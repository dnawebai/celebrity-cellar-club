import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership Application — Opus Drinks" },
      {
        name: "description",
        content:
          "Apply for invitation-only membership. $99 application fee, committee review. Tiers from $199/mo to Founder Circle.",
      },
    ],
  }),
  component: MembershipPage,
});

const tiers = [
  {
    name: "Opus Member",
    price: "$199",
    cadence: "/ month",
    features: [
      "4 premium bottles monthly",
      "Free shipping in the United States",
      "Auction floor access",
      "Education Center",
      "Investment Center",
      "Member-only pricing",
      "AI Sommelier",
    ],
  },
  {
    name: "Opus Black",
    price: "$499",
    cadence: "/ month",
    featured: true,
    features: [
      "Everything in Opus Member",
      "Priority allocations",
      "VIP events",
      "Private tastings",
      "Celebrity event invitations",
      "Quarterly investment reports",
      "Luxury concierge",
    ],
  },
  {
    name: "Founder Circle",
    price: "Invitation",
    cadence: "Only",
    features: [
      "Private winery access",
      "Celebrity dinners",
      "Co-investment opportunities",
      "Bespoke luxury travel",
      "Private cellar consulting",
      "Direct access to Opus executives",
    ],
  },
];

const categories = [
  "Bordeaux",
  "Burgundy",
  "Champagne",
  "Napa Cabernet",
  "Italian Reserve",
  "Rare Whisky",
  "Aged Tequila",
  "Vintage Cognac",
];

function MembershipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="px-6 pt-32 pb-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mb-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold">
            <span className="size-1.5 rounded-full bg-gold pulse-gold" /> Application Only
          </span>
          <h1 className="mb-8 max-w-[20ch] font-display text-5xl text-balance md:text-7xl">
            A private invitation, <span className="italic text-gold-gradient">reviewed by committee</span>.
          </h1>
          <p className="max-w-[58ch] text-pretty text-lg text-muted-foreground">
            Access to Opus is subject to approval. Each application is reviewed individually by the
            Membership Committee. Submissions are routed to{" "}
            <a href="mailto:elena@grusdrinks.com" className="text-gold hover:underline">
              elena@grusdrinks.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* TIERS */}
      <section className="border-y border-border bg-surface/30 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-display text-4xl md:text-5xl">Membership Plans</h2>
            <span className="hidden text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">
              All tiers require a $99 application fee
            </span>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-sm p-10 ring-1 ${
                  t.featured
                    ? "bg-surface ring-gold luxury-shadow"
                    : "bg-surface/40 ring-border"
                }`}
              >
                {t.featured ? (
                  <span className="absolute -top-3 left-10 rounded-sm gold-gradient px-3 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-primary-foreground">
                    Most Selected
                  </span>
                ) : null}
                <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gold">{t.name}</div>
                <div className="mb-8 font-display text-5xl">
                  {t.price}
                  <span className="ml-1 text-sm font-sans text-muted-foreground">{t.cadence}</span>
                </div>
                <ul className="flex-1 space-y-3 text-sm text-muted-foreground">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="px-6 py-28 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="mb-3 block text-[10px] uppercase tracking-[0.4em] text-gold">
              Application
            </span>
            <h2 className="mb-10 font-display text-4xl md:text-5xl">Begin your application</h2>

            {submitted ? (
              <div className="rounded-sm border border-gold/40 bg-surface p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                  Received
                </p>
                <h3 className="mt-3 font-display text-3xl">
                  Your application is under review.
                </h3>
                <p className="mt-4 text-sm text-muted-foreground">
                  Decisions are issued within 5–7 business days. You'll receive an email upon
                  Committee determination.
                </p>
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" name="first" required />
                  <Field label="Last Name" name="last" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email" type="email" name="email" required />
                  <Field label="Phone" type="tel" name="phone" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Country" name="country" required />
                  <Field label="LinkedIn" name="linkedin" placeholder="linkedin.com/in/…" />
                  <Field label="Instagram" name="instagram" placeholder="@handle" />
                </div>
                <Field
                  label="Wine Experience"
                  name="experience"
                  textarea
                  placeholder="Years collecting, areas of expertise, notable mentors…"
                />
                <Field
                  label="Estimated Collection Value (USD)"
                  name="value"
                  placeholder="$50,000+"
                />
                <Field
                  label="Why do you want to join Opus Drinks?"
                  name="why"
                  textarea
                  required
                  placeholder="Tell the Committee what draws you to the club…"
                />
                <div>
                  <span className="mb-3 block text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    Preferred Beverage Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => {
                      const active = selected.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() =>
                            setSelected((s) =>
                              s.includes(c) ? s.filter((x) => x !== c) : [...s, c],
                            )
                          }
                          className={`rounded-sm border px-3 py-2 text-xs uppercase tracking-[0.2em] transition ${
                            active
                              ? "border-gold bg-gold/10 text-gold"
                              : "border-border text-muted-foreground hover:border-gold/50"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-sm border border-border bg-surface/40 p-4 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 size-4 rounded border-border bg-surface accent-[color:var(--color-gold)]"
                  />
                  <span>
                    I authorize the non-refundable $99 USD application fee and acknowledge that
                    membership is subject to Committee approval.
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-sm gold-gradient py-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground transition hover:brightness-110"
                >
                  Submit Application — $99
                </button>
              </form>
            )}
          </div>

          <aside>
            <div className="sticky top-24 space-y-4">
              <div className="rounded-sm border border-border bg-surface p-8">
                <h3 className="mb-2 font-display text-2xl">Application Process</h3>
                <ol className="space-y-4 text-sm text-muted-foreground">
                  {[
                    "Submit form & application fee",
                    "Committee review (5–7 days)",
                    "Welcome packet & first delivery",
                  ].map((s, i) => (
                    <li key={s} className="flex gap-4">
                      <span className="font-display text-gold-gradient text-xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-sm border border-gold/30 bg-burgundy/20 p-6 text-xs leading-relaxed text-muted-foreground">
                <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gold">Confidential</p>
                Information submitted is reviewed exclusively by the Membership Committee and never
                shared outside Opus.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  const base =
    "w-full rounded-sm bg-surface px-4 py-3 text-sm text-foreground ring-1 ring-border placeholder:text-muted-foreground/50 transition focus:outline-none focus:ring-gold/60";
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} rows={4} placeholder={placeholder} className={base} required={required} />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={base}
        />
      )}
    </label>
  );
}
