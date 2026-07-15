# Phase 2 — Real Auth + $99 Membership on Lovable Cloud

Lovable Cloud is enabled. This plan turns the current demo interface into a live membership platform: real accounts, a $99 payment, member-only gating, and an admin surface. Auction house partner feeds stay out of scope (Phase 3).

## What we're building

1. **Accounts & sign-in** — Email/password plus Sign in with Google.
2. **Profile & compliance record** — Name, DOB (21+ check), country/state, ID doc reference, subscription status.
3. **$99 membership payment** via Lovable's built-in Stripe integration (one-time, monthly, or annual — configurable).
4. **Member gating** — the blur/paywall on lots, watchlist, bids, concierge only lifts for `status = active`.
5. **Admin console** — restricted to `admin` role: view members, mark verifications, comp memberships, adjust baseline counter.

## Data model (migrations)

```text
profiles            one row per auth user
  id (uuid, = auth.users.id)
  full_name, display_name
  date_of_birth (date, must be ≥ 21)
  country, region
  created_at, updated_at

user_roles          separate table (prevents privilege escalation)
  user_id, role enum('admin','member','applicant')
  has_role() SECURITY DEFINER helper for RLS

memberships         current subscription state
  user_id (PK), tier, status ('pending' | 'active' | 'past_due' | 'cancelled')
  billing_cycle ('one_time' | 'monthly' | 'annual')
  price_cents (default 9900)
  started_at, current_period_end, cancelled_at
  stripe_customer_id, stripe_subscription_id

id_verifications    KYC/age docs
  id, user_id, doc_type, doc_ref, status ('submitted'|'approved'|'rejected'), reviewed_by, reviewed_at

auction_source_log  compliance audit — every rendered auction/lot logs its
  internal source house (Sotheby's, Christie's, Acker, Iron Gate) even though
  the public label stays "Authorised Auction Partner".
```

All tables get RLS + GRANTs. Users see only their own rows; admins see all via `has_role(auth.uid(),'admin')`.

## Auth & routing

- New `/auth` route: sign in / sign up (email + Google), password reset, `/reset-password` page.
- Move `/watchlist`, `/bids`, `/concierge`, `/dashboard`, and lot detail pages under `_authenticated/`.
- Public routes (`/`, `/marketplace`, `/auctions`, `/auctions/$id`, `/membership`) stay public but show inline "Sign in to bid / save".
- Header shows Sign in when logged out, avatar menu + Sign out when logged in.

## $99 payment flow

- Lovable Stripe integration (no BYO keys). One product with three prices: one-time $99, monthly $99, annual $99 — user picks on the membership page.
- `POST /api/public/hooks/stripe` webhook (signature-verified) flips `memberships.status` to `active` on successful checkout, `past_due`/`cancelled` on downstream events.
- Success returns to `/dashboard` with a "Welcome" state; failure returns to `/membership` with an error.

## Member counter

Replace the deterministic Friday counter with `SELECT count(*) FROM memberships WHERE status='active'` fetched via a public server fn, cached 60s. Baseline offset stays configurable from admin.

## Admin console (`/_authenticated/_admin`)

- `has_role='admin'` layout gate.
- Members list (search, filter by status), ID verification queue (approve/reject), baseline counter, source-log audit view.

## Out of scope this phase

- Real auction house API integrations (still demo data, banner stays).
- Integrated in-platform bidding (`FEATURE_INTEGRATED_BIDDING` stays off).
- Producer portal and AI Sommelier backends (UI only for now).

## Technical notes

- All privileged writes go through `createServerFn` with `requireSupabaseAuth`; admin ops verify role via `has_role` before loading `supabaseAdmin`.
- Stripe webhook lives at `src/routes/api/public/hooks/stripe.ts`, HMAC verified against `STRIPE_WEBHOOK_SECRET`.
- Root route wires `onAuthStateChange` → `router.invalidate()`.
- Sign-out clears query cache and navigates to `/auth`.

## Questions before I start

1. **Billing cycle default** — should the membership page default to **one-time $99**, **monthly $99**, or show all three side-by-side and let the user pick?
2. **ID verification** — do you want a real provider (Stripe Identity / Persona) wired now, or a manual admin-review queue for launch (file upload → admin approves)?
3. **Google sign-in** — OK to enable alongside email/password? (It's the default.)

Reply with answers (or "your call, go") and I'll build it.
