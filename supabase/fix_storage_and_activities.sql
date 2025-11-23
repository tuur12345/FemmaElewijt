-- Update Activities Policies to use is_admin()
drop policy "Activities are insertable by admins" on public.activities;
drop policy "Activities are updatable by admins" on public.activities;
drop policy "Activities are deletable by admins" on public.activities;

create policy "Activities are insertable by admins" on public.activities
  for insert with check ( public.is_admin() );

create policy "Activities are updatable by admins" on public.activities
  for update using ( public.is_admin() );

create policy "Activities are deletable by admins" on public.activities
  for delete using ( public.is_admin() );

-- Update Activity Photos Policies to use is_admin()
drop policy "Photos are insertable by admins" on public.activity_photos;
drop policy "Photos are deletable by admins" on public.activity_photos;

create policy "Photos are insertable by admins" on public.activity_photos
  for insert with check ( public.is_admin() );

create policy "Photos are deletable by admins" on public.activity_photos
  for delete using ( public.is_admin() );

-- STORAGE POLICIES
-- We need to enable RLS on storage.objects if not already enabled (usually is by default in Supabase)

-- Policy for activity_covers bucket
create policy "Covers are viewable by everyone" on storage.objects
  for select using ( bucket_id = 'activity_covers' );

create policy "Covers are insertable by admins" on storage.objects
  for insert with check (
    bucket_id = 'activity_covers' and public.is_admin()
  );

create policy "Covers are updatable by admins" on storage.objects
  for update using (
    bucket_id = 'activity_covers' and public.is_admin()
  );

create policy "Covers are deletable by admins" on storage.objects
  for delete using (
    bucket_id = 'activity_covers' and public.is_admin()
  );

-- Policy for activity_photos bucket
create policy "Photos are viewable by everyone" on storage.objects
  for select using ( bucket_id = 'activity_photos' );

create policy "Photos are insertable by admins" on storage.objects
  for insert with check (
    bucket_id = 'activity_photos' and public.is_admin()
  );

create policy "Photos are deletable by admins" on storage.objects
  for delete using (
    bucket_id = 'activity_photos' and public.is_admin()
  );
