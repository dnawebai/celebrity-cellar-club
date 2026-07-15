-- Extend membership_status enum
ALTER TYPE public.membership_status ADD VALUE IF NOT EXISTS 'expired';
ALTER TYPE public.membership_status ADD VALUE IF NOT EXISTS 'refunded';
ALTER TYPE public.membership_status ADD VALUE IF NOT EXISTS 'disputed';
ALTER TYPE public.membership_status ADD VALUE IF NOT EXISTS 'payment_failed';

-- Reminder tracking column
ALTER TABLE public.memberships
  ADD COLUMN IF NOT EXISTS renewal_reminder_sent_at timestamptz;

-- Nightly expire job (SQL-only, no cron dependency here — cron scheduled separately)
CREATE OR REPLACE FUNCTION public.expire_lapsed_memberships()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.memberships
     SET status = 'expired', updated_at = now()
   WHERE status = 'active'
     AND current_period_end IS NOT NULL
     AND current_period_end < now();
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.expire_lapsed_memberships() FROM PUBLIC, anon, authenticated;

-- pg_cron schedule
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Unschedule if already exists (idempotent)
DO $$
BEGIN
  PERFORM cron.unschedule('expire-lapsed-memberships');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'expire-lapsed-memberships',
  '17 3 * * *',
  $$SELECT public.expire_lapsed_memberships();$$
);