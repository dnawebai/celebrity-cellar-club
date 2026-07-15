import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import heroBottle from "@/assets/hero-bottle.jpg";
import cellar from "@/assets/cellar-detail.jpg";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Member Dashboard — Opus Drinks" },
      { name: "description", content: "Your Opus cellar, auctions, deliveries, and portfolio." },
    ],
  }),
  component: Dashboard,
});

const deliveries = [
  { title: "October Allocation", date: "Ships Oct 18", bottles: 4 },
  { title: "Kidman Heritage Drop", date: "Ships Nov 02", bottles: 1 },
  { title: "Holiday Library Crate", date: "Ships Dec 05", bottles: 6 },
];

const watchlist = [
  { title: "1982 Mouton Rothschild", bid: "$48,250", closes: "02h 14m" },
  { title: "1996 DRC La Tâche", bid: "$31,800", closes: "04h 02m" },
  { title: "Pappy Van Winkle 23", bid: "$12,400", closes: "06h 49m" },
];

function Dashboard() {
  return (
    <SiteShell>
      {/* Header */}
      <section className="border-b border-border px-6 pt-32 pb-12 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gold">
              <span className="size-1.5 rounded-full bg-gold pulse-gold" />
              Opus Black · Member since 2023
            </span>
            <h1 className="font-display text-5xl md:text-6xl">Welcome back, Alexander.</h1>
          </div>
          <div className="flex gap-3 text-[10px] uppercase tracking-[0.3em]">
            <Link
              to="/auctions"
              className="rounded-sm border border-border px-4 py-2 hover:border-gold hover:text-gold"
            >
              Auction Floor
            </Link>
            <button className="rounded-sm gold-gradient px-4 py-2 font-semibold text-primary-foreground">
              Settings
            </button>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="border-b border-border bg-surface/30 px-6 py-10 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-px overflow-hidden md:grid-cols-4">
          {[
            { k: "Portfolio Value", v: "$284,910", sub: "+12.4% YTD", up: true },
            { k: "Bottles in Cellar", v: "184", sub: "Across 12 regions" },
            { k: "Active Bids", v: "6", sub: "2 closing tonight", up: true },
            { k: "Upcoming Deliveries", v: "3", sub: "Next Oct 18" },
          ].map((s) => (
            <div key={s.k} className="bg-background p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {s.k}
              </div>
              <div className="mt-2 font-display text-3xl text-gold-gradient">{s.v}</div>
              <div className={`mt-1 text-[10px] uppercase tracking-[0.3em] ${s.up ? "text-gold" : "text-muted-foreground"}`}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="px-6 py-12 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-3">
          {/* Deliveries */}
          <div className="rounded-sm border border-border bg-surface/40 p-8 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl">Upcoming Deliveries</h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                White-glove delivery
              </span>
            </div>
            <ul className="divide-y divide-border">
              {deliveries.map((d) => (
                <li key={d.title} className="flex items-center gap-5 py-5 first:pt-0">
                  <img src={heroBottle} alt="" className="size-16 rounded-sm object-cover" />
                  <div className="flex-1">
                    <div className="font-display text-xl">{d.title}</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {d.date} · {d.bottles} bottle{d.bottles > 1 ? "s" : ""}
                    </div>
                  </div>
                  <button className="rounded-sm border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold">
                    Track
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Watchlist */}
          <div className="rounded-sm border border-border bg-surface/40 p-8">
            <div className="mb-6 text-[10px] uppercase tracking-[0.3em] text-gold">Watchlist</div>
            <ul className="space-y-5">
              {watchlist.map((w) => (
                <li key={w.title} className="border-b border-border pb-5 last:border-0 last:pb-0">
                  <div className="font-serif text-base">{w.title}</div>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-gold">{w.bid}</span>
                    <span className="text-muted-foreground">Closes {w.closes}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/auctions"
              className="mt-6 block w-full rounded-sm border border-border py-3 text-center text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
            >
              Open Auction Floor
            </Link>
          </div>

          {/* Portfolio */}
          <div className="rounded-sm border border-border bg-surface/40 p-8 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl">Portfolio</h2>
              <Link to="/investment" className="text-[10px] uppercase tracking-[0.3em] text-gold">
                Full Analytics →
              </Link>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { name: "Bordeaux Premier Cru", w: "32%", value: "$92,180" },
                { name: "Burgundy Grand Cru", w: "24%", value: "$68,420" },
                { name: "Rare Whisky", w: "18%", value: "$51,280" },
                { name: "Champagne", w: "14%", value: "$40,310" },
                { name: "Other", w: "12%", value: "$32,720" },
              ].map((row) => (
                <div key={row.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif text-base">{row.name}</span>
                    <span className="font-mono text-gold">{row.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-background">
                    <div className="h-full gold-gradient" style={{ width: row.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="rounded-sm border border-gold/40 bg-surface p-8">
            <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">
              Upcoming Event
            </div>
            <img src={cellar} alt="" className="mb-5 aspect-[4/3] w-full rounded-sm object-cover" />
            <h3 className="font-display text-2xl">Aspen Founder Gala</h3>
            <p className="mt-2 text-xs text-muted-foreground">December 12 · 24 of 40 seats filled</p>
            <button className="mt-5 w-full rounded-sm gold-gradient py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-foreground">
              Reserve Seat
            </button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
