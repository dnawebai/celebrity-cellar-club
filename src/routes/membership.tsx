import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership Application — Opus Drinks Club" },
      {
        name: "description",
        content:
          "Apply for membership to Opus Drinks Club. $99 application fee, committee review, $199/mo or yearly with 10% off.",
      },
      { property: "og:title", content: "Membership Application — Opus Drinks Club" },
      {
        property: "og:description",
        content: "Invitation-only membership. Apply now for committee review.",
      },
    ],
  }),
  component: MembershipPage,
});

const benefits = [
  "Four premium bottles delivered monthly",
  "Access to limited-production wines & spirits",
  "Member-only auction participation",
  "Invitations to exclusive tasting events",
  "Early access to new releases",
  "Access to Beverages by Influencers",
  "Priority on celebrity collections",
  "Exclusive member discounts",
];

function MembershipPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <SiteShell>
      {/* Header */}
      <section className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-4xl">
          <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            Membership Application
          </span>
          <h1 className="mb-8 font-serif text-5xl italic leading-[1.05] text-balance md:text-6xl">
            A private invitation, reviewed by committee.
          </h1>
          <p className="max-w-[58ch] text-pretty text-lg text-muted-foreground">
            Access to the Opus Club is subject to approval. Prospective members complete the
            application below; submissions are reviewed individually by the Membership Committee and
            forwarded to{" "}
            <a href="mailto:elena@grusdrinks.com" className="text-accent hover:underline">
              elena@grusdrinks.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* Pricing Strip */}
      <section className="border-y border-border bg-surface/40 px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          <Stat label="Application Fee" value="$99" sub="One-time, non-refundable" />
          <Stat label="Monthly" value="$199" sub="USD per month" />
          <Stat label="Yearly" value="−10%" sub="When billed annually" />
        </div>
      </section>

      {/* Form + Benefits */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <div>
            <h2 className="mb-8 font-serif text-3xl italic">Begin your application</h2>
            {submitted ? (
              <div className="rounded-md bg-surface p-10 ring-1 ring-border">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                  Received
                </p>
                <h3 className="mt-3 font-serif text-2xl italic">
                  Thank you. Your application is under review.
                </h3>
                <p className="mt-4 text-sm text-muted-foreground">
                  You will be notified by email regarding your approval status. Applications are
                  reviewed within 5–7 business days.
                </p>
              </div>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" name="first" required />
                  <Field label="Last Name" name="last" required />
                </div>
                <Field label="Email Address" type="email" name="email" required />
                <Field label="Phone" type="tel" name="phone" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" name="city" required />
                  <Field label="State" name="state" required />
                </div>
                <Field
                  label="Tell us about your collection"
                  name="collection"
                  textarea
                  placeholder="Notable bottles, cellar size, areas of interest…"
                />
                <Field
                  label="How did you hear about Opus?"
                  name="referral"
                  placeholder="Referral, publication, member name…"
                />
                <div className="flex items-start gap-3 pt-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 size-4 rounded border-border bg-surface accent-[color:var(--color-accent)]"
                  />
                  <span>
                    I authorize the non-refundable $99 USD application fee and acknowledge membership
                    is subject to Committee approval.
                  </span>
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-sm bg-accent py-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground transition-all hover:brightness-110"
                >
                  Submit Application — $99
                </button>
              </form>
            )}
          </div>

          {/* Benefits */}
          <aside>
            <div className="sticky top-24 rounded-md bg-surface p-8 ring-1 ring-border">
              <h3 className="mb-2 font-serif text-2xl italic">Member Benefits</h3>
              <p className="mb-6 text-xs text-muted-foreground">
                Upon approval, members are enrolled in the Opus Club program.
              </p>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 border-t border-border pt-3 text-sm first:border-0 first:pt-0"
                  >
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[10px] uppercase tracking-widest text-muted-foreground">
                Currently available only to residents of the United States.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-4xl italic">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
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
    "w-full rounded-sm bg-surface px-4 py-3 text-sm text-foreground ring-1 ring-border placeholder:text-muted-foreground/60 focus:outline-none focus:ring-accent/60";
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} rows={4} placeholder={placeholder} className={base} />
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
