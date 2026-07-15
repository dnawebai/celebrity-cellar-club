import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

import { BiddingPanel } from "@/components/bidding-panel";
import {
  findAuction,
  findLot,
  formatCountdown,
  formatMoney,
} from "@/lib/auctions-data";

export const Route = createFileRoute("/auctions/$auctionId/lots/$lotId")({
  loader: ({ params }) => {
    const auction = findAuction(params.auctionId);
    const lot = findLot(params.lotId);
    if (!auction || !lot || lot.auctionId !== auction.id) throw notFound();
    return { auction, lot };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Lot — Opus Drinks" }, { name: "robots", content: "noindex" }] };
    }
    const { lot, auction } = loaderData;
    const title = `${lot.producer} ${lot.wineName}${lot.vintage ? ` ${lot.vintage}` : ""} — Opus Drinks`;
    return {
      meta: [
        { title },
        { name: "description", content: lot.description },
        { property: "og:title", content: title },
        { property: "og:description", content: lot.description },
        { property: "og:image", content: lot.image },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://opusdrinks.com/auctions/${auction.id}/lots/${lot.id}`,
        },
      ],
    };
  },
  errorComponent: () => (
    <SiteShell>
      <div className="px-6 py-24 text-center text-sm text-muted-foreground">
        We could not load this lot.
      </div>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Lot not found</h1>
        <Link to="/auctions" className="mt-6 inline-block text-gold underline">
          Back to auctions
        </Link>
      </div>
    </SiteShell>
  ),
  component: LotDetail,
});

function LotDetail() {
  const { auction, lot } = Route.useLoaderData();

  const totalLow =
    lot.estimateLow + lot.estimateLow * (auction.buyersPremiumPct / 100);
  const totalHigh =
    lot.estimateHigh + lot.estimateHigh * (auction.buyersPremiumPct / 100);

  return (
    <SiteShell>
      

      <div className="px-6 pt-16 pb-4 lg:px-10">
        <div className="mx-auto max-w-[1400px] text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          <Link to="/auctions" className="hover:text-foreground">Auctions</Link>{" "}
          ·{" "}
          <Link
            to="/auctions/$auctionId"
            params={{ auctionId: auction.id }}
            className="hover:text-foreground"
          >
            {auction.title}
          </Link>{" "}
          · <span className="text-foreground">{lot.lotNumber}</span>
        </div>
      </div>

      <section className="px-6 pb-24 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.1fr_1fr_360px]">
          <div className="aspect-[4/5] overflow-hidden rounded-sm border border-border">
            <img
              src={lot.image}
              alt={`${lot.producer} ${lot.wineName}`}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
              {lot.lotNumber} · Closes in {formatCountdown(auction.endsAtUtc)}
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              {lot.producer}
            </h1>
            <p className="mt-1 font-serif text-2xl text-muted-foreground">
              {lot.wineName}{lot.vintage ? ` · ${lot.vintage}` : ""}
            </p>

            <p className="mt-6 text-base text-muted-foreground">{lot.description}</p>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 text-sm">
              <Field label="Region" value={lot.region} />
              <Field label="Country" value={lot.country} />
              <Field label="Appellation" value={lot.appellation} />
              <Field label="Classification" value={lot.classification} />
              <Field label="Bottle Size" value={lot.bottleSize} />
              <Field label="Bottle Count" value={String(lot.bottleCount)} />
              <Field label="Packaging" value={lot.packaging} />
              <Field label="Fill Level" value={lot.fillLevel} />
              <Field label="Label" value={lot.labelCondition} />
              <Field label="Capsule" value={lot.capsuleCondition} />
              <Field label="Provenance" value={lot.provenance} />
              <Field label="Storage" value={lot.storageHistory} />
              <Field label="Drinking Window" value={lot.drinkingWindow} />
              <Field label="Bid Increment" value={formatMoney(lot.bidIncrement, auction.currency)} />
              <Field
                label="Collection"
                value={lot.collectionLocation}
              />
              <Field
                label="Shipping"
                value={lot.shippingEligible ? "Eligible (see terms)" : "Collection only"}
              />
            </div>

            {lot.criticScores && lot.criticScores.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Critic Scores
                </div>
                <ul className="space-y-2 text-sm">
                  {lot.criticScores.map((s: { critic: string; score: string }) => (
                    <li key={s.critic} className="flex justify-between">
                      <span className="text-muted-foreground">{s.critic}</span>
                      <span className="font-mono text-gold">{s.score}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 rounded-sm border border-border bg-surface/40 p-5 text-sm">
              <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Estimated Total Acquisition Cost
              </div>
              <div className="font-display text-2xl text-gold-gradient">
                {formatMoney(Math.round(totalLow), auction.currency)} –{" "}
                {formatMoney(Math.round(totalHigh), auction.currency)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Includes {auction.buyersPremiumPct}% buyer's premium. Taxes,
                shipping, insurance and duties calculated at checkout.
              </div>
            </div>
          </div>

          <BiddingPanel auction={auction} lot={lot} />
        </div>
      </section>
    </SiteShell>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
