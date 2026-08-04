-- Per-user AEM Author domain catalogs for Loopy EDS-UE.
--
-- One row per (user, author host). Stores:
--   sites              — discovered /content children + pin state + page nodes
--   sites_fetched_at   — last sites-list Query Builder run
--
-- Page catalogs live on pinned site entries inside `sites` jsonb
-- (not in user_visits). Separate from visit history by design.
--
-- Each site object in `sites` may include:
--   path, title, pinned, deliveryKind, deliveryKindManual,
--   edsDomains — manual publish origins for Preview/Live, e.g.
--     [{ "origin": "https://main--repo--owner.aem.live",
--        "kind": "eds"|"vanity", "label": "…", "isDefault": true }],
--   pagesScannedAt, nodes[]
--
-- Run in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.loopy_aem_author_sites (
  user_id          uuid        not null references auth.users(id) on delete cascade,
  author_host      text        not null,
  author_origin    text        not null default '',
  sites            jsonb       not null default '[]'::jsonb,
  sites_fetched_at timestamptz,
  updated_at       timestamptz not null default now(),
  primary key (user_id, author_host)
);

alter table public.loopy_aem_author_sites enable row level security;

drop policy if exists "loopy_aem_author_sites self-read"   on public.loopy_aem_author_sites;
drop policy if exists "loopy_aem_author_sites self-insert" on public.loopy_aem_author_sites;
drop policy if exists "loopy_aem_author_sites self-update" on public.loopy_aem_author_sites;
drop policy if exists "loopy_aem_author_sites self-delete" on public.loopy_aem_author_sites;

create policy "loopy_aem_author_sites self-read"
  on public.loopy_aem_author_sites for select using (auth.uid() = user_id);
create policy "loopy_aem_author_sites self-insert"
  on public.loopy_aem_author_sites for insert with check (auth.uid() = user_id);
create policy "loopy_aem_author_sites self-update"
  on public.loopy_aem_author_sites for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "loopy_aem_author_sites self-delete"
  on public.loopy_aem_author_sites for delete using (auth.uid() = user_id);

create index if not exists loopy_aem_author_sites_user_updated_idx
  on public.loopy_aem_author_sites (user_id, updated_at desc);
