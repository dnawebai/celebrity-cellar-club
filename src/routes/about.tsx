import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { submitContactForm } from "@/lib/contact.functions";

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
                  href="#contact-form"
                  className="gold-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight transition-all hover:brightness-110 lime-glow"
                >
                  Contact Us <span className="opacity-60">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="border-t border-border px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-10 text-center">
            <span className="mb-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold">
              Get in Touch
            </span>
            <h2 className="font-display text-3xl tracking-[-0.02em] md:text-4xl">
              Send us a message
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tell us about your brand, partnership, or distribution opportunity.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </SiteShell>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim() || undefined,
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      await submitContactForm({ data });
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-lime/30 bg-surface/40 p-10 text-center">
        <h3 className="font-display text-2xl">Message sent</h3>
        <p className="mt-3 text-muted-foreground">
          Thank you for reaching out. The Opus Drinks team will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-sm border border-border bg-surface/40 p-8 md:p-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            placeholder="Your name"
            className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-lime"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={255}
            placeholder="you@company.com"
            className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-lime"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="company" className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Company <span className="normal-case text-muted-foreground/60">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          maxLength={120}
          placeholder="Your company or brand"
          className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-lime"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="How can we partner?"
          className="w-full resize-none rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-lime"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMessage || "Failed to send message. Please try again."}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="gold-gradient w-full rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>

      <p className="text-center text-[11px] text-muted-foreground">
        Submissions are sent directly to{" "}
        <a href="mailto:hello@opusdrinks.com" className="underline underline-offset-2 hover:text-foreground">
          hello@opusdrinks.com
        </a>
        .
      </p>
    </form>
  );
}
