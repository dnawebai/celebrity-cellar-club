import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/producers")({
  head: () => ({
    meta: [
      { title: "Producer Portal — Opus Drinks" },
      {
        name: "description",
        content:
          "Wineries and distilleries apply to join Opus. Celebrity partnerships, global distribution, and luxury positioning.",
      },
    ],
  }),
  component: ProducersPage,
});

const packages = [
  {
    name: "Silver",
    price: "Application",
    features: ["Marketing support", "Auction listing access", "Distribution onboarding", "Member exposure"],
  },
  {
    name: "Gold",
    featured: true,
    price: "Curated",
    features: [
      "Everything in Silver",
      "Celebrity-paired releases",
      "Editorial features",
      "Investment analysis",
      "Quarterly media campaigns",
    ],
  },
  {
    name: "Platinum",
    price: "Bespoke",
    features: [
      "Everything in Gold",
      "Dedicated Opus producer manager",
      "Co-branded Legacy bottles",
      "Global luxury positioning",
      "Founder Circle access",
    ],
  },
];

function ProducersPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <SiteShell>
      <section className="border-b border-border px-6 pt-32 pb-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mb-6 block text-[10px] uppercase tracking-[0.4em] text-gold">
            Producer Portal
          </span>
          <h1 className="max-w-[22ch] font-display text-5xl text-balance md:text-7xl">
            For the world's most <span className="italic text-gold-gradient">discerning estates</span>.
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg text-muted-foreground">
            Opus partners with wineries, distilleries, and houses producing fewer than 50,000
            bottles annually. Apply to join our allocated producer network.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface/30 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-12 font-display text-4xl md:text-5xl">Producer Packages</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {packages.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-sm p-10 ring-1 ${
                  p.featured ? "bg-surface ring-gold luxury-shadow" : "bg-surface/40 ring-border"
                }`}
              >
                {p.featured ? (
                  <span className="absolute -top-3 left-10 rounded-sm gold-gradient px-3 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-primary-foreground">
                    Most Partnerships
                  </span>
                ) : null}
                <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gold">
                  {p.name} Program
                </div>
                <div className="mb-8 font-display text-4xl">{p.price}</div>
                <ul className="flex-1 space-y-3 text-sm text-muted-foreground">
                  {p.features.map((f) => (
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

      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="mb-8 font-display text-4xl md:text-5xl">Apply to partner</h2>
            {submitted ? (
              <div className="rounded-sm border border-gold/40 bg-surface p-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Received</p>
                <h3 className="mt-3 font-display text-3xl">Thank you.</h3>
                <p className="mt-4 text-sm text-muted-foreground">
                  Our Producer Relations team will be in touch within 10 business days.
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
                  <F label="Winery Name" required />
                  <F label="Country" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <F label="Owner / Principal" required />
                  <F label="Contact Email" type="email" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <F label="Website" placeholder="https://" />
                  <F label="Annual Production (bottles)" />
                </div>
                <F
                  label="Brief Estate Description"
                  textarea
                  placeholder="Tell us about your house, your flagship wines, and your aspirations…"
                />
                <div className="grid grid-cols-2 gap-4">
                  <UploadField label="Upload Presentation" />
                  <UploadField label="Upload Wine List" />
                </div>
                <button className="w-full rounded-sm gold-gradient py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground">
                  Submit Application
                </button>
              </form>
            )}
          </div>
          <aside>
            <div className="sticky top-24 space-y-3 rounded-sm border border-border bg-surface/40 p-8">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Benefits</div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Celebrity partnerships",
                  "Global luxury distribution",
                  "Auction access",
                  "Marketing campaigns",
                  "Brand development",
                  "Reference pricing intelligence",
                  "Luxury positioning",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-gold" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function F({
  label,
  type = "text",
  textarea,
  required,
  placeholder,
}: {
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  const base =
    "w-full rounded-sm bg-surface px-4 py-3 text-sm ring-1 ring-border placeholder:text-muted-foreground/50 focus:outline-none focus:ring-gold/60";
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </span>
      {textarea ? (
        <textarea rows={4} className={base} placeholder={placeholder} required={required} />
      ) : (
        <input type={type} className={base} placeholder={placeholder} required={required} />
      )}
    </label>
  );
}

function UploadField({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
      <div className="flex h-[46px] cursor-pointer items-center justify-center rounded-sm border border-dashed border-border bg-surface/60 text-xs text-muted-foreground hover:border-gold/50 hover:text-gold">
        Choose file
        <input type="file" className="hidden" />
      </div>
    </label>
  );
}
