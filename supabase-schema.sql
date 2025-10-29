-- ============================================
-- JP VOCAB DATABASE SCHEMA
-- ============================================
-- This SQL script creates all necessary tables for the Japanese Vocabulary Learning App
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_ad_free BOOLEAN DEFAULT FALSE,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ANIMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.animes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. SEASONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anime_id UUID NOT NULL REFERENCES public.animes(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(anime_id, season_number)
);

-- ============================================
-- 4. EPISODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, episode_number)
);

-- ============================================
-- 5. VOCABULARY_LISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.vocabulary_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  csv_filename TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.users(id),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. VOCABULARY_WORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.vocabulary_words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vocabulary_list_id UUID NOT NULL REFERENCES public.vocabulary_lists(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  reading TEXT NOT NULL,
  meaning TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. QUIZ_ATTEMPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vocabulary_list_id UUID REFERENCES public.vocabulary_lists(id) ON DELETE SET NULL,
  quiz_type TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_seasons_anime_id ON public.seasons(anime_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON public.episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_lists_episode_id ON public.vocabulary_lists(episode_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_lists_uploaded_by ON public.vocabulary_lists(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_vocabulary_words_list_id ON public.vocabulary_words(vocabulary_list_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_animes
  BEFORE UPDATE ON public.animes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_episodes
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_vocabulary_lists
  BEFORE UPDATE ON public.vocabulary_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_vocabulary_words
  BEFORE UPDATE ON public.vocabulary_words
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Animes table policies (public read, admin write)
CREATE POLICY "Anyone can view animes"
  ON public.animes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert animes"
  ON public.animes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update animes"
  ON public.animes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete animes"
  ON public.animes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seasons table policies (public read, admin write)
CREATE POLICY "Anyone can view seasons"
  ON public.seasons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage seasons"
  ON public.seasons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Episodes table policies (public read, admin write)
CREATE POLICY "Anyone can view episodes"
  ON public.episodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage episodes"
  ON public.episodes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Vocabulary lists policies (users can only see published, admins see all)
CREATE POLICY "Users can view published vocabulary lists"
  ON public.vocabulary_lists FOR SELECT
  TO authenticated
  USING (
    is_published = true OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage vocabulary lists"
  ON public.vocabulary_lists FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Vocabulary words policies (follows parent list visibility)
CREATE POLICY "Users can view vocabulary words from published lists"
  ON public.vocabulary_words FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vocabulary_lists
      WHERE id = vocabulary_list_id AND (
        is_published = true OR
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Admins can manage vocabulary words"
  ON public.vocabulary_words FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Quiz attempts policies (users can only see their own)
CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz attempts"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FUNCTION TO CREATE USER PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================
-- Uncomment below to add sample data

/*
-- Insert sample anime
INSERT INTO public.animes (name, slug) VALUES
  ('Attack on Titan', 'attack-on-titan'),
  ('Death Note', 'death-note'),
  ('My Hero Academia', 'my-hero-academia');

-- Insert sample seasons (for Attack on Titan)
INSERT INTO public.seasons (anime_id, season_number)
SELECT id, 1 FROM public.animes WHERE slug = 'attack-on-titan';

-- Insert sample episodes
INSERT INTO public.episodes (season_id, episode_number)
SELECT id, 1 FROM public.seasons WHERE season_number = 1 
  AND anime_id = (SELECT id FROM public.animes WHERE slug = 'attack-on-titan');
*/

