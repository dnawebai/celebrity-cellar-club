# OPUS DRINKS — Real Auctions, Dollywood Page & Conversion Tracking

## Goal
Move the platform from demo auction data to a real, member-only auction experience: a Dollywood Foundation benefit auction with real lots, member bidding, email notifications, and conversion analytics.

## What we will build

### 1. Real auction schema in the database
- `auctions` table: id, title, slug, starts_at, ends_at, status, currency, cover_image, description, beneficiary, is_featured.
- `auction_lots` table: id, auction_id, lot_number, title, description, estimate_low, estimate_high, bid_increment, current_bid, leading_user_id, image, sort_order.
- `bids` table: id, lot_id, user_id, amount, created_at, auto_max (optional proxy bidding).
- RLS policies: members can read auctions/lots; authenticated users can place bids; users can read their own bids; admins can manage everything.
- GRANT statements on every new public table.

### 2. Dollywood Foundation auction page
- New public route `/auctions/dollywood-foundation-2026` with its own SEO metadata.
- Page displays event details (Sept 15 2026, Nashville + online), beneficiary statement, and a real lot list pulled from the database.
- Each lot links to a detail page where members can bid.
- A dedicated CTA path to `/checkout/membership` for non-members.

### 3. Member bidding
- Lot detail route under `/_authenticated/auctions/$auctionId/lots/$lotId` so only signed-in members can bid.
- Bidding panel shows current bid, estimate, bid increment, and a "Place Bid" button.
- Server function `placeBid` validates:
  - User is authenticated and has an active membership.
  - Auction is live.
  - Bid amount >= current_bid + bid_increment.
  - Updates `auction_lots.current_bid` and `auction_lots.leading_user_id`, inserts a row into `bids`.
- Outbid notifications trigger via database function / queue.

### 4. Email notifications
- New transactional email templates:
  - `auction-opened` — sent to all active members when an auction status flips to `live`.
  - `outbid` — sent to the previous high bidder when they are outbid.
- A server function `notifyMembersAuctionOpen` queues emails via the existing `enqueue_email` infrastructure.
- A PostgreSQL trigger on `bids` inserts an outbid notification row for the previous leader.

### 5. Conversion tracking
- New `conversion_events` table: id, anonymous_id, user_id, event_type, path, referrer, created_at.
- Track these events client-side with a lightweight `trackEvent` helper:
  - `page_view` on every route.
  - `signup_started`, `signup_completed`, `email_confirmed`, `membership_page_viewed`, `checkout_started`, `checkout_completed`.
- New admin-only dashboard route `/_authenticated/admin/conversions` showing funnel counts.

### 6. Membership dashboard integration
- Dashboard "Active Bids" and "Auctions" sections pull from real `bids` and `auctions` tables instead of static data.
- Add a "Dollywood Benefit" card to the dashboard when the auction is live or upcoming.

## Technical notes
- Use `createServerFn` for all backend logic; no Supabase Edge Functions.
- Keep all new public tables behind RLS with explicit GRANTs.
- Reuse existing email infrastructure (`enqueue_email`, `email_send_log`).
- Continue using the existing $199 Stripe checkout for membership.
- No marketing emails — only event-triggered transactional notifications.

## Testing plan
1. Sign up a test user and confirm email.
2. Complete the $199 membership checkout with Stripe test card `4242 4242 4242 4242`.
3. Visit `/auctions/dollywood-foundation-2026`, confirm lots render.
4. Place a bid on a lot; confirm the bid appears and current bid updates.
5. Use a second test account to outbid the first; confirm the first user receives an outbid email.
6. Flip the auction status to `live` (admin) and confirm members receive the "auction opened" email.
7. Check `/admin/conversions` for funnel counts.

## Open questions for you
1. Do you want the Dollywood auction to use the same $199 membership checkout, or a separate event ticket?
2. Should bidding be open to all active members, or only members who have also registered for this specific auction?
3. For the outbid email, should we reveal the new high bid amount or just say "you've been outbid"?
