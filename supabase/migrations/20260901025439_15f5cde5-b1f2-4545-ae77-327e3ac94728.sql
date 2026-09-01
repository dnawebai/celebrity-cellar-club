CREATE OR REPLACE FUNCTION public.get_conversion_funnel()
RETURNS TABLE (
  event_type text,
  total bigint,
  unique_users bigint,
  last_7_days bigint,
  last_30_days bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ce.event_type,
    COUNT(*)::bigint AS total,
    COUNT(DISTINCT ce.user_id)::bigint AS unique_users,
    COUNT(*) FILTER (WHERE ce.created_at >= now() - interval '7 days')::bigint AS last_7_days,
    COUNT(*) FILTER (WHERE ce.created_at >= now() - interval '30 days')::bigint AS last_30_days
  FROM public.conversion_events ce
  WHERE ce.created_at >= now() - interval '90 days'
  GROUP BY ce.event_type
  ORDER BY
    CASE ce.event_type
      WHEN 'auth_page_viewed' THEN 1
      WHEN 'sign_up_initiated' THEN 2
      WHEN 'email_confirmation_sent' THEN 3
      WHEN 'email_confirmed' THEN 4
      WHEN 'membership_page_viewed' THEN 5
      WHEN 'membership_purchased' THEN 6
      ELSE 7
    END;
$$;

REVOKE ALL ON FUNCTION public.get_conversion_funnel() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_conversion_funnel() TO authenticated;
