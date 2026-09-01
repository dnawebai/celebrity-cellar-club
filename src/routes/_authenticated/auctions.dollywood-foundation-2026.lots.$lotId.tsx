import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteShell } from "@/components/site-shell";
import { getLotForBidding, placeBid } from "@/lib/auctions.functions";

export const Route = createFileRoute(
  "/_authenticated/auctions/dollywood-foundation-2026/lots/$lotId",
)({
  loader: async ({ params }) => {
    // We cannot call requireSupabaseAuth in a loader (SSR has no bearer).
    // The component will fetch the gated data client-side.
    return { lotId: params.lotId };
  },
  head: () => ({
    meta: [
      { title: "Place a Bid — Butterflies & Barrels — Opus Drinks" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LotBiddingPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Lot not found</h1>
        <Link to="/auctions/dollywood-foundation-2026" className="mt-6 inline-block text-gold underline">
          Back to the auction
        </Link>
      </div>
    </SiteShell>
  ),
});

function formatCurrency(cents: number | null | undefined) {
  if (cents == null) return "$—";
  return `$${(cents / 100).toLocaleString()}`;
}

function LotBiddingPage() {
  const { lotId } = Route.useLoaderData();
  const fetchLot = useServerFn(getLotForBidding);
  const submitBid = useServerFn(placeBid);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["lot", lotId],
    queryFn: () => fetchLot({ data: { lotId } }),
    staleTime: 10_000,
  });

  const [bidAmount, setBidAmount] = useState<string>("");
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "submitting" } | { kind: "success"; amount: number } | { kind: "error"; message: string }
  >({ kind: "idle" });

  if (isLoading) {
    return (
      <SiteShell>
        <div className="px-6 py-24 text-center text-sm text-muted-foreground">Loading lot…</div>
      </SiteShell>
    );
  }

  if (error || !data) {
    return (
      <SiteShell>
        <div className="px-6 py-24 text-center">
          <h1 className="font-display text-4xl">Lot not available</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Sign in to view this lot."}
          </p>
          <Link to="/auth" className="mt-6 inline-block text-gold underline">
            Sign in
          </Link>
        </div>
      </SiteShell>
    );
  }

  const { lot, auction, isMember, myBids } = data;
  const currentBid = lot.current_bid_cents ?? lot.starting_bid_cents;
  const minBid = currentBid + lot.bid_increment_cents;

  async function handleBid(e: React.FormEvent) {
    e.preventDefault();
    const amount = Math.round(parseFloat(bidAmount) * 100);
    if (!amount || amount < minBid) {
      setStatus({ kind: "error", message: `Minimum bid is ${formatCurrency(minBid)}.` });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await submitBid({ data: { lotId: lot.id, amountCents: amount } });
      if (res.ok) {
        setStatus({ kind: "success", amount });
        setBidAmount("");
        qc.invalidateQueries({ queryKey: ["lot", lotId] });
        qc.invalidateQueries({ queryKey: ["auction", "dollywood-foundation-2026"] });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Bid could not be placed.",
      });
    }
  }

  return (
    <SiteShell>
      <section className="px-6 pt-28 pb-16 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <Link
            to="/auctions/dollywood-foundation-2026"
            className="text-[10px] uppercase tracking-[0.3em] text-gold hover:underline"
          >
            ← Back to Butterflies & Barrels
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            {/* Lot image */}
            <div className="overflow-hidden rounded-sm border border-border">
              <img
                src={lot.image_url ?? "/placeholder.svg"}
                alt={lot.title}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            {/* Bidding panel */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
                {lot.lot_number} · {auction.title}
              </span>
              <h1 className="mt-3 font-display text-4xl md:text-5xl">{lot.title}</h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{lot.description}</p>

              <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6 md:grid-cols-3">
                <Meta label="Current bid" value={formatCurrency(lot.current_bid_cents)} />
                <Meta label="Estimate" value={`${formatCurrency(lot.estimate_low_cents)} – ${formatCurrency(lot.estimate_high_cents)}`} />
                <Meta label="Bid increment" value={formatCurrency(lot.bid_increment_cents)} />
                <Meta label="Status" value={auction.status === "live" ? "Live" : "Upcoming"} />
                <Meta label="My bids" value={myBids.length.toString()} />
                <Meta label="High bidder" value={lot.leading_bidder_id ? (lot.leading_bidder_id === data.userId ? "You" : "Another member") : "No bids yet"} />
              </div>

              {isMember ? (
                <form onSubmit={handleBid} className="mt-8">
                  <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Your bid (USD)
                  </label>
                  <div className="mt-2 flex gap-3">
                    <input
                      type="number"
                      min={minBid / 100}
                      step="0.01"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Minimum ${formatCurrency(minBid)}`}
                      className="flex-1 rounded-sm border border-border bg-surface/40 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold/60"
                    />
                    <button
                      type="submit"
                      disabled={status.kind === "submitting"}
                      className="rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground disabled:opacity-50"
                    >
                      {status.kind === "submitting" ? "Placing…" : "Place Bid"}
                    </button>
                  </div>
                  {status.kind === "error" && (
                    <p className="mt-3 text-sm text-red-500">{status.message}</p>
                  )}
                  {status.kind === "success" && (
                    <p className="mt-3 text-sm text-emerald-600">
                      Bid placed: {formatCurrency(status.amount)}
                    </p>
                  )}
                </form>
              ) : (
                <div className="mt-8 rounded-sm border border-border bg-surface/40 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Bidding is open to active Opus Drinks members.
                  </p>
                  <Link
                    to="/checkout/membership"
                    className="mt-4 inline-block rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
                  >
                    Unlock Membership · $199
                  </Link>
                </div>
              )}

              <div className="mt-8 text-xs leading-relaxed text-muted-foreground">
                By placing a bid you agree to the Opus Drinks Conditions of Sale. All payments are
                processed securely; winning bidders will receive an invoice after the auction closes.
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-sm text-foreground">{value}</div>
    </div>
  );
}
