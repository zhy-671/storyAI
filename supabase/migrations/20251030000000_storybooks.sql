-- Storybooks storage table: supports guest token and user binding
create table if not exists public.storybooks (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  icon text,
  featured boolean default false,
  bookcontent jsonb, -- optional lightweight content/meta
  data jsonb not null, -- full storybook json
  guest_token text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists storybooks_user_idx on public.storybooks(user_id);
create index if not exists storybooks_guest_idx on public.storybooks(guest_token);

alter table public.storybooks enable row level security;

-- Basic RLS: owners can read；guests由API按guest_token筛选，RLS放行
create policy "read_own_or_guest" on public.storybooks
for select using (
  (auth.uid() is not null and user_id = auth.uid()) or guest_token is not null
);

create policy "insert_any" on public.storybooks
for insert with check (true);

create policy "update_owner" on public.storybooks
for update using (auth.uid() = user_id);


