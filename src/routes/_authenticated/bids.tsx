import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteShell } from "@/components/site-shell";
import { getMyBids } from "@/lib/auctions.functions";

export const Route = createFileRoute("/_authenticated/bids")({
  head: () => ({
    meta: [
      { title: "My Bids — Opus Drinks" },
      { name: "description", content: "Track live bids, outbid status, wins and payments." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BidsPage,
});

const tabs = [
  "Active",
  "Highest Bidder",
  "Outbid",
  "Won",
  "Lost",
  "Pending Payment",
  "Completed",
] as const;

function formatCurrency(cents: number | null | undefined) {
  if (cents == null) return "$—";
  return `$${(cents / 100).toLocaleString()}`;
}

function BidsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Active");
  const fetchBids = useServerFn(getMyBids);
  const { data: bids, isLoading } = useQuery({
    queryKey: ["my-bids"],
    queryFn: () => fetchBids(),
    staleTime: 10_000,
  });

  const filtered = bids?.filter((b) => {
    const lot = b.auction_lots;
    if (!lot) return false;
    const isLeading = lot.leading_bidder_id === b.bidder_id;
    const isClosed = lot.status === "sold" || lot.status === "passed";
    switch (tab) {
      case "Active":
        return lot.status === "live";
      case "Highest Bidder":
        return isLeading && !isClosed;
      case "Outbid":
        return !isLeading && !isClosed;
      case "Won":
        return isLeading && isClosed;
      case "Lost":
        return !isLeading && isClosed;
      default:
        return true;
    }
  });

  return (
    <SiteShell>
      <section className="px-6 pt-24 pb-16 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <span className="mb-4 inline-block text-[10px] uppercase tracking-[0.4em] text-gold">
            My Bids
          </span>
          <h1 className="mb-8 font-display text-5xl md:text-6xl">
            Every bid, <span className="italic text-gold-gradient">every status</span>.
          </h1>

          <div className="mb-10 flex flex-wrap gap-1 rounded-sm border border-border bg-surface/40 p-1 text-[11px] uppercase tracking-[0.25em]">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-sm px-4 py-2.5 transition ${
                  tab === t
                    ? "bg-gold text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Loading bids…</p>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid gap-4">
              {filtered.map((b) => {
                const lot = b.auction_lots;
                const auction = lot?.auctions;
                if (!lot || !auction) return null;
                const isLeading = lot.leading_bidder_id === b.bidder_id;
                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-4 rounded-sm border border-border bg-surface/40 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {lot.lot_number} · {auction.title}
                      </div>
                      <h3 className="mt-1 font-display text-xl">{lot.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Your bid: <span className="font-mono text-foreground">{formatCurrency(b.amount_cents)}</span></span>
                        <span>Current bid: <span className="font-mono text-foreground">{formatCurrency(lot.current_bid_cents)}</span></span>
                        <span className={isLeading ? "text-emerald-600" : "text-amber-500"}>
                          {isLeading ? "Highest bidder" : "Outbid"}
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/auctions/dollywood-foundation-2026/lots/$lotId"
                      params={{ lotId: lot.id }}
                      className="shrink-0 rounded-sm border border-border px-4 py-2 text-center text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
                    >
                      View Lot
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-sm border border-border bg-surface/40 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No bids match this filter yet.
              </p>
              <Link
                to="/auctions/dollywood-foundation-2026"
                className="mt-4 inline-block text-gold underline"
              >
                Browse the Dollywood auction
              </Link>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
