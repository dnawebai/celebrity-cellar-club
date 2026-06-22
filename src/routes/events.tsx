import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import vineyard from "@/assets/event-vineyard.jpg";
import tasting from "@/assets/event-tasting.jpg";
import dinner from "@/assets/event-dinner.jpg";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Upcoming Events & Future Auctions — Opus Drinks Club" },
      {
        name: "description",
        content:
          "Private winery visits, virtual tastings, influencer appearances, and seasonal auctions on the Opus calendar.",
      },
      { property: "og:title", content: "Upcoming Events — Opus Drinks Club" },
      {
        property: "og:description",
        content: "The Opus calendar: tastings, winery visits, and private dinners.",
      },
      { property: "og:image", content: vineyard },
    ],
  }),
  component: EventsPage,
});

const events = [
  {
    location: "Napa Valley, CA",
    date: "October 14, 2026",
    type: "In Person",
    title: "Private Winery Immersion",
    description:
      "A two-day visit with a celebrated estate, including barrel tastings, blending sessions, and a chef's table dinner.",
    img: vineyard,
  },
  {
    location: "Virtual",
    date: "November 02, 2026",
    type: "Online",
    title: "Aaron Hibell Studio Tasting",
    description:
      "Guided tasting of three founder's reserves with the Hibell team. Bottles shipped in advance to members.",
    img: tasting,
  },
  {
    location: "New York City",
    date: "December 12, 2026",
    type: "In Person",
    title: "The Autumn Gala Dinner",
    description:
      "An intimate dinner for forty members across a long candlelit table. Pairings curated by the Opus sommelier.",
    img: dinner,
  },
];

const auctions = [
  { title: "Holiday Library Release", date: "Dec 2026", lots: 24 },
  { title: "Winter Spirits Collection", date: "Jan 2027", lots: 18 },
  { title: "Spring Champagne Cellar", date: "Mar 2027", lots: 36 },
];

function EventsPage() {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  function closeModal() {
    setActiveEvent(null);
    setSubmitted(false);
    setForm({ name: "", phone: "", email: "" });
  }

  return (
    <SiteShell>
      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-7xl">
          <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            The Opus Calendar
          </span>
          <h1 className="max-w-[22ch] font-serif text-5xl italic leading-[1.05] text-balance md:text-6xl">
            Upcoming events and future auctions.
          </h1>
        </div>
      </section>

      {/* Events grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          {events.map((e) => (
            <article key={e.title} className="group">
              <div className="overflow-hidden rounded-md ring-1 ring-border">
                <img
                  src={e.img}
                  alt={e.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="text-accent">{e.location}</span>
                <span>·</span>
                <span>{e.type}</span>
              </div>
              <h3 className="mt-2 font-serif text-2xl italic">{e.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">{e.date}</span>
                <button
                  onClick={() => setActiveEvent(e.title)}
                  className="text-[10px] uppercase tracking-widest text-accent hover:underline"
                >
                  Reserve Seat →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Future Auctions */}
      <section className="border-t border-border bg-surface/40 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-serif text-4xl italic">Future Auctions</h2>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Reserve in advance
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {auctions.map((a) => (
              <div
                key={a.title}
                className="rounded-md bg-surface p-8 ring-1 ring-border transition-all hover:ring-accent/40"
              >
                <p className="text-[10px] uppercase tracking-widest text-accent">{a.date}</p>
                <h3 className="mt-3 font-serif text-2xl italic">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.lots} lots</p>
                <Link
                  to="/membership"
                  className="mt-6 block w-full rounded-sm py-3 text-center text-[10px] font-semibold uppercase tracking-widest ring-1 ring-border transition-all hover:ring-accent/60 hover:text-accent"
                >
                  Register Interest
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation modal */}
      {activeEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 px-4 backdrop-blur-md"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md rounded-md border border-border bg-surface p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Close ✕
            </button>
            {submitted ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                  Confirmed
                </p>
                <h3 className="mt-3 font-serif text-2xl italic">
                  Your seat is reserved for {activeEvent}.
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  A confirmation has been sent to {form.email}. We'll be in touch with
                  arrival details.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 w-full rounded-sm bg-accent py-3 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                  Reserve a Seat
                </p>
                <h3 className="mt-2 font-serif text-2xl italic">{activeEvent}</h3>
                <div className="mt-6 space-y-4">
                  <Field
                    label="Full Name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    required
                  />
                  <Field
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-sm bg-accent py-3 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:brightness-110"
                >
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </SiteShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={120}
        className="w-full rounded-sm bg-background px-4 py-3 text-sm text-foreground ring-1 ring-border focus:outline-none focus:ring-accent/60"
      />
    </label>
  );
}
