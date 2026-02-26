-- ============================================================
-- Wytłumacz Dziecku — Complete Database Schema
-- Run this entire file in Supabase SQL Editor (once, top to bottom)
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE throughout
-- ============================================================


-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- Fuzzy text matching (Polish typos)
CREATE EXTENSION IF NOT EXISTS unaccent;    -- Diacritic stripping (ą→a, ę→e, etc.)


-- ============================================================
-- 2. CUSTOM POLISH FULL-TEXT SEARCH CONFIG
-- Combines unaccent + simple stemmer for Polish.
-- Makes search for "dinozaur" also match "Dinozaury", "dinozaurów".
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_ts_config WHERE cfgname = 'polish_unaccent'
  ) THEN
    CREATE TEXT SEARCH CONFIGURATION polish_unaccent (COPY = pg_catalog.simple);
  END IF;
END $$;

ALTER TEXT SEARCH CONFIGURATION polish_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple;


-- ============================================================
-- 3. ENUM TYPES
-- ============================================================

DO $$ BEGIN
  CREATE TYPE infographic_status AS ENUM (
    'draft',      -- AI generated, not yet reviewed
    'in_review',  -- In human review queue
    'approved',   -- Approved, pending publish
    'published',  -- Live on site
    'rejected'    -- Will not publish
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE age_group AS ENUM ('under13', '13plus', 'both');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE emotional_weight AS ENUM ('light', 'medium', 'heavy');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE reading_level AS ENUM ('easy', 'standard', 'advanced');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE queue_status AS ENUM ('pending', 'generating', 'generated', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ============================================================
-- 4. TABLES
-- ============================================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id            TEXT PRIMARY KEY,
  name_pl       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  color_hex     TEXT NOT NULL,
  icon_emoji    TEXT NOT NULL,
  description_pl TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Infographics (core content table)
CREATE TABLE IF NOT EXISTS infographics (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT UNIQUE NOT NULL,
  title_pl             TEXT NOT NULL,
  title_en             TEXT,
  category_id          TEXT NOT NULL REFERENCES categories(id),
  age_group            age_group NOT NULL DEFAULT 'both',
  content_under13      JSONB,
  content_13plus       JSONB,
  hero_image_url       TEXT,
  status               infographic_status NOT NULL DEFAULT 'draft',
  review_notes         TEXT,
  view_count           INTEGER NOT NULL DEFAULT 0,
  like_count           INTEGER NOT NULL DEFAULT 0,
  emotional_weight     emotional_weight NOT NULL DEFAULT 'light',
  reading_level        reading_level NOT NULL DEFAULT 'standard',
  tags                 TEXT[] NOT NULL DEFAULT '{}',
  ai_draft             BOOLEAN NOT NULL DEFAULT TRUE,
  expert_reviewed      BOOLEAN NOT NULL DEFAULT FALSE,
  expert_reviewer_name TEXT,
  search_vector        TSVECTOR,   -- maintained by trigger below (GENERATED AS can't use custom FTS config)
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at         TIMESTAMPTZ
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  infographic_id UUID NOT NULL REFERENCES infographics(id) ON DELETE CASCADE,
  age_group      age_group NOT NULL,
  question_pl    TEXT NOT NULL,
  options        JSONB NOT NULL,   -- [{text: string, correct: boolean}]
  explanation_pl TEXT NOT NULL,
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily questions (one per day)
CREATE TABLE IF NOT EXISTS daily_questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  infographic_id UUID NOT NULL REFERENCES infographics(id),
  featured_date  DATE UNIQUE NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Likes (anonymous, deduplicated client-side via localStorage)
CREATE TABLE IF NOT EXISTS likes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  infographic_id UUID NOT NULL REFERENCES infographics(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI generation queue (for user-requested topics, Phase 2)
CREATE TABLE IF NOT EXISTS generation_queue (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_pl       TEXT NOT NULL,
  topic_en       TEXT,
  status         queue_status NOT NULL DEFAULT 'pending',
  attempts       INTEGER NOT NULL DEFAULT 0,
  error_message  TEXT,
  infographic_id UUID REFERENCES infographics(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 5. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS infographics_search_idx
  ON infographics USING GIN(search_vector);

CREATE INDEX IF NOT EXISTS infographics_title_trgm_idx
  ON infographics USING GIN(title_pl gin_trgm_ops);

CREATE INDEX IF NOT EXISTS infographics_category_idx
  ON infographics(category_id);

CREATE INDEX IF NOT EXISTS infographics_status_idx
  ON infographics(status);

CREATE INDEX IF NOT EXISTS infographics_published_idx
  ON infographics(published_at DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS infographics_popular_idx
  ON infographics(like_count DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS quiz_infographic_idx
  ON quiz_questions(infographic_id, age_group);

CREATE INDEX IF NOT EXISTS daily_questions_date_idx
  ON daily_questions(featured_date DESC);

CREATE INDEX IF NOT EXISTS likes_infographic_idx
  ON likes(infographic_id);


-- ============================================================
-- 6. TRIGGERS
-- ============================================================

-- Maintain search_vector using polish_unaccent config
-- (GENERATED ALWAYS AS cannot use custom FTS configs — must use a trigger)
CREATE OR REPLACE FUNCTION infographics_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'polish_unaccent',
    coalesce(NEW.title_pl, '') || ' ' ||
    coalesce(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS infographics_search_vector ON infographics;
CREATE TRIGGER infographics_search_vector
  BEFORE INSERT OR UPDATE OF title_pl, tags
  ON infographics
  FOR EACH ROW EXECUTE FUNCTION infographics_search_vector_update();

-- Auto-update updated_at on infographics
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS infographics_updated_at ON infographics;
CREATE TRIGGER infographics_updated_at
  BEFORE UPDATE ON infographics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS generation_queue_updated_at ON generation_queue;
CREATE TRIGGER generation_queue_updated_at
  BEFORE UPDATE ON generation_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 7. FUNCTIONS
-- ============================================================

-- Atomic like increment (bypasses RLS, safe)
CREATE OR REPLACE FUNCTION increment_like(target_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE infographics
  SET like_count = like_count + 1
  WHERE id = target_id AND status = 'published';

  INSERT INTO likes (infographic_id) VALUES (target_id);
$$;

-- Atomic view count increment
CREATE OR REPLACE FUNCTION increment_view(target_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE infographics
  SET view_count = view_count + 1
  WHERE id = target_id AND status = 'published';
$$;

-- Fuzzy autocomplete using pg_trgm
CREATE OR REPLACE FUNCTION autocomplete_topics(
  query text,
  result_limit int DEFAULT 6
)
RETURNS TABLE(slug text, title_pl text, category_id text)
LANGUAGE sql
STABLE
AS $$
  SELECT slug, title_pl, category_id
  FROM infographics
  WHERE status = 'published'
    AND (
      title_pl ILIKE '%' || query || '%'
      OR similarity(title_pl, query) > 0.15
    )
  ORDER BY
    CASE WHEN title_pl ILIKE query || '%' THEN 0 ELSE 1 END,
    similarity(title_pl, query) DESC,
    like_count DESC
  LIMIT result_limit;
$$;


-- ============================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE infographics    ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_queue ENABLE ROW LEVEL SECURITY;

-- Anyone can read published infographics
DROP POLICY IF EXISTS "public_read_published" ON infographics;
CREATE POLICY "public_read_published" ON infographics
  FOR SELECT USING (status = 'published');

-- Anyone can read categories
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories
  FOR SELECT USING (true);

-- Anyone can read quiz questions for published infographics
DROP POLICY IF EXISTS "public_read_quiz" ON quiz_questions;
CREATE POLICY "public_read_quiz" ON quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM infographics i
      WHERE i.id = infographic_id AND i.status = 'published'
    )
  );

-- Anyone can read daily questions
DROP POLICY IF EXISTS "public_read_daily" ON daily_questions;
CREATE POLICY "public_read_daily" ON daily_questions
  FOR SELECT USING (true);

-- Anyone can insert likes (no auth required — deduplicated client-side)
DROP POLICY IF EXISTS "public_insert_likes" ON likes;
CREATE POLICY "public_insert_likes" ON likes
  FOR INSERT WITH CHECK (true);

-- No public access to generation queue
-- (service role key bypasses RLS automatically)


-- ============================================================
-- 9. SEED: CATEGORIES
-- ============================================================

INSERT INTO categories (id, name_pl, name_en, color_hex, icon_emoji, display_order)
VALUES
  ('science',     'Nauka',          'Science',     '#0D9488', '🔬', 1),
  ('history',     'Historia',       'History',     '#B45309', '🏛️', 2),
  ('tech',        'Technologia',    'Technology',  '#2563EB', '📱', 3),
  ('nature',      'Przyroda',       'Nature',      '#16A34A', '🌿', 4),
  ('body',        'Ciało i zdrowie','Body',         '#E11D48', '🫀', 5),
  ('society',     'Społeczeństwo',  'Society',     '#7C3AED', '🏘️', 6),
  ('space',       'Kosmos',         'Space',       '#1E40AF', '🔭', 7),
  ('emotions',    'Emocje',         'Emotions',    '#EA580C', '💛', 8),
  ('philosophy',  'Filozofia',      'Philosophy',  '#4338CA', '🤔', 9)
ON CONFLICT (id) DO UPDATE
  SET name_pl = EXCLUDED.name_pl,
      name_en = EXCLUDED.name_en,
      color_hex = EXCLUDED.color_hex,
      icon_emoji = EXCLUDED.icon_emoji,
      display_order = EXCLUDED.display_order;


-- ============================================================
-- DONE ✓
-- Schema created. Next steps:
-- 1. Copy ANON KEY and SERVICE_ROLE_KEY from Project Settings → API
-- 2. Copy PROJECT URL
-- 3. Add both to explaintomykidapp/.env.local
-- 4. Run: npm run dev
-- ============================================================
