import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import dinner from "@/assets/event-dinner.jpg";

export const Route = createFileRoute("/charity")({
  head: () => ({
    meta: [
      { title: "Charity Auctions — Opus Drinks" },
      {
        name: "description",
        content:
          "Funds raised for children, healthcare, education, and humanitarian causes through Opus celebrity charity auctions.",
      },
      { property: "og:image", content: dinner },
    ],
  }),
  component: CharityPage,
});

const causes = [
  { name: "Children & Family", raised: "$5.25K" },
  { name: "Healthcare Access", raised: "$3.9K" },
  { name: "Education", raised: "$3.25K" },
  { name: "Humanitarian Aid", raised: "$2.25K" },
  { name: "Community Development", raised: "$1.75K" },
];

function CharityPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10">
          <img src={dinner} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        </div>
        <div className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 lg:px-10">
          <span className="mb-6 block text-[10px] uppercase tracking-[0.4em] text-gold">
            Opus Cellar for Good
          </span>
          <h1 className="max-w-[22ch] font-display text-5xl text-balance md:text-7xl">
            Bottles that <span className="italic text-gold-gradient">change lives</span>.
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg text-muted-foreground">
            Celebrities and producers donate rare lots to be auctioned for the causes they care
            about most. 100% of hammer price flows to beneficiaries.
          </p>
          <div className="mt-12 flex flex-wrap gap-12">
            <div>
              <div className="font-display text-6xl text-gold-gradient">$65.5K</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Raised Since 2023
              </div>
            </div>
            <div>
              <div className="font-display text-6xl text-gold-gradient">8</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Charity Auctions
              </div>
            </div>
            <div>
              <div className="font-display text-6xl text-gold-gradient">3</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Partner Foundations
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-12 font-display text-4xl md:text-5xl">Causes we serve</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {causes.map((c) => (
              <div key={c.name} className="rounded-sm border border-border bg-surface/40 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{c.name}</div>
                <div className="mt-3 font-display text-3xl text-gold-gradient">{c.raised}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Lifetime
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/30 px-6 py-24 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-4xl md:text-5xl">Next: Aspen Founder Gala</h2>
            <p className="mt-3 text-muted-foreground">December 12 · benefitting St. Jude Children's Research Hospital</p>
          </div>
          <Link
            to="/events"
            className="rounded-sm gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
          >
            View Event
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
