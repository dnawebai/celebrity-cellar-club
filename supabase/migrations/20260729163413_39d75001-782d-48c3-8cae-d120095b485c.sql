ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;
UPDATE public.site_settings SET is_public = true WHERE key = 'member_counter_baseline';

DROP POLICY IF EXISTS "Anyone can read settings" ON public.site_settings;
CREATE POLICY "Public can read public settings"
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (is_public = true);
CREATE POLICY "Admins can read all settings"
  ON public.site_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can assign roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can change roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can remove roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));