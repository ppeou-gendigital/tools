-- Traveler people model: personal library + journey roster.
-- Retargets entry participants + expense paid_by/splits to journey_person_id.
-- Run once in Supabase → SQL Editor on existing projects.
-- Fresh installs: prefer updated viaggio_schema.sql (same end state).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

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
  add column if not exists journey_person_id uuid
    references public.viaggio_journey_people(id) on delete set null;
alter table public.viaggio_invites
  add column if not exists email text;

-- ---------------------------------------------------------------------------
-- Backfill roster from existing members
-- ---------------------------------------------------------------------------

insert into public.viaggio_people (owner_id, display_name, email, linked_user_id)
select distinct on (m.user_id)
  m.user_id,
  coalesce(
    nullif(trim(p.display_name), ''),
    nullif(trim(p.email), ''),
    left(m.user_id::text, 8)
  ),
  p.email,
  m.user_id
from public.viaggio_journey_members m
left join public.profiles p on p.id = m.user_id
where not exists (
  select 1 from public.viaggio_people pe
  where pe.owner_id = m.user_id and pe.linked_user_id = m.user_id
)
order by m.user_id;

insert into public.viaggio_journey_people (
  journey_id, person_id, display_name, email, linked_user_id, created_by
)
select
  m.journey_id,
  pe.id,
  pe.display_name,
  pe.email,
  m.user_id,
  m.user_id
from public.viaggio_journey_members m
join public.viaggio_people pe
  on pe.owner_id = m.user_id and pe.linked_user_id = m.user_id
where not exists (
  select 1 from public.viaggio_journey_people jp
  where jp.journey_id = m.journey_id and jp.linked_user_id = m.user_id
);

-- ---------------------------------------------------------------------------
-- Migrate entry_participants → journey_person_id
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'viaggio_entry_participants'
      and column_name = 'user_id'
  ) then
    alter table public.viaggio_entry_participants
      add column if not exists journey_person_id uuid
        references public.viaggio_journey_people(id) on delete cascade;

    -- Postgres: target table alias cannot appear in JOIN ON of FROM;
    -- put all join predicates in WHERE.
    update public.viaggio_entry_participants ep
    set journey_person_id = jp.id
    from public.viaggio_entries e,
         public.viaggio_journey_people jp
    where e.id = ep.entry_id
      and jp.journey_id = e.journey_id
      and jp.linked_user_id = ep.user_id
      and ep.journey_person_id is null;

    delete from public.viaggio_entry_participants where journey_person_id is null;

    alter table public.viaggio_entry_participants
      drop constraint if exists viaggio_entry_participants_pkey;
    alter table public.viaggio_entry_participants drop column user_id;
    alter table public.viaggio_entry_participants
      alter column journey_person_id set not null;
    alter table public.viaggio_entry_participants
      add primary key (entry_id, journey_person_id);

    drop index if exists public.viaggio_entry_participants_user_idx;
    create index if not exists viaggio_entry_participants_person_idx
      on public.viaggio_entry_participants (journey_person_id);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Migrate expenses paid_by + splits → journey_person_id
-- Idempotent: safe after a partial prior run.
-- ---------------------------------------------------------------------------

do $$
declare
  has_paid_by boolean;
  has_paid_by_person boolean;
  paid_by_is_nullable boolean;
  paid_by_refs_people boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'viaggio_expenses'
      and column_name = 'paid_by'
  ) into has_paid_by;

  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'viaggio_expenses'
      and column_name = 'paid_by_person_id'
  ) into has_paid_by_person;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'viaggio_expenses'
      and column_name = 'paid_by'
      and is_nullable = 'YES'
  ) into paid_by_is_nullable;

  -- True when paid_by already FK → viaggio_journey_people (post-rename).
  select exists (
    select 1
    from pg_constraint c
    join pg_class rel on rel.oid = c.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    join pg_class frel on frel.oid = c.confrelid
    where nsp.nspname = 'public'
      and rel.relname = 'viaggio_expenses'
      and c.contype = 'f'
      and frel.relname = 'viaggio_journey_people'
      and pg_get_constraintdef(c.oid) ilike '%paid_by%'
  ) into paid_by_refs_people;

  -- Ensure roster seats exist for any auth user still referenced as payer.
  if has_paid_by and not paid_by_refs_people and not has_paid_by_person then
    insert into public.viaggio_journey_people (
      journey_id, person_id, display_name, email, linked_user_id, created_by
    )
    select distinct
      e.journey_id,
      pe.id,
      pe.display_name,
      pe.email,
      x.paid_by,
      x.paid_by
    from public.viaggio_expenses x
    join public.viaggio_entries e on e.id = x.entry_id
    join public.viaggio_people pe
      on pe.owner_id = x.paid_by and pe.linked_user_id = x.paid_by
    where not exists (
      select 1 from public.viaggio_journey_people jp
      where jp.journey_id = e.journey_id and jp.linked_user_id = x.paid_by
    );
  end if;

  -- Legacy → add staging column and map user_id → journey_person_id
  if has_paid_by and not has_paid_by_person and not paid_by_refs_people then
    alter table public.viaggio_expenses
      add column if not exists paid_by_person_id uuid
        references public.viaggio_journey_people(id) on delete restrict;

    has_paid_by_person := true;

    update public.viaggio_expenses x
    set paid_by_person_id = jp.id
    from public.viaggio_entries e,
         public.viaggio_journey_people jp
    where e.id = x.entry_id
      and jp.journey_id = e.journey_id
      and jp.linked_user_id = x.paid_by
      and x.paid_by_person_id is null;
  end if;

  -- Mid-migration: fill staging nulls via linked user, then journey owner
  if has_paid_by_person then
    update public.viaggio_expenses x
    set paid_by_person_id = jp.id
    from public.viaggio_entries e,
         public.viaggio_journey_people jp
    where e.id = x.entry_id
      and jp.journey_id = e.journey_id
      and jp.linked_user_id = x.paid_by
      and x.paid_by_person_id is null;

    update public.viaggio_expenses x
    set paid_by_person_id = owner_jp.id
    from public.viaggio_entries e,
         public.viaggio_journey_members m,
         public.viaggio_journey_people owner_jp
    where e.id = x.entry_id
      and m.journey_id = e.journey_id
      and m.role = 'owner'
      and owner_jp.journey_id = e.journey_id
      and owner_jp.linked_user_id = m.user_id
      and x.paid_by_person_id is null;

    delete from public.viaggio_expenses where paid_by_person_id is null;

    alter table public.viaggio_expenses drop constraint if exists viaggio_expenses_paid_by_fkey;
    drop index if exists public.viaggio_expenses_paid_by_idx;
    alter table public.viaggio_expenses drop column if exists paid_by;
    alter table public.viaggio_expenses rename column paid_by_person_id to paid_by;
    alter table public.viaggio_expenses alter column paid_by set not null;
    create index if not exists viaggio_expenses_paid_by_idx
      on public.viaggio_expenses (paid_by);

    paid_by_refs_people := true;
    paid_by_is_nullable := false;
  end if;

  -- Partial prior run: paid_by already points at journey_people but is nullable / has nulls
  if paid_by_refs_people or (
    has_paid_by and not has_paid_by_person and paid_by_is_nullable
  ) then
    update public.viaggio_expenses x
    set paid_by = owner_jp.id
    from public.viaggio_entries e,
         public.viaggio_journey_members m,
         public.viaggio_journey_people owner_jp
    where e.id = x.entry_id
      and m.journey_id = e.journey_id
      and m.role = 'owner'
      and owner_jp.journey_id = e.journey_id
      and owner_jp.linked_user_id = m.user_id
      and x.paid_by is null;

    delete from public.viaggio_expenses where paid_by is null;

    alter table public.viaggio_expenses alter column paid_by set not null;
    create index if not exists viaggio_expenses_paid_by_idx
      on public.viaggio_expenses (paid_by);
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'viaggio_expense_splits'
      and column_name = 'user_id'
  ) then
    alter table public.viaggio_expense_splits
      add column if not exists journey_person_id uuid
        references public.viaggio_journey_people(id) on delete cascade;

    update public.viaggio_expense_splits s
    set journey_person_id = jp.id
    from public.viaggio_expenses x,
         public.viaggio_entries e,
         public.viaggio_journey_people jp
    where x.id = s.expense_id
      and e.id = x.entry_id
      and jp.journey_id = e.journey_id
      and jp.linked_user_id = s.user_id
      and s.journey_person_id is null;

    -- Fallback: attach unmapped splits to the expense payer
    update public.viaggio_expense_splits s
    set journey_person_id = x.paid_by
    from public.viaggio_expenses x
    where x.id = s.expense_id
      and s.journey_person_id is null;

    delete from public.viaggio_expense_splits where journey_person_id is null;

    alter table public.viaggio_expense_splits
      drop constraint if exists viaggio_expense_splits_pkey;
    alter table public.viaggio_expense_splits drop column user_id;
    alter table public.viaggio_expense_splits
      alter column journey_person_id set not null;
    alter table public.viaggio_expense_splits
      add primary key (expense_id, journey_person_id);

    drop index if exists public.viaggio_expense_splits_user_idx;
    create index if not exists viaggio_expense_splits_person_idx
      on public.viaggio_expense_splits (journey_person_id);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.viaggio_people enable row level security;
alter table public.viaggio_journey_people enable row level security;

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

drop policy if exists "viaggio_journey_people select" on public.viaggio_journey_people;
create policy "viaggio_journey_people select"
  on public.viaggio_journey_people for select
  using (public.viaggio_is_member(journey_id));

-- ---------------------------------------------------------------------------
-- Helpers / RPCs
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

  -- Keep linked members' roster seats removable only if not last owner account seat
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

-- create_journey: also seed owner roster
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

-- upsert_entry: participants are journey_person ids
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

drop function if exists public.create_invite(uuid, text, timestamptz);
drop function if exists public.create_invite(uuid, text, timestamptz, uuid, text);

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

  -- Keep library self-card linked
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
