-- Per-entry participants + upsert_entry(p_participant_ids).
-- Run once in Supabase → SQL Editor on existing projects.
-- Fresh installs get this from viaggio_schema.sql.

create table if not exists public.viaggio_entry_participants (
  entry_id  uuid not null references public.viaggio_entries(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  primary key (entry_id, user_id)
);

create index if not exists viaggio_entry_participants_user_idx
  on public.viaggio_entry_participants (user_id);

alter table public.viaggio_entry_participants enable row level security;

drop policy if exists "viaggio_entry_participants select" on public.viaggio_entry_participants;
create policy "viaggio_entry_participants select"
  on public.viaggio_entry_participants for select
  using (public.viaggio_can_access_entry(entry_id));

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
      select 1 from public.viaggio_journey_members m
      where m.journey_id = p_journey_id and m.user_id = v_participant
    ) then
      raise exception 'participant must be a journey member';
    end if;
  end loop;

  delete from public.viaggio_entry_participants where entry_id = v_row.id;

  insert into public.viaggio_entry_participants (entry_id, user_id)
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
