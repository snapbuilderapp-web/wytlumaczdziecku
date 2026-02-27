-- ============================================================
-- Migration: Add English hero image URL column
-- Run in Supabase SQL Editor
-- ============================================================

ALTER TABLE infographics
  ADD COLUMN IF NOT EXISTS hero_image_url_en TEXT;

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'infographics'
  AND column_name = 'hero_image_url_en';
