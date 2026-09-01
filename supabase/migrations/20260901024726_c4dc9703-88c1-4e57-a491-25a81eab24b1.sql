-- Real auction schema for Opus Drinks member bidding.

-- ============================================================
-- 1. auctions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.auctions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text,
  beneficiary text,
  beneficiary_url text,
  location text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','closed')),
  currency text NOT NULL DEFAULT 'USD',
  cover_image text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.auctions TO authenticated;
GRANT SELECT ON public.auctions TO anon;
GRANT ALL ON public.auctions TO service_role;

ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read live or upcoming auctions"
  ON public.auctions FOR SELECT
  TO anon, authenticated
  USING (status IN ('live','upcoming'));

CREATE POLICY "Authenticated can read all auctions"
  ON public.auctions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage auctions"
  ON public.auctions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 2. auction_lots
-- ============================================================
CREATE TABLE IF NOT EXISTS public.auction_lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  lot_number text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  estimate_low_cents integer,
  estimate_high_cents integer,
  starting_bid_cents integer NOT NULL,
  bid_increment_cents integer NOT NULL DEFAULT 1000,
  current_bid_cents integer,
  leading_bidder_id uuid REFERENCES auth.users(id),
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','sold','passed')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.auction_lots TO authenticated;
GRANT SELECT ON public.auction_lots TO anon;
GRANT ALL ON public.auction_lots TO service_role;

ALTER TABLE public.auction_lots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read lots for live/upcoming auctions"
  ON public.auction_lots FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.auctions a
    WHERE a.id = auction_lots.auction_id AND a.status IN ('live','upcoming')
  ));

CREATE POLICY "Authenticated can read all lots"
  ON public.auction_lots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage lots"
  ON public.auction_lots FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 3. bids
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid NOT NULL REFERENCES public.auction_lots(id) ON DELETE CASCADE,
  bidder_id uuid NOT NULL REFERENCES auth.users(id),
  amount_cents integer NOT NULL,
  is_proxy boolean NOT NULL DEFAULT false,
  proxy_max_cents integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.bids TO authenticated;
GRANT ALL ON public.bids TO service_role;

ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bids"
  ON public.bids FOR SELECT
  TO authenticated
  USING (auth.uid() = bidder_id);

CREATE POLICY "Users can place bids as themselves"
  ON public.bids FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Admins can view all bids"
  ON public.bids FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 4. conversion_events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  anonymous_id uuid,
  user_id uuid REFERENCES auth.users(id),
  path text,
  referrer text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT, SELECT ON public.conversion_events TO authenticated;
GRANT INSERT, SELECT ON public.conversion_events TO anon;
GRANT ALL ON public.conversion_events TO service_role;

ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own conversion events"
  ON public.conversion_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can view their own conversion events"
  ON public.conversion_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all conversion events"
  ON public.conversion_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 5. Triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_auctions_updated_at ON public.auctions;
CREATE TRIGGER update_auctions_updated_at
  BEFORE UPDATE ON public.auctions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_auction_lots_updated_at ON public.auction_lots;
CREATE TRIGGER update_auction_lots_updated_at
  BEFORE UPDATE ON public.auction_lots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6. Outbid email trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_outbid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prev_bidder uuid;
  prev_amount integer;
  lot_title text;
  auction_title text;
  recipient_email text;
BEGIN
  -- Only act if there was a previous high bidder who is different from the new one.
  SELECT l.current_bidder_id, l.current_bid_cents, l.title, a.title
    INTO prev_bidder, prev_amount, lot_title, auction_title
    FROM public.auction_lots l
    JOIN public.auctions a ON a.id = l.auction_id
    WHERE l.id = NEW.lot_id;

  IF prev_bidder IS NOT NULL AND prev_bidder != NEW.bidder_id THEN
    SELECT email INTO recipient_email FROM auth.users WHERE id = prev_bidder;
    IF recipient_email IS NOT NULL THEN
      PERFORM public.enqueue_email('transactional_emails', jsonb_build_object(
        'template', 'outbid',
        'to', recipient_email,
        'subject', 'You have been outbid — ' || lot_title,
        'data', jsonb_build_object(
          'auction_title', auction_title,
          'lot_title', lot_title,
          'previous_bid_cents', prev_amount,
          'new_bid_cents', NEW.amount_cents
        )
      ));
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_outbid ON public.bids;
CREATE TRIGGER trg_notify_outbid
  BEFORE INSERT ON public.bids
  FOR EACH ROW EXECUTE FUNCTION public.notify_outbid();

-- ============================================================
-- 7. Seed: Dollywood Foundation benefit auction
-- ============================================================
INSERT INTO public.auctions (
  slug, title, subtitle, description, beneficiary, beneficiary_url,
  location, starts_at, ends_at, status, currency, cover_image, is_featured
)
VALUES (
  'dollywood-foundation-2026',
  'Butterflies & Barrels',
  'The Dolly Parton Benefit',
  'A single-owner Appalachian cellar goes under the hammer for the Dollywood Foundation and Dolly Parton''s Imagination Library. 100% of hammer price benefits the cause. Members-only bidding opens September 15, 2026.',
  'Dollywood Foundation · Imagination Library',
  'https://imaginationlibrary.com/',
  'Nashville, Tennessee · Online',
  '2026-09-15 19:00:00+00',
  '2026-09-15 23:00:00+00',
  'upcoming',
  'USD',
  'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1600&q=80',
  true
)
ON CONFLICT (slug) DO NOTHING;

WITH dolly AS (
  SELECT id FROM public.auctions WHERE slug = 'dollywood-foundation-2026'
)
INSERT INTO public.auction_lots (
  auction_id, lot_number, title, description, image_url,
  estimate_low_cents, estimate_high_cents, starting_bid_cents,
  bid_increment_cents, current_bid_cents, sort_order, status,
  starts_at, ends_at
)
SELECT
  dolly.id,
  lot.lot_number,
  lot.title,
  lot.description,
  lot.image_url,
  lot.estimate_low_cents,
  lot.estimate_high_cents,
  lot.starting_bid_cents,
  lot.bid_increment_cents,
  lot.starting_bid_cents,
  lot.sort_order,
  'upcoming',
  '2026-09-15 19:00:00+00',
  '2026-09-15 23:00:00+00'
FROM dolly,
LATERAL (VALUES
  ('Lot 1', '1995 Screaming Eagle Cabernet Sauvignon · Napa Valley', '1 bottle (750ml). A legendary Napa cult Cabernet from the mid-1990s, professionally stored since release.', 'https://images.unsplash.com/photo-1584916205180-053f79d5a95d?auto=format&fit=crop&w=800&q=80', 450000, 650000, 450000, 10000, 1),
  ('Lot 2', 'Pappy Van Winkle''s Family Reserve 23 Year Old', '1 bottle (750ml). One of the most sought-after American whiskeys, distilled at Buffalo Trace.', 'https://images.unsplash.com/photo-1527281400683-493aae771eb3?auto=format&fit=crop&w=800&q=80', 350000, 550000, 350000, 10000, 2),
  ('Lot 3', '1996 Domaine de la Romanée-Conti · La Tâche Grand Cru', '1 bottle (750ml). A pristine bottle of one of Burgundy''s most coveted vineyards.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', 280000, 420000, 280000, 5000, 3),
  ('Lot 4', '1982 Château Margaux · 1er Cru Classé', '1 magnum (1.5L). A legendary Bordeaux vintage in large format, from a single private cellar.', 'https://images.unsplash.com/photo-1566996533071-2c578080c06e?auto=format&fit=crop&w=800&q=80', 220000, 320000, 220000, 5000, 4),
  ('Lot 5', '2008 Salon Le Mesnil Blanc de Blancs', '1 bottle (750ml). A rare vintage Champagne from a single exceptional harvest.', 'https://images.unsplash.com/photo-1536960353538-5d3b8e365823?auto=format&fit=crop&w=800&q=80', 90000, 140000, 90000, 2500, 5),
  ('Lot 6', '1974 Taylor Fladgate Very Old Single Harvest Port', '1 bottle (750ml). A rare colheita-style Port from a historic declared-quality year.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80', 60000, 100000, 60000, 2500, 6),
  ('Lot 7', '2013 Harlan Estate · Napa Valley', '1 bottle (750ml). A benchmark Napa Cabernet from a celebrated modern vintage.', 'https://images.unsplash.com/photo-1584916205180-053f79d5a95d?auto=format&fit=crop&w=800&q=80', 80000, 130000, 80000, 2500, 7),
  ('Lot 8', '1990 Château d''Yquem · Sauternes 1er Cru Supérieur', '1 bottle (750ml). A legendary Sauternes vintage, lauded for its balance and longevity.', 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=80', 50000, 85000, 50000, 1000, 8)
) AS lot(lot_number, title, description, image_url, estimate_low_cents, estimate_high_cents, starting_bid_cents, bid_increment_cents, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.auction_lots l2
  JOIN public.auctions a2 ON a2.id = l2.auction_id
  WHERE a2.slug = 'dollywood-foundation-2026'
);
