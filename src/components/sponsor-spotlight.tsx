import { Link } from "@tanstack/react-router";
import sponsor1 from "@/assets/sponsor-1.jpg";
import sponsor2 from "@/assets/sponsor-2.jpg";
import sponsor3 from "@/assets/sponsor-3.jpg";
import sponsor4 from "@/assets/sponsor-4.jpg";

const sponsors = [
  {
    id: "s1",
    name: "Obsidian Estate",
    category: "Napa Valley Cabernet",
    offer: "20% off inaugural allocation",
    detail: "Member-only 2021 vintage release. Ships December.",
    image: sponsor1,
    cta: "Claim Offer",
    href: "/auctions",
    badge: "Featured",
  },
  {
    id: "s2",
    name: "Maison Belmœt",
    category: "Grand Cru Champagne",
    offer: "Private tasting access",
    detail: "Reserve a seated tasting for two at the Reims estate.",
    image: sponsor2,
    cta: "Reserve",
    href: "/concierge",
    badge: "Members Only",
  },
  {
    id: "s3",
    name: "Rage & Rye",
    category: "Rare American Whisky",
    offer: "Complimentary shipping",
    detail: "On any allocation over $500 through the end of the year.",
    image: sponsor3,
    cta: "Shop Allocation",
    href: "/auctions",
    badge: "Exclusive",
  },
  {
    id: "s4",
    name: "Nocturne Botanicals",
    category: "Small-Batch Spirits",
    offer: "Early access + gift wrap",
    detail: "Be first to purchase limited holiday releases.",
    image: sponsor4,
    cta: "View Drop",
    href: "/auctions",
    badge: "Limited",
  },
];

export function SponsorSpotlight() {
  return (
    <section className="rounded-sm border border-border bg-surface/40 p-8 lg:col-span-3">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gold">Sponsor Spotlight</div>
          <h2 className="font-display text-2xl md:text-3xl">Featured brands & exclusive offers</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Curated perks from premium producers, available only to Opus members.
          </p>
        </div>
        <Link
          to="/concierge"
          className="shrink-0 rounded-sm border border-border px-4 py-2 text-center text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
        >
          Become a Sponsor →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sponsors.map((s) => (
          <article
            key={s.id}
            className="group relative overflow-hidden rounded-sm border border-border bg-background transition-colors hover:border-gold/40"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={s.image}
                alt={s.name}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-background">
                {s.badge}
              </span>
            </div>

            <div className="p-5">
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.category}</div>
              <h3 className="mt-1 font-display text-xl">{s.name}</h3>
              <div className="mt-3 inline-flex items-center rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                {s.offer}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
              <Link
                to={s.href}
                className="mt-5 block w-full rounded-sm border border-border py-2.5 text-center text-[10px] uppercase tracking-[0.3em] transition-colors hover:border-gold hover:text-gold"
              >
                {s.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
