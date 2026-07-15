import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public: read current active member count for the homepage / footer.
 * Uses a publishable-key server client and a public read on site_settings
 * (baseline) plus a safe count on memberships.
 */
export const getPublicMemberStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const url = process.env.SUPABASE_URL!;
    const client = createClient<Database>(url, key, {
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

    const { data: setting } = await client
      .from("site_settings")
      .select("value")
      .eq("key", "member_counter_baseline")
      .maybeSingle();

    const baseline =
      (setting?.value as { count?: number } | null)?.count ?? 1240;

    // Note: memberships table is not readable by anon; return baseline + 0 here.
    // Real live count is surfaced to admins via a separate server fn.
    return { baseline, active: 0, total: baseline };
  },
);

/**
 * Current user's membership + profile summary. Drives the paywall.
 */
export const getMyMembership = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [{ data: profile }, { data: membership }, { data: roles }] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase
          .from("memberships")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);

    // Entitlement: status must be active AND current_period_end (if set)
    // must be in the future. An expired active row is treated as not-a-member
    // until the nightly cron flips it to 'expired'.
    const now = Date.now();
    const periodEnd = membership?.current_period_end
      ? new Date(membership.current_period_end).getTime()
      : null;
    const isMember =
      membership?.status === "active" && (periodEnd === null || periodEnd > now);
    const isExpired =
      (membership?.status === "expired" ||
        (membership?.status === "active" && periodEnd !== null && periodEnd <= now));

    return {
      userId,
      profile,
      membership,
      roles: (roles ?? []).map((r) => r.role),
      isMember,
      isExpired,
      isAdmin: (roles ?? []).some((r) => r.role === "admin"),
    };
  });


/**
 * Save the user's compliance profile (name, DOB, country/region). DB trigger
 * enforces the 21+ check.
 */
export const saveProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        full_name: z.string().min(2).max(120),
        display_name: z.string().min(2).max(60).optional(),
        date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        country: z.string().min(2).max(80),
        region: z.string().min(1).max(80).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert(
        {
          id: context.userId,
          full_name: data.full_name,
          display_name: data.display_name ?? data.full_name,
          date_of_birth: data.date_of_birth,
          country: data.country,
          region: data.region ?? null,
        },
        { onConflict: "id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Submit ID + residence document references (URLs / storage paths) for admin review.
 */
export const submitVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        doc_type: z.enum(["passport", "drivers_license", "national_id"]),
        doc_ref: z.string().min(1).max(500),
        residence_doc_ref: z.string().min(1).max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("id_verifications").insert({
      user_id: context.userId,
      doc_type: data.doc_type,
      doc_ref: data.doc_ref,
      residence_doc_ref: data.residence_doc_ref ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Membership activation is now handled by the Stripe webhook on
 * `checkout.session.completed`. This helper only stores a chosen
 * billing cycle preference on the pending row — no status change.
 */
export const selectBillingCycle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ billing_cycle: z.enum(["one_time", "monthly", "annual"]) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("memberships")
      .update({ billing_cycle: data.billing_cycle, price_cents: 9900 })
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

