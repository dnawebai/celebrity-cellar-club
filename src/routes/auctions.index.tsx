import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";

import {
  getAuctions,
  formatCountdown,
  type Auction,
  type AuctionStatus,
} from "@/lib/auctions-data";

export const Route = createFileRoute("/auctions/")({
  head: () => ({
    meta: [
      { title: "Fine Wine & Rare Spirits Auctions — Opus Drinks" },
      {
        name: "description",
        content:
          "One private marketplace for the world's leading fine wine and rare spirits auctions. Track lots, register, bid, and manage your collection through Opus Drinks.",
      },
      { property: "og:title", content: "Fine Wine & Rare Spirits Auctions — Opus Drinks" },
      {
        property: "og:description",
        content:
          "Aggregated access to Sotheby's-tier wine auctions through one private, members-only interface.",
      },
      { property: "og:url", content: "https://opusdrinks.com/auctions" },
    ],
    links: [{ rel: "canonical", href: "https://opusdrinks.com/auctions" }],
  }),
  component: AuctionsIndexPage,
});

type TabId = AuctionStatus | "all";

const tabs: { id: TabId; label: string }[] = [
  { id: "live", label: "Live Now" },
  { id: "closing-soon", label: "Closing Soon" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Completed" },
  { id: "all", label: "All" },
];

function AuctionsIndexPage() {
  const [tab, setTab] = useState<TabId>("live");
  const [category, setCategory] = useState<"all" | "wine" | "spirits">("all");
  const [query, setQuery] = useState("");
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    return getAuctions().filter((a: Auction) => {
      if (tab !== "all" && a.status !== tab) return false;
      if (category !== "all" && a.category !== category && a.category !== "mixed")
        return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !a.title.toLowerCase().includes(q) &&
          !a.location.toLowerCase().includes(q) &&
          !a.summary.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [tab, category, query]);

  return (
    <SiteShell>
      <section className="border-b border-border px-6 pt-24 pb-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mb-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold">
            <span className="size-1.5 rounded-full bg-gold pulse-gold" />
            The Opus Auction Marketplace
          </span>
          <h1 className="mb-6 max-w-[20ch] font-display text-5xl text-balance md:text-7xl">
            The World's Finest Wine Auctions.{" "}
            <span className="italic text-gold-gradient">One private marketplace.</span>
          </h1>
          <p className="max-w-[62ch] text-lg text-muted-foreground">
            Discover exceptional wines and rare spirits offered through leading
            international auctions. Track lots, register, bid, and manage your
            collection through Opus Drinks — with a single membership, calendar,
            watchlist, and concierge team.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div className="flex max-w-full flex-wrap gap-1 rounded-sm border border-border bg-surface/40 p-1 text-[11px] uppercase tracking-[0.25em]">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-sm px-4 py-2.5 transition ${
                    tab === t.id
                      ? "bg-gold text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex max-w-full flex-wrap gap-1 rounded-sm border border-border bg-surface/40 p-1 text-[11px] uppercase tracking-[0.25em]">
              {(["all", "wine", "spirits"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-sm px-4 py-2.5 transition ${
                    category === c
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c === "all" ? "All Categories" : c}
                </button>
              ))}
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search producer, region, city…"
              className="min-w-[240px] flex-1 rounded-sm border border-border bg-surface/40 px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-gold/60"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No auctions match your filters.
            </p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {filtered.map((a) => (
                <AuctionCard key={a.id} a={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-surface/30 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-3">
          <Info
            title="One membership, every partner"
            body="A single $199 Opus Drinks membership gives you a unified calendar, watchlist, and concierge team across every authorised auction partner."
          />
          <Info
            title="Two clearly-labelled bidding modes"
            body="Where an authorised bidding integration exists, place bids directly. Otherwise, our concierge team handles registration and bidding on your behalf."
          />
          <Info
            title="No fabricated data. Ever."
            body="We never show a live bid button when no bidding integration exists. Every imported auction retains its verified source internally for compliance."
          />
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px] text-xs leading-relaxed text-muted-foreground">
          Opus Drinks provides access to auction opportunities subject to
          membership eligibility, auction-specific approval, geographic
          restrictions, and applicable conditions of sale. Availability of
          direct bidding depends on the integration and authorisation provided
          by each auction partner.
        </div>
      </section>
    </SiteShell>
  );
}

function AuctionCard({ a }: { a: Auction }) {
  const closesLocal = new Date(a.endsAtUtc).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <div className="group block overflow-hidden rounded-sm border border-border bg-surface/40 transition hover:border-gold/40">
      <div className="grid md:grid-cols-[280px_1fr]">
        <Link
          to="/checkout/membership"
          aria-label={`Join Opus Drinks — $199 to unlock ${a.title}`}
          className="relative block aspect-[4/5] overflow-hidden md:aspect-auto"
        >
          <img
            src={a.coverImage}
            alt={a.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-sm bg-background/80 px-2 py-1 text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur">
            {a.status === "closing-soon" ? "Closing soon" : a.status}
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4">
            <div className="text-[10px] uppercase tracking-[0.35em] text-gold">
              Unlock · $199 membership
            </div>
            <div className="mt-1 text-[11px] text-foreground/90">
              Bid across every partner house with one account
            </div>
          </div>
        </Link>

        <div className="flex flex-col p-7">
          <Link
            to="/auctions/$auctionId"
            params={{ auctionId: a.id }}
          >
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span>{a.category === "spirits" ? "Rare Spirits" : "Fine Wine"}</span>
              <span className="text-gold">{formatCountdown(a.endsAtUtc)}</span>
            </div>
            <h3 className="font-display text-2xl leading-tight">{a.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {a.location} · {a.format}
            </p>
          </Link>

          <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
            {a.summary}
          </p>

          <div className="my-5 grid grid-cols-3 gap-3 border-y border-border py-4 text-xs">
            <Stat label="Lots" value={a.lotCount.toString()} />
            <Stat label="Currency" value={a.currency} />
            <Stat label="Buyer's Premium" value={`${a.buyersPremiumPct}%`} />
          </div>

          <div className="mb-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Closes · <span className="text-foreground">{closesLocal}</span>
          </div>

          <div className="mt-auto flex gap-2">
            <Link
              to="/checkout/membership"
              className="flex-1 rounded-sm gold-gradient px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
            >
              Buy · $199
            </Link>
            <span
              className={`rounded-sm border px-4 py-3 text-[10px] uppercase tracking-[0.3em] ${
                a.biddingMode === "integrated"
                  ? "border-gold/50 text-gold"
                  : "border-border text-muted-foreground"
              }`}
            >
              {a.biddingMode === "integrated" ? "Direct Bidding" : "Concierge Bidding"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm">{value}</div>
    </div>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-sm border border-border bg-background/40 p-6">
      <h3 className="mb-2 font-display text-xl">{title}</h3>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
