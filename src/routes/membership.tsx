import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import celebBranson from "@/assets/celeb-branson.jpg";
import celebMouton from "@/assets/celeb-mouton.jpg";
import celebSancerre from "@/assets/celeb-sancerre.jpg";
import celebPappy from "@/assets/celeb-pappy.jpg";

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
    id: "member",
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
    id: "black",
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
    id: "founder",
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


const celebrityCollection = [
  {
    celebrity: "50 Cent",
    bottle: "Branson Cognac",
    lot: "Signature Release",
    price: "$25,000",
    img: celebBranson,
  },
  {
    celebrity: "Denise Richards",
    bottle: "1982 Mouton Rothschild",
    lot: "Lot 100",
    price: "$175,000",
    img: celebMouton,
  },
  {
    celebrity: "Taylor Swift",
    bottle: "Domaine de Terres Blanches Sancerre",
    lot: "Lot 100",
    price: "$300,000",
    img: celebSancerre,
  },
  {
    celebrity: "Aaron Hibell",
    bottle: "Pappy Van Winkle 23",
    lot: "Lot 100",
    price: "$500,000",
    img: celebPappy,
  },
];

type Tier = (typeof tiers)[number];

function MembershipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [subscribeTier, setSubscribeTier] = useState<Tier | null>(null);

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
            Membership Committee.
          </p>
        </div>
      </section>

      {/* CELEBRITIES' COLLECTION */}
      <CelebritiesCollection />

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
                  t.featured ? "bg-surface ring-gold luxury-shadow" : "bg-surface/40 ring-border"
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
                <button
                  onClick={() => setSubscribeTier(t)}
                  className={`mt-8 w-full rounded-sm py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] transition ${
                    t.featured
                      ? "gold-gradient text-primary-foreground hover:brightness-110"
                      : "border border-gold/60 text-gold hover:bg-gold/10"
                  }`}
                >
                  {t.id === "founder" ? "Request invitation" : `Subscribe — ${t.price}${t.cadence}`}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Subscriptions begin with a $99 application fee · ID & U.S. residence verification required
          </p>
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

      {subscribeTier ? (
        <SubscribeModal tier={subscribeTier} onClose={() => setSubscribeTier(null)} />
      ) : null}
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

function CelebritiesCollection() {
  return (
    <section className="border-b border-border px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 block text-[10px] uppercase tracking-[0.4em] text-gold">
              Members Only
            </span>
            <h2 className="font-display text-4xl md:text-5xl">
              The <span className="italic text-gold-gradient">Celebrities' Collection</span>.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            A private cellar of premium bottles inspired by beverages publicly associated with
            cultural icons. Never an endorsement. Available exclusively to approved Opus members.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {celebrityCollection.map((b) => (
            <article
              key={b.celebrity}
              className="group overflow-hidden rounded-sm border border-border bg-surface/40 transition hover:border-gold/50"
            >
              <img
                src={b.img}
                alt={b.bottle}
                loading="lazy"
                width={800}
                height={1000}
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {b.lot} · Inspired by
                </div>
                <div className="mt-1 font-display text-lg text-gold-gradient">{b.celebrity}</div>
                <h3 className="mt-2 font-display text-lg leading-tight">{b.bottle}</h3>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Inspired by {b.celebrity}'s reported favorite drink. Not an endorsement.
                </p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                  <a
                    href="#membership-plans"
                    className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-gradient underline-offset-4 hover:underline"
                  >
                    Request Information
                  </a>
                  <a
                    href="#membership-plans"
                    className="rounded-sm gold-gradient px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
                  >
                    Buy
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubscribeModal({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "review">("form");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-gold/40 bg-background p-8 luxury-shadow md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-2xl text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mb-2 text-[10px] uppercase tracking-[0.4em] text-gold">
          Subscribe · {tier.name}
        </div>
        <h3 className="mb-2 font-display text-3xl md:text-4xl">
          Become a member.
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Subscription <span className="text-foreground">{tier.price}{tier.cadence}</span>. A
          one-time <span className="text-foreground">$99 application fee</span> is charged today
          so the Membership Committee can verify your ID and U.S. residence per applicable U.S.
          regulations. Subscription billing begins only after approval.
        </p>

        {step === "form" ? (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setStep("review");
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Legal First Name" name="firstName" required />
              <Field label="Legal Last Name" name="lastName" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" type="email" name="email" required />
              <Field label="Phone" type="tel" name="phone" required />
            </div>
            <Field label="Date of Birth" type="date" name="dob" required />
            <Field label="Street Address (U.S.)" name="address" required />
            <div className="grid grid-cols-3 gap-4">
              <Field label="City" name="city" required />
              <Field label="State" name="state" placeholder="CA" required />
              <Field label="ZIP" name="zip" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Government ID Number" name="idNumber" placeholder="Driver's license / Passport" required />
              <Field label="ID Issuing State / Country" name="idIssuer" required />
            </div>

            <div className="rounded-sm border border-gold/30 bg-surface/40 p-4 text-xs text-muted-foreground">
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gold">
                Compliance · U.S. residents only
              </p>
              You must be 21+ and a legal U.S. resident. Opus will verify your identity, age, and
              U.S. residency against federal and state rules governing the sale of alcoholic
              beverages before any subscription begins.
            </div>

            <div className="space-y-3 text-xs text-muted-foreground">
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-0.5 size-4 accent-[color:var(--color-gold)]" />
                <span>I confirm I am 21 years of age or older and a legal resident of the United States.</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-0.5 size-4 accent-[color:var(--color-gold)]" />
                <span>
                  I authorize the non-refundable $99 USD application fee and consent to ID,
                  age, and U.S. residence verification.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-sm gold-gradient py-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground transition hover:brightness-110"
            >
              Continue to payment — $99
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-sm border border-border bg-surface/40 p-5 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-3 text-muted-foreground">
                <span>Application fee (today)</span>
                <span className="text-foreground">$99.00</span>
              </div>
              <div className="flex items-center justify-between pt-3 text-muted-foreground">
                <span>{tier.name} · billed after approval</span>
                <span className="text-foreground">{tier.price}{tier.cadence}</span>
              </div>
            </div>

            <div className="rounded-sm border border-gold/40 bg-surface p-5 text-sm">
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gold">Secure checkout · Stripe</p>
              <p className="text-muted-foreground">
                Payments are processed by Stripe. Once Stripe is enabled on this project, this
                step will hand off to a Stripe Checkout session for the $99 verification fee and
                set up the {tier.name} subscription on approval.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("form")}
                className="flex-1 rounded-sm border border-border py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
              >
                Back
              </button>
              <button
                onClick={() => {
                  alert(
                    "Stripe is not enabled yet. Ask Lovable to enable Stripe payments to complete checkout.",
                  );
                }}
                className="flex-1 rounded-sm gold-gradient py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground hover:brightness-110"
              >
                Pay $99 with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
