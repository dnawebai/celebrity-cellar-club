import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { MemberGate } from "@/components/member-gate";


export const Route = createFileRoute("/_authenticated/bids")({
  head: () => ({
    meta: [
      { title: "My Bids — Opus Drinks" },
      { name: "description", content: "Track live bids, outbid status, wins and payments." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BidsPage,
});

const tabs = [
  "Active",
  "Highest Bidder",
  "Outbid",
  "Won",
  "Lost",
  "Pending Payment",
  "Completed",
] as const;

function BidsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Active");
  return (
    <SiteShell>
      
      <section className="px-6 pt-24 pb-16 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <span className="mb-4 inline-block text-[10px] uppercase tracking-[0.4em] text-gold">
            My Bids
          </span>
          <h1 className="mb-8 font-display text-5xl md:text-6xl">
            Every bid, <span className="italic text-gold-gradient">every status</span>.
          </h1>

          <div className="mb-10 flex flex-wrap gap-1 rounded-sm border border-border bg-surface/40 p-1 text-[11px] uppercase tracking-[0.25em]">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-sm px-4 py-2.5 transition ${
                  tab === t
                    ? "bg-gold text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <MemberGate reason="Bid tracking activates automatically after you complete Opus Drinks membership and bidder verification." />
        </div>
      </section>
    </SiteShell>
  );
}
