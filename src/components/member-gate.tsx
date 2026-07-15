import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getMyMembership } from "@/lib/membership.functions";

/**
 * Real member gate. Renders `children` for active members. Shows a paywall
 * for guests and pending applicants.
 */
export function MemberGate({
  children,
  reason,
}: {
  children?: ReactNode;
  reason?: string;
}) {
  const { user, loading } = useAuth();
  const fetchMe = useServerFn(getMyMembership);
  const { data, isLoading } = useQuery({
    queryKey: ["me", user?.id ?? "guest"],
    queryFn: () => fetchMe(),
    enabled: !!user,
    staleTime: 30_000,
  });

  if (loading || (user && isLoading)) {
    return (
      <div className="rounded-sm border border-border bg-surface/40 p-10 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (data?.isMember) return <>{children}</>;

  const isExpired = !!data?.isExpired;
  const cta = !user ? "Become a member" : isExpired ? "Renew · $99" : "Complete membership";
  const ctaTo = user && isExpired ? "/checkout/membership" : "/membership";
  const secondaryLabel = user ? "View dashboard" : "Sign in";
  const secondaryTo = user ? "/dashboard" : "/auth";


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
          {!user
            ? "Sign in — or join Opus Drinks"
            : isExpired
              ? "Your membership has expired"
              : "Activate your membership"}
        </h3>
        <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
          {reason ??
            (isExpired
              ? "Renew your $99 Opus Drinks membership to restore auction access, watchlists, and concierge."
              : "Complete auction details, bidding, watchlists, and portfolio access are reserved for verified members ($99).")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to={ctaTo}
            className="rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
          >
            {cta}
          </Link>

          <Link
            to={secondaryTo}
            className="rounded-sm border border-border px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:border-gold hover:text-gold"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
