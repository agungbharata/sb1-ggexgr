-- Update existing profiles table if needed
alter table if exists profiles 
  add column if not exists email text,
  add column if not exists username text unique,
  add column if not exists full_name text,
  add column if not exists avatar_url text,
  add column if not exists updated_at timestamp with time zone;

-- Add constraint if it doesn't exist
do $$ 
begin 
  if not exists (
    select 1 from pg_constraint where conname = 'username_length'
  ) then
    alter table profiles 
    add constraint username_length check (char_length(username) >= 3);
  end if;
end $$;

-- Set up Row Level Security (RLS) if not already enabled
alter table if exists profiles enable row level security;

-- Drop existing policies if any
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Create or replace policies
create policy "Public profiles are viewable by everyone" 
  on profiles for select 
  using ( true );

create policy "Users can insert their own profile" 
  on profiles for insert 
  with check ( auth.uid() = id );

create policy "Users can update their own profile" 
  on profiles for update 
  using ( auth.uid() = id );

-- Create storage bucket for avatars if it doesn't exist
insert into storage.buckets (id, name, public)
select 'avatars', 'avatars', true
where not exists (
  select 1 from storage.buckets where id = 'avatars'
);

-- Drop existing storage policies if any
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Anyone can upload an avatar" on storage.objects;
drop policy if exists "Anyone can update their own avatar" on storage.objects;

-- Create or replace storage policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update their own avatar"
  on storage.objects for update
  using ( bucket_id = 'avatars' AND auth.uid() = owner );
