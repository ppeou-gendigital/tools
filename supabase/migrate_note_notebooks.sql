-- One-time migration: single notebook_id → many-to-many note↔notebook.
-- Run in Supabase → SQL Editor after deploying the app that expects
-- notas_note_notebooks. Safe to re-run.

-- 1. Join table + RLS
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

-- 2. Backfill from legacy notebook_id (no-op if column already dropped)
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'notas_notes'
      and column_name = 'notebook_id'
  ) then
    insert into public.notas_note_notebooks (note_id, notebook_id, user_id)
    select n.id, n.notebook_id, n.user_id
    from public.notas_notes n
    where n.notebook_id is not null
    on conflict (note_id, notebook_id) do nothing;

    drop index if exists public.notas_notes_user_notebook_idx;
    alter table public.notas_notes drop column notebook_id;
  end if;
end $$;
