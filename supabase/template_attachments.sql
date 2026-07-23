-- DEPRECATED for Viaggio: use viaggio_schema.sql instead (entry-scoped
-- attachments with membership RLS). Kept only as a template reference.
--
-- Generic attachments table + private Storage bucket for tools from template/base.
--
-- After `npm run init -- --name foo`, replace placeholders (or rely on init
-- sweeping `viaggio` in this file if you keep it under the tool tree):
--   viaggio_attachments  →  foo_attachments
--   viaggio-attachments  →  foo-attachments
--
-- Wire `parent_id` to your owning table (notes, cards, …), e.g.:
--   parent_id uuid not null references public.foo_notes(id) on delete cascade
--
-- Run in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.viaggio_attachments (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  -- Owning domain row. Add an FK once your parent table exists.
  parent_id     uuid        not null,
  file_name     text        not null,
  mime_type     text        not null default 'application/octet-stream',
  byte_size     bigint      not null default 0,
  storage_path  text        not null,
  -- Set when the Storage blob is AES-GCM ciphertext (optional E2EE).
  iv            text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (storage_path)
);

create index if not exists viaggio_attachments_parent_idx
  on public.viaggio_attachments (user_id, parent_id, created_at desc);

alter table public.viaggio_attachments enable row level security;

drop policy if exists "viaggio_attachments self-read"   on public.viaggio_attachments;
drop policy if exists "viaggio_attachments self-insert" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments self-update" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments self-delete" on public.viaggio_attachments;

create policy "viaggio_attachments self-read"
  on public.viaggio_attachments for select using (auth.uid() = user_id);
create policy "viaggio_attachments self-insert"
  on public.viaggio_attachments for insert with check (auth.uid() = user_id);
create policy "viaggio_attachments self-update"
  on public.viaggio_attachments for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "viaggio_attachments self-delete"
  on public.viaggio_attachments for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('viaggio-attachments', 'viaggio-attachments', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "viaggio_attachments storage read" on storage.objects;
drop policy if exists "viaggio_attachments storage insert" on storage.objects;
drop policy if exists "viaggio_attachments storage update" on storage.objects;
drop policy if exists "viaggio_attachments storage delete" on storage.objects;

-- Paths: {user_id}/{parent_id}/{attachment_id}
create policy "viaggio_attachments storage read"
  on storage.objects for select
  using (
    bucket_id = 'viaggio-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "viaggio_attachments storage insert"
  on storage.objects for insert
  with check (
    bucket_id = 'viaggio-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "viaggio_attachments storage update"
  on storage.objects for update
  using (
    bucket_id = 'viaggio-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'viaggio-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "viaggio_attachments storage delete"
  on storage.objects for delete
  using (
    bucket_id = 'viaggio-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
