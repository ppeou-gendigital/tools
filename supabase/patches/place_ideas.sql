-- Shared journey place shortlist (map brainstorming).
-- Run once in Supabase → SQL Editor on existing projects.
-- Fresh installs: prefer updated viaggio_schema.sql (same end state).

create table if not exists public.viaggio_place_ideas (
  id               uuid primary key default gen_random_uuid(),
  journey_id       uuid not null references public.viaggio_journeys(id) on delete cascade,
  google_place_id  text,
  name             text not null,
  address          text,
  lat              double precision not null,
  lng              double precision not null,
  note             text not null default '',
  sort_order       int not null default 0,
  entry_id         uuid references public.viaggio_entries(id) on delete set null,
  created_by       uuid not null references auth.users(id) on delete restrict,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists viaggio_place_ideas_journey_sort_idx
  on public.viaggio_place_ideas (journey_id, sort_order);

create unique index if not exists viaggio_place_ideas_google_uidx
  on public.viaggio_place_ideas (journey_id, google_place_id)
  where google_place_id is not null;

alter table public.viaggio_place_ideas enable row level security;

drop policy if exists "viaggio_place_ideas select" on public.viaggio_place_ideas;
drop policy if exists "viaggio_place_ideas insert" on public.viaggio_place_ideas;
drop policy if exists "viaggio_place_ideas update" on public.viaggio_place_ideas;
drop policy if exists "viaggio_place_ideas delete" on public.viaggio_place_ideas;

create policy "viaggio_place_ideas select"
  on public.viaggio_place_ideas for select
  using (public.viaggio_is_member(journey_id));
create policy "viaggio_place_ideas insert"
  on public.viaggio_place_ideas for insert
  with check (public.viaggio_is_editor(journey_id) and created_by = auth.uid());
create policy "viaggio_place_ideas update"
  on public.viaggio_place_ideas for update
  using (public.viaggio_is_editor(journey_id))
  with check (public.viaggio_is_editor(journey_id));
create policy "viaggio_place_ideas delete"
  on public.viaggio_place_ideas for delete
  using (public.viaggio_is_editor(journey_id));
