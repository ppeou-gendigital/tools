-- Shared journey todo checklist (pre-trip prep, etc.).
-- Run once in Supabase → SQL Editor on existing projects.
-- Fresh installs: prefer updated viaggio_schema.sql (same end state).
-- Multi-assignee junction: also run patches/todo_assignees.sql (or use schema).

create table if not exists public.viaggio_todos (
  id                           uuid primary key default gen_random_uuid(),
  journey_id                   uuid not null references public.viaggio_journeys(id) on delete cascade,
  title                        text not null,
  notes                        text not null default '',
  done                         boolean not null default false,
  due_on                       date,
  sort_order                   int not null default 0,
  created_by                   uuid not null references auth.users(id) on delete restrict,
  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now()
);

create index if not exists viaggio_todos_journey_sort_idx
  on public.viaggio_todos (journey_id, sort_order);

-- Drop legacy single-assignee column if an older patch created it.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'viaggio_todos'
      and column_name = 'assignee_journey_person_id'
  ) then
    alter table public.viaggio_todos
      drop column assignee_journey_person_id;
  end if;
end $$;

create table if not exists public.viaggio_todo_assignees (
  todo_id            uuid not null references public.viaggio_todos(id) on delete cascade,
  journey_person_id  uuid not null references public.viaggio_journey_people(id) on delete cascade,
  done               boolean not null default false,
  done_at            timestamptz,
  primary key (todo_id, journey_person_id)
);

alter table public.viaggio_todo_assignees
  add column if not exists done boolean not null default false;
alter table public.viaggio_todo_assignees
  add column if not exists done_at timestamptz;

create index if not exists viaggio_todo_assignees_person_idx
  on public.viaggio_todo_assignees (journey_person_id);

alter table public.viaggio_todos enable row level security;
alter table public.viaggio_todo_assignees enable row level security;

drop policy if exists "viaggio_todos select" on public.viaggio_todos;
drop policy if exists "viaggio_todos insert" on public.viaggio_todos;
drop policy if exists "viaggio_todos update" on public.viaggio_todos;
drop policy if exists "viaggio_todos delete" on public.viaggio_todos;

create policy "viaggio_todos select"
  on public.viaggio_todos for select
  using (public.viaggio_is_member(journey_id));
create policy "viaggio_todos insert"
  on public.viaggio_todos for insert
  with check (public.viaggio_is_editor(journey_id) and created_by = auth.uid());
create policy "viaggio_todos update"
  on public.viaggio_todos for update
  using (public.viaggio_is_editor(journey_id))
  with check (public.viaggio_is_editor(journey_id));
create policy "viaggio_todos delete"
  on public.viaggio_todos for delete
  using (public.viaggio_is_editor(journey_id));

drop policy if exists "viaggio_todo_assignees select" on public.viaggio_todo_assignees;
drop policy if exists "viaggio_todo_assignees insert" on public.viaggio_todo_assignees;
drop policy if exists "viaggio_todo_assignees delete" on public.viaggio_todo_assignees;

create policy "viaggio_todo_assignees select"
  on public.viaggio_todo_assignees for select
  using (
    exists (
      select 1 from public.viaggio_todos t
      where t.id = todo_id and public.viaggio_is_member(t.journey_id)
    )
  );
create policy "viaggio_todo_assignees insert"
  on public.viaggio_todo_assignees for insert
  with check (
    exists (
      select 1 from public.viaggio_todos t
      where t.id = todo_id and public.viaggio_is_editor(t.journey_id)
    )
  );
create policy "viaggio_todo_assignees delete"
  on public.viaggio_todo_assignees for delete
  using (
    exists (
      select 1 from public.viaggio_todos t
      where t.id = todo_id and public.viaggio_is_editor(t.journey_id)
    )
  );
drop policy if exists "viaggio_todo_assignees update" on public.viaggio_todo_assignees;
create policy "viaggio_todo_assignees update"
  on public.viaggio_todo_assignees for update
  using (
    exists (
      select 1 from public.viaggio_todos t
      where t.id = todo_id and public.viaggio_is_editor(t.journey_id)
    )
  )
  with check (
    exists (
      select 1 from public.viaggio_todos t
      where t.id = todo_id and public.viaggio_is_editor(t.journey_id)
    )
  );
