
-- ===== ENUMS =====
CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'applicant');
CREATE TYPE public.membership_status AS ENUM ('pending', 'active', 'past_due', 'cancelled');
CREATE TYPE public.billing_cycle AS ENUM ('one_time', 'monthly', 'annual');
CREATE TYPE public.verification_status AS ENUM ('submitted', 'approved', 'rejected');

-- ===== updated_at helper =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  date_of_birth DATE,
  country TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Age validation (21+) via trigger (CHECK cannot use now())
CREATE OR REPLACE FUNCTION public.validate_profile_age()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.date_of_birth IS NOT NULL AND NEW.date_of_birth > (CURRENT_DATE - INTERVAL '21 years') THEN
    RAISE EXCEPTION 'Members must be at least 21 years old';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER validate_profile_age_trg BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_profile_age();

-- ===== USER ROLES =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies (need user_roles + has_role in place first)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ===== MEMBERSHIPS =====
CREATE TABLE public.memberships (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'founding',
  status public.membership_status NOT NULL DEFAULT 'pending',
  billing_cycle public.billing_cycle NOT NULL DEFAULT 'one_time',
  price_cents INTEGER NOT NULL DEFAULT 9900,
  currency TEXT NOT NULL DEFAULT 'usd',
  started_at TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_checkout_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.memberships TO authenticated;
GRANT ALL ON public.memberships TO service_role;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Users can view own membership" ON public.memberships
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own membership" ON public.memberships
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own membership billing choice" ON public.memberships
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all memberships" ON public.memberships
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all memberships" ON public.memberships
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ===== ID VERIFICATIONS =====
CREATE TABLE public.id_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  doc_ref TEXT,
  residence_doc_ref TEXT,
  status public.verification_status NOT NULL DEFAULT 'submitted',
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX id_verifications_user_id_idx ON public.id_verifications(user_id);
GRANT SELECT, INSERT, UPDATE ON public.id_verifications TO authenticated;
GRANT ALL ON public.id_verifications TO service_role;
ALTER TABLE public.id_verifications ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_id_verifications_updated_at BEFORE UPDATE ON public.id_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Users can view own verifications" ON public.id_verifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own verifications" ON public.id_verifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all verifications" ON public.id_verifications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all verifications" ON public.id_verifications
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ===== AUCTION SOURCE LOG (admin-only compliance) =====
CREATE TABLE public.auction_source_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id TEXT NOT NULL,
  lot_id TEXT,
  source_house TEXT NOT NULL,
  source_url TEXT,
  viewed_by UUID REFERENCES auth.users(id),
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX auction_source_log_house_idx ON public.auction_source_log(source_house);
GRANT SELECT, INSERT ON public.auction_source_log TO authenticated;
GRANT ALL ON public.auction_source_log TO service_role;
ALTER TABLE public.auction_source_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can insert log" ON public.auction_source_log
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = viewed_by);
CREATE POLICY "Admins can read log" ON public.auction_source_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ===== SITE SETTINGS =====
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can upsert settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (key, value) VALUES
  ('member_counter_baseline', '{"count": 1240}'::jsonb);

-- ===== AUTO-CREATE profile/role/membership on signup =====
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
  VALUES (NEW.id, 'pending', 'one_time', 9900);
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
