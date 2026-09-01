import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteShell } from "@/components/site-shell";
import { getConversionFunnel } from "@/lib/auctions.functions";

export const Route = createFileRoute("/_authenticated/admin/conversions")({
  head: () => ({
    meta: [
      { title: "Conversion Funnel — Opus Drinks Admin" },
      { name: "description", content: "Member signup and membership conversion analytics." },
    ],
  }),
  component: ConversionsPage,
});

const labels: Record<string, string> = {
  auth_page_viewed: "Auth page viewed",
  sign_up_initiated: "Sign up initiated",
  email_confirmation_sent: "Confirmation email sent",
  email_confirmed: "Email confirmed",
  membership_page_viewed: "Membership page viewed",
  membership_purchased: "Membership purchased",
};

function ConversionsPage() {
  const fetchFunnel = useServerFn(getConversionFunnel);
  const { data, isLoading, error } = useQuery({
    queryKey: ["conversion-funnel"],
    queryFn: () => fetchFunnel(),
    staleTime: 60_000,
  });

  return (
    <SiteShell>
      <section className="px-6 pt-32 pb-12 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold">Admin</span>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">Conversion Funnel</h1>
          <p className="mt-3 max-w-[60ch] text-muted-foreground">
            Track how visitors move from sign-up initiation to confirmed membership purchase over the
            last 90 days.
          </p>
        </div>
      </section>

      <section className="border-t border-border px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground">Loading funnel data…</div>
          ) : error ? (
            <div className="rounded-sm border border-red-500/30 bg-red-500/5 p-6 text-red-400">
              Could not load conversion data. {String(error)}
            </div>
          ) : (
            <div className="overflow-hidden rounded-sm border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/60 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Stage</th>
                    <th className="px-6 py-4 font-medium text-right">Total (90d)</th>
                    <th className="px-6 py-4 font-medium text-right">Unique Users</th>
                    <th className="px-6 py-4 font-medium text-right">Last 7 Days</th>
                    <th className="px-6 py-4 font-medium text-right">Last 30 Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(data ?? []).map((row: any) => (
                    <tr key={row.event_type} className="hover:bg-surface/30">
                      <td className="px-6 py-4 font-serif text-base">
                        {labels[row.event_type] ?? row.event_type}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-gold">
                        {Number(row.total).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {Number(row.unique_users).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {Number(row.last_7_days).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {Number(row.last_30_days).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                label: "Confirmation rate",
                value: rate(data, "email_confirmed", "sign_up_initiated"),
                sub: "Confirmed / initiated",
              },
              {
                label: "Membership page visit rate",
                value: rate(data, "membership_page_viewed", "email_confirmed"),
                sub: "Reached checkout / confirmed",
              },
              {
                label: "Purchase conversion",
                value: rate(data, "membership_purchased", "membership_page_viewed"),
                sub: "Paid / reached membership page",
              },
            ].map((k) => (
              <div key={k.label} className="rounded-sm border border-border bg-surface/40 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {k.label}
                </div>
                <div className="mt-2 font-display text-4xl text-gold-gradient">{k.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function rate(data: any[] | undefined, numerator: string, denominator: string) {
  if (!data) return "—";
  const num = data.find((r) => r.event_type === numerator)?.total ?? 0;
  const den = data.find((r) => r.event_type === denominator)?.total ?? 0;
  if (!den) return "—";
  return `${((Number(num) / Number(den)) * 100).toFixed(1)}%`;
}
