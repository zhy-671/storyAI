-- Add is_admin field to storybooks table
-- 0 = normal user, 1 = admin user
alter table public.storybooks 
add column if not exists is_admin smallint default 0;

-- Create index for is_admin field for better query performance
create index if not exists storybooks_is_admin_idx on public.storybooks(is_admin);

-- Update RLS policy to allow reading admin-published storybooks (is_admin = 1)
drop policy if exists "read_own_or_guest" on public.storybooks;
create policy "read_own_or_guest" on public.storybooks
for select using (
  is_admin = 1 
  or (auth.uid() is not null and user_id = auth.uid()) 
  or guest_token is not null
);

