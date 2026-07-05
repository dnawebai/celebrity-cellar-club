import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { formatMembers, getActiveMembers, getNextFridayUtc, WEEKLY_INCREMENT_MIN, WEEKLY_INCREMENT_MAX } from "@/lib/members";

const navLinks = [
  { to: "/auctions", label: "Auctions" },
  { to: "/marketplace", label: "Drops" },
  { to: "/investment", label: "Invest" },
  { to: "/sommelier", label: "Sommelier AI" },
  { to: "/events", label: "Experiences" },
  { to: "/membership", label: "Membership" },
] as const;

const tickerItems = [
  "◆ Lot 014 · ’82 Mouton Rothschild · $48,250",
  "◆ Drop 0027 · Provence Rosé · 100 ed.",
  "◆ Opus 50 Index · +12.4% YTD",
  "◆ Live: Founder Tasting · Napa · Fri 9PM",
  "◆ New Allocation · Domaine Leflaive 2019",
  "◆ Charity Auction · $1.2M raised this quarter",
];

export function SiteTicker() {
  return (
    <div className="relative overflow-hidden border-b border-border bg-background py-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      <div className="marquee-track">
        {[...tickerItems, ...tickerItems].map((t, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="text-lime" style={{ color: "var(--color-lime)" }}>
              {t}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span
            className="grid size-8 place-items-center rounded-full"
            style={{ backgroundColor: "var(--color-lime)" }}
          >
            <span className="font-display text-base font-bold leading-none text-background">
              O
            </span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Opus<span className="italic text-muted-foreground">/drinks</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface/60 px-2 py-1.5 text-[12px] font-medium backdrop-blur xl:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              activeProps={{
                className:
                  "rounded-full px-3.5 py-1.5 bg-foreground text-background hover:bg-foreground",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden rounded-full px-4 py-2 text-[12px] font-medium text-muted-foreground transition hover:bg-surface hover:text-foreground md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/membership"
            className="gold-gradient inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[12px] font-semibold tracking-tight transition-all hover:brightness-110"
          >
            Apply <span className="opacity-60">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

const footerLinks = {
  Club: [
    { to: "/membership", label: "Membership" },
    { to: "/auctions", label: "Live Auctions" },
    { to: "/marketplace", label: "Drops" },
    { to: "/events", label: "Experiences" },
  ],
  Platform: [
    { to: "/investment", label: "Investment" },
    { to: "/sommelier", label: "Sommelier AI" },
    { to: "/dashboard", label: "Member Dashboard" },
    { to: "/producers", label: "Producer Portal" },
    { to: "/sponsors", label: "Sponsors" },
    { to: "/charity", label: "Charity" },
  ],
  Contact: [{ to: "/membership", label: "Apply for Membership" }],
} as const;

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-background px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-20">
          <h2 className="font-display text-[12vw] font-semibold leading-[0.85] tracking-[-0.04em] md:text-[10rem]">
            Opus<span className="italic text-gold-gradient">.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            Where great beverages become legacy. A members-only platform for the next
            generation of collectors, investors, and tastemakers.
          </p>
        </div>

        <div className="grid gap-16 border-t border-border pt-16 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-[42ch]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span
                className="size-1.5 rounded-full pulse-gold"
                style={{ backgroundColor: "var(--color-lime)" }}
              />
              {formatMembers(getActiveMembers())}+ Active Members
            </div>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              Built in California. Shipping nationwide. Allocations across Bordeaux,
              Burgundy, Napa, Tuscany, Champagne, and rare spirits worldwide.
            </p>
            <a
              href="mailto:hello@opusdrinks.com"
              className="font-display text-2xl underline decoration-1 underline-offset-4 hover:text-gold-gradient"
            >
              hello@opusdrinks.com
            </a>
          </div>
          <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
            {Object.entries(footerLinks).map(([heading, items]) => (
              <div key={heading}>
                <h4 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground">
                  {heading}
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {items.map((i) => (
                    <li key={i.to + i.label}>
                      <Link
                        to={i.to}
                        className="transition hover:text-foreground"
                      >
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-3 border-t border-border pt-8 text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Opus Drinks · A Property of Grus Drinks</span>
          <span>Collect · Invest · Experience · Drink Responsibly · 21+</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-16">
        <SiteTicker />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
