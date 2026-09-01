DELETE FROM public.bids WHERE lot_id IN (SELECT id FROM public.auction_lots WHERE sort_order > 1);
DELETE FROM public.auction_lots WHERE sort_order > 1;

UPDATE public.auction_lots
SET lot_number = 'Lot 1',
    title = 'Veuve Monsigny Champagne Brut',
    description = '1 bottle (750ml). The signature Veuve Monsigny Brut — a crisp, citrus-and-brioche Champagne — offered as the single lot of the Butterflies & Barrels benefit. 100% of the hammer price supports the Dollywood Foundation and Dolly Parton''s Imagination Library.',
    image_url = 'https://images.unsplash.com/photo-1536960353538-5d3b8e365823?auto=format&fit=crop&w=1200&q=80',
    estimate_low_cents = 25000,
    estimate_high_cents = 60000,
    starting_bid_cents = 25000,
    current_bid_cents = GREATEST(COALESCE(current_bid_cents, 0), 25000),
    bid_increment_cents = 2500,
    sort_order = 1
WHERE sort_order = 1;

UPDATE public.auctions
SET subtitle = 'The Dolly Parton Benefit',
    description = 'A single-lot benefit auction: one bottle of Veuve Monsigny Champagne Brut goes under the hammer for the Dollywood Foundation and Dolly Parton''s Imagination Library. 100% of hammer price to the cause.'
WHERE slug = 'dollywood-foundation-2026';