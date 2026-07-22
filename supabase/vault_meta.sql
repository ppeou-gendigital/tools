-- Shared per-app vault crypto metadata (same table Accesso uses).
-- Run once on the shared Supabase project if not already applied from
-- tool/accesso/supabase/vault_meta.sql. Safe to re-run.
--
-- App id conventions:
--   accesso              — Accesso single vault (salt/verifier/idle/hint)
--   notas:<lockboxUuid>  — one row per Notas lockbox (salt/verifier/hint)
--
-- Notas still keeps notas_lockboxes for name + FK targets and dual-writes
-- crypto columns for older clients; vault_meta is authoritative on pull.

create table if not exists public.vault_meta (
  user_id          uuid        not null references auth.users(id) on delete cascade,
  app_id           text        not null,
  salt             text        not null,
  iterations       integer     not null,
  verifier         jsonb       not null,
  hint             text,
  idle_timeout_ms  bigint,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (user_id, app_id),
  constraint vault_meta_app_id_nonempty check (char_length(trim(app_id)) > 0),
  constraint vault_meta_iterations_positive check (iterations > 0)
);

create index if not exists vault_meta_user_idx
  on public.vault_meta (user_id);

alter table public.vault_meta enable row level security;

drop policy if exists "vault_meta self-read"   on public.vault_meta;
drop policy if exists "vault_meta self-insert" on public.vault_meta;
drop policy if exists "vault_meta self-update" on public.vault_meta;
drop policy if exists "vault_meta self-delete" on public.vault_meta;

create policy "vault_meta self-read"
  on public.vault_meta for select using (auth.uid() = user_id);
create policy "vault_meta self-insert"
  on public.vault_meta for insert with check (auth.uid() = user_id);
create policy "vault_meta self-update"
  on public.vault_meta for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "vault_meta self-delete"
  on public.vault_meta for delete using (auth.uid() = user_id);
