-- Allow journey co-members to read each other's profiles (display_name).
-- Requires viaggio_journey_members + existing "read own" policy on profiles.
-- Run once in Supabase → SQL Editor.

drop policy if exists "read co-travelers" on public.profiles;

create policy "read co-travelers"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.viaggio_journey_members me
      join public.viaggio_journey_members them
        on them.journey_id = me.journey_id
      where me.user_id = auth.uid()
        and them.user_id = profiles.id
    )
  );
