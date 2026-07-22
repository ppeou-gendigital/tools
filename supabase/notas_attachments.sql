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
