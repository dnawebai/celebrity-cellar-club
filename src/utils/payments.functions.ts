import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

type CheckoutSessionResult = { clientSecret: string } | { error: string };

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

export const createMembershipCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { returnUrl: string; environment: StripeEnv }) => data,
  )
  .handler(async ({ data, context }): Promise<CheckoutSessionResult> => {
    try {
      const { userId, supabase } = context;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const stripe = createStripeClient(data.environment);

      const prices = await stripe.prices.list({
        lookup_keys: ["opus_membership_onetime"],
      });
      if (!prices.data.length) throw new Error("Membership price not found");
      const stripePrice = prices.data[0];

      const customerId = await resolveOrCreateCustomer(stripe, {
        email: user?.email ?? undefined,
        userId,
      });

      const productId =
        typeof stripePrice.product === "string"
          ? stripePrice.product
          : stripePrice.product.id;
      const product = await stripe.products.retrieve(productId);

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        payment_intent_data: { description: product.name },
        metadata: { userId },
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

// Server-verify a Checkout Session so /checkout/return can only show
// "Payment received" when Stripe confirms payment_status === 'paid'.
export const verifyCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { sessionId: string; environment: StripeEnv }) => data,
  )
  .handler(async ({ data, context }) => {
    try {
      const stripe = createStripeClient(data.environment);
      const session = await stripe.checkout.sessions.retrieve(data.sessionId);
      // Only allow the session's owner to read its status.
      const owner = (session.metadata as Record<string, string> | null)?.userId;
      if (owner && owner !== context.userId) {
        return { ok: false as const, error: "This checkout session belongs to a different account." };
      }
      const paid = session.payment_status === "paid" || session.status === "complete";
      return {
        ok: true as const,
        paid,
        status: session.status ?? null,
        paymentStatus: session.payment_status ?? null,
        amountTotal: session.amount_total ?? null,
        currency: session.currency ?? null,
      };
    } catch (error) {
      return { ok: false as const, error: getStripeErrorMessage(error) };
    }
  });
