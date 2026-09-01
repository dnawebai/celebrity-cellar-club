import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { verifyCheckoutSession } from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { trackConversionEvent } from "@/lib/auctions.functions";

export const Route = createFileRoute("/_authenticated/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturnPage,
});

type State =
  | { kind: "loading" }
  | { kind: "paid"; amount?: string; currency?: string }
  | { kind: "processing" }
  | { kind: "error"; message: string }
  | { kind: "missing" };

function CheckoutReturnPage() {
  const { session_id } = Route.useSearch();
  const verify = useServerFn(verifyCheckoutSession);
  const qc = useQueryClient();
  const [state, setState] = useState<State>(
    session_id ? { kind: "loading" } : { kind: "missing" },
  );

  useEffect(() => {
    if (!session_id) return;
    let cancelled = false;
    let attempt = 0;
    async function poll() {
      try {
        const env = getStripeEnvironment();
        const res = await verify({ data: { sessionId: session_id!, environment: env } });
        if (cancelled) return;
        if (!res.ok) {
          setState({ kind: "error", message: res.error });
          return;
        }
        if (res.paid) {
          qc.invalidateQueries();
          const amt =
            typeof res.amountTotal === "number"
              ? `$${(res.amountTotal / 100).toFixed(2)}`
              : undefined;
          setState({ kind: "paid", amount: amt, currency: (res.currency ?? "usd").toUpperCase() });
          return;
        }
        if (attempt++ < 5) {
          setTimeout(poll, 1500);
        } else {
          setState({ kind: "processing" });
        }
      } catch (e) {
        if (cancelled) return;
        setState({ kind: "error", message: e instanceof Error ? e.message : "Verification failed" });
      }
    }
    poll();
    return () => {
      cancelled = true;
    };
  }, [session_id, verify, qc]);

  const heading =
    state.kind === "paid"
      ? "Payment received"
      : state.kind === "processing"
        ? "Almost there…"
        : state.kind === "error"
          ? "We couldn't verify this payment"
          : state.kind === "missing"
            ? "No payment session found"
            : "Confirming your payment…";

  const body =
    state.kind === "paid"
      ? `Thank you. Your $199 Opus Drinks membership is active for the next 12 months.${state.amount ? ` Charged ${state.amount} ${state.currency}.` : ""} A receipt is on its way to your inbox.`
      : state.kind === "processing"
        ? "Stripe is still confirming your payment. Refresh in a minute — your membership will unlock automatically once confirmed."
        : state.kind === "error"
          ? state.message
          : state.kind === "missing"
            ? "Return to the auctions and try again."
            : "One moment while we confirm with Stripe.";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
          Opus Drinks · Membership
        </span>
        <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">{heading}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{body}</p>
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
