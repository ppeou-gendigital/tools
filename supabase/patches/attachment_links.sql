-- Attachment ↔ activity / expense M:N (0–N each).
-- Empty links = journey-level attachment. Storage for new files: {journey_id}/{attachment_id}.

-- ---------------------------------------------------------------------------
-- journey_id required
-- ---------------------------------------------------------------------------

alter table public.viaggio_attachments
  add column if not exists journey_id uuid references public.viaggio_journeys(id) on delete cascade;

update public.viaggio_attachments a
set journey_id = public.viaggio_entry_journey_id(a.entry_id)
where a.journey_id is null and a.entry_id is not null;

update public.viaggio_attachments a
set journey_id = x.journey_id
from public.viaggio_expenses x
where a.journey_id is null and a.expense_id = x.id;

delete from public.viaggio_attachments where journey_id is null;

alter table public.viaggio_attachments
  alter column journey_id set not null;

alter table public.viaggio_attachments
  drop constraint if exists viaggio_attachments_scope_chk;

alter table public.viaggio_attachments
  add constraint viaggio_attachments_scope_chk
  check (journey_id is not null);

create index if not exists viaggio_attachments_journey_idx
  on public.viaggio_attachments (journey_id);

-- ---------------------------------------------------------------------------
-- Junctions
-- ---------------------------------------------------------------------------

create table if not exists public.viaggio_attachment_entries (
  attachment_id uuid not null references public.viaggio_attachments(id) on delete cascade,
  entry_id      uuid not null references public.viaggio_entries(id) on delete cascade,
  primary key (attachment_id, entry_id)
);

create index if not exists viaggio_attachment_entries_entry_idx
  on public.viaggio_attachment_entries (entry_id);

create table if not exists public.viaggio_attachment_expenses (
  attachment_id uuid not null references public.viaggio_attachments(id) on delete cascade,
  expense_id    uuid not null references public.viaggio_expenses(id) on delete cascade,
  primary key (attachment_id, expense_id)
);

create index if not exists viaggio_attachment_expenses_expense_idx
  on public.viaggio_attachment_expenses (expense_id);

alter table public.viaggio_attachment_entries enable row level security;
alter table public.viaggio_attachment_expenses enable row level security;

drop policy if exists "viaggio_attachment_entries select" on public.viaggio_attachment_entries;
drop policy if exists "viaggio_attachment_entries insert" on public.viaggio_attachment_entries;
drop policy if exists "viaggio_attachment_entries update" on public.viaggio_attachment_entries;
drop policy if exists "viaggio_attachment_entries delete" on public.viaggio_attachment_entries;

create policy "viaggio_attachment_entries select"
  on public.viaggio_attachment_entries for select
  using (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_member(a.journey_id)
    )
  );

create policy "viaggio_attachment_entries insert"
  on public.viaggio_attachment_entries for insert
  with check (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_editor(a.journey_id)
    )
  );

create policy "viaggio_attachment_entries update"
  on public.viaggio_attachment_entries for update
  using (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_editor(a.journey_id)
    )
  )
  with check (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_editor(a.journey_id)
    )
  );

create policy "viaggio_attachment_entries delete"
  on public.viaggio_attachment_entries for delete
  using (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_editor(a.journey_id)
    )
  );

drop policy if exists "viaggio_attachment_expenses select" on public.viaggio_attachment_expenses;
drop policy if exists "viaggio_attachment_expenses insert" on public.viaggio_attachment_expenses;
drop policy if exists "viaggio_attachment_expenses update" on public.viaggio_attachment_expenses;
drop policy if exists "viaggio_attachment_expenses delete" on public.viaggio_attachment_expenses;

create policy "viaggio_attachment_expenses select"
  on public.viaggio_attachment_expenses for select
  using (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_member(a.journey_id)
    )
  );

create policy "viaggio_attachment_expenses insert"
  on public.viaggio_attachment_expenses for insert
  with check (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_editor(a.journey_id)
    )
  );

create policy "viaggio_attachment_expenses update"
  on public.viaggio_attachment_expenses for update
  using (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_editor(a.journey_id)
    )
  )
  with check (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_editor(a.journey_id)
    )
  );

create policy "viaggio_attachment_expenses delete"
  on public.viaggio_attachment_expenses for delete
  using (
    exists (
      select 1 from public.viaggio_attachments a
      where a.id = attachment_id and public.viaggio_is_editor(a.journey_id)
    )
  );

-- Backfill from legacy single FKs
insert into public.viaggio_attachment_entries (attachment_id, entry_id)
select a.id, a.entry_id
from public.viaggio_attachments a
where a.entry_id is not null
on conflict do nothing;

insert into public.viaggio_attachment_expenses (attachment_id, expense_id)
select a.id, a.expense_id
from public.viaggio_attachments a
where a.expense_id is not null
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Attachment RLS: journey-scoped
-- ---------------------------------------------------------------------------

drop policy if exists "viaggio_attachments select" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments insert" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments update" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments delete" on public.viaggio_attachments;

create policy "viaggio_attachments select"
  on public.viaggio_attachments for select
  using (public.viaggio_is_member(journey_id));

create policy "viaggio_attachments insert"
  on public.viaggio_attachments for insert
  with check (
    uploaded_by = auth.uid()
    and public.viaggio_is_editor(journey_id)
  );

create policy "viaggio_attachments update"
  on public.viaggio_attachments for update
  using (public.viaggio_is_editor(journey_id))
  with check (public.viaggio_is_editor(journey_id));

create policy "viaggio_attachments delete"
  on public.viaggio_attachments for delete
  using (public.viaggio_is_editor(journey_id));

-- ---------------------------------------------------------------------------
-- Storage paths:
--   {entry_id}/{att}                         (legacy)
--   {journey_id}/expense/{expense_id}/{att}  (legacy journey expense)
--   {journey_id}/{att}                      (new journey-root)
-- ---------------------------------------------------------------------------

create or replace function public.viaggio_can_access_attachment_path(p_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  parts text[];
begin
  parts := storage.foldername(p_name);
  if parts is null or cardinality(parts) < 1 then
    return false;
  end if;
  if cardinality(parts) >= 2 and parts[2] = 'expense' then
    return public.viaggio_is_member(parts[1]::uuid);
  end if;
  if exists (
    select 1 from public.viaggio_journeys j where j.id = parts[1]::uuid
  ) then
    return public.viaggio_is_member(parts[1]::uuid);
  end if;
  return public.viaggio_can_access_entry(parts[1]::uuid);
end;
$$;

create or replace function public.viaggio_can_edit_attachment_path(p_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  parts text[];
begin
  parts := storage.foldername(p_name);
  if parts is null or cardinality(parts) < 1 then
    return false;
  end if;
  if cardinality(parts) >= 2 and parts[2] = 'expense' then
    return public.viaggio_is_editor(parts[1]::uuid);
  end if;
  if exists (
    select 1 from public.viaggio_journeys j where j.id = parts[1]::uuid
  ) then
    return public.viaggio_is_editor(parts[1]::uuid);
  end if;
  return public.viaggio_can_edit_entry(parts[1]::uuid);
end;
$$;

-- ---------------------------------------------------------------------------
-- Replace activity / expense links for an attachment
-- ---------------------------------------------------------------------------

create or replace function public.set_attachment_links(
  p_attachment_id uuid,
  p_entry_ids uuid[] default '{}',
  p_expense_ids uuid[] default '{}'
)
returns public.viaggio_attachments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.viaggio_attachments;
  v_entry_ids uuid[];
  v_expense_ids uuid[];
  v_link uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_row
  from public.viaggio_attachments a
  where a.id = p_attachment_id;
  if v_row.id is null then raise exception 'attachment not found'; end if;
  if not public.viaggio_is_editor(v_row.journey_id) then
    raise exception 'forbidden';
  end if;

  select coalesce(array_agg(u order by u), '{}'::uuid[])
  into v_entry_ids
  from (select distinct unnest(coalesce(p_entry_ids, '{}'::uuid[])) as u) d
  where u is not null;

  select coalesce(array_agg(u order by u), '{}'::uuid[])
  into v_expense_ids
  from (select distinct unnest(coalesce(p_expense_ids, '{}'::uuid[])) as u) d
  where u is not null;

  foreach v_link in array v_entry_ids
  loop
    if public.viaggio_entry_journey_id(v_link) is distinct from v_row.journey_id then
      raise exception 'entry not on journey';
    end if;
  end loop;

  foreach v_link in array v_expense_ids
  loop
    if not exists (
      select 1 from public.viaggio_expenses x
      where x.id = v_link and x.journey_id = v_row.journey_id
    ) then
      raise exception 'expense not on journey';
    end if;
  end loop;

  delete from public.viaggio_attachment_entries where attachment_id = v_row.id;
  if cardinality(v_entry_ids) > 0 then
    insert into public.viaggio_attachment_entries (attachment_id, entry_id)
    select v_row.id, u from unnest(v_entry_ids) as u
    on conflict do nothing;
  end if;

  delete from public.viaggio_attachment_expenses where attachment_id = v_row.id;
  if cardinality(v_expense_ids) > 0 then
    insert into public.viaggio_attachment_expenses (attachment_id, expense_id)
    select v_row.id, u from unnest(v_expense_ids) as u
    on conflict do nothing;
  end if;

  -- Clear legacy single FKs so cascade does not delete multi-linked rows.
  update public.viaggio_attachments a set
    entry_id = null,
    expense_id = null,
    updated_at = now()
  where a.id = v_row.id
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.set_attachment_links(uuid, uuid[], uuid[]) from public;
grant execute on function public.set_attachment_links(uuid, uuid[], uuid[]) to authenticated;
