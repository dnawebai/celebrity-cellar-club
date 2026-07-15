import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturnPage,
});

function CheckoutReturnPage() {
  const { session_id } = Route.useSearch();
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
          Welcome to Opus Drinks
        </span>
        <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
          {session_id ? "Payment received" : "No payment session found"}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          {session_id
            ? "Your membership is being activated. It usually takes a few seconds to reflect across the platform."
            : "Return to the auctions and try again."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
          >
            Go to dashboard
          </Link>
          <Link
            to="/auctions"
            className="rounded-sm border border-border px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:border-gold hover:text-gold"
          >
            Browse auctions
          </Link>
        </div>
      </div>
    </div>
  );
}
