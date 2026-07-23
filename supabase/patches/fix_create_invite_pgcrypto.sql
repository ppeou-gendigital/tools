-- Fix: create_invite → "function gen_random_bytes(integer) does not exist"
-- Run once in Supabase → SQL Editor, then retry Copy / Email / Text invite.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.create_invite(
  p_journey_id uuid,
  p_role text,
  p_expires_at timestamptz
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

  v_token := encode(gen_random_bytes(24), 'hex');

  insert into public.viaggio_invites (
    journey_id, token, role, expires_at, created_by
  ) values (
    p_journey_id, v_token, p_role, p_expires_at, v_uid
  )
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.create_invite(uuid, text, timestamptz) from public;
grant execute on function public.create_invite(uuid, text, timestamptz) to authenticated;
