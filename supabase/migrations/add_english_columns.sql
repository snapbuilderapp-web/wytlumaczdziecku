-- ============================================================
-- Migration: Add English language support columns
-- Run in Supabase SQL Editor
-- ============================================================

-- Add English content columns
ALTER TABLE infographics
  ADD COLUMN IF NOT EXISTS content_under13_en JSONB,
  ADD COLUMN IF NOT EXISTS content_13plus_en  JSONB,
  ADD COLUMN IF NOT EXISTS slug_en            TEXT UNIQUE;

-- English full-text search vector (generated column)
ALTER TABLE infographics
  ADD COLUMN IF NOT EXISTS search_vector_en TSVECTOR
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title_en, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_infographics_search_vector_en
  ON infographics USING GIN (search_vector_en);

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'infographics'
  AND column_name IN ('content_under13_en', 'content_13plus_en', 'slug_en', 'search_vector_en')
ORDER BY column_name;
