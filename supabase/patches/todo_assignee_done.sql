-- Per-assignee completion on journey todos.
-- Run once in Supabase → SQL Editor on existing projects.
-- Fresh installs: prefer updated viaggio_schema.sql (same end state).

alter table public.viaggio_todo_assignees
  add column if not exists done boolean not null default false;

alter table public.viaggio_todo_assignees
  add column if not exists done_at timestamptz;

-- Roll up: todos with assignees become done only when every assignee is done.
update public.viaggio_todos t
set done = coalesce((
  select bool_and(a.done)
  from public.viaggio_todo_assignees a
  where a.todo_id = t.id
), t.done);

-- Seed assignee.done from overall todo.done for existing rows.
update public.viaggio_todo_assignees a
set
  done = t.done,
  done_at = case when t.done then coalesce(a.done_at, now()) else null end
from public.viaggio_todos t
where a.todo_id = t.id;

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
