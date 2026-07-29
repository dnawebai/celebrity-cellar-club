import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Opus Drinks" },
      {
        name: "description",
        content:
          "Opus Drinks Privacy Policy: how we collect, use, retain, and protect your personal information.",
      },
      { property: "og:title", content: "Privacy Policy — Opus Drinks" },
      {
        property: "og:description",
        content:
          "How Opus Drinks collects, uses, retains, and protects your personal information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Privacy Policy — Opus Drinks" },
      {
        name: "twitter:description",
        content:
          "How Opus Drinks collects, uses, retains, and protects your personal information.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            Privacy{" "}
            <span className="italic text-gold-gradient">Policy.</span>
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">
            This page is maintained by Grus Drinks LLC to answer common privacy
            questions about Opus Drinks. It is not a certification, audit report,
            or legal opinion.
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
                <a href="#collection" className="block transition hover:text-foreground">Information we collect</a>
                <a href="#use" className="block transition hover:text-foreground">How we use information</a>
                <a href="#sharing" className="block transition hover:text-foreground">Sharing and subprocessors</a>
                <a href="#cookies" className="block transition hover:text-foreground">Cookies and analytics</a>
                <a href="#retention" className="block transition hover:text-foreground">Retention</a>
                <a href="#rights" className="block transition hover:text-foreground">Your rights</a>
                <a href="#security" className="block transition hover:text-foreground">Security</a>
                <a href="#changes" className="block transition hover:text-foreground">Changes</a>
                <a href="#contact" className="block transition hover:text-foreground">Contact</a>
              </nav>
            </div>
          </aside>

          <article className="prose-style space-y-14 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              <strong className="text-foreground">Effective date:</strong> October 20, 2023.
            </p>

            <section id="collection">
              <h2 className="mb-4 font-display text-2xl text-foreground">Information we collect</h2>
              <p className="leading-relaxed">
                We collect information you provide directly when you create an account, apply for
                membership, place bids, use the concierge service, fill out the contact form, or
                otherwise interact with Opus Drinks. This may include your name, email address, phone
                number, mailing address, date of birth, payment information, and any messages you send us.
              </p>
              <p className="mt-4 leading-relaxed">
                We also collect certain technical information automatically when you use the platform,
                such as your IP address, browser type, device identifiers, pages viewed, and the dates
                and times of your visits. This helps us operate and improve the service.
              </p>
            </section>

            <section id="use">
              <h2 className="mb-4 font-display text-2xl text-foreground">How we use your information</h2>
              <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                <li>To create and manage your account and membership.</li>
                <li>To process payments and fulfill auction, marketplace, and concierge transactions.</li>
                <li>To verify that you are of legal drinking age and eligible to participate.</li>
                <li>To communicate with you about your account, transactions, and service updates.</li>
                <li>To respond to inquiries submitted through the contact form or concierge.</li>
                <li>To improve the platform, monitor usage trends, and maintain security.</li>
              </ul>
            </section>

            <section id="sharing">
              <h2 className="mb-4 font-display text-2xl text-foreground">Sharing and subprocessors</h2>
              <p className="leading-relaxed">
                We do not sell personal information. We share data only with service providers
                (subprocessors) that help us operate Opus Drinks, such as payment processors, cloud
                hosting providers, email delivery services, and authentication services. The platform
                is hosted on Lovable Cloud infrastructure and uses Stripe for payment processing.
              </p>
              <p className="mt-4 leading-relaxed">
                Lovable Cloud provides the underlying backend, authentication, and database services.
                Stripe handles payment card data according to its own privacy and security practices.
                We may engage additional subprocessors as the service grows and will update this page
                when we do.
              </p>
            </section>

            <section id="cookies">
              <h2 className="mb-4 font-display text-2xl text-foreground">Cookies and analytics</h2>
              <p className="leading-relaxed">
                Opus Drinks uses cookies and similar technologies to keep you signed in, remember your
                preferences, understand how the platform is used, and support security. You can manage
                cookies through your browser settings. Disabling certain cookies may affect your ability
                to use some features, such as staying signed in.
              </p>
            </section>

            <section id="retention">
              <h2 className="mb-4 font-display text-2xl text-foreground">Data retention</h2>
              <p className="leading-relaxed">
                We retain your personal information for as long as your account is active and as needed
                to provide the service. After account closure, we keep certain records for legal, tax, and
                fraud-prevention purposes for the period required by applicable law, then delete or
                anonymize them. Specific retention periods depend on the type of record and the
                jurisdiction.
              </p>
            </section>

            <section id="rights">
              <h2 className="mb-4 font-display text-2xl text-foreground">Your rights and choices</h2>
              <p className="leading-relaxed">
                Depending on where you live, you may have rights to access, correct, delete, or restrict
                the use of your personal information. You can update most account information from your
                dashboard. To exercise other rights, contact us at the email address below. We will
                respond in accordance with applicable law.
              </p>
              <p className="mt-4 leading-relaxed">
                You may also opt out of promotional emails by following the unsubscribe link in any
                marketing message. Transactional and service-related messages cannot be opted out of
                while you maintain an account.
              </p>
            </section>

            <section id="security">
              <h2 className="mb-4 font-display text-2xl text-foreground">Security</h2>
              <p className="leading-relaxed">
                We use commercially reasonable administrative, technical, and physical safeguards to
                protect your information. This includes encrypted connections, access controls, and
                backend security features provided by Lovable Cloud. No online service can guarantee
                absolute security, and you are responsible for keeping your account credentials safe.
              </p>
            </section>

            <section id="changes">
              <h2 className="mb-4 font-display text-2xl text-foreground">Changes to this policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. The effective date at the top of the
                page will reflect the most recent revision. Material changes will be communicated through
                the platform or by email where required by law.
              </p>
            </section>

            <section id="contact">
              <h2 className="mb-4 font-display text-2xl text-foreground">Contact us</h2>
              <p className="leading-relaxed">
                If you have questions about this Privacy Policy or how we handle your data, please email{" "}
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
                  to="/terms"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-gold-gradient"
                >
                  View Terms of Service →
                </Link>
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
