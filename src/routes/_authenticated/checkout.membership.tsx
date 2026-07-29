import { createFileRoute, Link } from "@tanstack/react-router";
import { MembershipEmbeddedCheckout } from "@/components/membership-embedded-checkout";
import { PaymentTestModeBanner } from "@/components/payment-test-mode-banner";

export const Route = createFileRoute("/_authenticated/checkout/membership")({
  component: MembershipCheckoutPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-3">Checkout unavailable</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <div className="px-6 py-24 text-center">Not found</div>,
});

function MembershipCheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Opus Drinks · Membership
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
            $199 unlocks every auction house
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A single $199 Opus Drinks membership gives you a unified calendar,
            watchlist, and concierge team across every authorised auction
            partner.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-surface/40 p-4">
          <MembershipEmbeddedCheckout />
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/auctions" className="underline hover:text-gold">
            Back to auctions
          </Link>
        </div>
      </div>
    </div>
  );
}
