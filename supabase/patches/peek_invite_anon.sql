-- Allow logged-out guests to preview an invite (journey title / role / expiry)
-- so AcceptInvite can show “Sign in to join”. accept_invite stays authenticated-only.
--
-- Run once in Supabase → SQL Editor on existing projects.

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
  if p_token is null or length(trim(p_token)) = 0 then
    return;
  end if;

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
grant execute on function public.peek_invite(text) to anon, authenticated;
