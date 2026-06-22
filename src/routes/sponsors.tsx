import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Partner with Opus Drinks — Sponsorship" },
      {
        name: "description",
        content:
          "Reach an engaged audience of wine collectors, luxury consumers, and beverage enthusiasts through Opus sponsorship placements.",
      },
      { property: "og:title", content: "Partner with Opus Drinks" },
      {
        property: "og:description",
        content: "Sponsorship and partnership opportunities across the Opus ecosystem.",
      },
    ],
  }),
  component: SponsorsPage,
});

const placements = [
  "Opus Club Portal",
  "Opus by Influencers",
  "Event Pages",
  "Auction Pages",
  "Email Campaigns",
  "Member Newsletters",
];

const benefits = [
  "Premium brand visibility",
  "Direct member engagement",
  "Event sponsorship opportunities",
  "Product placement opportunities",
  "Digital advertising inventory",
  "VIP event participation",
];

function SponsorsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <SiteShell>
      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl">
          <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            Sponsorship
          </span>
          <h1 className="mb-8 font-serif text-5xl italic leading-[1.05] text-balance md:text-6xl">
            Partner with Opus Drinks.
          </h1>
          <p className="max-w-[58ch] text-pretty text-lg text-muted-foreground">
            The Opus Club offers sponsors direct exposure to a highly engaged audience of wine
            collectors, luxury consumers, investors, executives, and beverage enthusiasts.
          </p>
        </div>
      </section>

      {/* Placements + Benefits */}
      <section className="border-y border-border bg-surface/40 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-6 font-serif text-2xl italic">Placement Inventory</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {placements.map((p) => (
                <li
                  key={p}
                  className="rounded-sm bg-surface px-4 py-3 text-sm ring-1 ring-border"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 font-serif text-2xl italic">Sponsor Benefits</h2>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 border-t border-border pt-3 text-sm first:border-0 first:pt-0">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-serif text-3xl italic">Become a Sponsor</h2>
          {submitted ? (
            <div className="rounded-md bg-surface p-10 ring-1 ring-border">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                Received
              </p>
              <h3 className="mt-3 font-serif text-2xl italic">
                Thank you. The Partnership Team will be in touch.
              </h3>
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
                <Field label="Company Name" name="company" required />
                <Field label="Contact Name" name="contact" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field type="email" label="Email" name="email" required />
                <Field label="Website" name="website" placeholder="https://" />
              </div>
              <Field label="Industry" name="industry" />
              <label className="block">
                <span className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Sponsorship Budget
                </span>
                <select
                  name="budget"
                  className="w-full rounded-sm bg-surface px-4 py-3 text-sm ring-1 ring-border focus:outline-none focus:ring-accent/60"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a range
                  </option>
                  <option>$10k – $50k</option>
                  <option>$50k – $200k</option>
                  <option>$200k – $500k</option>
                  <option>$500k+</option>
                </select>
              </label>
              <Field
                label="Marketing Objectives"
                name="objectives"
                textarea
                placeholder="Goals, target outcomes, preferred placements…"
              />
              <button
                type="submit"
                className="mt-2 w-full rounded-sm bg-accent py-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground transition-all hover:brightness-110"
              >
                Submit Inquiry
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                Applications reviewed by the Grus Drinks Partnership Team
              </p>
            </form>
          )}
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
