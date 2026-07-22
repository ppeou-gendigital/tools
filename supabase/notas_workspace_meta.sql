-- Workspace sync semver for Notas (lockbox lifecycle + wipe sentinel).
-- Run in Supabase → SQL Editor. Safe to re-run.
--
-- Values:
--   0.0.0  — fresh / unset
--   0.0.1  — seeded (Napkin Notes) or existing content migrated
--   x.y.z  — bumps on lockbox add/update/delete (see app workspaceSemver.js)
--   -1     — intentional full wipe; clients clear cloud then reset to 0.0.0

create table if not exists public.notas_workspace_meta (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  semver     text        not null default '0.0.0',
  updated_at timestamptz not null default now()
);

alter table public.notas_workspace_meta enable row level security;

drop policy if exists "notas_workspace_meta self-read"   on public.notas_workspace_meta;
drop policy if exists "notas_workspace_meta self-insert" on public.notas_workspace_meta;
drop policy if exists "notas_workspace_meta self-update" on public.notas_workspace_meta;
drop policy if exists "notas_workspace_meta self-delete" on public.notas_workspace_meta;

create policy "notas_workspace_meta self-read"
  on public.notas_workspace_meta for select using (auth.uid() = user_id);
create policy "notas_workspace_meta self-insert"
  on public.notas_workspace_meta for insert with check (auth.uid() = user_id);
create policy "notas_workspace_meta self-update"
  on public.notas_workspace_meta for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas_workspace_meta self-delete"
  on public.notas_workspace_meta for delete using (auth.uid() = user_id);
