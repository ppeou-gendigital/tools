-- Notas domain tables for the shared Supabase project (with Accesso / Loopy).
-- Assumes auth.users already exists. Does NOT create profiles or user_data.
--
-- Run in Supabase → SQL Editor. Safe to re-run (IF NOT EXISTS / drop policy).
-- If you already have notas_notes.notebook_id, also run
-- supabase/migrate_note_notebooks.sql once.
-- Also run supabase/notas_workspace_meta.sql (sync semver) and
-- supabase/vault_meta.sql (lockbox crypto) if not already applied.

-- ---------------------------------------------------------------------------
-- Lockboxes (passphrase meta only — never store the passphrase)
-- ---------------------------------------------------------------------------
create table if not exists public.notas_lockboxes (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  name          text        not null,
  salt          text        not null,
  iterations    integer     not null,
  verifier_ct   text        not null,
  verifier_iv   text        not null,
  hint          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists notas_lockboxes_user_idx
  on public.notas_lockboxes (user_id);

alter table public.notas_lockboxes enable row level security;

drop policy if exists "notas_lockboxes self-read"   on public.notas_lockboxes;
drop policy if exists "notas_lockboxes self-insert" on public.notas_lockboxes;
drop policy if exists "notas_lockboxes self-update" on public.notas_lockboxes;
drop policy if exists "notas_lockboxes self-delete" on public.notas_lockboxes;

create policy "notas_lockboxes self-read"
  on public.notas_lockboxes for select using (auth.uid() = user_id);
create policy "notas_lockboxes self-insert"
  on public.notas_lockboxes for insert with check (auth.uid() = user_id);
create policy "notas_lockboxes self-update"
  on public.notas_lockboxes for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas_lockboxes self-delete"
  on public.notas_lockboxes for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Notebooks
-- ---------------------------------------------------------------------------
create table if not exists public.notas_notebooks (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  name            text        not null,
  default_view    text        not null default 'timeline'
                    check (default_view in ('book', 'timeline', 'custom', 'tags')),
  timeline_field  text        not null default 'updatedAt'
                    check (timeline_field in ('createdAt', 'updatedAt')),
  lockbox_id      uuid        references public.notas_lockboxes(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists notas_notebooks_user_idx
  on public.notas_notebooks (user_id, updated_at desc);

alter table public.notas_notebooks enable row level security;

drop policy if exists "notas_notebooks self-read"   on public.notas_notebooks;
drop policy if exists "notas_notebooks self-insert" on public.notas_notebooks;
drop policy if exists "notas_notebooks self-update" on public.notas_notebooks;
drop policy if exists "notas_notebooks self-delete" on public.notas_notebooks;

create policy "notas_notebooks self-read"
  on public.notas_notebooks for select using (auth.uid() = user_id);
create policy "notas_notebooks self-insert"
  on public.notas_notebooks for insert with check (auth.uid() = user_id);
create policy "notas_notebooks self-update"
  on public.notas_notebooks for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas_notebooks self-delete"
  on public.notas_notebooks for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Notes
-- ---------------------------------------------------------------------------
-- Unlocked notes: title + body plaintext, ciphertext/iv null.
-- Locked notes: title is a placeholder (e.g. 'Locked note'), body empty,
--               sensitive content in ciphertext + iv (AES-GCM base64),
--               same pattern as Accesso credentials.
-- Notebook membership is many-to-many via notas_note_notebooks.
create table if not exists public.notas_notes (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  title         text        not null default 'Untitled',
  body          text        not null default '',
  page_number   integer     not null default 0,
  sort_key      integer     not null default 0,
  lockbox_id    uuid        references public.notas_lockboxes(id) on delete set null,
  ciphertext    text,
  iv            text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint notas_notes_lock_pair check (
    (ciphertext is null and iv is null)
    or (ciphertext is not null and iv is not null)
  )
);

create index if not exists notas_notes_user_updated_idx
  on public.notas_notes (user_id, updated_at desc);

alter table public.notas_notes enable row level security;

drop policy if exists "notas_notes self-read"   on public.notas_notes;
drop policy if exists "notas_notes self-insert" on public.notas_notes;
drop policy if exists "notas_notes self-update" on public.notas_notes;
drop policy if exists "notas_notes self-delete" on public.notas_notes;

create policy "notas_notes self-read"
  on public.notas_notes for select using (auth.uid() = user_id);
create policy "notas_notes self-insert"
  on public.notas_notes for insert with check (auth.uid() = user_id);
create policy "notas_notes self-update"
  on public.notas_notes for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas_notes self-delete"
  on public.notas_notes for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Note ↔ notebook join (a note can live in multiple notebooks)
-- ---------------------------------------------------------------------------
create table if not exists public.notas_note_notebooks (
  note_id     uuid not null references public.notas_notes(id) on delete cascade,
  notebook_id uuid not null references public.notas_notebooks(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  primary key (note_id, notebook_id)
);

create index if not exists notas_note_notebooks_user_notebook_idx
  on public.notas_note_notebooks (user_id, notebook_id);

alter table public.notas_note_notebooks enable row level security;

drop policy if exists "notas_note_notebooks self-read"   on public.notas_note_notebooks;
drop policy if exists "notas_note_notebooks self-insert" on public.notas_note_notebooks;
drop policy if exists "notas_note_notebooks self-update" on public.notas_note_notebooks;
drop policy if exists "notas_note_notebooks self-delete" on public.notas_note_notebooks;

create policy "notas_note_notebooks self-read"
  on public.notas_note_notebooks for select using (auth.uid() = user_id);
create policy "notas_note_notebooks self-insert"
  on public.notas_note_notebooks for insert with check (auth.uid() = user_id);
create policy "notas_note_notebooks self-update"
  on public.notas_note_notebooks for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas_note_notebooks self-delete"
  on public.notas_note_notebooks for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Tags
-- ---------------------------------------------------------------------------
create table if not exists public.notas_tags (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  name       text        not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create index if not exists notas_tags_user_idx
  on public.notas_tags (user_id);

alter table public.notas_tags enable row level security;

drop policy if exists "notas_tags self-read"   on public.notas_tags;
drop policy if exists "notas_tags self-insert" on public.notas_tags;
drop policy if exists "notas_tags self-update" on public.notas_tags;
drop policy if exists "notas_tags self-delete" on public.notas_tags;

create policy "notas_tags self-read"
  on public.notas_tags for select using (auth.uid() = user_id);
create policy "notas_tags self-insert"
  on public.notas_tags for insert with check (auth.uid() = user_id);
create policy "notas_tags self-update"
  on public.notas_tags for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas_tags self-delete"
  on public.notas_tags for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Note ↔ tag join
-- ---------------------------------------------------------------------------
create table if not exists public.notas_note_tags (
  note_id uuid not null references public.notas_notes(id) on delete cascade,
  tag_id  uuid not null references public.notas_tags(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (note_id, tag_id)
);

create index if not exists notas_note_tags_user_tag_idx
  on public.notas_note_tags (user_id, tag_id);

alter table public.notas_note_tags enable row level security;

drop policy if exists "notas_note_tags self-read"   on public.notas_note_tags;
drop policy if exists "notas_note_tags self-insert" on public.notas_note_tags;
drop policy if exists "notas_note_tags self-update" on public.notas_note_tags;
drop policy if exists "notas_note_tags self-delete" on public.notas_note_tags;

create policy "notas_note_tags self-read"
  on public.notas_note_tags for select using (auth.uid() = user_id);
create policy "notas_note_tags self-insert"
  on public.notas_note_tags for insert with check (auth.uid() = user_id);
create policy "notas_note_tags self-update"
  on public.notas_note_tags for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas_note_tags self-delete"
  on public.notas_note_tags for delete using (auth.uid() = user_id);
-- Notas attachments + private Storage bucket.
-- Run in Supabase → SQL Editor (shared project with Accesso / Loopy).
-- Safe to re-run.

-- ---------------------------------------------------------------------------
-- Metadata table
-- ---------------------------------------------------------------------------
create table if not exists public.notas_attachments (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  note_id       uuid        not null references public.notas_notes(id) on delete cascade,
  file_name     text        not null,
  mime_type     text        not null default 'application/octet-stream',
  byte_size     bigint      not null default 0,
  storage_path  text        not null,
  -- Set when the blob in Storage is AES-GCM ciphertext (lockbox-protected note).
  iv            text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (storage_path)
);

create index if not exists notas_attachments_note_idx
  on public.notas_attachments (user_id, note_id, created_at desc);

alter table public.notas_attachments enable row level security;

drop policy if exists "notas_attachments self-read"   on public.notas_attachments;
drop policy if exists "notas_attachments self-insert" on public.notas_attachments;
drop policy if exists "notas_attachments self-update" on public.notas_attachments;
drop policy if exists "notas_attachments self-delete" on public.notas_attachments;

create policy "notas_attachments self-read"
  on public.notas_attachments for select using (auth.uid() = user_id);
create policy "notas_attachments self-insert"
  on public.notas_attachments for insert with check (auth.uid() = user_id);
create policy "notas_attachments self-update"
  on public.notas_attachments for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notas_attachments self-delete"
  on public.notas_attachments for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Private Storage bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('notas-attachments', 'notas-attachments', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "notas_attachments storage read" on storage.objects;
drop policy if exists "notas_attachments storage insert" on storage.objects;
drop policy if exists "notas_attachments storage update" on storage.objects;
drop policy if exists "notas_attachments storage delete" on storage.objects;

-- Paths: {user_id}/{note_id}/{attachment_id}
create policy "notas_attachments storage read"
  on storage.objects for select
  using (
    bucket_id = 'notas-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "notas_attachments storage insert"
  on storage.objects for insert
  with check (
    bucket_id = 'notas-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "notas_attachments storage update"
  on storage.objects for update
  using (
    bucket_id = 'notas-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'notas-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "notas_attachments storage delete"
  on storage.objects for delete
  using (
    bucket_id = 'notas-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- Also available as supabase/notas_attachments.sql for one-off runs.
