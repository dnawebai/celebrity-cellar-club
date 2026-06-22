import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import heroBottle from "@/assets/hero-bottle.jpg";
import cellar from "@/assets/cellar-detail.jpg";

export const Route = createFileRoute("/legacy")({
  head: () => ({
    meta: [
      { title: "Legacy Collection — Opus Drinks" },
      {
        name: "description",
        content:
          "Limited editions of only 100 bottles per release. Serialized, authenticated, celebrity-associated.",
      },
      { property: "og:image", content: heroBottle },
    ],
  }),
  component: LegacyPage,
});

const bottles = [
  {
    serial: "001 / 100",
    title: "Kidman Heritage No. 1",
    vintage: "2009 Hill of Grace Shiraz",
    market: "$24,800",
    potential: "AAA",
    img: heroBottle,
  },
  {
    serial: "017 / 100",
    title: "Johnson Founder Cask",
    vintage: "Teremana 18-Year Single Estate",
    market: "$8,400",
    potential: "AA+",
    img: cellar,
  },
  {
    serial: "042 / 100",
    title: "Clooney Riserva",
    vintage: "1998 Sassicaia Magnum",
    market: "$18,200",
    potential: "AAA",
    img: heroBottle,
  },
  {
    serial: "066 / 100",
    title: "Gomez Modern No. 3",
    vintage: "Casa Dragones Joven Reserve",
    market: "$2,200",
    potential: "AA",
    img: cellar,
  },
];

function LegacyPage() {
  return (
    <SiteShell>
      <section className="border-b border-border px-6 pt-32 pb-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mb-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold">
            <span className="size-1.5 rounded-full bg-gold" /> Limited to 100 Bottles
          </span>
          <h1 className="max-w-[20ch] font-display text-5xl text-balance md:text-7xl">
            The <span className="italic text-gold-gradient">Legacy</span> Collection.
          </h1>
          <p className="mt-8 max-w-[58ch] text-lg text-muted-foreground">
            Each release is hand-numbered, certified, and accompanied by a chain-of-custody record.
            Owners join a private ledger preserved by the Opus archive.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-2 lg:grid-cols-4">
          {bottles.map((b) => (
            <article
              key={b.serial}
              className="group overflow-hidden rounded-sm border border-border bg-surface/40 transition hover:border-gold/50 hover:luxury-shadow"
            >
              <div className="relative overflow-hidden">
                <img
                  src={b.img}
                  alt={b.title}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute top-3 left-3 rounded-sm bg-background/80 px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-gold backdrop-blur">
                  {b.serial}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl">{b.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {b.vintage}
                </p>
                <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                      Market
                    </div>
                    <div className="font-display text-xl text-gold-gradient">{b.market}</div>
                  </div>
                  <span className="rounded-sm bg-gold/10 px-2 py-1 text-[9px] uppercase tracking-[0.3em] text-gold">
                    {b.potential}
                  </span>
                </div>
                <Link
                  to="/auctions"
                  className="mt-5 block w-full rounded-sm border border-border py-2.5 text-center text-[10px] uppercase tracking-[0.3em] transition hover:border-gold hover:text-gold"
                >
                  View Provenance
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/30 px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-3">
          {[
            { k: "Serial", v: "Hand-numbered 001–100 with engraved closure" },
            { k: "Authentication", v: "NFC chip + tamper-evident wax · paired to the Opus ledger" },
            { k: "Provenance", v: "Owner history preserved in perpetuity, transferable on resale" },
          ].map((c) => (
            <div key={c.k}>
              <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold">{c.k}</div>
              <p className="font-display text-2xl">{c.v}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
