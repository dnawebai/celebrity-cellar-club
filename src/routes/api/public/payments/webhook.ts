import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

async function activateMembershipFromSession(session: any) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("checkout.session.completed missing metadata.userId", session.id);
    return;
  }
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;

  const now = new Date().toISOString();
  const periodEnd = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Activate the pre-created pending membership row (created by handle_new_user trigger).
  await getSupabase()
    .from("memberships")
    .update({
      status: "active",
      billing_cycle: "one_time",
      price_cents: 9900,
      currency: "usd",
      started_at: now,
      current_period_end: periodEnd,
      stripe_customer_id: customerId ?? null,
      stripe_checkout_session_id: session.id ?? null,
      updated_at: now,
    })
    .eq("user_id", userId);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status === "paid" || session.status === "complete") {
        await activateMembershipFromSession(session);
      }
      break;
    }
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook missing/invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
