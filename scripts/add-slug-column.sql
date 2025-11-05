-- Quick fix: Add slug column to storybooks table
-- Run this in Supabase SQL Editor if the slug column doesn't exist yet

-- Add slug column if it doesn't exist
ALTER TABLE public.storybooks 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index for slug field (allowing nulls)
CREATE UNIQUE INDEX IF NOT EXISTS storybooks_slug_idx 
ON public.storybooks(slug) 
WHERE slug IS NOT NULL;

-- Create index for slug field for better query performance
CREATE INDEX IF NOT EXISTS storybooks_slug_query_idx 
ON public.storybooks(slug);

-- Generate slugs for existing records (optional)
-- UPDATE public.storybooks 
-- SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9\u4e00-\u9fff]+', '-', 'g'))
-- WHERE slug IS NULL AND title IS NOT NULL;

