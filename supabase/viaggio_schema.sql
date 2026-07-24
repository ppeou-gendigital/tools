-- Viaggio domain schema: tables, helpers, RLS, RPCs.
-- Run in Supabase → SQL Editor after auth is configured.
-- Order: tables → helpers → RLS → RPCs (SQL helpers require tables to exist first).
--
-- Replaces the template `viaggio_attachments` shape (user_id/parent_id) with
-- entry-scoped attachments per the product spec.
--
-- If create_invite fails with "gen_random_bytes does not exist", run
-- supabase/patches/fix_create_invite_pgcrypto.sql in the SQL Editor
-- (pgcrypto lives in extensions; create_invite search_path includes it).

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.viaggio_journeys (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  type               text not null check (type in ('trip', 'journal')),
  preset             text not null,
  activity_packs     text[] not null default '{}',
  default_timezone   text not null,
  default_currency   text not null,
  starts_on          date,
  ends_on            date,
  created_by         uuid not null references auth.users(id) on delete restrict,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on),
  check (default_currency ~ '^[A-Z]{3}$')
);

create index if not exists viaggio_journeys_created_by_idx
  on public.viaggio_journeys (created_by);
create index if not exists viaggio_journeys_type_idx
  on public.viaggio_journeys (type);

create table if not exists public.viaggio_journey_members (
  journey_id  uuid not null references public.viaggio_journeys(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null check (role in ('owner', 'editor', 'viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (journey_id, user_id)
);

create index if not exists viaggio_journey_members_user_idx
  on public.viaggio_journey_members (user_id);

create table if not exists public.viaggio_journey_blocks (
  journey_id   uuid not null references public.viaggio_journeys(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  blocked_by   uuid not null references auth.users(id) on delete restrict,
  reason       text,
  created_at   timestamptz not null default now(),
  primary key (journey_id, user_id)
);

create index if not exists viaggio_journey_blocks_user_idx
  on public.viaggio_journey_blocks (user_id);

create table if not exists public.viaggio_invites (
  id           uuid primary key default gen_random_uuid(),
  journey_id   uuid not null references public.viaggio_journeys(id) on delete cascade,
  token        text not null unique,
  role         text not null check (role in ('owner', 'editor', 'viewer')),
  expires_at   timestamptz not null,
  revoked_at   timestamptz,
  created_by   uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  journey_person_id uuid,
  email        text
);

create index if not exists viaggio_invites_journey_idx on public.viaggio_invites (journey_id);
create index if not exists viaggio_invites_token_idx on public.viaggio_invites (token)
  where revoked_at is null;

-- Personal reusable people library (owned by a user).
create table if not exists public.viaggio_people (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  display_name    text not null,
  email           text,
  phone_e164      text check (phone_e164 is null or phone_e164 ~ '^\+[1-9]\d{1,14}$'),
  linked_user_id  uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists viaggio_people_owner_idx
  on public.viaggio_people (owner_id);
create index if not exists viaggio_people_linked_user_idx
  on public.viaggio_people (linked_user_id);

-- Journey roster (travelers; may or may not have an app account).
create table if not exists public.viaggio_journey_people (
  id              uuid primary key default gen_random_uuid(),
  journey_id      uuid not null references public.viaggio_journeys(id) on delete cascade,
  person_id       uuid references public.viaggio_people(id) on delete set null,
  display_name    text not null,
  email           text,
  phone_e164      text check (phone_e164 is null or phone_e164 ~ '^\+[1-9]\d{1,14}$'),
  linked_user_id  uuid references auth.users(id) on delete set null,
  created_by      uuid not null references auth.users(id) on delete restrict,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists viaggio_journey_people_journey_idx
  on public.viaggio_journey_people (journey_id);
create unique index if not exists viaggio_journey_people_linked_uidx
  on public.viaggio_journey_people (journey_id, linked_user_id)
  where linked_user_id is not null;
create unique index if not exists viaggio_journey_people_person_uidx
  on public.viaggio_journey_people (journey_id, person_id)
  where person_id is not null;

alter table public.viaggio_invites
  drop constraint if exists viaggio_invites_journey_person_id_fkey;
alter table public.viaggio_invites
  add constraint viaggio_invites_journey_person_id_fkey
  foreign key (journey_person_id)
  references public.viaggio_journey_people(id) on delete set null;

create table if not exists public.viaggio_contacts (
  id             uuid primary key default gen_random_uuid(),
  journey_id     uuid not null references public.viaggio_journeys(id) on delete cascade,
  kind           text not null default 'person'
                   check (kind in ('person', 'place', 'business')),
  display_name   text not null,
  phone_e164     text check (phone_e164 is null or phone_e164 ~ '^\+[1-9]\d{1,14}$'),
  email          text,
  notes          text,
  created_by     uuid not null references auth.users(id) on delete restrict,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists viaggio_contacts_journey_idx on public.viaggio_contacts (journey_id);

create table if not exists public.viaggio_entries (
  id               uuid primary key default gen_random_uuid(),
  journey_id       uuid not null references public.viaggio_journeys(id) on delete cascade,
  activity_id      text not null,
  schema           text not null,
  title            text not null default '',
  body             jsonb not null default '{}'::jsonb,
  occurs_on        date,
  occurs_at        timestamptz,
  ends_at          timestamptz,
  timezone         text,
  start_timezone   text,
  end_timezone     text,
  place_name       text,
  address          text,
  lat              double precision,
  lng              double precision,
  phone_e164       text check (phone_e164 is null or phone_e164 ~ '^\+[1-9]\d{1,14}$'),
  contact_id       uuid references public.viaggio_contacts(id) on delete set null,
  details          jsonb not null default '{}'::jsonb,
  created_by       uuid not null references auth.users(id) on delete restrict,
  updated_by       uuid references auth.users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (ends_at is null or occurs_at is null or ends_at >= occurs_at),
  check (
    (occurs_at is null and ends_at is null)
    or (
      (timezone is not null and timezone <> '')
      or (start_timezone is not null and start_timezone <> '')
      or (end_timezone is not null and end_timezone <> '')
    )
  )
);

create index if not exists viaggio_entries_journey_occurs_idx
  on public.viaggio_entries (journey_id, occurs_at nulls last, occurs_on nulls last);
create index if not exists viaggio_entries_journey_schema_idx
  on public.viaggio_entries (journey_id, schema);
create index if not exists viaggio_entries_journey_activity_idx
  on public.viaggio_entries (journey_id, activity_id);
create index if not exists viaggio_entries_contact_idx
  on public.viaggio_entries (contact_id);

create table if not exists public.viaggio_expenses (
  id            uuid primary key default gen_random_uuid(),
  entry_id      uuid not null references public.viaggio_entries(id) on delete cascade,
  title         text not null default '',
  amount_cents  bigint not null check (amount_cents >= 0),
  currency      text not null check (currency ~ '^[A-Z]{3}$'),
  paid_by       uuid not null references public.viaggio_journey_people(id) on delete restrict,
  split_mode    text not null check (split_mode in ('equal', 'custom')),
  category      text,
  created_by    uuid not null references auth.users(id) on delete restrict,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists viaggio_expenses_entry_idx on public.viaggio_expenses (entry_id);
create index if not exists viaggio_expenses_paid_by_idx on public.viaggio_expenses (paid_by);

create table if not exists public.viaggio_expense_splits (
  expense_id         uuid not null references public.viaggio_expenses(id) on delete cascade,
  journey_person_id  uuid not null references public.viaggio_journey_people(id) on delete cascade,
  amount_cents       bigint not null check (amount_cents >= 0),
  primary key (expense_id, journey_person_id)
);

create index if not exists viaggio_expense_splits_person_idx
  on public.viaggio_expense_splits (journey_person_id);

create table if not exists public.viaggio_entry_participants (
  entry_id           uuid not null references public.viaggio_entries(id) on delete cascade,
  journey_person_id  uuid not null references public.viaggio_journey_people(id) on delete cascade,
  primary key (entry_id, journey_person_id)
);

create index if not exists viaggio_entry_participants_person_idx
  on public.viaggio_entry_participants (journey_person_id);

create table if not exists public.viaggio_playlist_items (
  id          uuid primary key default gen_random_uuid(),
  journey_id  uuid not null references public.viaggio_journeys(id) on delete cascade,
  url         text not null,
  title       text not null default '',
  platform    text,
  sort_order  int not null default 0,
  created_by  uuid not null references auth.users(id) on delete restrict,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists viaggio_playlist_journey_sort_idx
  on public.viaggio_playlist_items (journey_id, sort_order);

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

-- Drop template attachments shape if present (user_id/parent_id).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'viaggio_attachments'
      and column_name = 'parent_id'
  ) then
    drop table public.viaggio_attachments cascade;
  end if;
end $$;

create table if not exists public.viaggio_attachments (
  id            uuid primary key default gen_random_uuid(),
  entry_id      uuid not null references public.viaggio_entries(id) on delete cascade,
  uploaded_by   uuid not null references auth.users(id) on delete restrict,
  file_name     text not null,
  mime_type     text not null default 'application/octet-stream',
  byte_size     bigint not null default 0,
  storage_path  text not null unique,
  iv            text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists viaggio_attachments_entry_idx
  on public.viaggio_attachments (entry_id);

-- ---------------------------------------------------------------------------
-- Helpers (membership)
-- ---------------------------------------------------------------------------

create or replace function public.viaggio_is_member(p_journey_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.viaggio_journey_members m
    where m.journey_id = p_journey_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.viaggio_my_role(p_journey_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select m.role
  from public.viaggio_journey_members m
  where m.journey_id = p_journey_id
    and m.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.viaggio_is_editor(p_journey_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.viaggio_my_role(p_journey_id) in ('owner', 'editor'), false);
$$;

create or replace function public.viaggio_is_owner(p_journey_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.viaggio_my_role(p_journey_id) = 'owner', false);
$$;

create or replace function public.viaggio_owner_count(p_journey_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.viaggio_journey_members m
  where m.journey_id = p_journey_id
    and m.role = 'owner';
$$;

create or replace function public.viaggio_entry_journey_id(p_entry_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select e.journey_id from public.viaggio_entries e where e.id = p_entry_id;
$$;

create or replace function public.viaggio_can_access_entry(p_entry_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.viaggio_is_member(public.viaggio_entry_journey_id(p_entry_id));
$$;

create or replace function public.viaggio_can_edit_entry(p_entry_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.viaggio_is_editor(public.viaggio_entry_journey_id(p_entry_id));
$$;

-- Contact must belong to same journey as entry
create or replace function public.viaggio_entries_contact_same_journey()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.contact_id is null then
    return new;
  end if;
  if not exists (
    select 1 from public.viaggio_contacts c
    where c.id = new.contact_id and c.journey_id = new.journey_id
  ) then
    raise exception 'contact_id must belong to the same journey as the entry';
  end if;
  return new;
end;
$$;

drop trigger if exists viaggio_entries_contact_same_journey_trg on public.viaggio_entries;
create trigger viaggio_entries_contact_same_journey_trg
  before insert or update of contact_id, journey_id
  on public.viaggio_entries
  for each row execute function public.viaggio_entries_contact_same_journey();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.viaggio_journeys enable row level security;
alter table public.viaggio_journey_members enable row level security;
alter table public.viaggio_journey_blocks enable row level security;
alter table public.viaggio_invites enable row level security;
alter table public.viaggio_people enable row level security;
alter table public.viaggio_journey_people enable row level security;
alter table public.viaggio_contacts enable row level security;
alter table public.viaggio_entries enable row level security;
alter table public.viaggio_expenses enable row level security;
alter table public.viaggio_expense_splits enable row level security;
alter table public.viaggio_entry_participants enable row level security;
alter table public.viaggio_playlist_items enable row level security;
alter table public.viaggio_place_ideas enable row level security;
alter table public.viaggio_attachments enable row level security;

-- Journeys
drop policy if exists "viaggio_journeys select" on public.viaggio_journeys;
drop policy if exists "viaggio_journeys update" on public.viaggio_journeys;
drop policy if exists "viaggio_journeys delete" on public.viaggio_journeys;

create policy "viaggio_journeys select"
  on public.viaggio_journeys for select
  using (public.viaggio_is_member(id));

create policy "viaggio_journeys update"
  on public.viaggio_journeys for update
  using (public.viaggio_is_editor(id))
  with check (public.viaggio_is_editor(id));

create policy "viaggio_journeys delete"
  on public.viaggio_journeys for delete
  using (public.viaggio_is_owner(id));

-- Members (read for members; mutations via RPC)
drop policy if exists "viaggio_members select" on public.viaggio_journey_members;
create policy "viaggio_members select"
  on public.viaggio_journey_members for select
  using (public.viaggio_is_member(journey_id));

-- Blocks (owners only)
drop policy if exists "viaggio_blocks select" on public.viaggio_journey_blocks;
create policy "viaggio_blocks select"
  on public.viaggio_journey_blocks for select
  using (public.viaggio_is_owner(journey_id));

-- Invites (owners only; redeem via RPC)
drop policy if exists "viaggio_invites select" on public.viaggio_invites;
drop policy if exists "viaggio_invites insert" on public.viaggio_invites;
drop policy if exists "viaggio_invites update" on public.viaggio_invites;

create policy "viaggio_invites select"
  on public.viaggio_invites for select
  using (public.viaggio_is_owner(journey_id));

create policy "viaggio_invites insert"
  on public.viaggio_invites for insert
  with check (public.viaggio_is_owner(journey_id) and created_by = auth.uid());

create policy "viaggio_invites update"
  on public.viaggio_invites for update
  using (public.viaggio_is_owner(journey_id))
  with check (public.viaggio_is_owner(journey_id));

-- Personal people library
drop policy if exists "viaggio_people select" on public.viaggio_people;
drop policy if exists "viaggio_people insert" on public.viaggio_people;
drop policy if exists "viaggio_people update" on public.viaggio_people;
drop policy if exists "viaggio_people delete" on public.viaggio_people;

create policy "viaggio_people select"
  on public.viaggio_people for select
  using (owner_id = auth.uid() or linked_user_id = auth.uid());
create policy "viaggio_people insert"
  on public.viaggio_people for insert
  with check (owner_id = auth.uid());
create policy "viaggio_people update"
  on public.viaggio_people for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
create policy "viaggio_people delete"
  on public.viaggio_people for delete
  using (owner_id = auth.uid());

-- Journey roster (mutations via RPC)
drop policy if exists "viaggio_journey_people select" on public.viaggio_journey_people;
create policy "viaggio_journey_people select"
  on public.viaggio_journey_people for select
  using (public.viaggio_is_member(journey_id));

-- Contacts
drop policy if exists "viaggio_contacts select" on public.viaggio_contacts;
drop policy if exists "viaggio_contacts insert" on public.viaggio_contacts;
drop policy if exists "viaggio_contacts update" on public.viaggio_contacts;
drop policy if exists "viaggio_contacts delete" on public.viaggio_contacts;

create policy "viaggio_contacts select"
  on public.viaggio_contacts for select
  using (public.viaggio_is_member(journey_id));
create policy "viaggio_contacts insert"
  on public.viaggio_contacts for insert
  with check (public.viaggio_is_editor(journey_id) and created_by = auth.uid());
create policy "viaggio_contacts update"
  on public.viaggio_contacts for update
  using (public.viaggio_is_editor(journey_id))
  with check (public.viaggio_is_editor(journey_id));
create policy "viaggio_contacts delete"
  on public.viaggio_contacts for delete
  using (public.viaggio_is_editor(journey_id));

-- Entries
drop policy if exists "viaggio_entries select" on public.viaggio_entries;
drop policy if exists "viaggio_entries insert" on public.viaggio_entries;
drop policy if exists "viaggio_entries update" on public.viaggio_entries;
drop policy if exists "viaggio_entries delete" on public.viaggio_entries;

create policy "viaggio_entries select"
  on public.viaggio_entries for select
  using (public.viaggio_is_member(journey_id));
create policy "viaggio_entries insert"
  on public.viaggio_entries for insert
  with check (public.viaggio_is_editor(journey_id) and created_by = auth.uid());
create policy "viaggio_entries update"
  on public.viaggio_entries for update
  using (public.viaggio_is_editor(journey_id))
  with check (public.viaggio_is_editor(journey_id));
create policy "viaggio_entries delete"
  on public.viaggio_entries for delete
  using (public.viaggio_is_editor(journey_id));

-- Expenses
drop policy if exists "viaggio_expenses select" on public.viaggio_expenses;
drop policy if exists "viaggio_expenses insert" on public.viaggio_expenses;
drop policy if exists "viaggio_expenses update" on public.viaggio_expenses;
drop policy if exists "viaggio_expenses delete" on public.viaggio_expenses;

create policy "viaggio_expenses select"
  on public.viaggio_expenses for select
  using (public.viaggio_can_access_entry(entry_id));
create policy "viaggio_expenses insert"
  on public.viaggio_expenses for insert
  with check (public.viaggio_can_edit_entry(entry_id) and created_by = auth.uid());
create policy "viaggio_expenses update"
  on public.viaggio_expenses for update
  using (public.viaggio_can_edit_entry(entry_id))
  with check (public.viaggio_can_edit_entry(entry_id));
create policy "viaggio_expenses delete"
  on public.viaggio_expenses for delete
  using (public.viaggio_can_edit_entry(entry_id));

-- Splits
drop policy if exists "viaggio_expense_splits select" on public.viaggio_expense_splits;
drop policy if exists "viaggio_expense_splits insert" on public.viaggio_expense_splits;
drop policy if exists "viaggio_expense_splits update" on public.viaggio_expense_splits;
drop policy if exists "viaggio_expense_splits delete" on public.viaggio_expense_splits;

create policy "viaggio_expense_splits select"
  on public.viaggio_expense_splits for select
  using (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_can_access_entry(x.entry_id)
    )
  );
create policy "viaggio_expense_splits insert"
  on public.viaggio_expense_splits for insert
  with check (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_can_edit_entry(x.entry_id)
    )
  );
create policy "viaggio_expense_splits update"
  on public.viaggio_expense_splits for update
  using (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_can_edit_entry(x.entry_id)
    )
  )
  with check (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_can_edit_entry(x.entry_id)
    )
  );
create policy "viaggio_expense_splits delete"
  on public.viaggio_expense_splits for delete
  using (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_can_edit_entry(x.entry_id)
    )
  );

-- Entry participants (read for members; mutations via upsert_entry RPC)
drop policy if exists "viaggio_entry_participants select" on public.viaggio_entry_participants;
create policy "viaggio_entry_participants select"
  on public.viaggio_entry_participants for select
  using (public.viaggio_can_access_entry(entry_id));

-- Playlist
drop policy if exists "viaggio_playlist select" on public.viaggio_playlist_items;
drop policy if exists "viaggio_playlist insert" on public.viaggio_playlist_items;
drop policy if exists "viaggio_playlist update" on public.viaggio_playlist_items;
drop policy if exists "viaggio_playlist delete" on public.viaggio_playlist_items;

create policy "viaggio_playlist select"
  on public.viaggio_playlist_items for select
  using (public.viaggio_is_member(journey_id));
create policy "viaggio_playlist insert"
  on public.viaggio_playlist_items for insert
  with check (public.viaggio_is_editor(journey_id) and created_by = auth.uid());
create policy "viaggio_playlist update"
  on public.viaggio_playlist_items for update
  using (public.viaggio_is_editor(journey_id))
  with check (public.viaggio_is_editor(journey_id));
create policy "viaggio_playlist delete"
  on public.viaggio_playlist_items for delete
  using (public.viaggio_is_editor(journey_id));

-- Place ideas (map shortlist)
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

-- Attachments
drop policy if exists "viaggio_attachments select" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments insert" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments update" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments delete" on public.viaggio_attachments;

create policy "viaggio_attachments select"
  on public.viaggio_attachments for select
  using (public.viaggio_can_access_entry(entry_id));
create policy "viaggio_attachments insert"
  on public.viaggio_attachments for insert
  with check (public.viaggio_can_edit_entry(entry_id) and uploaded_by = auth.uid());
create policy "viaggio_attachments update"
  on public.viaggio_attachments for update
  using (public.viaggio_can_edit_entry(entry_id))
  with check (public.viaggio_can_edit_entry(entry_id));
create policy "viaggio_attachments delete"
  on public.viaggio_attachments for delete
  using (public.viaggio_can_edit_entry(entry_id));

-- Storage bucket + path {entry_id}/{attachment_id}
insert into storage.buckets (id, name, public)
values ('viaggio-attachments', 'viaggio-attachments', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "viaggio_attachments storage read" on storage.objects;
drop policy if exists "viaggio_attachments storage insert" on storage.objects;
drop policy if exists "viaggio_attachments storage update" on storage.objects;
drop policy if exists "viaggio_attachments storage delete" on storage.objects;

create policy "viaggio_attachments storage read"
  on storage.objects for select
  using (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_access_entry(((storage.foldername(name))[1])::uuid)
  );

create policy "viaggio_attachments storage insert"
  on storage.objects for insert
  with check (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_edit_entry(((storage.foldername(name))[1])::uuid)
  );

create policy "viaggio_attachments storage update"
  on storage.objects for update
  using (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_edit_entry(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_edit_entry(((storage.foldername(name))[1])::uuid)
  );

create policy "viaggio_attachments storage delete"
  on storage.objects for delete
  using (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_edit_entry(((storage.foldername(name))[1])::uuid)
  );

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

create or replace function public.viaggio_ensure_self_person(p_uid uuid)
returns public.viaggio_people
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.viaggio_people;
  v_name text;
  v_email text;
begin
  select * into v_row
  from public.viaggio_people
  where owner_id = p_uid and linked_user_id = p_uid
  limit 1;
  if v_row.id is not null then return v_row; end if;

  select nullif(trim(display_name), ''), email
    into v_name, v_email
  from public.profiles where id = p_uid;

  insert into public.viaggio_people (owner_id, display_name, email, linked_user_id)
  values (
    p_uid,
    coalesce(v_name, nullif(trim(v_email), ''), left(p_uid::text, 8)),
    v_email,
    p_uid
  )
  returning * into v_row;
  return v_row;
end;
$$;

create or replace function public.viaggio_ensure_journey_person_for_user(
  p_journey_id uuid,
  p_uid uuid
)
returns public.viaggio_journey_people
language plpgsql
security definer
set search_path = public
as $$
declare
  v_person public.viaggio_people;
  v_row public.viaggio_journey_people;
begin
  select * into v_row
  from public.viaggio_journey_people
  where journey_id = p_journey_id and linked_user_id = p_uid
  limit 1;
  if v_row.id is not null then return v_row; end if;

  v_person := public.viaggio_ensure_self_person(p_uid);

  insert into public.viaggio_journey_people (
    journey_id, person_id, display_name, email, phone_e164, linked_user_id, created_by
  ) values (
    p_journey_id, v_person.id, v_person.display_name, v_person.email,
    v_person.phone_e164, p_uid, p_uid
  )
  returning * into v_row;
  return v_row;
end;
$$;

create or replace function public.create_journey(
  p_title text,
  p_type text,
  p_preset text,
  p_default_timezone text,
  p_default_currency text,
  p_starts_on date default null,
  p_ends_on date default null,
  p_activity_packs text[] default '{}'
)
returns public.viaggio_journeys
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.viaggio_journeys;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_type not in ('trip', 'journal') then
    raise exception 'invalid type';
  end if;
  if coalesce(trim(p_default_timezone), '') = '' then
    raise exception 'default_timezone required';
  end if;
  if p_default_currency is null or p_default_currency !~ '^[A-Z]{3}$' then
    raise exception 'default_currency must be ISO 4217';
  end if;

  insert into public.viaggio_journeys (
    title, type, preset, activity_packs,
    default_timezone, default_currency,
    starts_on, ends_on, created_by
  ) values (
    coalesce(nullif(trim(p_title), ''), 'Untitled'),
    p_type,
    p_preset,
    coalesce(p_activity_packs, '{}'),
    trim(p_default_timezone),
    p_default_currency,
    p_starts_on,
    p_ends_on,
    v_uid
  )
  returning * into v_row;

  insert into public.viaggio_journey_members (journey_id, user_id, role)
  values (v_row.id, v_uid, 'owner');

  perform public.viaggio_ensure_journey_person_for_user(v_row.id, v_uid);

  return v_row;
end;
$$;

revoke all on function public.create_journey(text, text, text, text, text, date, date, text[]) from public;
grant execute on function public.create_journey(text, text, text, text, text, date, date, text[]) to authenticated;

drop function if exists public.upsert_entry(
  uuid, uuid, text, text, text, jsonb, date, timestamptz, timestamptz,
  text, text, text, text, text, double precision, double precision,
  text, uuid, jsonb
);
drop function if exists public.upsert_entry(
  uuid, uuid, text, text, text, jsonb, date, timestamptz, timestamptz,
  text, text, text, text, text, double precision, double precision,
  text, uuid, jsonb, uuid[]
);

create or replace function public.upsert_entry(
  p_id uuid,
  p_journey_id uuid,
  p_activity_id text,
  p_schema text,
  p_title text default '',
  p_body jsonb default '{}'::jsonb,
  p_occurs_on date default null,
  p_occurs_at timestamptz default null,
  p_ends_at timestamptz default null,
  p_timezone text default null,
  p_start_timezone text default null,
  p_end_timezone text default null,
  p_place_name text default null,
  p_address text default null,
  p_lat double precision default null,
  p_lng double precision default null,
  p_phone_e164 text default null,
  p_contact_id uuid default null,
  p_details jsonb default '{}'::jsonb,
  p_participant_ids uuid[] default '{}'::uuid[]
)
returns public.viaggio_entries
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.viaggio_entries;
  v_participant uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_editor(p_journey_id) then
    raise exception 'forbidden';
  end if;
  if coalesce(trim(p_activity_id), '') = '' or coalesce(trim(p_schema), '') = '' then
    raise exception 'activity_id and schema required';
  end if;

  if p_id is null then
    insert into public.viaggio_entries (
      journey_id, activity_id, schema, title, body,
      occurs_on, occurs_at, ends_at,
      timezone, start_timezone, end_timezone,
      place_name, address, lat, lng,
      phone_e164, contact_id, details,
      created_by, updated_by
    ) values (
      p_journey_id, trim(p_activity_id), trim(p_schema),
      coalesce(p_title, ''), coalesce(p_body, '{}'::jsonb),
      p_occurs_on, p_occurs_at, p_ends_at,
      nullif(trim(p_timezone), ''),
      nullif(trim(p_start_timezone), ''),
      nullif(trim(p_end_timezone), ''),
      p_place_name, p_address, p_lat, p_lng,
      p_phone_e164, p_contact_id, coalesce(p_details, '{}'::jsonb),
      v_uid, v_uid
    )
    returning * into v_row;
  else
    update public.viaggio_entries e set
      activity_id = trim(p_activity_id),
      schema = trim(p_schema),
      title = coalesce(p_title, ''),
      body = coalesce(p_body, '{}'::jsonb),
      occurs_on = p_occurs_on,
      occurs_at = p_occurs_at,
      ends_at = p_ends_at,
      timezone = nullif(trim(p_timezone), ''),
      start_timezone = nullif(trim(p_start_timezone), ''),
      end_timezone = nullif(trim(p_end_timezone), ''),
      place_name = p_place_name,
      address = p_address,
      lat = p_lat,
      lng = p_lng,
      phone_e164 = p_phone_e164,
      contact_id = p_contact_id,
      details = coalesce(p_details, '{}'::jsonb),
      updated_by = v_uid,
      updated_at = now()
    where e.id = p_id and e.journey_id = p_journey_id
    returning * into v_row;
    if v_row.id is null then
      raise exception 'entry not found';
    end if;
  end if;

  foreach v_participant in array coalesce(p_participant_ids, '{}'::uuid[])
  loop
    if not exists (
      select 1 from public.viaggio_journey_people jp
      where jp.journey_id = p_journey_id and jp.id = v_participant
    ) then
      raise exception 'participant must be on the journey roster';
    end if;
  end loop;

  delete from public.viaggio_entry_participants where entry_id = v_row.id;

  insert into public.viaggio_entry_participants (entry_id, journey_person_id)
  select v_row.id, u
  from unnest(coalesce(p_participant_ids, '{}'::uuid[])) as u
  on conflict do nothing;

  return v_row;
end;
$$;

revoke all on function public.upsert_entry(
  uuid, uuid, text, text, text, jsonb, date, timestamptz, timestamptz,
  text, text, text, text, text, double precision, double precision,
  text, uuid, jsonb, uuid[]
) from public;
grant execute on function public.upsert_entry(
  uuid, uuid, text, text, text, jsonb, date, timestamptz, timestamptz,
  text, text, text, text, text, double precision, double precision,
  text, uuid, jsonb, uuid[]
) to authenticated;

create or replace function public.upsert_expense_with_splits(
  p_id uuid,
  p_entry_id uuid,
  p_title text,
  p_amount_cents bigint,
  p_currency text,
  p_paid_by uuid,
  p_split_mode text,
  p_category text,
  p_splits jsonb
)
returns public.viaggio_expenses
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_journey_id uuid;
  v_row public.viaggio_expenses;
  v_sum bigint;
  v_split record;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  v_journey_id := public.viaggio_entry_journey_id(p_entry_id);
  if v_journey_id is null then raise exception 'entry not found'; end if;
  if not public.viaggio_is_editor(v_journey_id) then
    raise exception 'forbidden';
  end if;
  if p_amount_cents is null or p_amount_cents < 0 then
    raise exception 'invalid amount';
  end if;
  if p_currency is null or p_currency !~ '^[A-Z]{3}$' then
    raise exception 'invalid currency';
  end if;
  if p_split_mode not in ('equal', 'custom') then
    raise exception 'invalid split_mode';
  end if;
  if not exists (
    select 1 from public.viaggio_journey_people jp
    where jp.journey_id = v_journey_id and jp.id = p_paid_by
  ) then
    raise exception 'paid_by must be on the journey roster';
  end if;

  select coalesce(sum((s->>'amount_cents')::bigint), 0) into v_sum
  from jsonb_array_elements(coalesce(p_splits, '[]'::jsonb)) s;

  if v_sum <> p_amount_cents then
    raise exception 'splits must sum to amount_cents';
  end if;

  for v_split in
    select coalesce(
             (s->>'journey_person_id')::uuid,
             (s->>'user_id')::uuid
           ) as journey_person_id,
           (s->>'amount_cents')::bigint as amount_cents
    from jsonb_array_elements(coalesce(p_splits, '[]'::jsonb)) s
  loop
    if not exists (
      select 1 from public.viaggio_journey_people jp
      where jp.journey_id = v_journey_id and jp.id = v_split.journey_person_id
    ) then
      raise exception 'split participant must be on the journey roster';
    end if;
  end loop;

  if p_id is null then
    insert into public.viaggio_expenses (
      entry_id, title, amount_cents, currency, paid_by, split_mode, category, created_by
    ) values (
      p_entry_id, coalesce(p_title, ''), p_amount_cents, p_currency,
      p_paid_by, p_split_mode, p_category, v_uid
    )
    returning * into v_row;
  else
    update public.viaggio_expenses x set
      title = coalesce(p_title, ''),
      amount_cents = p_amount_cents,
      currency = p_currency,
      paid_by = p_paid_by,
      split_mode = p_split_mode,
      category = p_category,
      updated_at = now()
    where x.id = p_id and x.entry_id = p_entry_id
    returning * into v_row;
    if v_row.id is null then raise exception 'expense not found'; end if;
    delete from public.viaggio_expense_splits where expense_id = v_row.id;
  end if;

  insert into public.viaggio_expense_splits (expense_id, journey_person_id, amount_cents)
  select
    v_row.id,
    coalesce((s->>'journey_person_id')::uuid, (s->>'user_id')::uuid),
    (s->>'amount_cents')::bigint
  from jsonb_array_elements(coalesce(p_splits, '[]'::jsonb)) s;

  return v_row;
end;
$$;

revoke all on function public.upsert_expense_with_splits(
  uuid, uuid, text, bigint, text, uuid, text, text, jsonb
) from public;
grant execute on function public.upsert_expense_with_splits(
  uuid, uuid, text, bigint, text, uuid, text, text, jsonb
) to authenticated;

drop function if exists public.create_invite(uuid, text, timestamptz);

create or replace function public.create_invite(
  p_journey_id uuid,
  p_role text,
  p_expires_at timestamptz,
  p_journey_person_id uuid default null,
  p_email text default null
)
returns public.viaggio_invites
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.viaggio_invites;
  v_token text;
  v_email text := nullif(trim(p_email), '');
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_owner(p_journey_id) then
    raise exception 'forbidden';
  end if;
  if p_role not in ('owner', 'editor', 'viewer') then
    raise exception 'invalid role';
  end if;
  if p_expires_at is null or p_expires_at <= now() then
    raise exception 'expires_at must be in the future';
  end if;

  if p_journey_person_id is not null then
    if not exists (
      select 1 from public.viaggio_journey_people jp
      where jp.id = p_journey_person_id and jp.journey_id = p_journey_id
    ) then
      raise exception 'journey person not on this journey';
    end if;
    if v_email is null then
      select nullif(trim(email), '') into v_email
      from public.viaggio_journey_people
      where id = p_journey_person_id;
    end if;
  end if;

  v_token := encode(gen_random_bytes(24), 'hex');

  insert into public.viaggio_invites (
    journey_id, token, role, expires_at, created_by, journey_person_id, email
  ) values (
    p_journey_id, v_token, p_role, p_expires_at, v_uid, p_journey_person_id, v_email
  )
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.create_invite(uuid, text, timestamptz, uuid, text) from public;
grant execute on function public.create_invite(uuid, text, timestamptz, uuid, text) to authenticated;

create or replace function public.revoke_invite(p_invite_id uuid)
returns public.viaggio_invites
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.viaggio_invites;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  update public.viaggio_invites i
  set revoked_at = now()
  where i.id = p_invite_id
    and public.viaggio_is_owner(i.journey_id)
    and i.revoked_at is null
  returning * into v_row;

  if v_row.id is null then
    raise exception 'invite not found or forbidden';
  end if;
  return v_row;
end;
$$;

revoke all on function public.revoke_invite(uuid) from public;
grant execute on function public.revoke_invite(uuid) to authenticated;

create or replace function public.accept_invite(p_token text)
returns public.viaggio_journey_members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_inv public.viaggio_invites;
  v_mem public.viaggio_journey_members;
  v_name text;
  v_email text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_inv
  from public.viaggio_invites i
  where i.token = p_token
  limit 1;

  if v_inv.id is null then raise exception 'invite not found'; end if;
  if v_inv.revoked_at is not null then raise exception 'invite revoked'; end if;
  if v_inv.expires_at <= now() then raise exception 'invite expired'; end if;

  if exists (
    select 1 from public.viaggio_journey_blocks b
    where b.journey_id = v_inv.journey_id and b.user_id = v_uid
  ) then
    raise exception 'blocked from this journey';
  end if;

  select * into v_mem
  from public.viaggio_journey_members m
  where m.journey_id = v_inv.journey_id and m.user_id = v_uid;

  if v_mem.user_id is null then
    insert into public.viaggio_journey_members (journey_id, user_id, role)
    values (v_inv.journey_id, v_uid, v_inv.role)
    returning * into v_mem;
  end if;

  if v_inv.journey_person_id is not null then
    update public.viaggio_journey_people
    set linked_user_id = v_uid,
        updated_at = now()
    where id = v_inv.journey_person_id
      and journey_id = v_inv.journey_id
      and (linked_user_id is null or linked_user_id = v_uid);
  else
    perform public.viaggio_ensure_journey_person_for_user(v_inv.journey_id, v_uid);
  end if;

  perform public.viaggio_ensure_self_person(v_uid);

  select nullif(trim(display_name), ''), email
    into v_name, v_email
  from public.profiles where id = v_uid;

  if v_inv.journey_person_id is not null and coalesce(v_name, '') <> '' then
    update public.viaggio_journey_people
    set display_name = coalesce(nullif(trim(display_name), ''), v_name),
        email = coalesce(email, v_email)
    where id = v_inv.journey_person_id;
  end if;

  return v_mem;
end;
$$;

revoke all on function public.accept_invite(text) from public;
grant execute on function public.accept_invite(text) to authenticated;

create or replace function public.remove_member(p_journey_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_owner(p_journey_id) then
    raise exception 'forbidden';
  end if;

  select role into v_role
  from public.viaggio_journey_members
  where journey_id = p_journey_id and user_id = p_user_id;

  if v_role is null then return; end if;
  if v_role = 'owner' and public.viaggio_owner_count(p_journey_id) <= 1 then
    raise exception 'cannot remove the last owner';
  end if;

  delete from public.viaggio_journey_members
  where journey_id = p_journey_id and user_id = p_user_id;
end;
$$;

revoke all on function public.remove_member(uuid, uuid) from public;
grant execute on function public.remove_member(uuid, uuid) to authenticated;

create or replace function public.block_member(
  p_journey_id uuid,
  p_user_id uuid,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_owner(p_journey_id) then
    raise exception 'forbidden';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'cannot block yourself';
  end if;

  perform public.remove_member(p_journey_id, p_user_id);

  insert into public.viaggio_journey_blocks (journey_id, user_id, blocked_by, reason)
  values (p_journey_id, p_user_id, auth.uid(), p_reason)
  on conflict (journey_id, user_id) do update
    set blocked_by = excluded.blocked_by,
        reason = excluded.reason,
        created_at = now();
end;
$$;

revoke all on function public.block_member(uuid, uuid, text) from public;
grant execute on function public.block_member(uuid, uuid, text) to authenticated;

create or replace function public.unblock_member(p_journey_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_owner(p_journey_id) then
    raise exception 'forbidden';
  end if;
  delete from public.viaggio_journey_blocks
  where journey_id = p_journey_id and user_id = p_user_id;
end;
$$;

revoke all on function public.unblock_member(uuid, uuid) from public;
grant execute on function public.unblock_member(uuid, uuid) to authenticated;

create or replace function public.set_member_role(
  p_journey_id uuid,
  p_user_id uuid,
  p_role text
)
returns public.viaggio_journey_members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current text;
  v_row public.viaggio_journey_members;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_owner(p_journey_id) then
    raise exception 'forbidden';
  end if;
  if p_role not in ('owner', 'editor', 'viewer') then
    raise exception 'invalid role';
  end if;

  select role into v_current
  from public.viaggio_journey_members
  where journey_id = p_journey_id and user_id = p_user_id;

  if v_current is null then raise exception 'member not found'; end if;
  if v_current = 'owner' and p_role <> 'owner'
     and public.viaggio_owner_count(p_journey_id) <= 1 then
    raise exception 'cannot demote the last owner';
  end if;

  update public.viaggio_journey_members
  set role = p_role, updated_at = now()
  where journey_id = p_journey_id and user_id = p_user_id
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.set_member_role(uuid, uuid, text) from public;
grant execute on function public.set_member_role(uuid, uuid, text) to authenticated;

create or replace function public.leave_journey(p_journey_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select role into v_role
  from public.viaggio_journey_members
  where journey_id = p_journey_id and user_id = v_uid;

  if v_role is null then return; end if;
  if v_role = 'owner' and public.viaggio_owner_count(p_journey_id) <= 1 then
    raise exception 'sole owner cannot leave; transfer ownership or delete the journey';
  end if;

  delete from public.viaggio_journey_members
  where journey_id = p_journey_id and user_id = v_uid;
end;
$$;

revoke all on function public.leave_journey(uuid) from public;
grant execute on function public.leave_journey(uuid) to authenticated;

create or replace function public.update_journey_packs(
  p_journey_id uuid,
  p_packs text[]
)
returns public.viaggio_journeys
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.viaggio_journeys;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_editor(p_journey_id) then
    raise exception 'forbidden';
  end if;

  update public.viaggio_journeys
  set activity_packs = coalesce(p_packs, '{}'),
      updated_at = now()
  where id = p_journey_id
  returning * into v_row;

  if v_row.id is null then raise exception 'journey not found'; end if;
  return v_row;
end;
$$;

revoke all on function public.update_journey_packs(uuid, text[]) from public;
grant execute on function public.update_journey_packs(uuid, text[]) to authenticated;

-- Peek invite (for accept screen) — returns limited public fields if token valid
create or replace function public.peek_invite(p_token text)
returns table (
  journey_id uuid,
  journey_title text,
  role text,
  expires_at timestamptz,
  revoked boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv public.viaggio_invites;
  v_title text;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  select * into v_inv from public.viaggio_invites i where i.token = p_token limit 1;
  if v_inv.id is null then
    return;
  end if;

  select j.title into v_title from public.viaggio_journeys j where j.id = v_inv.journey_id;

  journey_id := v_inv.journey_id;
  journey_title := coalesce(v_title, 'Journey');
  role := v_inv.role;
  expires_at := v_inv.expires_at;
  revoked := v_inv.revoked_at is not null;
  return next;
end;
$$;

revoke all on function public.peek_invite(text) from public;
grant execute on function public.peek_invite(text) to authenticated;

-- People library + roster RPCs (also in patches/journey_people.sql)

create or replace function public.upsert_person(
  p_id uuid,
  p_display_name text,
  p_email text default null,
  p_phone_e164 text default null
)
returns public.viaggio_people
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.viaggio_people;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if coalesce(trim(p_display_name), '') = '' then
    raise exception 'display_name required';
  end if;

  if p_id is null then
    insert into public.viaggio_people (owner_id, display_name, email, phone_e164)
    values (
      v_uid,
      trim(p_display_name),
      nullif(trim(p_email), ''),
      nullif(trim(p_phone_e164), '')
    )
    returning * into v_row;
  else
    update public.viaggio_people
    set display_name = trim(p_display_name),
        email = nullif(trim(p_email), ''),
        phone_e164 = nullif(trim(p_phone_e164), ''),
        updated_at = now()
    where id = p_id and owner_id = v_uid
    returning * into v_row;
    if v_row.id is null then raise exception 'person not found'; end if;
  end if;
  return v_row;
end;
$$;

revoke all on function public.upsert_person(uuid, text, text, text) from public;
grant execute on function public.upsert_person(uuid, text, text, text) to authenticated;

create or replace function public.delete_person(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from public.viaggio_people
  where id = p_id and owner_id = auth.uid()
    and (linked_user_id is null or linked_user_id <> auth.uid());
end;
$$;

revoke all on function public.delete_person(uuid) from public;
grant execute on function public.delete_person(uuid) to authenticated;

create or replace function public.add_journey_person(
  p_journey_id uuid,
  p_person_id uuid default null,
  p_display_name text default null,
  p_email text default null,
  p_phone_e164 text default null
)
returns public.viaggio_journey_people
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_person public.viaggio_people;
  v_row public.viaggio_journey_people;
  v_name text;
  v_email text;
  v_phone text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_editor(p_journey_id) then
    raise exception 'forbidden';
  end if;

  if p_person_id is not null then
    select * into v_person
    from public.viaggio_people
    where id = p_person_id and owner_id = v_uid;
    if v_person.id is null then raise exception 'person not found'; end if;

    select * into v_row
    from public.viaggio_journey_people
    where journey_id = p_journey_id and person_id = p_person_id;
    if v_row.id is not null then return v_row; end if;

    v_name := v_person.display_name;
    v_email := v_person.email;
    v_phone := v_person.phone_e164;
  else
    v_name := trim(coalesce(p_display_name, ''));
    if v_name = '' then raise exception 'display_name required'; end if;
    v_email := nullif(trim(p_email), '');
    v_phone := nullif(trim(p_phone_e164), '');

    insert into public.viaggio_people (owner_id, display_name, email, phone_e164)
    values (v_uid, v_name, v_email, v_phone)
    returning * into v_person;
    p_person_id := v_person.id;
  end if;

  insert into public.viaggio_journey_people (
    journey_id, person_id, display_name, email, phone_e164,
    linked_user_id, created_by
  ) values (
    p_journey_id, p_person_id, v_name, v_email, v_phone,
    v_person.linked_user_id, v_uid
  )
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.add_journey_person(uuid, uuid, text, text, text) from public;
grant execute on function public.add_journey_person(uuid, uuid, text, text, text) to authenticated;

create or replace function public.update_journey_person(
  p_id uuid,
  p_display_name text,
  p_email text default null,
  p_phone_e164 text default null
)
returns public.viaggio_journey_people
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.viaggio_journey_people;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  update public.viaggio_journey_people jp
  set display_name = trim(p_display_name),
      email = nullif(trim(p_email), ''),
      phone_e164 = nullif(trim(p_phone_e164), ''),
      updated_at = now()
  where jp.id = p_id
    and public.viaggio_is_editor(jp.journey_id)
    and coalesce(trim(p_display_name), '') <> ''
  returning * into v_row;

  if v_row.id is null then raise exception 'journey person not found or forbidden'; end if;
  return v_row;
end;
$$;

revoke all on function public.update_journey_person(uuid, text, text, text) from public;
grant execute on function public.update_journey_person(uuid, text, text, text) to authenticated;

create or replace function public.remove_journey_person(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_jp public.viaggio_journey_people;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  select * into v_jp from public.viaggio_journey_people where id = p_id;
  if v_jp.id is null then return; end if;
  if not public.viaggio_is_editor(v_jp.journey_id) then
    raise exception 'forbidden';
  end if;

  if v_jp.linked_user_id is not null then
    if exists (
      select 1 from public.viaggio_journey_members m
      where m.journey_id = v_jp.journey_id
        and m.user_id = v_jp.linked_user_id
        and m.role = 'owner'
        and public.viaggio_owner_count(v_jp.journey_id) <= 1
    ) then
      raise exception 'cannot remove the last owner from the roster';
    end if;
  end if;

  delete from public.viaggio_journey_people where id = p_id;
end;
$$;

revoke all on function public.remove_journey_person(uuid) from public;
grant execute on function public.remove_journey_person(uuid) to authenticated;
