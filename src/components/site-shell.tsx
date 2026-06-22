import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navLinks = [
  { to: "/membership", label: "Membership" },
  { to: "/auctions", label: "Auctions" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/legacy", label: "Legacy" },
  { to: "/investment", label: "Investment" },
  { to: "/sommelier", label: "AI Sommelier" },
  { to: "/events", label: "Events" },
] as const;

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl tracking-[0.35em] uppercase">
          <span className="text-gold-gradient font-semibold">Opus</span>
          <span className="hidden text-[10px] tracking-[0.4em] text-muted-foreground sm:inline">
            Drinks
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground xl:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground md:inline"
          >
            Sign In
          </Link>
          <Link
            to="/membership"
            className="rounded-sm bg-gold-gradient gold-gradient px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-all hover:brightness-110"
          >
            Apply
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
    { to: "/marketplace", label: "Marketplace" },
    { to: "/legacy", label: "Legacy Collection" },
    { to: "/events", label: "Events" },
  ],
  Platform: [
    { to: "/investment", label: "Investment Center" },
    { to: "/sommelier", label: "AI Sommelier" },
    { to: "/producers", label: "Producer Portal" },
    { to: "/sponsors", label: "Sponsor Portal" },
    { to: "/charity", label: "Charity Auctions" },
  ],
  Contact: [
    { to: "/membership", label: "Apply for Membership" },
  ],
} as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-[42ch]">
            <div className="mb-6 font-serif text-3xl uppercase tracking-[0.3em] text-gold-gradient">
              Opus
            </div>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              Where great beverages become legacy. An invitation-only platform for collectors,
              investors, and luxury consumers seeking the world's rarest wines, spirits, and
              celebrity-curated releases.
            </p>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-gold pulse-gold" />
              24,000+ Active Members · North America
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
            {Object.entries(footerLinks).map(([heading, items]) => (
              <div key={heading}>
                <h4 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">
                  {heading}
                </h4>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  {items.map((i) => (
                    <li key={i.to + i.label}>
                      <Link to={i.to} className="transition hover:text-gold">
                        {i.label}
                      </Link>
                    </li>
                  ))}
                  {heading === "Contact" ? (
                    <li>
                      <a href="mailto:elena@grusdrinks.com" className="hover:text-gold">
                        elena@grusdrinks.com
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-3 border-t border-border pt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Opus Drinks · A Property of Grus Drinks</span>
          <span>Collect · Invest · Experience</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteHeader />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
