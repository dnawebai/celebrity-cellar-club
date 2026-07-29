import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import { enqueueTransactionalEmail } from "@/lib/email/enqueue.server";

import type { Database } from "@/integrations/supabase/types";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

async function fetchRecipient(userId: string): Promise<{ email: string; name: string | null } | null> {
  const admin = getSupabase();
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, display_name")
    .eq("id", userId)
    .maybeSingle();
  const { data: authRes } = await (admin.auth as any).admin.getUserById(userId);
  const email = authRes?.user?.email as string | undefined;
  if (!email) return null;
  return { email, name: profile?.display_name ?? profile?.full_name ?? null };
}

async function activateMembershipFromSession(session: any) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("checkout.session.completed missing metadata.userId", session.id);
    return;
  }
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;

  const now = new Date();
  const periodEnd = new Date(Date.now() + YEAR_MS);

  await getSupabase()
    .from("memberships")
    .update({
      status: "active",
      billing_cycle: "one_time",
      price_cents: 19900,
      currency: "usd",
      started_at: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      renewal_reminder_sent_at: null,
      stripe_customer_id: customerId ?? null,
      stripe_checkout_session_id: session.id ?? null,
      updated_at: now.toISOString(),
    })
    .eq("user_id", userId);

  await getSupabase()
    .from("user_roles")
    .upsert({ user_id: userId, role: "member" }, { onConflict: "user_id,role" });

  // Send receipt + welcome
  const recipient = await fetchRecipient(userId);
  if (recipient) {
    const amountCents = session.amount_total ?? 19900;
    const amount = `$${(amountCents / 100).toFixed(2)}`;
    const currency = (session.currency ?? "usd").toUpperCase();
    await enqueueTransactionalEmail({
      templateName: "membership-receipt",
      recipientEmail: recipient.email,
      idempotencyKey: `receipt:${session.id}`,
      templateData: {
        recipientName: recipient.name ?? undefined,
        amount,
        currency,
        paidAt: now.toISOString().slice(0, 10),
        sessionId: session.id,
        periodEnd: periodEnd.toISOString().slice(0, 10),
      },
    });
    await enqueueTransactionalEmail({
      templateName: "membership-welcome",
      recipientEmail: recipient.email,
      idempotencyKey: `welcome:${session.id}`,
      templateData: {
        recipientName: recipient.name ?? undefined,
        dashboardUrl: "https://opusdrinks.com/dashboard",
        auctionsUrl: "https://opusdrinks.com/auctions",
      },
    });
  }
}

async function setMembershipStatusByCustomer(customerId: string, status: "refunded" | "disputed" | "payment_failed") {
  if (!customerId) return;
  await getSupabase()
    .from("memberships")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("stripe_customer_id", customerId);
}

async function setMembershipStatusBySession(sessionId: string, status: "expired") {
  if (!sessionId) return;
  await getSupabase()
    .from("memberships")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("stripe_checkout_session_id", sessionId);
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
    case "checkout.session.expired": {
      const session = event.data.object;
      await setMembershipStatusBySession(session.id, "expired");
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      const customer = typeof pi.customer === "string" ? pi.customer : pi.customer?.id;
      await setMembershipStatusByCustomer(customer ?? "", "payment_failed");
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object;
      const customer = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
      await setMembershipStatusByCustomer(customer ?? "", "refunded");
      break;
    }
    case "charge.dispute.created": {
      const dispute = event.data.object;
      // dispute.charge is the charge id; we don't have customer directly, but charge object was expanded in most events.
      const customer =
        typeof dispute.customer === "string"
          ? dispute.customer
          : dispute.customer?.id ?? "";
      await setMembershipStatusByCustomer(customer, "disputed");
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
