import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Opus Drinks" },
      {
        name: "description",
        content:
          "Opus Drinks Terms of Service: membership, auctions, payments, eligibility, and platform rules.",
      },
      { property: "og:title", content: "Terms of Service — Opus Drinks" },
      {
        property: "og:description",
        content:
          "Membership, auctions, payments, eligibility, and platform rules for Opus Drinks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Terms of Service — Opus Drinks" },
      {
        name: "twitter:description",
        content:
          "Membership, auctions, payments, eligibility, and platform rules for Opus Drinks.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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
            <span className="size-1.5 rounded-full bg-gold pulse-gold" /> Legal
          </span>
          <h1 className="max-w-[18ch] font-display text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl lg:text-8xl">
            Terms of{" "}
            <span className="italic text-gold-gradient">Service.</span>
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">
            This page is maintained by Grus Drinks LLC to set out the rules and
            expectations for using Opus Drinks. It is not a certification or legal
            advice.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-16 lg:grid-cols-[1fr_2.2fr] lg:gap-24">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6 rounded-sm border border-border bg-surface/40 p-6">
              <h2 className="font-display text-xl">On this page</h2>
              <nav className="space-y-3 text-sm text-muted-foreground">
                <a href="#agreement" className="block transition hover:text-foreground">Agreement</a>
                <a href="#eligibility" className="block transition hover:text-foreground">Eligibility</a>
                <a href="#membership" className="block transition hover:text-foreground">Membership</a>
                <a href="#auctions" className="block transition hover:text-foreground">Auctions</a>
                <a href="#conduct" className="block transition hover:text-foreground">Prohibited conduct</a>
                <a href="#ip" className="block transition hover:text-foreground">Intellectual property</a>
                <a href="#disclaimers" className="block transition hover:text-foreground">Disclaimers</a>
                <a href="#liability" className="block transition hover:text-foreground">Liability</a>
                <a href="#law" className="block transition hover:text-foreground">Governing law</a>
                <a href="#changes" className="block transition hover:text-foreground">Changes</a>
                <a href="#contact" className="block transition hover:text-foreground">Contact</a>
              </nav>
            </div>
          </aside>

          <article className="prose-style space-y-14 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              <strong className="text-foreground">Effective date:</strong> October 20, 2023.
            </p>

            <section id="agreement">
              <h2 className="mb-4 font-display text-2xl text-foreground">Agreement to terms</h2>
              <p className="leading-relaxed">
                By accessing or using the Opus Drinks website, mobile applications, and related
                services (the “Platform”), you agree to be bound by these Terms of Service. If you do
                not agree, do not use the Platform. These Terms apply to all visitors, registered users,
                and members.
              </p>
            </section>

            <section id="eligibility">
              <h2 className="mb-4 font-display text-2xl text-foreground">Eligibility and age verification</h2>
              <p className="leading-relaxed">
                Opus Drinks is intended for users who are at least 21 years old and of legal drinking
                age in their jurisdiction. By using the Platform, you represent that you meet this
                requirement. We reserve the right to request age and identity verification at any time,
                including before processing purchases, auction bids, or membership applications.
              </p>
              <p className="mt-4 leading-relaxed">
                You must provide accurate, complete, and current information. Accounts created with
                false information may be suspended or terminated.
              </p>
            </section>

            <section id="membership">
              <h2 className="mb-4 font-display text-2xl text-foreground">Membership and payments</h2>
              <p className="leading-relaxed">
                Opus Drinks offers a paid membership that provides access to a unified calendar,
                watchlist, concierge team, and other member features across authorised auction partners.
                Membership fees are processed through Stripe and are described on the membership page at
                the time of purchase. All fees are non-refundable unless otherwise stated or required by
                law.
              </p>
              <p className="mt-4 leading-relaxed">
                You are responsible for keeping your payment and account information current.
                Failure to pay applicable fees may result in suspension of membership benefits.
              </p>
            </section>

            <section id="auctions">
              <h2 className="mb-4 font-display text-2xl text-foreground">Auctions, marketplace, and concierge</h2>
              <p className="leading-relaxed">
                The Platform aggregates listings from authorised auction partners and provides tools
                for tracking, bidding, and requesting concierge assistance. Opus Drinks does not
                guarantee the availability, authenticity, or outcome of any third-party listing. All
                bids, purchases, and shipments are subject to the partner’s terms and applicable law.
              </p>
              <p className="mt-4 leading-relaxed">
                You agree to use the bidding, marketplace, and concierge features lawfully and in good
                faith. Shill bidding, fraudulent payments, and abusive conduct are prohibited.
              </p>
            </section>

            <section id="conduct">
              <h2 className="mb-4 font-display text-2xl text-foreground">Prohibited conduct</h2>
              <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                <li>Using the Platform if you are under the legal drinking age in your jurisdiction.</li>
                <li>Providing false identity, age, or payment information.</li>
                <li>Interfering with the Platform’s security, auctions, or other users.</li>
                <li>Using automated tools to scrape, mine, or manipulate listings or prices.</li>
                <li>Engaging in harassment, fraud, or illegal activity through the Platform.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                Violations may result in account suspension, termination, forfeiture of bids or
                memberships, and referral to appropriate authorities.
              </p>
            </section>

            <section id="ip">
              <h2 className="mb-4 font-display text-2xl text-foreground">Intellectual property</h2>
              <p className="leading-relaxed">
                All content on the Platform — including text, graphics, logos, images, software, and
                design — is owned by Grus Drinks LLC or its licensors and is protected by copyright,
                trademark, and other laws. You may not copy, modify, distribute, or create derivative
                works without our prior written consent.
              </p>
            </section>

            <section id="disclaimers">
              <h2 className="mb-4 font-display text-2xl text-foreground">Disclaimers</h2>
              <p className="leading-relaxed">
                The Platform is provided on an “as is” and “as available” basis. Opus Drinks and Grus
                Drinks LLC make no warranties, express or implied, about the accuracy, reliability, or
                availability of the Platform or any third-party listings. Investment information,
                pricing indices, and market commentary are for informational purposes only and do not
                constitute financial or investment advice.
              </p>
            </section>

            <section id="liability">
              <h2 className="mb-4 font-display text-2xl text-foreground">Limitation of liability</h2>
              <p className="leading-relaxed">
                To the fullest extent permitted by law, Grus Drinks LLC and its affiliates, officers,
                employees, and partners will not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of your use of the Platform, even if
                advised of the possibility of such damages. Our total liability for any claim relating to
                the Platform will not exceed the amount you paid to Opus Drinks in the twelve months
                preceding the claim.
              </p>
            </section>

            <section id="law">
              <h2 className="mb-4 font-display text-2xl text-foreground">Governing law and disputes</h2>
              <p className="leading-relaxed">
                These Terms are governed by the laws of the State of New York, without regard to
                conflict-of-law principles. Any dispute arising from these Terms or your use of the
                Platform will be resolved in the courts located in New York, unless otherwise required by
                applicable law.
              </p>
            </section>

            <section id="changes">
              <h2 className="mb-4 font-display text-2xl text-foreground">Changes to these terms</h2>
              <p className="leading-relaxed">
                We may update these Terms from time to time. The effective date at the top of the page
                will reflect the most recent revision. Continued use of the Platform after changes
                constitutes acceptance of the revised Terms. Material changes will be communicated
                through the Platform or by email where required.
              </p>
            </section>

            <section id="contact">
              <h2 className="mb-4 font-display text-2xl text-foreground">Contact us</h2>
              <p className="leading-relaxed">
                If you have questions about these Terms, please email{" "}
                <a
                  href="mailto:hello@opusdrinks.com"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-gold-gradient"
                >
                  hello@opusdrinks.com
                </a>
                .
              </p>
              <p className="mt-6 text-sm">
                <Link
                  to="/privacy"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-gold-gradient"
                >
                  View Privacy Policy →
                </Link>
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
