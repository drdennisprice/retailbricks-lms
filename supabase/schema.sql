-- ============================================================
-- RetailBricks LMS — Supabase Schema
-- Run in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'student',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Courses ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           TEXT UNIQUE NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  price_aud      NUMERIC(10,2) NOT NULL DEFAULT 97.00,
  content_path   TEXT,            -- path in Supabase Storage bucket "courses"
  external_url   TEXT,            -- if set, enrolled students are redirected here
  thumbnail_url  TEXT,
  published      BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Enrolments ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enrolments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id         UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ── RLS Policies ─────────────────────────────────────────────
-- Using service_role for admin operations; anon/authenticated for reads.

ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolments ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies (clean slate)
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Profiles: users can read/update their own row; service_role bypasses RLS
CREATE POLICY "profiles_own_select" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Courses: authenticated users can read published courses
CREATE POLICY "courses_published_select" ON public.courses
  FOR SELECT USING (published = TRUE);

-- Enrolments: users can read their own enrolments
CREATE POLICY "enrolments_own_select" ON public.enrolments
  FOR SELECT USING (auth.uid() = user_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('courses', 'courses', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: enrolled users can download their course
CREATE POLICY "course_download" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'courses' AND
    EXISTS (
      SELECT 1 FROM public.enrolments e
      JOIN public.courses c ON c.id = e.course_id
      WHERE e.user_id = auth.uid()
        AND (storage.objects.name LIKE c.slug || '/%')
    )
  );
