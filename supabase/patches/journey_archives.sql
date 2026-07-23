-- Journey archives: store full snapshot JSON, then hard-delete live journey.
-- Run in Supabase SQL Editor after viaggio_schema.sql (+ journey_people if needed).

create table if not exists public.viaggio_journey_archives (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  source_journey_id uuid,
  title text not null,
  snapshot jsonb not null,
  snapshot_version integer not null default 1,
  archived_at timestamptz not null default now(),
  byte_size integer
);

create index if not exists viaggio_journey_archives_owner_archived_idx
  on public.viaggio_journey_archives (owner_id, archived_at desc);

alter table public.viaggio_journey_archives enable row level security;

drop policy if exists "viaggio_archives select" on public.viaggio_journey_archives;
create policy "viaggio_archives select"
  on public.viaggio_journey_archives for select
  using (owner_id = auth.uid());

drop policy if exists "viaggio_archives delete" on public.viaggio_journey_archives;
create policy "viaggio_archives delete"
  on public.viaggio_journey_archives for delete
  using (owner_id = auth.uid());

-- Inserts go through security-definer RPC only (validates ownership + snapshot).

create or replace function public.archive_journey(
  p_journey_id uuid,
  p_snapshot jsonb
)
returns public.viaggio_journey_archives
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_title text;
  v_version integer;
  v_row public.viaggio_journey_archives;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_journey_id is null then raise exception 'journey_id required'; end if;
  if p_snapshot is null or jsonb_typeof(p_snapshot) <> 'object' then
    raise exception 'snapshot must be a JSON object';
  end if;
  if not public.viaggio_is_owner(p_journey_id) then
    raise exception 'forbidden';
  end if;

  if coalesce(p_snapshot->>'format', '') <> 'viaggio.journey_snapshot' then
    raise exception 'invalid snapshot format';
  end if;

  begin
    v_version := (p_snapshot->>'version')::integer;
  exception when others then
    raise exception 'invalid snapshot version';
  end;
  if v_version is null or v_version < 1 then
    raise exception 'invalid snapshot version';
  end if;

  select title into v_title
  from public.viaggio_journeys
  where id = p_journey_id;
  if v_title is null then raise exception 'journey not found'; end if;

  -- Prefer title from snapshot journey block when present
  v_title := coalesce(
    nullif(trim(p_snapshot->'journey'->>'title'), ''),
    v_title
  );

  insert into public.viaggio_journey_archives (
    owner_id, source_journey_id, title, snapshot, snapshot_version, byte_size
  ) values (
    v_uid,
    p_journey_id,
    v_title,
    p_snapshot,
    v_version,
    octet_length(p_snapshot::text)
  )
  returning * into v_row;

  delete from public.viaggio_journeys where id = p_journey_id;

  return v_row;
end;
$$;

revoke all on function public.archive_journey(uuid, jsonb) from public;
grant execute on function public.archive_journey(uuid, jsonb) to authenticated;

create or replace function public.delete_journey_archive(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  delete from public.viaggio_journey_archives
  where id = p_id and owner_id = v_uid;
  if not found then
    raise exception 'archive not found';
  end if;
end;
$$;

revoke all on function public.delete_journey_archive(uuid) from public;
grant execute on function public.delete_journey_archive(uuid) to authenticated;
