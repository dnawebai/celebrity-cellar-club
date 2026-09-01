import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { formatMembers, getActiveMembers } from "@/lib/members";
import heroBottle from "@/assets/hero-bottle.jpg";
import opusOneBottle from "@/assets/opus-one-bottle.jpg";
import influencer1 from "@/assets/drop-denise.jpg";
import influencer2 from "@/assets/drop-hibell.jpg";
import influencer3 from "@/assets/drop-taylor.jpg";
import influencer4 from "@/assets/drop-50cent.jpg";
import eventTasting from "@/assets/event-tasting.jpg";
import eventVineyard from "@/assets/event-vineyard.jpg";
import eventDinner from "@/assets/event-dinner.jpg";
import dollyAuction from "@/assets/event-dolly-auction.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OPUS DRINKS — Collect. Invest. Experience." },
      {
        name: "description",
        content:
          "The members-only platform for the next generation of collectors. Live auctions, celebrity drops, private sommelier, and a wine investment portfolio in one app.",
      },
      { property: "og:title", content: "OPUS DRINKS — Collect. Invest. Experience." },
      { property: "og:image", content: heroBottle },
    ],
  }),
  component: HomePage,
});

const influencers = [
  {
    beverage: "Napa Valley Cabernet",
    inspiredBy: "Denise Richards",
    confirmed: false,
    img: influencer1,
    tag: "Red Wine",
  },
  {
    beverage: "Grand Cru Champagne",
    inspiredBy: "Aaron Hibell",
    confirmed: false,
    img: influencer2,
    tag: "Champagne",
  },
  {
    beverage: "Artisan Mezcal",
    inspiredBy: "Taylor Swift",
    confirmed: true,
    img: influencer3,
    tag: "Agave",
  },
  {
    beverage: "Branson Cognac",
    inspiredBy: "50 Cent",
    confirmed: true,
    img: influencer4,
    tag: "Cognac",
  },
];

const liveAuctions = [
  { lot: "Lot 014", title: "1982 Mouton Rothschild", region: "Pauillac", bid: "$48,250", bidders: 17, closes: "2d 14h 06m" },
  { lot: "Lot 017", title: "1996 DRC La Tâche", region: "Burgundy", bid: "$31,800", bidders: 24, closes: "4d 02h 18m" },
  { lot: "Lot 021", title: "Pappy Van Winkle 23", region: "Kentucky", bid: "$12,400", bidders: 39, closes: "1d 06h 49m" },
];

// Stats are built inside HomePage() so getActiveMembers() re-runs per
// request/render. Module-scope evaluation freezes on serverless isolates.


const pillars = [
  { n: "01", title: "Drops", body: "Limited-edition celebrity bottles. 100 per release. Numbered, signed, sealed." },
  { n: "02", title: "Auctions", body: "Live bidding on grail bottles. Real-time data from the world's top auction houses." },
  { n: "03", title: "Invest", body: "Track your cellar like a portfolio. Analyst forecasts, market indices, ROI reports." },
  { n: "04", title: "Sommelier", body: "Your private advisor. Pairings, vintages, allocation strategy — 24/7, in your pocket." },
];

function DollyModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        data-testid="dolly-modal"
        className="relative my-auto flex h-[80dvh] max-h-[80dvh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border-2 border-[#ffb6c1] bg-white shadow-2xl md:h-auto md:max-h-[86dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#c71585] shadow-lg transition hover:bg-[#fff0f5]"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex min-h-0 flex-col overflow-hidden md:grid md:grid-cols-2">
          <Link to="/checkout/membership" className="relative block h-28 shrink-0 md:h-auto">
            <img
              src={dollyAuction}
              alt="Dolly Parton benefit auction lots"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#c71585]/30 to-transparent" />
          </Link>

          <div className="flex min-h-0 flex-col bg-gradient-to-br from-white to-[#fff0f5]">
            <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-12">
              <span className="mb-1.5 inline-flex w-fit items-center gap-2 rounded-full border border-[#ffb6c1] bg-[#fff0f5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c71585]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff69b4]" />
                Benefit Auction
              </span>

              <h2 className="font-display text-2xl font-medium tracking-tight text-[#1a1a1a] md:text-5xl">
                Butterflies &amp; Barrels
              </h2>
              <p className="mt-0.5 font-display text-lg italic text-[#c71585] md:mt-2 md:text-2xl">
                The Dolly Parton Benefit
              </p>

              <p className="mt-2 text-xs leading-relaxed text-[#4a4a4a] md:mt-5 md:text-sm">
                September 15, 2026 · Nashville &amp; Online. A single-owner Appalachian cellar goes under the hammer for the Dollywood Foundation and Imagination Library. 100% of hammer price to the cause.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 md:mt-6 md:grid-cols-4 md:gap-3">
                {[
                  { label: "Lots", value: "22" },
                  { label: "Opens", value: "7PM CT" },
                  { label: "Proceeds", value: "100%" },
                  { label: "Paddles", value: "140" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[#ffe4e1] bg-white p-1.5 text-center shadow-sm md:p-3"
                  >
                    <div className="text-[9px] uppercase tracking-[0.08em] text-[#c71585] md:text-[10px] md:tracking-[0.12em] lg:tracking-[0.2em]">
                      {stat.label}
                    </div>
                    <div className="font-display text-sm text-[#1a1a1a] md:mt-1 md:text-xl">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#ffe4e1] bg-white/80 p-4 backdrop-blur-sm md:border-transparent md:bg-transparent md:p-12 md:pt-0">
              <Link
                to="/checkout/membership"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff1493] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg transition hover:bg-[#c71585] hover:shadow-xl md:px-8 md:py-4"
              >
                Reserve your paddle · $199
              </Link>

              <p className="mt-1.5 text-center text-[11px] text-[#888] md:mt-3">
                Membership required. One-time $199.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [showDolly, setShowDolly] = useState(true);
  const stats = [
    { value: `${formatMembers(getActiveMembers())}+`, label: "Members" },
    { value: "$184M", label: "Transacted" },
    { value: "320+", label: "Producers" },
    { value: "+12.4%", label: "YTD Return" },
  ];
  return (
    <SiteShell>
      {showDolly && <DollyModal onClose={() => setShowDolly(false)} />}
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10">
          <img src={heroBottle} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/85 to-background/40" />
          <div
            className="absolute -right-32 -top-32 size-[40rem] rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, oklch(0.92 0.21 125 / 0.4), transparent 60%)" }}
          />
          <div
            className="absolute -bottom-32 -left-32 size-[36rem] rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, oklch(0.68 0.27 350 / 0.5), transparent 60%)" }}
          />
        </div>

        <div className="mx-auto grid max-w-[1500px] gap-16 px-5 pb-24 pt-24 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="lg:col-span-8">
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur animate-fade-up">
              <span
                className="size-1.5 rounded-full pulse-gold"
                style={{ backgroundColor: "var(--color-lime)" }}
              />
              Est. 2023
            </span>

            <h1 className="font-display text-[13vw] font-medium leading-[0.85] tracking-[-0.045em] sm:text-[10vw] lg:text-[8.5rem] animate-fade-up">
              Collect.
              <br />
              Invest.
              <br />
              <span className="italic text-gold-gradient">Experience.</span>
            </h1>

            <p className="mt-10 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground animate-fade-up">
              The members-only platform where rare bottles become assets, celebrities
              drop limited runs, and your cellar grows up alongside you.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-3 animate-fade-up">
              <Link
                to="/membership"
                className="gold-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight transition-all hover:brightness-110 lime-glow"
              >
                Apply for membership <span className="opacity-60">→</span>
              </Link>
              <Link
                to="/auctions"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-surface"
              >
                Watch the floor live
              </Link>
            </div>
          </div>

          <aside className="hidden flex-col gap-4 lg:col-span-4 lg:flex">
            <div className="rounded-3xl border border-border bg-surface/60 p-6 backdrop-blur-xl luxury-shadow">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Opus 50 Index
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                  style={{ background: "oklch(0.92 0.21 125 / 0.18)", color: "var(--color-lime)" }}
                >
                  +12.4%
                </span>
              </div>
              <div className="font-display text-5xl font-medium tracking-tight">
                1,847<span className="text-muted-foreground/40">.62</span>
              </div>
              <svg viewBox="0 0 300 80" className="mt-4 w-full">
                <polyline
                  points="0,60 30,55 60,58 90,40 120,45 150,30 180,38 210,20 240,28 270,12 300,18"
                  fill="none"
                  stroke="var(--color-lime)"
                  strokeWidth="2"
                />
                <polyline
                  points="0,60 30,55 60,58 90,40 120,45 150,30 180,38 210,20 240,28 270,12 300,18 300,80 0,80"
                  fill="url(#g)"
                  opacity="0.25"
                />
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-lime)" />
                    <stop offset="100%" stopColor="var(--color-lime)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <div>1D <span className="text-foreground">+0.8%</span></div>
                <div>1M <span className="text-foreground">+3.1%</span></div>
                <div>YTD <span className="text-foreground">+12.4%</span></div>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-red-500 blink" />
                Live now
              </div>
              <div className="font-display text-2xl leading-tight">
                Founder Tasting · Napa
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                47 members watching · Vintage 2018 verticals
              </div>
              <Link
                to="/events"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-gradient"
              >
                Join stream →
              </Link>
            </div>
          </aside>
        </div>

        {/* Stats strip */}
        <div className="border-t border-border bg-background/40 backdrop-blur">
          <div className="mx-auto grid max-w-[1500px] grid-cols-2 divide-x divide-border lg:grid-cols-4 lg:px-8">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-6">
                <div className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOUR PILLARS ============ */}
      <section className="border-b border-border px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-16 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="font-display text-5xl font-medium tracking-[-0.03em] md:text-7xl">
              One app. <span className="italic text-gold-gradient">Four obsessions.</span>
            </h2>
            <p className="max-w-md text-base text-muted-foreground">
              Most platforms pick a lane. We don't. Buy it, bid on it, hold it, learn it —
              all under one membership.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div
                key={p.n}
                className="group relative flex h-72 flex-col justify-between bg-background p-7 transition hover:bg-surface"
              >
                <span className="font-mono text-xs text-muted-foreground">{p.n}</span>
                <div>
                  <h3 className="font-display text-3xl font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
                <span
                  className="absolute right-7 top-7 size-2 rounded-full opacity-0 transition group-hover:opacity-100"
                  style={{ backgroundColor: "var(--color-lime)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dolly Parton benefit auction now appears as a centered popup modal on page load. */}



      {/* ============ LIVE AUCTIONS ============ */}
      <section className="border-b border-border px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.25em]">
                <span className="size-1.5 rounded-full bg-red-500 blink" /> Live floor
              </span>
              <h2 className="font-display text-5xl font-medium tracking-[-0.03em] md:text-7xl">
                Tonight's <span className="italic text-gold-gradient">grails</span>.
              </h2>
            </div>
            <Link
              to="/auctions"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface"
            >
              All auctions →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {liveAuctions.map((a) => (
              <div
                key={a.lot}
                className="group flex flex-col rounded-3xl border border-border bg-surface/40 p-7 transition hover:border-foreground/30 hover:bg-surface"
              >
                <div className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
                  <span className="text-muted-foreground">{a.lot} · {a.region}</span>
                  <span className="text-gold flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-red-500 blink" />
                    {a.closes}
                  </span>
                </div>
                <h3 className="font-display text-3xl font-medium leading-tight tracking-tight">
                  {a.title}
                </h3>
                <div className="mt-auto pt-10">
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Current bid
                      </div>
                      <div className="mt-1 font-display text-4xl font-medium tracking-tight text-gold-gradient">
                        {a.bid}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Bidders
                      </div>
                      <div className="mt-1 font-display text-2xl">{a.bidders}</div>
                    </div>
                  </div>
                  <Link
                    to="/membership"
                    className="block w-full rounded-full border border-foreground/20 px-4 py-3 text-center text-xs font-semibold transition group-hover:gold-gradient group-hover:border-transparent"
                  >
                    Place bid
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DROPS ============ */}
      <section className="relative overflow-hidden border-b border-border px-5 py-24 lg:px-8 lg:py-32">
        <div
          className="absolute -right-40 top-10 size-[30rem] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, oklch(0.68 0.27 350 / 0.6), transparent 60%)" }}
        />
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-col items-end justify-between gap-6 lg:flex-row">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Celebrity drops
              </span>
              <h2 className="font-display text-5xl font-medium tracking-[-0.03em] md:text-7xl">
                100 bottles.
                <br />
                <span className="italic text-magenta-gradient">A whole lot of envy.</span>
              </h2>
              <p className="mt-5 text-base text-muted-foreground">
                Numbered editions co-created with the people you actually follow.
                Drops every two weeks. Members get first 24 hours.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface"
            >
              All drops →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {influencers.map((i, idx) => (
              <Link key={i.beverage} to="/marketplace" className="group">
                <div className="relative overflow-hidden rounded-3xl border border-border transition group-hover:border-foreground/30">
                  <img
                    src={i.img}
                    alt={i.beverage}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <span
                    className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur"
                    style={{ background: "oklch(0.10 0.012 280 / 0.7)" }}
                  >
                    {i.tag}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div
                      className="mb-1 text-[10px] uppercase tracking-[0.25em]"
                      style={{ color: "var(--color-lime)" }}
                    >
                      Drop {String(idx + 1).padStart(3, "0")} · ed. 100
                    </div>
                    <h3 className="font-display text-2xl font-medium leading-tight tracking-tight">
                      {i.beverage}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {i.confirmed
                        ? `Inspired by ${i.inspiredBy}'s reported favorite drink`
                        : `Inspired by ${i.inspiredBy} · not publicly confirmed`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INVEST ============ */}
      <section className="border-b border-border px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <span className="mb-4 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Investment platform
            </span>
            <h2 className="mb-6 font-display text-5xl font-medium tracking-[-0.03em] md:text-7xl">
              Your cellar is a <span className="italic text-gold-gradient">portfolio</span>.
            </h2>
            <p className="mb-10 text-lg text-muted-foreground">
              Track market value, producer rankings, and analyst forecasts on every bottle
              you own. The first investment platform built for fine wine and spirits —
              designed for the people who'd rather hold than sip.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { k: "+12.4%", v: "Avg. YTD return on Founder portfolios" },
                { k: "1,840", v: "Producers tracked across 17 regions" },
                { k: "Real-time", v: "Sotheby's, Christie's, Acker data feed" },
                { k: "Forecast", v: "Vintage projections & cellaring strategy" },
              ].map((m) => (
                <div
                  key={m.v}
                  className="rounded-2xl border border-border bg-surface/50 p-5"
                >
                  <div className="mb-1 font-display text-3xl font-medium tracking-tight text-gold-gradient">
                    {m.k}
                  </div>
                  <div className="text-xs leading-relaxed text-muted-foreground">{m.v}</div>
                </div>
              ))}
            </div>
            <Link
              to="/investment"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-foreground/30 px-5 py-2.5 text-sm font-semibold hover:gold-gradient hover:border-transparent"
            >
              Open investment center →
            </Link>
          </div>
          <div className="relative order-1 overflow-hidden rounded-3xl border border-border luxury-shadow transition hover:border-gold/50 lg:order-2">
            <img
              src={opusOneBottle}
              alt="Opus One Napa Valley red wine bottle"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-border bg-background/80 p-5 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <span>Opus One · Napa Valley</span>
                <span style={{ color: "var(--color-lime)" }}>+8.4% (30d)</span>
              </div>
              <div className="font-display text-3xl font-medium tracking-tight">
                $2,800
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-gold">
                Investment-grade allocation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCES ============ */}
      <section className="border-b border-border px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-col items-end justify-between gap-6 lg:flex-row">
            <div>
              <span className="mb-4 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Experiences
              </span>
              <h2 className="font-display text-5xl font-medium tracking-[-0.03em] md:text-7xl">
                Beyond the <span className="italic text-gold-gradient">bottle</span>.
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface"
            >
              All experiences →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { img: eventVineyard, kicker: "Napa · Oct 12", title: "Private harvest at Opus One" },
              { img: eventTasting, kicker: "NYC · Oct 19", title: "Burgundy vertical · 12 vintages" },
              { img: eventDinner, kicker: "Miami · Nov 02", title: "Chef's table × Founder Circle" },
            ].map((e) => (
              <Link key={e.title} to="/events" className="group">
                <div className="relative overflow-hidden rounded-3xl border border-border">
                  <img
                    src={e.img}
                    alt={e.title}
                    loading="lazy"
                    className="aspect-[5/6] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div
                      className="mb-2 text-[10px] uppercase tracking-[0.25em]"
                      style={{ color: "var(--color-lime)" }}
                    >
                      {e.kicker}
                    </div>
                    <h3 className="font-display text-2xl font-medium leading-tight tracking-tight">
                      {e.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden px-5 py-32 lg:px-8 lg:py-40">
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, oklch(0.92 0.21 125 / 0.25), transparent 50%), radial-gradient(circle at 70% 50%, oklch(0.68 0.27 350 / 0.25), transparent 50%)",
          }}
        />
        <div className="mx-auto max-w-[1500px] text-center">
          <h2 className="mx-auto max-w-5xl font-display text-6xl font-medium leading-[0.9] tracking-[-0.04em] md:text-[9rem]">
            Apply. Get in.
            <br />
            <span className="italic text-gold-gradient">Get rare.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
            $199 application fee. Reviewed individually. Approved members unlock
            allocations within 48 hours.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link
              to="/membership"
              className="gold-gradient inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold lime-glow"
            >
              Start application →
            </Link>
            <Link
              to="/sommelier"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-surface/50 px-7 py-4 text-sm font-semibold backdrop-blur hover:bg-surface"
            >
              Meet the Opus Sommelier
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
