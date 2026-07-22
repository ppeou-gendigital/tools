-- Generic attachments table + private Storage bucket for tools from template/base.
--
-- After `npm run init -- --name foo`, replace placeholders (or rely on init
-- sweeping `toolname` in this file if you keep it under the tool tree):
--   toolname_attachments  →  foo_attachments
--   toolname-attachments  →  foo-attachments
--
-- Wire `parent_id` to your owning table (notes, cards, …), e.g.:
--   parent_id uuid not null references public.foo_notes(id) on delete cascade
--
-- Run in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.toolname_attachments (
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

create index if not exists toolname_attachments_parent_idx
  on public.toolname_attachments (user_id, parent_id, created_at desc);

alter table public.toolname_attachments enable row level security;

drop policy if exists "toolname_attachments self-read"   on public.toolname_attachments;
drop policy if exists "toolname_attachments self-insert" on public.toolname_attachments;
drop policy if exists "toolname_attachments self-update" on public.toolname_attachments;
drop policy if exists "toolname_attachments self-delete" on public.toolname_attachments;

create policy "toolname_attachments self-read"
  on public.toolname_attachments for select using (auth.uid() = user_id);
create policy "toolname_attachments self-insert"
  on public.toolname_attachments for insert with check (auth.uid() = user_id);
create policy "toolname_attachments self-update"
  on public.toolname_attachments for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "toolname_attachments self-delete"
  on public.toolname_attachments for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('toolname-attachments', 'toolname-attachments', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "toolname_attachments storage read" on storage.objects;
drop policy if exists "toolname_attachments storage insert" on storage.objects;
drop policy if exists "toolname_attachments storage update" on storage.objects;
drop policy if exists "toolname_attachments storage delete" on storage.objects;

-- Paths: {user_id}/{parent_id}/{attachment_id}
create policy "toolname_attachments storage read"
  on storage.objects for select
  using (
    bucket_id = 'toolname-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "toolname_attachments storage insert"
  on storage.objects for insert
  with check (
    bucket_id = 'toolname-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "toolname_attachments storage update"
  on storage.objects for update
  using (
    bucket_id = 'toolname-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'toolname-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "toolname_attachments storage delete"
  on storage.objects for delete
  using (
    bucket_id = 'toolname-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
