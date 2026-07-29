-- Drop personal people library; travelers live only on viaggio_journey_people.
-- Profile display_name seeds new seats (create_journey / accept_invite); names stay journey-local after that.
-- Safe to re-run.

-- ---------------------------------------------------------------------------
-- RPCs (no longer touch viaggio_people)
-- ---------------------------------------------------------------------------

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
  v_row public.viaggio_journey_people;
  v_name text;
  v_email text;
begin
  select * into v_row
  from public.viaggio_journey_people
  where journey_id = p_journey_id and linked_user_id = p_uid
  limit 1;
  if v_row.id is not null then return v_row; end if;

  select nullif(trim(display_name), ''), email
    into v_name, v_email
  from public.profiles where id = p_uid;

  insert into public.viaggio_journey_people (
    journey_id, display_name, email, linked_user_id, created_by
  ) values (
    p_journey_id,
    coalesce(v_name, nullif(trim(v_email), ''), left(p_uid::text, 8)),
    v_email,
    p_uid,
    p_uid
  )
  returning * into v_row;
  return v_row;
end;
$$;

-- Old signature had p_person_id (library FK).
drop function if exists public.add_journey_person(uuid, uuid, text, text, text);

create or replace function public.add_journey_person(
  p_journey_id uuid,
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
  v_uid uuid := auth.uid();
  v_row public.viaggio_journey_people;
  v_name text;
  v_email text;
  v_phone text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if not public.viaggio_is_editor(p_journey_id) then
    raise exception 'forbidden';
  end if;

  v_name := trim(coalesce(p_display_name, ''));
  if v_name = '' then raise exception 'display_name required'; end if;
  v_email := nullif(trim(p_email), '');
  v_phone := nullif(trim(p_phone_e164), '');

  insert into public.viaggio_journey_people (
    journey_id, display_name, email, phone_e164, created_by
  ) values (
    p_journey_id, v_name, v_email, v_phone, v_uid
  )
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.add_journey_person(uuid, text, text, text) from public;
grant execute on function public.add_journey_person(uuid, text, text, text) to authenticated;

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

  select nullif(trim(display_name), ''), email
    into v_name, v_email
  from public.profiles where id = v_uid;

  -- First bind: claim seat (seed name from profile when present) or create seat.
  if v_inv.journey_person_id is not null then
    update public.viaggio_journey_people
    set linked_user_id = v_uid,
        display_name = coalesce(v_name, display_name),
        email = coalesce(email, v_email),
        updated_at = now()
    where id = v_inv.journey_person_id
      and journey_id = v_inv.journey_id
      and (linked_user_id is null or linked_user_id = v_uid);
  else
    perform public.viaggio_ensure_journey_person_for_user(v_inv.journey_id, v_uid);
  end if;

  return v_mem;
end;
$$;

drop function if exists public.sync_my_display_name(text);
drop function if exists public.upsert_person(uuid, text, text, text);
drop function if exists public.delete_person(uuid);
drop function if exists public.viaggio_ensure_self_person(uuid);

-- ---------------------------------------------------------------------------
-- Schema: drop library FK / table
-- ---------------------------------------------------------------------------

drop index if exists public.viaggio_journey_people_person_uidx;

alter table public.viaggio_journey_people
  drop column if exists person_id;

drop policy if exists "viaggio_people select" on public.viaggio_people;
drop policy if exists "viaggio_people insert" on public.viaggio_people;
drop policy if exists "viaggio_people update" on public.viaggio_people;
drop policy if exists "viaggio_people delete" on public.viaggio_people;

drop table if exists public.viaggio_people;
