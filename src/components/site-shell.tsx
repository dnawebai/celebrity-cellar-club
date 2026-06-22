import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navLinks = [
  { to: "/membership", label: "Membership" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/auctions", label: "Auctions" },
  { to: "/events", label: "Events" },
  { to: "/sponsors", label: "Sponsors" },
] as const;

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-serif text-xl tracking-[0.3em] uppercase">
          Opus
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide text-muted-foreground md:flex">
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
        <Link
          to="/membership"
          className="rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest ring-1 ring-border transition-all hover:ring-accent/60 hover:text-accent"
        >
          Apply
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="max-w-[40ch]">
            <div className="mb-6 font-serif text-2xl uppercase tracking-[0.3em]">Opus</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Exclusive Access. Exceptional Bottles. Celebrity Experiences. Currently available only to
              residents of the United States. Opus Club is a property of Grus Drinks. Member
              applications are subject to approval by the Membership Committee.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h4 className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-foreground">
                Club
              </h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li>
                  <Link to="/membership" className="hover:text-accent">
                    Membership
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace" className="hover:text-accent">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/auctions" className="hover:text-accent">
                    Auctions
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:text-accent">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-foreground">
                Contact
              </h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li>
                  <a href="mailto:elena@grusdrinks.com" className="hover:text-accent">
                    elena@grusdrinks.com
                  </a>
                </li>
                <li>
                  <Link to="/sponsors" className="hover:text-accent">
                    Partnerships
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 flex justify-between border-t border-border pt-8 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>© {new Date().getFullYear()} Opus Drinks Club</span>
          <span>Built for Connoisseurs</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
