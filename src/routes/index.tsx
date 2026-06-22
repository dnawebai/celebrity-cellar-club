import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import heroBottle from "@/assets/hero-bottle.jpg";
import cellarDetail from "@/assets/cellar-detail.jpg";
import influencer1 from "@/assets/influencer-1.jpg";
import influencer2 from "@/assets/influencer-2.jpg";
import influencer3 from "@/assets/influencer-3.jpg";
import influencer4 from "@/assets/influencer-4.jpg";
import eventTasting from "@/assets/event-tasting.jpg";
import eventVineyard from "@/assets/event-vineyard.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OPUS DRINKS — Where Great Beverages Become Legacy" },
      {
        name: "description",
        content:
          "Luxury wine club, live auctions, celebrity-curated collections, and wine investment platform. Invitation-only membership for the world's most discerning collectors.",
      },
      { property: "og:title", content: "OPUS DRINKS — Where Great Beverages Become Legacy" },
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

const liveAuctions = [
  {
    lot: "Lot 014",
    title: "1982 Château Mouton Rothschild · Pauillac",
    bid: "$48,250",
    bidders: 17,
    closes: "02h 14m",
  },
  {
    lot: "Lot 017",
    title: "1996 Domaine de la Romanée-Conti · La Tâche",
    bid: "$31,800",
    bidders: 24,
    closes: "04h 02m",
  },
  {
    lot: "Lot 021",
    title: "Pappy Van Winkle 23-Year · Sealed Bottle",
    bid: "$12,400",
    bidders: 39,
    closes: "06h 49m",
  },
];

const stats = [
  { value: "24,000+", label: "Active Members" },
  { value: "$184M", label: "Lots Transacted" },
  { value: "320+", label: "Allocated Producers" },
  { value: "12.4%", label: "Avg. Annual Return" },
];

function HomePage() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBottle}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="mx-auto max-w-[1400px] px-6 pt-40 pb-32 lg:px-10 lg:pt-48 lg:pb-44">
          <span className="mb-10 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.45em] text-gold animate-fade-up">
            <span className="size-1.5 rounded-full bg-gold pulse-gold" />
            Invitation Only · Est. 2023
          </span>
          <h1 className="mb-10 max-w-[18ch] font-display text-[3.5rem] leading-[0.95] text-balance md:text-[5.5rem] lg:text-[7rem] animate-fade-up">
            Where great beverages become{" "}
            <span className="italic text-gold-gradient">legacy</span>.
          </h1>
          <p className="mb-12 max-w-[58ch] text-pretty text-lg leading-relaxed text-muted-foreground animate-fade-up">
            Access exclusive wines, celebrity collections, rare auctions, luxury experiences, and
            collectible beverages unavailable anywhere else.
          </p>
          <div className="flex flex-wrap items-center gap-4 animate-fade-up">
            <Link
              to="/membership"
              className="gold-gradient rounded-sm px-7 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground shadow-lg shadow-black/40 transition-all hover:brightness-110"
            >
              Apply for Membership
            </Link>
            <Link
              to="/auctions"
              className="rounded-sm border border-foreground/30 bg-background/30 px-7 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground backdrop-blur transition-all hover:border-gold hover:text-gold"
            >
              Explore Auctions
            </Link>
            <button
              type="button"
              className="group inline-flex items-center gap-3 px-2 py-4 text-xs uppercase tracking-[0.25em] text-muted-foreground transition hover:text-foreground"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-foreground/30 transition group-hover:border-gold group-hover:text-gold">
                ▶
              </span>
              Watch Introduction
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-border bg-background/60 backdrop-blur">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-border lg:grid-cols-4 lg:px-10">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-8">
                <div className="font-display text-3xl text-gold-gradient md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE AUCTIONS */}
      <section className="border-b border-border px-6 py-32 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gold">
                <span className="size-1.5 rounded-full bg-gold pulse-gold" /> Live Now
              </span>
              <h2 className="font-display text-5xl text-balance md:text-6xl">
                Tonight's <span className="italic">auction floor</span>.
              </h2>
            </div>
            <Link
              to="/auctions"
              className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold"
            >
              All Auctions →
            </Link>
          </div>
          <div className="grid gap-px overflow-hidden rounded-sm bg-border md:grid-cols-3">
            {liveAuctions.map((a) => (
              <div key={a.lot} className="group bg-background p-8 transition hover:bg-surface">
                <div className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  <span>{a.lot}</span>
                  <span className="flex items-center gap-2 text-gold">
                    <span className="size-1 rounded-full bg-gold pulse-gold" /> Closes {a.closes}
                  </span>
                </div>
                <h3 className="mb-8 font-serif text-2xl leading-tight">{a.title}</h3>
                <div className="mb-6 flex items-end justify-between border-t border-border pt-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Current Bid
                    </div>
                    <div className="mt-1 font-display text-3xl text-gold-gradient">{a.bid}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Bidders
                    </div>
                    <div className="mt-1 font-display text-2xl">{a.bidders}</div>
                  </div>
                </div>
                <Link
                  to="/auctions"
                  className="block w-full rounded-sm border border-foreground/30 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.3em] transition group-hover:border-gold group-hover:text-gold"
                >
                  Place Bid
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS */}
      <section className="px-6 py-32 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 max-w-3xl">
            <span className="mb-4 block text-[10px] uppercase tracking-[0.4em] text-gold">
              Membership
            </span>
            <h2 className="mb-6 font-display text-5xl text-balance md:text-6xl">
              Three doors. <span className="italic">By committee only.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Every application is reviewed individually. A non-refundable USD $99 application fee
              accompanies submission to ensure the integrity of our community.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "Opus Member",
                price: "$199",
                cadence: "/ month",
                features: [
                  "4 premium bottles monthly",
                  "Free U.S. shipping",
                  "Auction floor access",
                  "Education & Investment Center",
                  "AI Sommelier",
                ],
                cta: "Apply",
              },
              {
                name: "Opus Black",
                price: "$499",
                cadence: "/ month",
                featured: true,
                features: [
                  "Everything in Opus Member",
                  "Priority allocations",
                  "VIP events & private tastings",
                  "Celebrity event invitations",
                  "Quarterly investment reports",
                  "Luxury concierge",
                ],
                cta: "Apply",
              },
              {
                name: "Founder Circle",
                price: "Invitation",
                cadence: "Only",
                features: [
                  "Private winery access",
                  "Celebrity dinners",
                  "Co-investment opportunities",
                  "Bespoke luxury travel",
                  "Private cellar consulting",
                  "Direct access to Opus executives",
                ],
                cta: "Request Introduction",
              },
            ].map((t) => (
              <div
                key={t.name}
                className={`group relative flex flex-col rounded-sm p-10 ring-1 transition ${
                  t.featured
                    ? "bg-surface ring-gold luxury-shadow"
                    : "bg-surface/40 ring-border hover:ring-gold/40"
                }`}
              >
                {t.featured ? (
                  <span className="absolute -top-3 left-10 rounded-sm gold-gradient px-3 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-primary-foreground">
                    Most Selected
                  </span>
                ) : null}
                <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gold">
                  {t.name}
                </div>
                <div className="mb-8 font-display text-5xl">
                  {t.price}
                  <span className="ml-1 text-sm font-sans text-muted-foreground">{t.cadence}</span>
                </div>
                <ul className="mb-10 flex-1 space-y-3 text-sm text-muted-foreground">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/membership"
                  className={`block rounded-sm px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.3em] transition ${
                    t.featured
                      ? "gold-gradient text-primary-foreground hover:brightness-110"
                      : "border border-foreground/30 hover:border-gold hover:text-gold"
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CELEBRITY MARKETPLACE */}
      <section className="border-y border-border bg-surface/30 px-6 py-32 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 lg:flex-row">
            <div className="max-w-2xl">
              <span className="mb-4 block text-[10px] uppercase tracking-[0.4em] text-gold">
                Beverages by Influencers
              </span>
              <h2 className="font-display text-5xl text-balance md:text-6xl">
                Curated by <span className="italic">globally recognized icons</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every month, celebrities release serialized collectible bottles. Only 100 per
                edition. Each includes certificate of authenticity, exclusive packaging, and an
                investment score.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold"
            >
              View Marketplace →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {influencers.map((i, idx) => (
              <Link key={i.name} to="/marketplace" className="group">
                <div className="relative overflow-hidden rounded-sm ring-1 ring-border transition-all group-hover:ring-gold/50">
                  <img
                    src={i.img}
                    alt={i.name}
                    loading="lazy"
                    width={800}
                    height={1200}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="mb-1 text-[9px] uppercase tracking-[0.3em] text-gold">
                      Edition {String(idx + 1).padStart(3, "0")} / 100
                    </div>
                    <h3 className="font-serif text-2xl">{i.name}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {i.series}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT */}
      <section className="px-6 py-32 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-sm ring-1 ring-border">
            <img
              src={cellarDetail}
              alt="Private cellar"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div>
            <span className="mb-4 block text-[10px] uppercase tracking-[0.4em] text-gold">
              Investment Platform
            </span>
            <h2 className="mb-6 font-display text-5xl text-balance md:text-6xl">
              Transforming bottles into <span className="italic">assets</span>.
            </h2>
            <p className="mb-10 text-lg text-muted-foreground">
              Track market value, producer rankings, auction analytics, and AI forecasting for every
              bottle in your cellar. The world's first complete portfolio platform built for fine
              wine and spirits.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { k: "+12.4%", v: "Avg. annual return on Founder Tier portfolios" },
                { k: "1,840", v: "Producers tracked across 17 regions" },
                { k: "Real-time", v: "Auction data from Sotheby's, Christie's, Acker" },
                { k: "AI", v: "Forecasting and cellaring recommendations" },
              ].map((m) => (
                <div key={m.v} className="rounded-sm border border-border bg-surface/50 p-6">
                  <div className="mb-1 font-display text-3xl text-gold-gradient">{m.k}</div>
                  <div className="text-xs leading-relaxed text-muted-foreground">{m.v}</div>
                </div>
              ))}
            </div>
            <Link
              to="/investment"
              className="mt-10 inline-block border-b border-gold pb-1 text-[11px] uppercase tracking-[0.3em] text-gold"
            >
              Open Investment Center →
            </Link>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="border-t border-border bg-surface/30 px-6 py-32 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 flex flex-col items-end justify-between gap-6 lg:flex-row">
            <div>
              <span className="mb-4 block text-[10px] uppercase tracking-[0.4em] text-gold">
                Experiences
              </span>
              <h2 className="font-display text-5xl text-balance md:text-6xl">
                Beyond the <span className="italic">bottle</span>.
              </h2>
            </div>
            <Link
              to="/events"
              className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold"
            >
              All Experiences →
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { img: eventVineyard, title: "Harvest at Château Margaux", date: "October · Bordeaux" },
              { img: eventTasting, title: "Founders Dinner with Nicole Kidman", date: "November · Aspen" },
            ].map((e) => (
              <div
                key={e.title}
                className="group relative overflow-hidden rounded-sm ring-1 ring-border"
              >
                <img
                  src={e.img}
                  alt={e.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gold">
                    {e.date}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl">{e.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="px-6 py-40 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-10 font-serif text-6xl italic text-gold-gradient">"</div>
          <p className="font-display text-3xl leading-snug text-balance italic md:text-4xl">
            The 2018 Reserve is arguably the finest production we have seen in a decade. Opus has
            redefined what membership means in luxury beverage.
          </p>
          <p className="mt-10 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            — Opus Membership Committee
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
