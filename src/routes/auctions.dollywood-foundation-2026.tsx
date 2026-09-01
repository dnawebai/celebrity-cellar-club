import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteShell } from "@/components/site-shell";
import { getAuctionBySlug } from "@/lib/auctions.functions";

export const Route = createFileRoute("/auctions/dollywood-foundation-2026")({
  head: () => ({
    meta: [
      { title: "Butterflies & Barrels — Dolly Parton Benefit Auction — Opus Drinks" },
      {
        name: "description",
        content:
          "One bottle of Veuve Monsigny Champagne Brut goes under the hammer for the Dollywood Foundation and Imagination Library. September 15, 2026 in Nashville. Members-only bidding.",
      },
      {
        property: "og:title",
        content: "Butterflies & Barrels — The Dolly Parton Benefit Auction",
      },
      {
        property: "og:description",
        content:
          "100% of hammer price benefits the Dollywood Foundation. Exclusive lots for Opus Drinks members.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://opusdrinks.com/auctions/dollywood-foundation-2026" },
    ],
  }),
  component: DollywoodAuctionPage,
});

function formatCurrency(cents: number | null | undefined) {
  if (cents == null) return "$—";
  return `$${(cents / 100).toLocaleString()}`;
}

function formatCountdown(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

function DollywoodAuctionPage() {
  const fetchAuction = useServerFn(getAuctionBySlug);
  const { data } = useQuery({
    queryKey: ["auction", "dollywood-foundation-2026"],
    queryFn: () => fetchAuction({ data: { slug: "dollywood-foundation-2026" } }),
    staleTime: 30_000,
  });

  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 1_000);
    return () => clearInterval(id);
  }, []);

  const auction = data?.auction;
  const lots = data?.lots ?? [];

  const eventDate = useMemo(() => {
    if (!auction) return null;
    return new Date(auction.starts_at).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [auction]);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border px-6 pt-28 pb-16 lg:px-10">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="h-full w-full bg-gradient-to-br from-pink-100 via-white to-emerald-50" />
        </div>
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-pink-700 backdrop-blur">
              <span className="size-1.5 rounded-full bg-pink-500" />
              Benefit Auction · September 15, 2026
            </span>
            <h1 className="max-w-[18ch] font-display text-5xl text-balance md:text-7xl lg:text-8xl">
              Butterflies <span className="italic text-pink-600">&</span> Barrels
            </h1>
            <p className="mt-4 max-w-[60ch] font-serif text-2xl italic text-pink-700 md:text-3xl">
              The Dolly Parton Benefit
            </p>
            <p className="mt-6 max-w-[70ch] text-base text-muted-foreground md:text-lg">
              One bottle of <strong className="text-foreground">Veuve Monsigny Champagne Brut</strong>{" "}
              goes under the hammer for the{" "}
              <strong className="text-foreground">Dollywood Foundation</strong> and{" "}
              <strong className="text-foreground">Dolly Parton&apos;s Imagination Library</strong>. 100%
              of hammer price benefits the cause. Bidding is open to active Opus Drinks members.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/checkout/membership"
                className="rounded-sm bg-pink-600 px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-pink-700"
              >
                Reserve Your Paddle · $199
              </Link>
              <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                {auction ? formatCountdown(auction.starts_at) : "Loading…"}
              </span>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Stat label="Lots" value={lots.length.toString()} />
              <Stat label="Opens" value={eventDate ?? "—"} />
              <Stat label="Proceeds" value="100%" />
              <Stat label="Location" value="Nashville + Online" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-sm border border-border shadow-lg">
            <img
              src={dollyVeuve}
              alt="Veuve Monsigny Champagne Brut — the single lot of the Butterflies & Barrels benefit auction"
              className="aspect-[4/5] w-full object-cover"
              width={1024}
              height={1280}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-950/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Lots */}
      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">The Lot</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">Veuve Monsigny Champagne Brut</h2>
            </div>
            <p className="max-w-[50ch] text-sm text-muted-foreground">
              Each lot is available exclusively to Opus Drinks members. Click a lot to place a bid or
              unlock membership.
            </p>
          </div>

          {lots.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Lots are being catalogued. Check back soon.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {lots.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Membership CTA */}
      <section className="border-t border-border bg-surface/30 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold">Membership</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">
            One $199 membership. Every authorised house.
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-sm text-muted-foreground">
            Your Opus Drinks membership gives you a unified calendar, watchlist, and concierge team
            across Sotheby&apos;s, Christie&apos;s, Acker, Iron Gate, and exclusive benefit auctions like
            this one.
          </p>
          <Link
            to="/checkout/membership"
            className="mt-8 inline-block rounded-sm bg-pink-600 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-pink-700"
          >
            Join Opus Drinks · $199
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border bg-background/60 p-4 text-center">
      <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-sm text-foreground md:text-base">{value}</div>
    </div>
  );
}

function LotCard({ lot }: { lot: { id: string; lot_number: string; title: string; description: string | null; image_url: string | null; estimate_low_cents: number | null; estimate_high_cents: number | null; current_bid_cents: number | null } }) {
  return (
    <Link
      to="/auctions/dollywood-foundation-2026/lots/$lotId"
      params={{ lotId: lot.id }}
      className="group flex flex-col overflow-hidden rounded-sm border border-border bg-surface/40 transition hover:border-gold/40"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={lot.image_url ?? "/placeholder.svg"}
          alt={lot.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {lot.lot_number}
        </div>
        <h3 className="mt-2 font-display text-lg leading-tight">{lot.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted-foreground">{lot.description}</p>
        <div className="mt-4 border-t border-border pt-4">
          <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Current bid</div>
          <div className="mt-1 font-mono text-gold">
            {formatCurrency(lot.current_bid_cents)}
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            Est. {formatCurrency(lot.estimate_low_cents)} – {formatCurrency(lot.estimate_high_cents)}
          </div>
        </div>
      </div>
    </Link>
  );
}
