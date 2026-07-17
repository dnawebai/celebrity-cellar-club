import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/investment")({
  head: () => ({
    meta: [
      { title: "Wine Investment Center — Opus Drinks" },
      {
        name: "description",
        content:
          "Market reports, analyst forecasts, auction analytics, and portfolio tracking for fine wine and spirits.",
      },
    ],
  }),
  component: InvestmentPage,
});

const indices = [
  { name: "Opus 50 Index", value: "428.61", change: "+1.42%", up: true },
  { name: "Bordeaux Reserve", value: "612.04", change: "+0.86%", up: true },
  { name: "Burgundy Grand Cru", value: "1,184.20", change: "−0.34%", up: false },
  { name: "Rare Whisky 100", value: "892.15", change: "+2.18%", up: true },
];

const movers = [
  { name: "Yamazaki 55", region: "Speyside", ytd: "+47.2%" },
  { name: "Krug Clos d'Ambonnay '02", region: "Champagne", ytd: "+31.9%" },
  { name: "Sassicaia '15", region: "Bolgheri", ytd: "+22.6%" },
  { name: "DRC Grands Échezeaux '17", region: "Burgundy", ytd: "+19.4%" },
  { name: "Pappy 23 Sealed", region: "Kentucky", ytd: "+17.1%" },
];

function InvestmentPage() {
  return (
    <SiteShell>
      <section className="border-b border-border px-6 pt-32 pb-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mb-6 block text-[10px] uppercase tracking-[0.4em] text-gold">
            Investment Center
          </span>
          <h1 className="max-w-[22ch] font-display text-5xl text-balance md:text-7xl">
            Transforming bottles into <span className="italic text-gold-gradient">assets</span>.
          </h1>
          <p className="mt-8 max-w-[58ch] text-lg text-muted-foreground">
            Real-time market data, analyst forecasts, and portfolio tracking — engineered for the
            collector who treats their cellar as a balance sheet.
          </p>
        </div>
      </section>

      {/* INDICES STRIP */}
      <section className="border-b border-border bg-surface/40 px-6 py-10 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-px overflow-hidden md:grid-cols-4">
          {indices.map((i) => (
            <div key={i.name} className="bg-background p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {i.name}
              </div>
              <div className="mt-2 font-display text-3xl text-gold-gradient">{i.value}</div>
              <div className={`mt-1 font-mono text-xs ${i.up ? "text-gold" : "text-burgundy-foreground"}`}>
                {i.change} · YTD
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHART + MOVERS */}
      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-3">
          <div className="rounded-sm border border-border bg-surface/40 p-8 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  Opus 50 Index
                </div>
                <h3 className="font-display text-3xl">5-Year Performance</h3>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl text-gold-gradient">+184.6%</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Cumulative return
                </div>
              </div>
            </div>
            <FakeChart />
          </div>
          <div className="rounded-sm border border-border bg-surface/40 p-8">
            <div className="mb-6 text-[10px] uppercase tracking-[0.3em] text-gold">Top Movers</div>
            <ul className="divide-y divide-border">
              {movers.map((m) => (
                <li key={m.name} className="flex items-center justify-between py-4 first:pt-0">
                  <div>
                    <div className="font-serif text-base">{m.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {m.region}
                    </div>
                  </div>
                  <div className="font-mono text-sm text-gold">{m.ytd}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border bg-surface/30 px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Market Reports", v: "Quarterly briefings authored by the Opus research desk." },
            { k: "AI Forecasting", v: "Bottle-level 12-month projections trained on 40 years of auction data." },
            { k: "Portfolio Tracker", v: "Live valuation, allocation drift, and cellaring windows." },
            { k: "Producer Rankings", v: "1,840 producers scored across vintage, scarcity, and demand." },
          ].map((f) => (
            <div key={f.k} className="rounded-sm border border-border bg-background p-7">
              <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold">{f.k}</div>
              <p className="font-serif text-lg leading-snug">{f.v}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-[1400px] text-center">
          <Link
            to="/membership"
            className="inline-block rounded-sm gold-gradient px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
          >
            Unlock Full Access
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

function FakeChart() {
  // SVG luxury sparkline
  const pts = [10, 16, 14, 22, 28, 24, 36, 44, 38, 52, 60, 58, 68, 76, 84, 80, 92, 100];
  const w = 800;
  const h = 220;
  const step = w / (pts.length - 1);
  const max = Math.max(...pts);
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 20)}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.80 0.135 88)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.80 0.135 88)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={path} fill="none" stroke="oklch(0.80 0.135 88)" strokeWidth="2" />
    </svg>
  );
}
