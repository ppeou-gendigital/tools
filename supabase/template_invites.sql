-- Generic workspace + invite join flow for tools from template/base.
--
-- After `npm run init -- --name foo`, placeholders become:
--   toolname_workspaces          → foo_workspaces
--   toolname_workspace_members   → foo_workspace_members
--   toolname_invites             → foo_invites
--   toolname_* RPCs              → foo_*
--
-- Pattern (same as Viaggio journeys):
--   1. Owner creates a workspace and gets an owner membership.
--   2. Owner creates a shareable invite token (create_invite).
--   3. Guest opens /?invite=TOKEN → peek_invite (anon OK) → sign in → accept_invite.
--
-- Run in Supabase → SQL Editor. Safe to re-run (create or replace / drop policy).
-- Requires: create extension if not exists pgcrypto with schema extensions;

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.toolname_workspaces (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  created_by  uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.toolname_workspace_members (
  workspace_id uuid not null references public.toolname_workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null check (role in ('owner', 'editor', 'viewer')),
  joined_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists toolname_workspace_members_user_idx
  on public.toolname_workspace_members (user_id);

create table if not exists public.toolname_invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.toolname_workspaces(id) on delete cascade,
  token        text not null unique,
  role         text not null check (role in ('owner', 'editor', 'viewer')),
  expires_at   timestamptz not null,
  revoked_at   timestamptz,
  created_by   uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  email        text
);

create index if not exists toolname_invites_workspace_idx
  on public.toolname_invites (workspace_id);
create index if not exists toolname_invites_token_idx
  on public.toolname_invites (token)
  where revoked_at is null;

-- ---------------------------------------------------------------------------
-- Membership helpers
-- ---------------------------------------------------------------------------

create or replace function public.toolname_is_member(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.toolname_workspace_members m
    where m.workspace_id = p_workspace_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.toolname_my_role(p_workspace_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select m.role
  from public.toolname_workspace_members m
  where m.workspace_id = p_workspace_id and m.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.toolname_is_owner(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.toolname_my_role(p_workspace_id) = 'owner', false);
$$;

revoke all on function public.toolname_is_member(uuid) from public;
revoke all on function public.toolname_my_role(uuid) from public;
revoke all on function public.toolname_is_owner(uuid) from public;
grant execute on function public.toolname_is_member(uuid) to authenticated;
grant execute on function public.toolname_my_role(uuid) to authenticated;
grant execute on function public.toolname_is_owner(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.toolname_workspaces enable row level security;
alter table public.toolname_workspace_members enable row level security;
alter table public.toolname_invites enable row level security;

drop policy if exists "toolname_workspaces select" on public.toolname_workspaces;
drop policy if exists "toolname_workspaces insert" on public.toolname_workspaces;
drop policy if exists "toolname_workspaces update" on public.toolname_workspaces;
drop policy if exists "toolname_workspaces delete" on public.toolname_workspaces;

create policy "toolname_workspaces select"
  on public.toolname_workspaces for select
  using (public.toolname_is_member(id));
create policy "toolname_workspaces insert"
  on public.toolname_workspaces for insert
  with check (created_by = auth.uid());
create policy "toolname_workspaces update"
  on public.toolname_workspaces for update
  using (public.toolname_is_owner(id))
  with check (public.toolname_is_owner(id));
create policy "toolname_workspaces delete"
  on public.toolname_workspaces for delete
  using (public.toolname_is_owner(id));

drop policy if exists "toolname_workspace_members select" on public.toolname_workspace_members;
create policy "toolname_workspace_members select"
  on public.toolname_workspace_members for select
  using (public.toolname_is_member(workspace_id));
-- Mutations via RPCs only.

drop policy if exists "toolname_invites select" on public.toolname_invites;
drop policy if exists "toolname_invites insert" on public.toolname_invites;
drop policy if exists "toolname_invites update" on public.toolname_invites;

create policy "toolname_invites select"
  on public.toolname_invites for select
  using (public.toolname_is_owner(workspace_id));
create policy "toolname_invites insert"
  on public.toolname_invites for insert
  with check (public.toolname_is_owner(workspace_id) and created_by = auth.uid());
create policy "toolname_invites update"
  on public.toolname_invites for update
  using (public.toolname_is_owner(workspace_id))
  with check (public.toolname_is_owner(workspace_id));

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

create or replace function public.toolname_create_workspace(p_title text)
returns public.toolname_workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.toolname_workspaces;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_title is null or length(trim(p_title)) = 0 then
    raise exception 'title required';
  end if;

  insert into public.toolname_workspaces (title, created_by)
  values (trim(p_title), v_uid)
  returning * into v_row;

  insert into public.toolname_workspace_members (workspace_id, user_id, role)
  values (v_row.id, v_uid, 'owner');

  return v_row;
end;
$$;

revoke all on function public.toolname_create_workspace(text) from public;
grant execute on function public.toolname_create_workspace(text) to authenticated;

create or replace function public.toolname_create_invite(
  p_workspace_id uuid,
  p_role text,
  p_expires_at timestamptz,
  p_email text default null
)
returns public.toolname_invites
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.toolname_invites;
  v_token text;
  v_email text := nullif(trim(p_email), '');
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if not public.toolname_is_owner(p_workspace_id) then
    raise exception 'forbidden';
  end if;
  if p_role not in ('owner', 'editor', 'viewer') then
    raise exception 'invalid role';
  end if;
  if p_expires_at is null or p_expires_at <= now() then
    raise exception 'expires_at must be in the future';
  end if;

  v_token := encode(gen_random_bytes(24), 'hex');

  insert into public.toolname_invites (
    workspace_id, token, role, expires_at, created_by, email
  ) values (
    p_workspace_id, v_token, p_role, p_expires_at, v_uid, v_email
  )
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.toolname_create_invite(uuid, text, timestamptz, text) from public;
grant execute on function public.toolname_create_invite(uuid, text, timestamptz, text) to authenticated;

create or replace function public.toolname_revoke_invite(p_invite_id uuid)
returns public.toolname_invites
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.toolname_invites;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  update public.toolname_invites i
  set revoked_at = now()
  where i.id = p_invite_id
    and public.toolname_is_owner(i.workspace_id)
    and i.revoked_at is null
  returning * into v_row;

  if v_row.id is null then
    raise exception 'invite not found or forbidden';
  end if;
  return v_row;
end;
$$;

revoke all on function public.toolname_revoke_invite(uuid) from public;
grant execute on function public.toolname_revoke_invite(uuid) to authenticated;

-- Logged-out guests must be able to preview title/role before signing in.
create or replace function public.toolname_peek_invite(p_token text)
returns table (
  workspace_id uuid,
  workspace_title text,
  role text,
  expires_at timestamptz,
  revoked boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv public.toolname_invites;
  v_title text;
begin
  if p_token is null or length(trim(p_token)) = 0 then
    return;
  end if;

  select * into v_inv from public.toolname_invites i where i.token = p_token limit 1;
  if v_inv.id is null then
    return;
  end if;

  select w.title into v_title
  from public.toolname_workspaces w
  where w.id = v_inv.workspace_id;

  workspace_id := v_inv.workspace_id;
  workspace_title := coalesce(v_title, 'Workspace');
  role := v_inv.role;
  expires_at := v_inv.expires_at;
  revoked := v_inv.revoked_at is not null;
  return next;
end;
$$;

revoke all on function public.toolname_peek_invite(text) from public;
grant execute on function public.toolname_peek_invite(text) to anon, authenticated;

create or replace function public.toolname_accept_invite(p_token text)
returns public.toolname_workspace_members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_inv public.toolname_invites;
  v_mem public.toolname_workspace_members;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_inv
  from public.toolname_invites i
  where i.token = p_token
  limit 1;

  if v_inv.id is null then raise exception 'invite not found'; end if;
  if v_inv.revoked_at is not null then raise exception 'invite revoked'; end if;
  if v_inv.expires_at <= now() then raise exception 'invite expired'; end if;

  select * into v_mem
  from public.toolname_workspace_members m
  where m.workspace_id = v_inv.workspace_id and m.user_id = v_uid;

  if v_mem.user_id is null then
    insert into public.toolname_workspace_members (workspace_id, user_id, role)
    values (v_inv.workspace_id, v_uid, v_inv.role)
    returning * into v_mem;
  end if;

  return v_mem;
end;
$$;

revoke all on function public.toolname_accept_invite(text) from public;
grant execute on function public.toolname_accept_invite(text) to authenticated;
