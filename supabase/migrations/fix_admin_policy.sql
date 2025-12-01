-- Fix infinite recursion in admin policy
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

drop policy "Admins can view all profiles" on public.users;

create policy "Admins can view all profiles" on public.users
  for select using (
    public.is_admin()
  );
