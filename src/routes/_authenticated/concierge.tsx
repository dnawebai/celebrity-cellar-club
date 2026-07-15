import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { DemoDataBanner } from "@/components/demo-data-banner";

export const Route = createFileRoute("/_authenticated/concierge")({
  head: () => ({
    meta: [
      { title: "Opus Concierge — Auction Registration, Assisted Bidding, Shipping & Storage" },
      {
        name: "description",
        content:
          "Request auction registration, assisted bidding, condition reports, shipping, storage, insurance and private sourcing from the Opus Concierge team.",
      },
      { property: "og:title", content: "Opus Concierge — Opus Drinks" },
      {
        property: "og:description",
        content: "Personal auction registration, bidding assistance, shipping, storage and sourcing.",
      },
    ],
  }),
  component: ConciergePage,
});

const requestTypes = [
  "Auction registration support",
  "Assisted bidding (maximum bid)",
  "Condition report",
  "Shipping quotation",
  "Customs support",
  "Storage arrangements",
  "Insurance",
  "Private sourcing",
  "Portfolio advice",
  "Collection appraisal",
  "Sale or consignment",
] as const;

function ConciergePage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <DemoDataBanner />

      <section className="border-b border-border px-6 pt-24 pb-16 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <span className="mb-4 inline-block text-[10px] uppercase tracking-[0.4em] text-gold">
            Opus Concierge
          </span>
          <h1 className="mb-6 max-w-[20ch] font-display text-5xl md:text-7xl">
            A private team for{" "}
            <span className="italic text-gold-gradient">every auction.</span>
          </h1>
          <p className="max-w-[62ch] text-lg text-muted-foreground">
            Where a partner does not offer direct API bidding, our concierge
            team handles registration, submits maximum-bid instructions,
            arranges shipping, storage and insurance, and can source specific
            lots privately.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.2fr_1fr]">
          <form
            className="rounded-sm border border-border bg-surface/40 p-8"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <h2 className="mb-6 font-display text-2xl">Open a concierge case</h2>

            {sent ? (
              <div className="rounded-sm border border-gold/40 bg-gold/10 p-6 text-sm">
                Your case has been logged. A concierge director will be in touch
                within one business hour.
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <Row label="Request type">
                  <select className="w-full rounded-sm bg-background px-3 py-2 ring-1 ring-border focus:outline-none focus:ring-gold/60">
                    {requestTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Row>
                <Row label="Auction or lot reference (optional)">
                  <input
                    placeholder="e.g. Burgundy · Lot 087"
                    className="w-full rounded-sm bg-background px-3 py-2 ring-1 ring-border focus:outline-none focus:ring-gold/60"
                  />
                </Row>
                <Row label="Details">
                  <textarea
                    rows={5}
                    placeholder="Describe what you need. For assisted bidding, include your maximum bid and any conditions."
                    className="w-full rounded-sm bg-background px-3 py-2 ring-1 ring-border focus:outline-none focus:ring-gold/60"
                  />
                </Row>
                <Row label="Contact email">
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    className="w-full rounded-sm bg-background px-3 py-2 ring-1 ring-border focus:outline-none focus:ring-gold/60"
                  />
                </Row>

                <button className="rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground">
                  Submit request
                </button>

                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Bids submitted through concierge are placed on the partner's
                  platform under your name and are legally binding.
                </p>
              </div>
            )}
          </form>

          <aside className="space-y-6 text-sm">
            <div className="rounded-sm border border-border bg-background/40 p-6">
              <h3 className="mb-2 font-display text-xl">Response times</h3>
              <p className="text-muted-foreground">
                Concierge cases opened during business hours receive a personal
                response within 60 minutes. Time-sensitive bidding cases are
                escalated automatically.
              </p>
            </div>
            <div className="rounded-sm border border-border bg-background/40 p-6">
              <h3 className="mb-2 font-display text-xl">Compliance</h3>
              <p className="text-muted-foreground">
                Every concierge action is logged, timestamped, and retained for
                dispute resolution. We never place bids without your written
                authorisation.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
