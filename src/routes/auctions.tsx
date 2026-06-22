import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/auctions")({
  head: () => ({
    meta: [
      { title: "Current Auctions — Opus Drinks Club" },
      {
        name: "description",
        content:
          "Live member-only auctions for rare wines and spirits curated by globally recognized influencers.",
      },
      { property: "og:title", content: "Current Auctions — Opus Drinks Club" },
      {
        property: "og:description",
        content: "Live member-only auctions for rare wines and spirits.",
      },
    ],
  }),
  component: AuctionsPage,
});

type Auction = {
  curator: string;
  product: string;
  bid: number;
  bids: number;
  bottles: number;
  endsAt: number;
  reserveMet: boolean;
};

const now = Date.now();
const HOUR = 1000 * 60 * 60;

const initial: Auction[] = [
  {
    curator: "Kidman",
    product: "1982 Château Margaux (1.5L)",
    bid: 4250,
    bids: 18,
    bottles: 2,
    endsAt: now + 4 * HOUR + 22 * 60_000,
    reserveMet: true,
  },
  {
    curator: "Gomez",
    product: "Macallan 25-Year Sherry Oak",
    bid: 2800,
    bids: 12,
    bottles: 1,
    endsAt: now + 11 * HOUR + 5 * 60_000,
    reserveMet: true,
  },
  {
    curator: "Johnson",
    product: "Teremana Founder's Cask — Numbered",
    bid: 1850,
    bids: 9,
    bottles: 8,
    endsAt: now + 18 * HOUR + 45 * 60_000,
    reserveMet: false,
  },
  {
    curator: "Cyrus",
    product: "Midnight Gin — Single Botanical Edition",
    bid: 620,
    bids: 24,
    bottles: 24,
    endsAt: now + 2 * HOUR + 12 * 60_000,
    reserveMet: true,
  },
  {
    curator: "Kidman",
    product: "Penfolds Grange 2008 — Library Release",
    bid: 3400,
    bids: 21,
    bottles: 4,
    endsAt: now + 30 * HOUR,
    reserveMet: true,
  },
];

function AuctionsPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <SiteShell>
      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative size-1.5 rounded-full bg-accent" />
            </span>
            Live Now
          </div>
          <h1 className="mt-6 max-w-[20ch] font-serif text-5xl italic leading-[1.05] text-balance md:text-6xl">
            Current Auctions
          </h1>
          <p className="mt-6 max-w-[56ch] text-pretty text-lg text-muted-foreground">
            Member-only bidding on rare allocations. Bids may be placed directly from your account
            dashboard.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-md ring-1 ring-border">
          <div className="hidden grid-cols-12 gap-4 border-b border-border bg-surface/50 px-8 py-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground md:grid">
            <div className="col-span-2">Curator</div>
            <div className="col-span-4">Allocation</div>
            <div className="col-span-2 text-right">Current Bid</div>
            <div className="col-span-2 text-right">Time Left</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <div className="divide-y divide-border">
            {initial.map((a) => (
              <div
                key={a.product}
                className="grid grid-cols-2 items-center gap-4 px-8 py-6 transition-colors hover:bg-surface/30 md:grid-cols-12"
              >
                <div className="md:col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground md:hidden">
                    Curator
                  </p>
                  <p className="font-serif text-lg italic">{a.curator}</p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-sm font-medium">{a.product}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.bottles} bottle{a.bottles === 1 ? "" : "s"} remaining · {a.bids} bids
                  </p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground md:hidden">
                    Bid
                  </p>
                  <p className="font-mono text-base text-accent">
                    ${a.bid.toLocaleString()}
                  </p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground md:hidden">
                    Time Left
                  </p>
                  <p
                    key={tick + a.product}
                    className="font-mono text-xs tabular-nums text-foreground"
                  >
                    {formatRemaining(a.endsAt)}
                  </p>
                </div>
                <div className="flex items-center justify-end md:col-span-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ring-1 ${
                      a.reserveMet
                        ? "bg-accent/10 text-accent ring-accent/30"
                        : "bg-destructive/10 text-destructive ring-destructive/30"
                    }`}
                  >
                    {a.reserveMet ? "Reserve Met" : "No Reserve"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function formatRemaining(endsAt: number) {
  const diff = Math.max(0, endsAt - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}
