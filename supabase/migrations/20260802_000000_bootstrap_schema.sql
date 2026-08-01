CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  nationality TEXT,
  passport_country TEXT,
  passport_number TEXT,
  passport_expiry DATE,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  dark_mode BOOLEAN NOT NULL DEFAULT false,
  language TEXT NOT NULL DEFAULT 'en',
  currency TEXT NOT NULL DEFAULT 'USD',
  notify_passport_expiry BOOLEAN NOT NULL DEFAULT true,
  notify_visa BOOLEAN NOT NULL DEFAULT true,
  notify_flight BOOLEAN NOT NULL DEFAULT true,
  notify_packing BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings
  ALTER COLUMN dark_mode SET DEFAULT false,
  ALTER COLUMN language SET DEFAULT 'en',
  ALTER COLUMN currency SET DEFAULT 'USD',
  ALTER COLUMN notify_passport_expiry SET DEFAULT true,
  ALTER COLUMN notify_visa SET DEFAULT true,
  ALTER COLUMN notify_flight SET DEFAULT true,
  ALTER COLUMN notify_packing SET DEFAULT true,
  ALTER COLUMN updated_at SET DEFAULT now();

CREATE TABLE IF NOT EXISTS public.saved_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  destination_code TEXT,
  passport_code TEXT,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  budget JSONB NOT NULL DEFAULT '{}'::jsonb,
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_trips
  ALTER COLUMN budget SET DEFAULT '{}'::jsonb,
  ALTER COLUMN checklist SET DEFAULT '[]'::jsonb,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

CREATE TABLE IF NOT EXISTS public.favorite_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, country_code)
);

ALTER TABLE public.favorite_destinations
  ALTER COLUMN created_at SET DEFAULT now();

CREATE TABLE IF NOT EXISTS public.visa_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  passport_code TEXT NOT NULL,
  destination_code TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.visa_history
  ALTER COLUMN created_at SET DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_saved_trips_user ON public.saved_trips(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visa_history_user ON public.visa_history(user_id, created_at DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own profile select" ON public.profiles;
DROP POLICY IF EXISTS "own profile insert" ON public.profiles;
DROP POLICY IF EXISTS "own profile update" ON public.profiles;
DROP POLICY IF EXISTS "own profile delete" ON public.profiles;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile delete" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "own settings all" ON public.user_settings;
CREATE POLICY "own settings all" ON public.user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own trips all" ON public.saved_trips;
CREATE POLICY "own trips all" ON public.saved_trips FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own favorites all" ON public.favorite_destinations;
CREATE POLICY "own favorites all" ON public.favorite_destinations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own history all" ON public.visa_history;
CREATE POLICY "own history all" ON public.visa_history FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_trips TO authenticated;
GRANT ALL ON public.saved_trips TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorite_destinations TO authenticated;
GRANT ALL ON public.favorite_destinations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visa_history TO authenticated;
GRANT ALL ON public.visa_history TO service_role;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
DROP TRIGGER IF EXISTS trg_settings_updated ON public.user_settings;
DROP TRIGGER IF EXISTS trg_trips_updated ON public.saved_trips;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_trips_updated BEFORE UPDATE ON public.saved_trips FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', false
WHERE NOT EXISTS (
  SELECT 1
  FROM storage.buckets
  WHERE id = 'avatars'
);

DROP POLICY IF EXISTS "avatars own select" ON storage.objects;
DROP POLICY IF EXISTS "avatars own insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars own update" ON storage.objects;
DROP POLICY IF EXISTS "avatars own delete" ON storage.objects;
CREATE POLICY "avatars own select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars own insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars own update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars own delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);