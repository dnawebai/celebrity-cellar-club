import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Opus Drinks — Premium Beverages & Global Partnerships" },
      {
        name: "description",
        content:
          "Opus Drinks develops premium beverages, builds producer partnerships, and connects quality brands with international markets. Owned by ELP Ventures.",
      },
      { property: "og:title", content: "About Opus Drinks — Premium Beverages & Global Partnerships" },
      {
        property: "og:description",
        content:
          "Opus Drinks develops premium beverages, builds producer partnerships, and connects quality brands with international markets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "About Opus Drinks — Premium Beverages & Global Partnerships",
      },
      {
        name: "twitter:description",
        content:
          "Opus Drinks develops premium beverages, builds producer partnerships, and connects quality brands with international markets.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border px-6 pt-32 pb-20 lg:px-10 lg:pb-28">
        <div
          className="absolute -right-32 -top-32 size-[30rem] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, oklch(0.92 0.21 125 / 0.4), transparent 60%)" }}
        />
        <div className="relative mx-auto max-w-[1200px]">
          <span className="mb-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold">
            <span className="size-1.5 rounded-full bg-gold pulse-gold" /> About
          </span>
          <h1 className="max-w-[18ch] font-display text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl lg:text-8xl">
            About{" "}
            <span className="italic text-gold-gradient">Opus Drinks.</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <aside className="space-y-8">
            <div className="rounded-sm border border-border bg-surface/40 p-6">
              <h2 className="mb-3 font-display text-xl">What we do</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Premium drinks development, producer partnerships, and market
                expansion for quality beverage brands.
              </p>
            </div>
            <div className="rounded-sm border border-border bg-surface/40 p-6">
              <h2 className="mb-3 font-display text-xl">Who we serve</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Producers, brands, distributors, retailers, restaurants, hotels,
                and hospitality partners worldwide.
              </p>
            </div>
          </aside>

          <article className="space-y-8 text-lg leading-relaxed text-muted-foreground">
            <p>
              Opus Drinks is a beverage company focused on developing premium
              drinks, building strong producer partnerships, and connecting
              quality brands with international markets.
            </p>
            <p>
              We combine commercial experience, market knowledge, and long-term
              relationships to create sustainable opportunities for producers,
              brands, distributors, retailers, restaurants, hotels, and
              hospitality partners.
            </p>
            <p>
              Opus Drinks is owned by{" "}
              <a
                href="https://elp-ventures.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-1 underline-offset-4 transition hover:text-gold-gradient"
              >
                ELP Ventures
              </a>
              , an investment company focused on building and supporting
              businesses with long-term growth potential.
            </p>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="relative overflow-hidden rounded-sm border border-border bg-surface/40 p-10 md:p-16">
            <div
              className="absolute -right-20 -bottom-20 size-[24rem] rounded-full blur-3xl opacity-25"
              style={{ background: "radial-gradient(circle, oklch(0.92 0.21 125 / 0.5), transparent 60%)" }}
            />
            <div className="relative max-w-[68ch]">
              <span className="mb-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold">
                Partnerships
              </span>
              <h2 className="font-display text-4xl tracking-[-0.02em] md:text-5xl">
                Partner With Opus Drinks
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                “Contact our team to discuss brand development, distribution,
                market expansion, or commercial partnerships.”
              </p>
              <div className="mt-8">
                <a
                  href="mailto:hello@opusdrinks.com"
                  className="gold-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight transition-all hover:brightness-110 lime-glow"
                >
                  Contact Us <span className="opacity-60">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
