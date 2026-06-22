import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import heroBottle from "@/assets/hero-bottle.jpg";
import cellarDetail from "@/assets/cellar-detail.jpg";
import influencer1 from "@/assets/influencer-1.jpg";
import influencer2 from "@/assets/influencer-2.jpg";
import influencer3 from "@/assets/influencer-3.jpg";
import influencer4 from "@/assets/influencer-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Opus Drinks Club — Exclusive Access. Exceptional Bottles." },
      {
        name: "description",
        content:
          "Invitation-only membership for rare wines, spirits, and celebrity-curated beverages. Established 2023.",
      },
      { property: "og:title", content: "Opus Drinks Club" },
      {
        property: "og:description",
        content:
          "Invitation-only membership for rare wines, spirits, and celebrity-curated beverages.",
      },
      { property: "og:image", content: heroBottle },
    ],
  }),
  component: HomePage,
});

const influencers = [
  { name: "Nicole Kidman", series: "Heritage Selection", img: influencer1 },
  { name: "Selena Gomez", series: "Modern Classics", img: influencer2 },
  { name: "Miley Cyrus", series: "The Vanguard List", img: influencer3 },
  { name: "Dwayne Johnson", series: "Founder's Reserves", img: influencer4 },
];

function HomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-[58ch]">
            <span className="mb-8 block font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
              Established 2023 · North America
            </span>
            <h1 className="mb-8 font-serif text-5xl italic leading-[1.05] text-balance md:text-7xl">
              Opus Drinks Club — Exclusive Access. Exceptional Bottles. Celebrity Experiences.
            </h1>
            <p className="mb-12 max-w-[52ch] text-pretty text-lg text-muted-foreground">
              The most exclusive wine and beverage membership experience in North America. A private
              sanctuary for collectors and connoisseurs, serving 24,000+ active members.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/membership"
                className="rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-all hover:brightness-110"
              >
                Begin Application
              </Link>
              <Link
                to="/marketplace"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Explore the Marketplace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Anchor */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-md ring-1 ring-border">
            <img
              src={heroBottle}
              alt="A dust-jacketed vintage bottle resting in a private cellar under warm sconce light"
              width={1920}
              height={1280}
              className="aspect-[21/9] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Membership Tier */}
      <section className="border-y border-border bg-surface/40 px-6 py-32">
        <div className="mx-auto grid max-w-7xl gap-24 lg:grid-cols-2">
          <div>
            <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
              A Curated Invitation
            </span>
            <h2 className="mb-8 font-serif text-4xl text-balance italic md:text-5xl">
              Membership is reviewed individually, by committee.
            </h2>
            <div className="max-w-[48ch] space-y-6 text-pretty text-muted-foreground">
              <p>
                Access to the Opus Club is subject to approval. We prioritize collectors, beverage
                enthusiasts, and individuals seeking rarities over volume.
              </p>
              <p>
                A non-refundable $99 USD application fee is required at the time of submission. Each
                application is reviewed individually to maintain the integrity of our community.
              </p>
            </div>
            <div className="mt-12 rounded-md bg-surface p-8 ring-1 ring-border">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-accent">
                Membership
              </span>
              <div className="mb-6 font-serif text-4xl">
                $199<span className="ml-2 font-sans text-sm text-muted-foreground">/ month</span>
                <span className="ml-3 text-xs text-muted-foreground">or yearly · save 10%</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Four premium bottles delivered monthly",
                  "Access to member-only auctions",
                  "Exclusive tasting events & winery visits",
                  "Priority on celebrity beverage collections",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span className="size-1 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to="/membership"
                className="mt-8 inline-block border-b border-accent pb-1 text-xs uppercase tracking-widest text-accent"
              >
                Begin Application →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-md ring-1 ring-border">
              <img
                src={cellarDetail}
                alt="Corkscrew and rare bottle on velvet"
                loading="lazy"
                width={1000}
                height={1280}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div className="mt-12 overflow-hidden rounded-md ring-1 ring-border">
              <img
                src={heroBottle}
                alt="Cellar detail"
                loading="lazy"
                width={1920}
                height={1280}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Influencer Marketplace */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                Opus by Influencers
              </span>
              <h2 className="font-serif text-4xl italic md:text-5xl">
                Curated by globally recognized icons.
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              View Marketplace →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {influencers.map((i) => (
              <Link
                key={i.name}
                to="/marketplace"
                className="group"
              >
                <div className="overflow-hidden rounded-sm ring-1 ring-border transition-all group-hover:ring-accent/40">
                  <img
                    src={i.img}
                    alt={`${i.name} portrait`}
                    loading="lazy"
                    width={800}
                    height={1200}
                    className="aspect-[2/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-lg italic">{i.name}</h3>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {i.series}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quiet CTA */}
      <section className="border-t border-border px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-3xl italic leading-snug text-balance md:text-4xl">
            “The 2018 Reserve is arguably the finest production we have seen in a decade.”
          </p>
          <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            — Opus Membership Committee
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
