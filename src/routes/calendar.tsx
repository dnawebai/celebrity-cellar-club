import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { DemoDataBanner } from "@/components/demo-data-banner";
import { auctions } from "@/lib/auctions-data";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Auction Calendar — Opus Drinks" },
      {
        name: "description",
        content:
          "Openings, registration deadlines, closings and collection dates for every auction in the Opus Drinks marketplace.",
      },
      { property: "og:title", content: "Auction Calendar — Opus Drinks" },
      { property: "og:description", content: "Every fine wine and rare spirits auction, on one calendar." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const sorted = [...auctions].sort(
    (a, b) => new Date(a.startsAtUtc).getTime() - new Date(b.startsAtUtc).getTime(),
  );

  return (
    <SiteShell>
      <DemoDataBanner />

      <section className="border-b border-border px-6 pt-24 pb-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mb-4 inline-block text-[10px] uppercase tracking-[0.4em] text-gold">
            Auction Calendar
          </span>
          <h1 className="max-w-[18ch] font-display text-5xl md:text-7xl">
            Every important date, <span className="italic text-gold-gradient">in one place</span>.
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg text-muted-foreground">
            Openings, registration deadlines, closings, payment deadlines, and
            collection dates — synchronised to your local time zone. Export any
            auction to Google, Apple or ICS.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-sm border border-border">
          <div className="grid grid-cols-12 border-b border-border bg-surface/60 px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <div className="col-span-2">Opens</div>
            <div className="col-span-2">Closes</div>
            <div className="col-span-4">Auction</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2 text-right">Action</div>
          </div>
          {sorted.map((a) => {
            const opens = new Date(a.startsAtUtc).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const closes = new Date(a.endsAtUtc).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <div
                key={a.id}
                className="grid grid-cols-12 items-center border-b border-border bg-background/40 px-6 py-5 text-sm last:border-0 hover:bg-surface/40"
              >
                <div className="col-span-2 font-mono text-gold">{opens}</div>
                <div className="col-span-2 font-mono text-muted-foreground">{closes}</div>
                <div className="col-span-4 font-display text-lg">{a.title}</div>
                <div className="col-span-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {a.location}
                </div>
                <div className="col-span-2 text-right">
                  <Link
                    to="/auctions/$auctionId"
                    params={{ auctionId: a.id }}
                    className="inline-block rounded-sm border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-6 max-w-[1400px] text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Calendar export (Google · Apple · ICS) and reminder rules unlock with
          your Opus membership.
        </p>
      </section>
    </SiteShell>
  );
}
