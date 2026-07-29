ALTER TABLE public.memberships ALTER COLUMN price_cents SET DEFAULT 19900;

UPDATE public.memberships SET price_cents = 19900 WHERE status = 'pending' AND price_cents = 9900;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'applicant');
  INSERT INTO public.memberships (user_id, status, billing_cycle, price_cents)
  VALUES (NEW.id, 'pending', 'one_time', 19900);
  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;