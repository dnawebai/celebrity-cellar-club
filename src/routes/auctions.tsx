import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import heroBottle from "@/assets/hero-bottle.jpg";
import cellar from "@/assets/cellar-detail.jpg";

export const Route = createFileRoute("/auctions")({
  head: () => ({
    meta: [
      { title: "Live Auctions — Opus Drinks" },
      {
        name: "description",
        content:
          "Sotheby's-style live auctions for rare wines and spirits. Place bids, view investment ratings, and track auction history.",
      },
    ],
  }),
  component: AuctionsPage,
});

type Auction = {
  lot: string;
  title: string;
  region: string;
  bid: number;
  reserve: number;
  bidders: number;
  endsAt: number;
  estimate: string;
  rating: "AAA" | "AA+" | "AA" | "A+";
  img: string;
};

const now = Date.now();
const H = 3_600_000;

const live: Auction[] = [
  {
    lot: "Lot 014",
    title: "1982 Château Mouton Rothschild",
    region: "Pauillac · Bordeaux",
    bid: 48250,
    reserve: 45000,
    bidders: 17,
    endsAt: now + 2 * H + 14 * 60_000,
    estimate: "$52,000 – $68,000",
    rating: "AAA",
    img: heroBottle,
  },
  {
    lot: "Lot 017",
    title: "1996 DRC La Tâche · 750ml",
    region: "Vosne-Romanée · Burgundy",
    bid: 31800,
    reserve: 28000,
    bidders: 24,
    endsAt: now + 4 * H + 2 * 60_000,
    estimate: "$34,000 – $42,000",
    rating: "AAA",
    img: cellar,
  },
  {
    lot: "Lot 021",
    title: "Pappy Van Winkle 23-Year Sealed",
    region: "Kentucky · United States",
    bid: 12400,
    reserve: 12500,
    bidders: 39,
    endsAt: now + 6 * H + 49 * 60_000,
    estimate: "$14,000 – $18,000",
    rating: "AA+",
    img: heroBottle,
  },
  {
    lot: "Lot 023",
    title: "Macallan 25-Year Sherry Oak",
    region: "Speyside · Scotland",
    bid: 8200,
    reserve: 7500,
    bidders: 12,
    endsAt: now + 11 * H,
    estimate: "$9,500 – $11,000",
    rating: "AA",
    img: cellar,
  },
  {
    lot: "Lot 028",
    title: "Penfolds Grange 2008 Library",
    region: "South Australia",
    bid: 3400,
    reserve: 3000,
    bidders: 21,
    endsAt: now + 30 * H,
    estimate: "$3,800 – $4,500",
    rating: "A+",
    img: heroBottle,
  },
];

const upcoming = [
  { date: "Dec 12", title: "Holiday Library Release", lots: 24 },
  { date: "Jan 18", title: "Winter Spirits Collection", lots: 18 },
  { date: "Feb 22", title: "Founder Circle Cellar Liquidation", lots: 11 },
  { date: "Mar 14", title: "Spring Champagne Vault", lots: 36 },
];

function AuctionsPage() {
  const [tab, setTab] = useState<"live" | "upcoming" | "past">("live");
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="border-b border-border px-6 pt-32 pb-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mb-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold">
            <span className="size-1.5 rounded-full bg-gold pulse-gold" /> Live Auction Floor
          </span>
          <h1 className="mb-6 max-w-[18ch] font-display text-5xl text-balance md:text-7xl">
            The Opus <span className="italic text-gold-gradient">Auction House</span>.
          </h1>
          <p className="max-w-[58ch] text-lg text-muted-foreground">
            Member-only bidding on rare allocations from the world's most respected cellars and
            distilleries. All lots authenticated, insured, and white-glove shipped.
          </p>
          <div className="mt-10 flex gap-1 rounded-sm border border-border bg-surface/40 p-1 text-[11px] uppercase tracking-[0.25em] w-fit">
            {(["live", "upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-sm px-5 py-2.5 transition ${
                  tab === t
                    ? "bg-gold text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "live" ? "Live Now" : t === "upcoming" ? "Upcoming" : "Completed"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          {tab === "live" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {live.map((a) => (
                <LotCard key={a.lot} a={a} />
              ))}
            </div>
          ) : tab === "upcoming" ? (
            <UpcomingCalendar />
          ) : (
            <PastResults />
          )}
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="border-t border-border bg-surface/30 px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="mb-3 block text-[10px] uppercase tracking-[0.4em] text-gold">
              Stay informed
            </span>
            <h2 className="mb-4 font-display text-4xl md:text-5xl">
              Never miss <span className="italic">a closing bell</span>.
            </h2>
            <p className="text-muted-foreground">
              Receive SMS and email alerts for auctions you've reserved, allocations you're tracking,
              and final five-minute closing windows on any lot.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="member@email.com"
              className="flex-1 rounded-sm bg-surface px-4 py-3 text-sm ring-1 ring-border focus:outline-none focus:ring-gold/60"
            />
            <button className="rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}

function LotCard({ a }: { a: Auction }) {
  const met = a.bid >= a.reserve;
  return (
    <article className="group overflow-hidden rounded-sm border border-border bg-surface/40 transition hover:border-gold/40">
      <div className="grid md:grid-cols-[260px_1fr]">
        <div className="relative overflow-hidden">
          <img
            src={a.img}
            alt={a.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-sm bg-background/80 px-2 py-1 text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur">
            {a.rating}
          </span>
        </div>
        <div className="flex flex-col p-7">
          <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>{a.lot}</span>
            <span className="flex items-center gap-2 text-gold">
              <span className="size-1 rounded-full bg-gold pulse-gold" />
              {formatRemaining(a.endsAt)}
            </span>
          </div>
          <h3 className="font-display text-2xl leading-tight">{a.title}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {a.region}
          </p>

          <div className="my-5 grid grid-cols-2 gap-4 border-y border-border py-4">
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Current Bid
              </div>
              <div className="mt-1 font-display text-2xl text-gold-gradient">
                ${a.bid.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Est. Future Value
              </div>
              <div className="mt-1 font-mono text-sm">{a.estimate}</div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{a.bidders} bidders</span>
            <span
              className={`rounded-sm px-2 py-1 text-[9px] uppercase tracking-[0.3em] ${
                met ? "bg-gold/15 text-gold" : "bg-burgundy/30 text-foreground"
              }`}
            >
              {met ? "Reserve Met" : "Below Reserve"}
            </span>
          </div>

          <div className="mt-auto flex gap-2">
            <button className="flex-1 rounded-sm gold-gradient px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-foreground">
              Place Bid
            </button>
            <button className="rounded-sm border border-border px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:border-gold hover:text-gold">
              Watch
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function UpcomingCalendar() {
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <div className="grid grid-cols-12 border-b border-border bg-surface/60 px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <div className="col-span-2">Date</div>
        <div className="col-span-6">Auction</div>
        <div className="col-span-2">Lots</div>
        <div className="col-span-2 text-right">Action</div>
      </div>
      {upcoming.map((u) => (
        <div
          key={u.title}
          className="grid grid-cols-12 items-center border-b border-border bg-background/40 px-6 py-5 text-sm last:border-0 hover:bg-surface/40"
        >
          <div className="col-span-2 font-mono text-gold">{u.date}</div>
          <div className="col-span-6 font-display text-xl">{u.title}</div>
          <div className="col-span-2 text-muted-foreground">{u.lots}</div>
          <div className="col-span-2 text-right">
            <button className="rounded-sm border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold">
              Reserve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PastResults() {
  const past = [
    { title: "1990 Krug Clos d'Ambonnay", sold: "$28,400", change: "+18%" },
    { title: "Yamazaki 55 Year", sold: "$795,000", change: "+42%" },
    { title: "1945 Romanée-Conti", sold: "$558,000", change: "+27%" },
    { title: "Macallan Fine & Rare 1926", sold: "$1.2M", change: "+34%" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {past.map((p) => (
        <div key={p.title} className="rounded-sm border border-border bg-surface/40 p-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Hammered
          </div>
          <div className="mt-2 font-display text-3xl text-gold-gradient">{p.sold}</div>
          <h3 className="mt-3 font-serif text-lg">{p.title}</h3>
          <div className="mt-3 text-xs text-gold">{p.change} vs estimate</div>
        </div>
      ))}
    </div>
  );
}

function formatRemaining(endsAt: number) {
  const diff = Math.max(0, endsAt - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}
