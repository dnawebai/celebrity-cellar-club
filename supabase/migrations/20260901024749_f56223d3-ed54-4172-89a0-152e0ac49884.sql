-- Secure the outbid notification function.
-- It is a SECURITY DEFINER trigger helper and should only run via the trigger.
REVOKE EXECUTE ON FUNCTION public.notify_outbid() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_outbid() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_outbid() FROM anon;

-- Ensure the trigger owner (postgres) can still execute it.
-- Triggers run with the privileges of the function owner, so direct grants
-- are not required for trigger execution, but we keep this explicit for clarity.
GRANT EXECUTE ON FUNCTION public.notify_outbid() TO postgres;

-- Pin search_path explicitly (defense in depth).
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
