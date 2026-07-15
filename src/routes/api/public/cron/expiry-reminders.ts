import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { enqueueTransactionalEmail } from "@/lib/email/enqueue.server";

// Cron endpoint (called by pg_cron via pg_net once per day). Sends the
// 30-day-before-expiry renewal reminder to any active member whose
// current_period_end falls inside the next 30 days and hasn't been
// reminded yet.

export const Route = createFileRoute("/api/public/cron/expiry-reminders")({
  server: {
    handlers: {
      POST: async () => {
        const supabase: any = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const { data: rows, error } = await supabase
          .from("memberships")
          .select("user_id, current_period_end")
          .eq("status", "active")
          .is("renewal_reminder_sent_at", null)
          .not("current_period_end", "is", null)
          .lte("current_period_end", in30Days.toISOString())
          .gte("current_period_end", now.toISOString())
          .limit(500);

        if (error) {
          console.error("expiry-reminders query failed", error);
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        let sent = 0;
        for (const row of rows ?? []) {
          const userId = row.user_id as string;
          const periodEnd = row.current_period_end as string;

          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, display_name")
            .eq("id", userId)
            .maybeSingle();
          const { data: authRes } = await supabase.auth.admin.getUserById(userId);
          const email = authRes?.user?.email as string | undefined;
          if (!email) continue;

          const result = await enqueueTransactionalEmail({
            templateName: "membership-expiry-reminder",
            recipientEmail: email,
            idempotencyKey: `expiry-reminder:${userId}:${periodEnd}`,
            templateData: {
              recipientName: profile?.display_name ?? profile?.full_name ?? undefined,
              periodEnd: periodEnd.slice(0, 10),
              renewUrl: "https://opusdrinks.com/checkout/membership",
            },
          });
          if (result.ok) {
            await supabase
              .from("memberships")
              .update({ renewal_reminder_sent_at: new Date().toISOString() })
              .eq("user_id", userId);
            sent++;
          }
        }

        return Response.json({ ok: true, sent, considered: rows?.length ?? 0 });
      },
    },
  },
});
