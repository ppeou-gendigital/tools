-- Multi-assignee support for journey todos.
-- Migrates single assignee_journey_person_id → viaggio_todo_assignees junction.
-- Run once in Supabase → SQL Editor on existing projects.
-- Fresh installs: prefer updated viaggio_schema.sql (same end state).

create table if not exists public.viaggio_todo_assignees (
  todo_id            uuid not null references public.viaggio_todos(id) on delete cascade,
  journey_person_id  uuid not null references public.viaggio_journey_people(id) on delete cascade,
  primary key (todo_id, journey_person_id)
);

create index if not exists viaggio_todo_assignees_person_idx
  on public.viaggio_todo_assignees (journey_person_id);

-- Move any existing single-assignee values into the junction table.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'viaggio_todos'
      and column_name = 'assignee_journey_person_id'
  ) then
    insert into public.viaggio_todo_assignees (todo_id, journey_person_id)
    select id, assignee_journey_person_id
    from public.viaggio_todos
    where assignee_journey_person_id is not null
    on conflict do nothing;

    alter table public.viaggio_todos
      drop column assignee_journey_person_id;
  end if;
end $$;

alter table public.viaggio_todo_assignees enable row level security;

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
