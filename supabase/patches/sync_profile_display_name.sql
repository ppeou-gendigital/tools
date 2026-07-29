-- SUPERSEDED by patches/drop_viaggio_people.sql (journey-local names; no library).
-- Do not re-run. Kept for history only.
--
-- Sync profiles.display_name onto linked roster seats + self person rows.
-- Also fix accept_invite so a non-empty stale roster name does not block the profile name.
-- Run once in Supabase → SQL Editor.

create or replace function public.sync_my_display_name(p_display_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_name text := nullif(trim(p_display_name), '');
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if v_name is null then return; end if;

  update public.viaggio_people
  set display_name = v_name,
      updated_at = now()
  where linked_user_id = v_uid
    and owner_id = v_uid;

  update public.viaggio_journey_people
  set display_name = v_name,
      updated_at = now()
  where linked_user_id = v_uid;
end;
$$;

revoke all on function public.sync_my_display_name(text) from public;
grant execute on function public.sync_my_display_name(text) to authenticated;

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

  -- Prefer profile display name over stale invite-time roster copy.
  if coalesce(v_name, '') <> '' then
    update public.viaggio_journey_people
    set display_name = v_name,
        email = coalesce(email, v_email),
        updated_at = now()
    where journey_id = v_inv.journey_id
      and linked_user_id = v_uid;

    update public.viaggio_people
    set display_name = v_name,
        email = coalesce(email, v_email),
        updated_at = now()
    where owner_id = v_uid
      and linked_user_id = v_uid;
  elsif v_inv.journey_person_id is not null then
    update public.viaggio_journey_people
    set email = coalesce(email, v_email)
    where id = v_inv.journey_person_id;
  end if;

  return v_mem;
end;
$$;
