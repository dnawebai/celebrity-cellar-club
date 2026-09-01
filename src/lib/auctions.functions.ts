import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/**
 * Public: fetch a live or upcoming auction by slug, with all its lots.
 */
export const getAuctionBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ slug: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: auction, error: auctionError } = await supabase
      .from("auctions")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();

    if (auctionError) throw new Error(auctionError.message);
    if (!auction) return null;

    const { data: lots, error: lotsError } = await supabase
      .from("auction_lots")
      .select("*")
      .eq("auction_id", auction.id)
      .order("sort_order", { ascending: true });

    if (lotsError) throw new Error(lotsError.message);
    return { auction, lots: lots ?? [] };
  });

/**
 * Public: list all live/upcoming auctions.
 */
export const listPublicAuctions = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("auctions")
      .select("*")
      .in("status", ["live", "upcoming"])
      .order("starts_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },
);

/**
 * Authenticated: fetch a single lot with auction context and the current
 * user's bid history. Used by the member bidding page.
 */
export const getLotForBidding = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ lotId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: lot, error: lotError } = await supabase
      .from("auction_lots")
      .select("*, auctions(id, title, starts_at, ends_at, status)")
      .eq("id", data.lotId)
      .maybeSingle();

    if (lotError) throw new Error(lotError.message);
    if (!lot) return null;

    const { data: myBids, error: bidsError } = await supabase
      .from("bids")
      .select("*")
      .eq("lot_id", lot.id)
      .eq("bidder_id", userId)
      .order("created_at", { ascending: false });

    if (bidsError) throw new Error(bidsError.message);

    // Membership check
    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .select("status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    if (membershipError) throw new Error(membershipError.message);

    const now = Date.now();
    const periodEnd = membership?.current_period_end
      ? new Date(membership.current_period_end).getTime()
      : null;
    const isMember =
      membership?.status === "active" && (periodEnd === null || periodEnd > now);

    return {
      lot,
      auction: lot.auctions,
      myBids: myBids ?? [],
      isMember,
      userId,
    };
  });

/**
 * Authenticated: place a bid on a live lot.
 * Validates membership, auction status, amount, and bid increment.
 */
export const placeBid = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        lotId: z.string().uuid(),
        amountCents: z.number().int().positive(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // 1. Membership check
    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .select("status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    if (membershipError) throw new Error(membershipError.message);

    const now = Date.now();
    const periodEnd = membership?.current_period_end
      ? new Date(membership.current_period_end).getTime()
      : null;
    const isMember =
      membership?.status === "active" && (periodEnd === null || periodEnd > now);

    if (!isMember) {
      throw new Error("Active Opus Drinks membership is required to bid.");
    }

    // 2. Lot + auction must be live
    const { data: lot, error: lotError } = await supabase
      .from("auction_lots")
      .select("*, auctions(id, title, status, starts_at, ends_at)")
      .eq("id", data.lotId)
      .maybeSingle();

    if (lotError) throw new Error(lotError.message);
    if (!lot) throw new Error("Lot not found.");

    const auction = lot.auctions;
    if (auction.status !== "live") {
      throw new Error("Bidding is only open while the auction is live.");
    }
    const auctionNow = new Date().toISOString();
    if (auctionNow < auction.starts_at || auctionNow > auction.ends_at) {
      throw new Error("This lot is not currently open for bidding.");
    }

    // 3. Bid amount must meet increment
    const currentBid = lot.current_bid_cents ?? lot.starting_bid_cents;
    const minBid = currentBid + lot.bid_increment_cents;
    if (data.amountCents < minBid) {
      throw new Error(
        `Minimum bid is $${(minBid / 100).toFixed(2)}.`,
      );
    }

    // 4. Capture previous leader before the bid is recorded.
    const previousLeaderId = lot.leading_bidder_id;
    const previousBidAmount = lot.current_bid_cents;

    // 5. Insert bid and update lot.
    const { error: bidError } = await supabase.from("bids").insert({
      lot_id: data.lotId,
      bidder_id: userId,
      amount_cents: data.amountCents,
    });

    if (bidError) throw new Error(bidError.message);

    const { error: updateError } = await supabase
      .from("auction_lots")
      .update({
        current_bid_cents: data.amountCents,
        leading_bidder_id: userId,
      })
      .eq("id", data.lotId);

    if (updateError) throw new Error(updateError.message);

    // 6. Notify previous high bidder they were outbid.
    if (previousLeaderId && previousLeaderId !== userId) {
      const { data: prevProfile } = await supabase
        .from("profiles")
        .select("full_name, display_name")
        .eq("id", previousLeaderId)
        .maybeSingle();

      const { data: prevUser } = await supabase.auth.admin.getUserById(
        previousLeaderId,
      );
      const recipientEmail = prevUser?.user?.email;

      if (recipientEmail) {
        const { enqueueTransactionalEmail } = await import(
          "@/lib/email/enqueue.server"
        );
        await enqueueTransactionalEmail({
          templateName: "outbid",
          recipientEmail,
          idempotencyKey: `outbid:${data.lotId}:${previousLeaderId}:${Date.now()}`,
          templateData: {
            recipientName: prevProfile?.display_name ?? prevProfile?.full_name ?? undefined,
            auctionTitle: auction.title,
            lotTitle: lot.title,
            previousBidCents: previousBidAmount,
            newBidCents: data.amountCents,
            lotUrl: `https://opusdrinks.com/auctions/dollywood-foundation-2026/lots/${data.lotId}`,
          },
        });
      }
    }

    return { ok: true, amountCents: data.amountCents };
  });

/**
 * Authenticated: current user's active bids with lot/auction details.
 */
export const getMyBids = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("bids")
      .select("*, auction_lots(*, auctions(*))")
      .eq("bidder_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  });

/**
 * Public: track a conversion event from an anonymous or known visitor.
 */
export const trackPublicConversionEvent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        eventType: z.string().min(1),
        userId: z.string().uuid().optional(),
        path: z.string().optional(),
        referrer: z.string().optional(),
        metadata: z.record(z.unknown()).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { error } = await supabase.from("conversion_events").insert({
      event_type: data.eventType,
      user_id: data.userId ?? null,
      path: data.path ?? null,
      referrer: data.referrer ?? null,
      metadata: (data.metadata ?? null) as any,
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Authenticated: track a conversion event from a signed-in user.
 */
export const trackConversionEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        eventType: z.string().min(1),
        path: z.string().optional(),
        referrer: z.string().optional(),
        metadata: z.record(z.unknown()).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("conversion_events").insert({
      event_type: data.eventType,
      user_id: userId,
      path: data.path ?? null,
      referrer: data.referrer ?? null,
      metadata: (data.metadata ?? null) as any,
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });
