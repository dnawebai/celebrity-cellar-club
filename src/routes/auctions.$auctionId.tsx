import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

import {
  findAuction,
  formatCountdown,
  formatMoney,
  lotsForAuction,
} from "@/lib/auctions-data";

export const Route = createFileRoute("/auctions/$auctionId")({
  loader: ({ params }) => {
    const auction = findAuction(params.auctionId);
    if (!auction) throw notFound();
    return { auction, lots: lotsForAuction(auction.id) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Auction — Opus Drinks" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.auction;
    return {
      meta: [
        { title: `${a.title} — Opus Drinks Auctions` },
        { name: "description", content: a.summary },
        { property: "og:title", content: `${a.title} — Opus Drinks` },
        { property: "og:description", content: a.summary },
        { property: "og:image", content: a.coverImage },
      ],
    };
  },
  errorComponent: () => (
    <SiteShell>
      <div className="px-6 py-24 text-center text-sm text-muted-foreground">
        We could not load this auction.
      </div>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Auction not found</h1>
        <Link to="/auctions" className="mt-6 inline-block text-gold underline">
          Back to auctions
        </Link>
      </div>
    </SiteShell>
  ),
  component: AuctionDetail,
});

function AuctionDetail() {
  const { auction, lots } = Route.useLoaderData();

  const startLocal = new Date(auction.startsAtUtc).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
  const endLocal = new Date(auction.endsAtUtc).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
  const regLocal = new Date(auction.registrationDeadlineUtc).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <SiteShell>
      

      <section className="grid gap-0 border-b border-border lg:grid-cols-2">
        <Link
          to="/checkout/membership"
          aria-label="Unlock with $99 Opus Drinks membership"
          className="group relative block aspect-[4/3] overflow-hidden"
        >
          <img src={auction.coverImage} alt={auction.title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="mb-8 rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground">
              Unlock · $99 membership
            </span>
          </div>
        </Link>

        <div className="flex flex-col justify-center gap-4 px-6 py-16 lg:px-12">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
            {auction.status === "past" ? "Completed Auction" : "Auction"}
          </span>
          <h1 className="font-display text-4xl md:text-6xl">{auction.title}</h1>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            {auction.location} · {auction.format}
          </p>
          <p className="max-w-[60ch] text-base text-muted-foreground">{auction.summary}</p>

          <div className="mt-4 grid grid-cols-2 gap-4 border-y border-border py-6 text-sm md:grid-cols-4">
            <Meta label="Opens" value={startLocal} />
            <Meta label="Closes" value={endLocal} />
            <Meta label="Registration Deadline" value={regLocal} />
            <Meta
              label="Countdown"
              value={<span className="text-gold">{formatCountdown(auction.endsAtUtc)}</span>}
            />
            <Meta label="Lots" value={auction.lotCount.toString()} />
            <Meta label="Currency" value={auction.currency} />
            <Meta label="Buyer's Premium" value={`${auction.buyersPremiumPct}%`} />
            <Meta
              label="Bidding"
              value={auction.biddingMode === "integrated" ? "Direct" : "Concierge / Partner"}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/membership"
              className="rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
            >
              Register to Bid
            </Link>
            <Link
              to="/concierge"
              className="rounded-sm border border-border px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
            >
              Contact Opus Concierge
            </Link>
            <a
              href={auction.partnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-border px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
            >
              Open Partner Page ↗
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-3xl md:text-4xl">
              Lots in this auction
            </h2>
            <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Showing {lots.length} of {auction.lotCount}
            </span>
          </div>

          {lots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Lot details will populate once the partner feed is connected.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {lots.map((l: import("@/lib/auctions-data").Lot) => (
                <Link
                  key={l.id}
                  to="/auctions/$auctionId/lots/$lotId"
                  params={{ auctionId: auction.id, lotId: l.id }}
                  className="group overflow-hidden rounded-sm border border-border bg-surface/40 transition hover:border-gold/40"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={l.image}
                      alt={`${l.producer} ${l.wineName}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {l.lotNumber} · {l.bottleCount} × {l.bottleSize}
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-tight">
                      {l.producer}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {l.wineName}{l.vintage ? ` · ${l.vintage}` : ""}
                    </p>
                    <div className="mt-4 font-mono text-sm text-gold">
                      {formatMoney(l.estimateLow, auction.currency)} –{" "}
                      {formatMoney(l.estimateHigh, auction.currency)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
