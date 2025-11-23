-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.users
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger to create public user on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ACTIVITIES TABLE
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  cover_image_url text,
  date date not null,
  start_time time not null,
  location text not null,
  price_text text not null, -- e.g. "€5 (leden) / €7 (niet-leden)"
  max_participants int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.activities enable row level security;

-- Policies for activities
create policy "Activities are viewable by everyone" on public.activities
  for select using (true);

create policy "Activities are insertable by admins" on public.activities
  for insert with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Activities are updatable by admins" on public.activities
  for update using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Activities are deletable by admins" on public.activities
  for delete using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );


-- REGISTRATIONS TABLE
create table public.registrations (
  id uuid default uuid_generate_v4() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(activity_id, user_id)
);

-- Enable RLS
alter table public.registrations enable row level security;

-- Policies for registrations
create policy "Users can view their own registrations" on public.registrations
  for select using (auth.uid() = user_id);

create policy "Admins can view all registrations" on public.registrations
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can register themselves" on public.registrations
  for insert with check (auth.uid() = user_id);

create policy "Users can unregister themselves" on public.registrations
  for delete using (auth.uid() = user_id);


-- ACTIVITY PHOTOS TABLE (for gallery)
create table public.activity_photos (
  id uuid default uuid_generate_v4() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.activity_photos enable row level security;

-- Policies for photos
create policy "Photos are viewable by everyone" on public.activity_photos
  for select using (true);

create policy "Photos are insertable by admins" on public.activity_photos
  for insert with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Photos are deletable by admins" on public.activity_photos
  for delete using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- STORAGE POLICIES (Conceptual - must be applied in Storage dashboard or via SQL if supported)
-- Bucket: activity_covers
-- Public: true
-- Policy: Give admin full access, public read access.

-- Bucket: activity_photos
-- Public: true
-- Policy: Give admin full access, public read access.
