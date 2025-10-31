-- ============================================
-- UPDATE RLS POLICIES FOR ANONYMOUS ACCESS
-- ============================================
-- This script updates Row Level Security policies to allow
-- unauthenticated (anonymous) users to read public content
-- Execute this in your Supabase SQL Editor

-- ============================================
-- DROP OLD POLICIES
-- ============================================

-- Drop old anime policies
DROP POLICY IF EXISTS "Anyone can view animes" ON public.animes;

-- Drop old season policies
DROP POLICY IF EXISTS "Anyone can view seasons" ON public.seasons;

-- Drop old episode policies
DROP POLICY IF EXISTS "Anyone can view episodes" ON public.episodes;

-- Drop old vocabulary list policies
DROP POLICY IF EXISTS "Users can view published vocabulary lists" ON public.vocabulary_lists;

-- Drop old vocabulary words policies
DROP POLICY IF EXISTS "Users can view vocabulary words from published lists" ON public.vocabulary_words;

-- ============================================
-- CREATE NEW POLICIES WITH ANONYMOUS ACCESS
-- ============================================

-- Animes table policies (public read for everyone, admin write)
CREATE POLICY "Anyone can view animes"
  ON public.animes FOR SELECT
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

-- Seasons table policies (public read for everyone, admin write)
CREATE POLICY "Anyone can view seasons"
  ON public.seasons FOR SELECT
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

-- Episodes table policies (public read for everyone, admin write)
CREATE POLICY "Anyone can view episodes"
  ON public.episodes FOR SELECT
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

-- Vocabulary lists policies (everyone can see published, admins see all)
CREATE POLICY "Anyone can view published vocabulary lists"
  ON public.vocabulary_lists FOR SELECT
  USING (
    is_published = true OR
    (
      auth.uid() IS NOT NULL AND
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
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

-- Vocabulary words policies (follows parent list visibility for everyone)
CREATE POLICY "Anyone can view vocabulary words from published lists"
  ON public.vocabulary_words FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vocabulary_lists
      WHERE id = vocabulary_list_id AND (
        is_published = true OR
        (
          auth.uid() IS NOT NULL AND
          EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
          )
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

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the policies were updated correctly:
-- SELECT schemaname, tablename, policyname, roles, cmd 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;

