import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { MemberGate } from "@/components/member-gate";
import { DemoDataBanner } from "@/components/demo-data-banner";

export const Route = createFileRoute("/_authenticated/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — Opus Drinks" },
      { name: "description", content: "Track auctions, lots, producers and vintages across every partner." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  return (
    <SiteShell>
      <DemoDataBanner />
      <section className="px-6 pt-24 pb-16 lg:px-10">
        <div className="mx-auto max-w-[1000px]">
          <span className="mb-4 inline-block text-[10px] uppercase tracking-[0.4em] text-gold">
            Watchlist & Saved Searches
          </span>
          <h1 className="mb-6 font-display text-5xl md:text-6xl">
            Your lots. <span className="italic text-gold-gradient">Your alerts.</span>
          </h1>
          <p className="mb-10 text-lg text-muted-foreground">
            Save auctions, lots, producers, regions and vintages. Receive email
            and SMS alerts the moment matching lots appear or bidding activity
            changes.
          </p>
          <MemberGate reason="Watchlists, saved searches and alert rules are reserved for verified Opus Drinks members." />
        </div>
      </section>
    </SiteShell>
  );
}
