-- Generate slugs for existing storybooks that don't have slugs yet
-- Run this after adding the slug column

-- Function to generate a simple slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title(title_text TEXT)
RETURNS TEXT AS $$
BEGIN
  IF title_text IS NULL OR title_text = '' THEN
    RETURN NULL;
  END IF;
  
  -- Convert to lowercase and replace spaces/special chars with hyphens
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title_text, '[^a-zA-Z0-9\u4e00-\u9fff\s]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Generate slugs for existing records
UPDATE public.storybooks
SET slug = CASE
  WHEN slug IS NULL OR slug = '' THEN
    generate_slug_from_title(title) || '-' || SUBSTRING(id::text, 1, 8)
  ELSE
    slug
END
WHERE is_admin = 1;

-- Clean up: Remove the function if you don't need it anymore
-- DROP FUNCTION IF EXISTS generate_slug_from_title(TEXT);

