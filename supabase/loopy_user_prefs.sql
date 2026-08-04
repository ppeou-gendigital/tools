-- Per-app user prefs table for Loopy (replaces shared public.user_data
-- for new prefs writes).
--
-- One row per auth user.
--   data    — owned shell prefs: theme, fontSize, fabCorner, updatedAt
--   payload — Loopy lists (snake_case keys):
--             aem_domains, tracked_hostnames, pinned_sites, favorites_order
--
-- Run in Supabase → SQL Editor. Safe to re-run.
-- Keep public.user_data during the dual-read/write window; do not drop it yet.
-- Favorites/visits stay on user_favorites / user_visits — untouched by this.

create table if not exists public.loopy_user_prefs (
  id          uuid        primary key references auth.users(id) on delete cascade,
  data        jsonb       not null default '{}'::jsonb,
  payload     jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.loopy_user_prefs enable row level security;

drop policy if exists "loopy_user_prefs self-read"   on public.loopy_user_prefs;
drop policy if exists "loopy_user_prefs self-insert" on public.loopy_user_prefs;
drop policy if exists "loopy_user_prefs self-update" on public.loopy_user_prefs;
drop policy if exists "loopy_user_prefs self-delete" on public.loopy_user_prefs;

create policy "loopy_user_prefs self-read"
  on public.loopy_user_prefs for select using (auth.uid() = id);
create policy "loopy_user_prefs self-insert"
  on public.loopy_user_prefs for insert with check (auth.uid() = id);
create policy "loopy_user_prefs self-update"
  on public.loopy_user_prefs for update
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "loopy_user_prefs self-delete"
  on public.loopy_user_prefs for delete using (auth.uid() = id);
