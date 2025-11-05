-- Add slug field to storybooks table for URL-friendly paths
alter table public.storybooks 
add column if not exists slug text;

-- Create unique index for slug field
create unique index if not exists storybooks_slug_idx on public.storybooks(slug) where slug is not null;

-- Create index for slug field for better query performance
create index if not exists storybooks_slug_query_idx on public.storybooks(slug);

