# Opus Drinks — Auctions Marketplace Rebuild

This plan rebuilds the `/auctions` experience into a proper multi-house aggregator (Sotheby's Wine, Christie's, Acker, Iron Gate, +future partners) fronted by the Opus Drinks brand, gated behind $99 membership, with two clearly-labeled bidding modes and honest demo-data disclosures.

Given the massive spec, I'll deliver **Phase 1 (frontend + demo data)** now, structured so Phases 2–4 (real feeds, integrated bidding, payments/portfolio) can slot in without redesign. Backend (Supabase, Stripe, Realtime, admin console) is called out but NOT built this turn — we'll enable Lovable Cloud and layer it in follow-up turns to keep this change reviewable.

## Scope this turn

**Frontend rebuild of the auction surface** — no backend wiring, no fabricated live data, no fake bid buttons.

### Files touched
- `src/routes/auctions.tsx` — full rewrite: aggregator marketplace (hero, filters, live/upcoming/closing-soon/past tabs, auction cards showing "via partner" internally-typed but publicly Opus-branded, demo-data banner).
- `src/routes/auctions.$auctionId.tsx` — new auction detail page (cover, dates, lots grid, register CTA gated to membership, calendar export stub, concierge CTA).
- `src/routes/auctions.$auctionId.lots.$lotId.tsx` — new lot detail page (all spec fields present as sections, only populated when data exists; Bidding Panel component picks Mode 1 vs Mode 2 from `auction.biddingMode`).
- `src/routes/calendar.tsx` — new auction calendar (month/week/list views, ICS export stub).
- `src/routes/watchlist.tsx` — new (member-gated; empty-state + saved-search cards).
- `src/routes/bids.tsx` — new "My Bids" with tabs (Active/Highest/Outbid/Won/Lost/Pending/Completed) — empty-state until backend.
- `src/routes/concierge.tsx` — new Opus Concierge request page (form, request-type picker, case tracking placeholder).
- `src/lib/auctions-data.ts` — new: typed demo dataset (`AuctionHouse`, `Auction`, `Lot`, `BiddingMode`), with `sourceId` retained internally per spec.
- `src/components/site-shell.tsx` — extend nav (Live, Upcoming, Calendar, Wine Lots, Spirits, My Bids, Watchlist, Concierge, Membership); collapse into a grouped mega-menu on desktop, drawer on mobile.
- `src/components/demo-data-banner.tsx` — new: persistent, dismissible "Demonstration data — no live auction feeds connected" strip, per spec's "never represent demo data as current auction data".
- `src/components/bidding-panel.tsx` — new: renders Mode 1 (Bid / Max Bid / two-step confirm) vs Mode 2 (Watchlist / Request Concierge Bid / Open Partner Site) based on `auction.biddingMode`. Never renders a live-bid button when mode is external.
- `src/components/member-gate.tsx` — new: wraps deep content, blurs + shows "Join Opus Drinks — $99" CTA for non-members. Uses simple client-side flag until Cloud/auth lands.

### Design
- Deep forest green background (`--background`), warm ivory surfaces, refined gold accents. Update `src/styles.css` tokens.
- Cormorant / Fraunces serif headings retained; Geist sans for data.
- Large editorial photography, generous spacing, subtle motion (fade-up on scroll, no flashy transitions).

### Bidding modes (visible, honest)
- Each auction has `biddingMode: "integrated" | "external"`. All demo auctions ship as `"external"` this turn — no fake live bid buttons anywhere. When Phase 3 lands, admin flips the flag per partner.
- External mode shows: Watchlist · Request Concierge Bid · Open Auction Page (opens partner URL in new tab).
- Integrated mode UI is built but disabled behind a `FEATURE_INTEGRATED_BIDDING = false` flag until a real API is wired.

### Compliance copy
- Footer legal notice from spec verbatim.
- 21+ / geographic-restriction reminder on membership CTA.
- No third-party house logos on public pages; internal `sourceId` only.

## Explicitly deferred (call out to user, propose next turns)

1. **Lovable Cloud (Supabase)** — required for members, memberships, bids, watchlists, alerts, orders, audit logs, RLS, roles. Next turn.
2. **Stripe** — $99 membership (configurable one-time / monthly / annual). Turn after Cloud.
3. **Partner feed ingestion** — Sotheby's/Christie's/Acker/Iron Gate. Requires signed API/feed agreements; will scaffold `partner_integrations` table + admin config UI only, no scraping.
4. **Realtime bid updates, KYC/AML, Resend/Twilio, PostHog, Sentry** — later phases.
5. **Admin dashboard** — after Cloud + roles.

## Technical notes
- All routes SSR-safe; member-only depth is client-gated for now (public shell renders teasers with head/meta for SEO on marketplace and category pages).
- Times stored/authored as UTC ISO strings in demo data; displayed in browser locale via `Intl.DateTimeFormat`.
- `head()` per route with unique titles/descriptions for SEO pages (fine wine, Bordeaux, Burgundy, Champagne, whisky) — added as filter deep-links on the marketplace, not separate route explosion, to keep this turn scoped.

## Confirm to proceed
Reply **"go"** to build Phase 1 as above, or tell me which pieces to cut/add. If you want me to enable Lovable Cloud and start Phase 2 (auth + membership schema) in the same turn, say **"go + cloud"**.
