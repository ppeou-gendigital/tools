-- Per-app vault crypto metadata (salt / verifier / idle / hint).
-- Shared Supabase project — never store this inside public.user_data.data
-- (sibling prefs CAS must not be able to wipe it).
--
-- App id conventions:
--   accesso              — Accesso single vault
--   notas:<lockboxUuid>  — one row per Notas lockbox
--
-- Run in Supabase → SQL Editor. Safe to re-run.

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

-- Optional one-time cleanup for a broken Accesso vault (orphaned ciphertext
-- after vault meta was wiped from user_data). Replace the UUID, then run.
--
-- delete from public.credentials
--   where user_id = '1623b278-2570-4e9e-ab34-7c58c3bf8127';
-- delete from public.credit_cards
--   where user_id = '1623b278-2570-4e9e-ab34-7c58c3bf8127';
-- delete from public.vault_meta
--   where user_id = '1623b278-2570-4e9e-ab34-7c58c3bf8127'
--     and app_id = 'accesso';
-- update public.user_data
--   set data = coalesce(data, '{}'::jsonb) - 'vault',
--       updated_at = now()
--   where id = '1623b278-2570-4e9e-ab34-7c58c3bf8127';
