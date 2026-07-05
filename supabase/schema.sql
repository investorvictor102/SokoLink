-- Run this once in your Supabase project's SQL editor.
-- Project settings > SQL Editor > New query > paste this whole file > Run.

-- 1. Profiles table (one row per signed-up user, extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  region text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone signed in can read basic seller contact info (needed for "Contact seller").
create policy "Profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can only create/update their own profile row.
create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 2. Items table (the listings)
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  price_kes numeric(12, 2) not null check (price_kes >= 0),
  description text not null,
  region text not null,
  image_urls text[] not null default '{}',
  video_url text,
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;

-- Listings are public: anyone can browse, even signed-out visitors.
create policy "Items are readable by everyone"
  on public.items for select
  to anon, authenticated
  using (true);

-- Only signed-in users can post, and only as themselves.
create policy "Users can insert their own items"
  on public.items for insert
  to authenticated
  with check (auth.uid() = seller_id);

create policy "Users can update their own items"
  on public.items for update
  to authenticated
  using (auth.uid() = seller_id);

create policy "Users can delete their own items"
  on public.items for delete
  to authenticated
  using (auth.uid() = seller_id);

create index if not exists items_created_at_idx on public.items (created_at desc);
create index if not exists items_region_idx on public.items (region);

-- 3. Storage buckets for photos and video
insert into storage.buckets (id, name, public, file_size_limit)
values ('item-images', 'item-images', true, 5242880) -- 5MB per image
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit)
values ('item-videos', 'item-videos', true, 5242880) -- 5MB hard cap per video
on conflict (id) do nothing;

create policy "Public read access to item images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'item-images');

create policy "Authenticated users can upload item images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'item-images');

create policy "Public read access to item videos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'item-videos');

create policy "Authenticated users can upload item videos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'item-videos');
