import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import napaCab from "@/assets/drop-denise.jpg";
import champagne from "@/assets/drop-hibell.jpg";
import mezcal from "@/assets/drop-taylor.jpg";
import cognac from "@/assets/drop-50cent.jpg";
import rose from "@/assets/drop-rose.jpg";
import kombucha from "@/assets/drop-kombucha.jpg";
import champagneLux from "@/assets/drop-champagne-lux.jpg";
import cabernet from "@/assets/drop-cabernet.jpg";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Opus Marketplace — Beverages Inspired by Icons" },
      {
        name: "description",
        content:
          "A private marketplace of premium beverages inspired by the reported favorites of cultural icons. Available exclusively to Opus Club members.",
      },
      { property: "og:title", content: "Opus Marketplace — Beverages Inspired by Icons" },
      {
        property: "og:description",
        content: "Premium beverages inspired by cultural icons, exclusive to Opus members.",
      },
    ],
  }),
  component: MarketplacePage,
});

type Profile = {
  inspiredBy: string;
  beverage: string;
  category: string;
  note: string;
  img: string;
  confirmed: boolean;
};

const profiles: Profile[] = [
  {
    inspiredBy: "50 Cent",
    beverage: "Branson Cognac",
    category: "Cognac · France",
    note: "Publicly co-founded and championed by the artist across interviews and press releases.",
    img: cognac,
    confirmed: true,
  },
  {
    inspiredBy: "Nicole Kidman",
    beverage: "Prestige Cuvée Champagne",
    category: "Champagne · France",
    note: "Widely reported in interviews as a personal favorite for celebrations.",
    img: champagneLux,
    confirmed: true,
  },
  {
    inspiredBy: "Pink",
    beverage: "Two Wolves-Style Cabernet",
    category: "Red Wine · California",
    note: "Publicly associated with her family's Two Wolves winery and Cabernet program.",
    img: cabernet,
    confirmed: true,
  },
  {
    inspiredBy: "Selena Gomez",
    beverage: "Provence Rosé",
    category: "Rosé · France",
    note: "Publicly mentioned rosé as a preferred pour in lifestyle interviews.",
    img: rose,
    confirmed: true,
  },
  {
    inspiredBy: "Taylor Swift",
    beverage: "Artisan Mezcal Reserve",
    category: "Agave Spirits · Mexico",
    note: "Mezcal and agave cocktails have been mentioned in press coverage of her celebrations.",
    img: mezcal,
    confirmed: true,
  },
  {
    inspiredBy: "Demi Moore",
    beverage: "Craft Kombucha",
    category: "Fermented Tea · USA",
    note: "Publicly sober; kombucha frequently referenced in wellness interviews.",
    img: kombucha,
    confirmed: true,
  },
  {
    inspiredBy: "Denise Richards",
    beverage: "Napa Valley Cabernet",
    category: "Red Wine · California",
    note: "Favorite beverage not publicly confirmed — pairing shown as a California classic.",
    img: napaCab,
    confirmed: false,
  },
  {
    inspiredBy: "Aaron Hibell",
    beverage: "Grand Cru Champagne",
    category: "Champagne · France",
    note: "Favorite beverage not publicly confirmed.",
    img: champagne,
    confirmed: false,
  },
];

function MarketplacePage() {
  return (
    <SiteShell>
      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-7xl">
          <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            Members Only · Inspired by Icons
          </span>
          <h1 className="max-w-[22ch] font-serif text-5xl italic leading-[1.05] text-balance md:text-7xl">
            The beverages behind the icons.
          </h1>
          <p className="mt-8 max-w-[62ch] text-pretty text-lg text-muted-foreground">
            Each release is inspired by drinks publicly associated with cultural icons — never
            endorsed, never sponsored. We honor the beverage, not the likeness. Bottles released
            by allocation from <span className="text-foreground">$200</span>, shipped to members in
            the United States.
          </p>
          <p className="mt-4 max-w-[62ch] text-xs text-muted-foreground/70">
            Opus Drinks is not affiliated with, endorsed by, or sponsored by any of the individuals
            referenced. Beverage associations are drawn from publicly available interviews and
            reputable media coverage.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.map((p) => (
            <article
              key={p.inspiredBy}
              className="group flex flex-col overflow-hidden rounded-sm border border-border bg-surface/40 shadow-sm transition hover:border-accent/60 hover:shadow-lg"
            >
              <div className="overflow-hidden bg-black">
                <img
                  src={p.img}
                  alt={`${p.beverage} — ${p.category}`}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                  {p.category}
                </span>
                <h2 className="mt-2 font-serif text-2xl italic leading-tight">{p.beverage}</h2>
                <p className="mt-3 text-xs text-muted-foreground">
                  {p.confirmed
                    ? `Inspired by ${p.inspiredBy}'s reported favorite drink.`
                    : `Inspired by ${p.inspiredBy}. Favorite beverage not publicly confirmed.`}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/70">
                  {p.note}
                </p>
                <div className="mt-auto pt-5">
                  <Link
                    to="/membership"
                    className="block w-full rounded-sm bg-accent px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:brightness-110"
                  >
                    Members Only — Join
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border px-6 py-24 text-center">
        <p className="mx-auto max-w-[52ch] font-serif text-2xl italic text-muted-foreground">
          New beverages announced monthly. No celebrity likeness, portrait, signature, or
          promotional material is used on this platform.
        </p>
      </section>
    </SiteShell>
  );
}
