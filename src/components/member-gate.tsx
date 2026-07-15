import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

// Phase 1: no real auth. This gate always renders the CTA path for
// unauthenticated visitors. Wire to Supabase session in Phase 2.
export function MemberGate({
  children,
  reason,
}: {
  children?: ReactNode;
  reason?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-border bg-surface/40 p-10 text-center">
      {children ? (
        <div className="pointer-events-none absolute inset-0 opacity-30 blur-sm">
          {children}
        </div>
      ) : null}
      <div className="relative">
        <span className="mb-3 inline-block text-[10px] uppercase tracking-[0.4em] text-gold">
          Members Only
        </span>
        <h3 className="mb-3 font-display text-3xl">
          Sign in — or join Opus Drinks
        </h3>
        <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
          {reason ??
            "Complete auction details, bidding, watchlists, and portfolio access are reserved for verified members ($99)."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/membership"
            className="rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
          >
            Become a Member
          </Link>
          <Link
            to="/dashboard"
            className="rounded-sm border border-border px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:border-gold hover:text-gold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
