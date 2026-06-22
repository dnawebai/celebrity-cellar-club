import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import influencer1 from "@/assets/influencer-1.jpg";
import influencer2 from "@/assets/influencer-2.jpg";
import influencer3 from "@/assets/influencer-3.jpg";
import influencer4 from "@/assets/influencer-4.jpg";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Opus by Influencers — Member Marketplace" },
      {
        name: "description",
        content:
          "A private marketplace of celebrity-curated wines and spirits, available exclusively to Opus Club members.",
      },
      { property: "og:title", content: "Opus by Influencers — Member Marketplace" },
      {
        property: "og:description",
        content: "Celebrity-curated wines and spirits, exclusive to Opus members.",
      },
    ],
  }),
  component: MarketplacePage,
});

const profiles = [
  {
    name: "Nicole Kidman",
    series: "Heritage Selection",
    bio: "Adelaide-born and Hollywood-honed; her collection favors old-vine Australian Shiraz and grower Champagne.",
    bottles: 12,
    img: influencer1,
  },
  {
    name: "Selena Gomez",
    series: "Modern Classics",
    bio: "Texas roots, California palate. A rotating list of Provençal rosé and small-batch agave spirits.",
    bottles: 8,
    img: influencer2,
  },
  {
    name: "Miley Cyrus",
    series: "The Vanguard List",
    bio: "Independent producers and rule-breakers. Natural wines, single-barrel rye, and a midnight gin.",
    bottles: 6,
    img: influencer3,
  },
  {
    name: "Dwayne Johnson",
    series: "Founder's Reserves",
    bio: "Aged tequila, blanc de blancs, and a personal stash of Bordeaux first-growths.",
    bottles: 14,
    img: influencer4,
  },
];

function MarketplacePage() {
  return (
    <SiteShell>
      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-7xl">
          <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            Members Only · Opus by Influencers
          </span>
          <h1 className="max-w-[20ch] font-serif text-5xl italic leading-[1.05] text-balance md:text-7xl">
            A private marketplace, curated by icons.
          </h1>
          <p className="mt-8 max-w-[56ch] text-pretty text-lg text-muted-foreground">
            Each month, Opus partners with globally recognized celebrities, athletes, and
            entrepreneurs to feature beverages they personally enjoy. Bottles are released by
            allocation at <span className="text-foreground">$200 each</span> and shipped to members
            in the United States.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl space-y-24">
          {profiles.map((p, i) => (
            <article
              key={p.name}
              className={`grid items-center gap-12 lg:grid-cols-12 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-sm ring-1 ring-border">
                  <img
                    src={p.img}
                    alt={`${p.name} portrait`}
                    loading="lazy"
                    width={800}
                    height={1200}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-7">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                  {p.series}
                </span>
                <h2 className="mt-3 font-serif text-4xl italic md:text-5xl">{p.name}</h2>
                <p className="mt-5 max-w-[52ch] text-pretty text-muted-foreground">{p.bio}</p>

                <div className="mt-8 grid grid-cols-3 gap-6 rounded-md bg-surface p-6 ring-1 ring-border">
                  <Cell label="Bottles" value={`${p.bottles}`} />
                  <Cell label="Per Bottle" value="$200" />
                  <Cell label="Status" value="Live" accent />
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button className="rounded-sm bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:brightness-110">
                    Buy Now — $200
                  </button>
                  <Link
                    to="/auctions"
                    className="rounded-sm px-6 py-3 text-xs font-semibold uppercase tracking-widest ring-1 ring-border transition-all hover:ring-accent/60"
                  >
                    Join Auction
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border px-6 py-24 text-center">
        <p className="font-serif text-2xl italic text-muted-foreground">
          New collections announced monthly.
        </p>
      </section>
    </SiteShell>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p
        className={`mt-2 font-serif text-2xl italic ${accent ? "text-accent" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
