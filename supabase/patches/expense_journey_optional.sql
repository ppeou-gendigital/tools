-- Journey-level expenses: 0–N activity links.
-- Adds journey_id (required), nullable primary entry_id, journey-scoped receipts.

-- ---------------------------------------------------------------------------
-- Expenses: journey_id + nullable entry_id
-- ---------------------------------------------------------------------------

alter table public.viaggio_expenses
  add column if not exists journey_id uuid references public.viaggio_journeys(id) on delete cascade;

update public.viaggio_expenses x
set journey_id = public.viaggio_entry_journey_id(x.entry_id)
where x.journey_id is null and x.entry_id is not null;

-- Orphans without a resolvable journey cannot be kept
delete from public.viaggio_expenses where journey_id is null;

alter table public.viaggio_expenses
  alter column journey_id set not null;

create index if not exists viaggio_expenses_journey_idx
  on public.viaggio_expenses (journey_id);

do $$
declare
  con_name text;
begin
  select c.conname into con_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'viaggio_expenses'
    and c.contype = 'f'
    and pg_get_constraintdef(c.oid) ilike '%entry_id%viaggio_entries%';
  if con_name is not null then
    execute format('alter table public.viaggio_expenses drop constraint %I', con_name);
  end if;
end $$;

alter table public.viaggio_expenses
  alter column entry_id drop not null;

alter table public.viaggio_expenses
  add constraint viaggio_expenses_entry_id_fkey
  foreign key (entry_id) references public.viaggio_entries(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Attachments: nullable entry_id + journey_id
-- ---------------------------------------------------------------------------

alter table public.viaggio_attachments
  add column if not exists journey_id uuid references public.viaggio_journeys(id) on delete cascade;

update public.viaggio_attachments a
set journey_id = e.journey_id
from public.viaggio_entries e
where a.journey_id is null and a.entry_id = e.id;

update public.viaggio_attachments a
set journey_id = x.journey_id
from public.viaggio_expenses x
where a.journey_id is null and a.expense_id = x.id;

do $$
declare
  con_name text;
begin
  select c.conname into con_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'viaggio_attachments'
    and c.contype = 'f'
    and pg_get_constraintdef(c.oid) ilike '%entry_id%viaggio_entries%';
  if con_name is not null then
    execute format('alter table public.viaggio_attachments drop constraint %I', con_name);
  end if;
end $$;

alter table public.viaggio_attachments
  alter column entry_id drop not null;

alter table public.viaggio_attachments
  add constraint viaggio_attachments_entry_id_fkey
  foreign key (entry_id) references public.viaggio_entries(id) on delete cascade;

alter table public.viaggio_attachments
  drop constraint if exists viaggio_attachments_scope_chk;

alter table public.viaggio_attachments
  add constraint viaggio_attachments_scope_chk
  check (entry_id is not null or journey_id is not null);

create index if not exists viaggio_attachments_journey_idx
  on public.viaggio_attachments (journey_id)
  where journey_id is not null;

-- ---------------------------------------------------------------------------
-- Storage path helper: entry/{id}/… or {journey_id}/expense/{expense_id}/…
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
  return public.viaggio_can_edit_entry(parts[1]::uuid);
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS: expenses / splits / attachments
-- ---------------------------------------------------------------------------

drop policy if exists "viaggio_expenses select" on public.viaggio_expenses;
drop policy if exists "viaggio_expenses insert" on public.viaggio_expenses;
drop policy if exists "viaggio_expenses update" on public.viaggio_expenses;
drop policy if exists "viaggio_expenses delete" on public.viaggio_expenses;

create policy "viaggio_expenses select"
  on public.viaggio_expenses for select
  using (public.viaggio_is_member(journey_id));
create policy "viaggio_expenses insert"
  on public.viaggio_expenses for insert
  with check (public.viaggio_is_editor(journey_id) and created_by = auth.uid());
create policy "viaggio_expenses update"
  on public.viaggio_expenses for update
  using (public.viaggio_is_editor(journey_id))
  with check (public.viaggio_is_editor(journey_id));
create policy "viaggio_expenses delete"
  on public.viaggio_expenses for delete
  using (public.viaggio_is_editor(journey_id));

drop policy if exists "viaggio_expense_splits select" on public.viaggio_expense_splits;
drop policy if exists "viaggio_expense_splits insert" on public.viaggio_expense_splits;
drop policy if exists "viaggio_expense_splits update" on public.viaggio_expense_splits;
drop policy if exists "viaggio_expense_splits delete" on public.viaggio_expense_splits;

create policy "viaggio_expense_splits select"
  on public.viaggio_expense_splits for select
  using (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_is_member(x.journey_id)
    )
  );
create policy "viaggio_expense_splits insert"
  on public.viaggio_expense_splits for insert
  with check (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_is_editor(x.journey_id)
    )
  );
create policy "viaggio_expense_splits update"
  on public.viaggio_expense_splits for update
  using (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_is_editor(x.journey_id)
    )
  )
  with check (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_is_editor(x.journey_id)
    )
  );
create policy "viaggio_expense_splits delete"
  on public.viaggio_expense_splits for delete
  using (
    exists (
      select 1 from public.viaggio_expenses x
      where x.id = expense_id and public.viaggio_is_editor(x.journey_id)
    )
  );

drop policy if exists "viaggio_attachments select" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments insert" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments update" on public.viaggio_attachments;
drop policy if exists "viaggio_attachments delete" on public.viaggio_attachments;

create policy "viaggio_attachments select"
  on public.viaggio_attachments for select
  using (
    (entry_id is not null and public.viaggio_can_access_entry(entry_id))
    or (journey_id is not null and public.viaggio_is_member(journey_id))
  );
create policy "viaggio_attachments insert"
  on public.viaggio_attachments for insert
  with check (
    uploaded_by = auth.uid()
    and (
      (entry_id is not null and public.viaggio_can_edit_entry(entry_id))
      or (journey_id is not null and public.viaggio_is_editor(journey_id))
    )
  );
create policy "viaggio_attachments update"
  on public.viaggio_attachments for update
  using (
    (entry_id is not null and public.viaggio_can_edit_entry(entry_id))
    or (journey_id is not null and public.viaggio_is_editor(journey_id))
  )
  with check (
    (entry_id is not null and public.viaggio_can_edit_entry(entry_id))
    or (journey_id is not null and public.viaggio_is_editor(journey_id))
  );
create policy "viaggio_attachments delete"
  on public.viaggio_attachments for delete
  using (
    (entry_id is not null and public.viaggio_can_edit_entry(entry_id))
    or (journey_id is not null and public.viaggio_is_editor(journey_id))
  );

drop policy if exists "viaggio_attachments storage read" on storage.objects;
drop policy if exists "viaggio_attachments storage insert" on storage.objects;
drop policy if exists "viaggio_attachments storage update" on storage.objects;
drop policy if exists "viaggio_attachments storage delete" on storage.objects;

create policy "viaggio_attachments storage read"
  on storage.objects for select
  using (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_access_attachment_path(name)
  );

create policy "viaggio_attachments storage insert"
  on storage.objects for insert
  with check (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_edit_attachment_path(name)
  );

create policy "viaggio_attachments storage update"
  on storage.objects for update
  using (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_edit_attachment_path(name)
  )
  with check (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_edit_attachment_path(name)
  );

create policy "viaggio_attachments storage delete"
  on storage.objects for delete
  using (
    bucket_id = 'viaggio-attachments'
    and public.viaggio_can_edit_attachment_path(name)
  );

-- ---------------------------------------------------------------------------
-- upsert_expense_with_splits (journey-scoped, 0–N entry links)
-- ---------------------------------------------------------------------------

drop function if exists public.upsert_expense_with_splits(
  uuid, uuid, text, bigint, text, uuid, text, text, jsonb
);
drop function if exists public.upsert_expense_with_splits(
  uuid, uuid, text, bigint, text, uuid, text, text, jsonb, uuid[]
);

create or replace function public.upsert_expense_with_splits(
  p_id uuid,
  p_journey_id uuid,
  p_entry_id uuid,
  p_title text,
  p_amount_cents bigint,
  p_currency text,
  p_paid_by uuid,
  p_split_mode text,
  p_category text,
  p_splits jsonb,
  p_entry_ids uuid[] default null
)
returns public.viaggio_expenses
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.viaggio_expenses;
  v_sum bigint;
  v_split record;
  v_entry_ids uuid[];
  v_link uuid;
  v_primary uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_journey_id is null then raise exception 'journey not found'; end if;
  if not exists (select 1 from public.viaggio_journeys j where j.id = p_journey_id) then
    raise exception 'journey not found';
  end if;
  if not public.viaggio_is_editor(p_journey_id) then
    raise exception 'forbidden';
  end if;
  if p_amount_cents is null or p_amount_cents < 0 then
    raise exception 'invalid amount';
  end if;
  if p_currency is null or p_currency !~ '^[A-Z]{3}$' then
    raise exception 'invalid currency';
  end if;
  if p_split_mode not in ('equal', 'custom') then
    raise exception 'invalid split_mode';
  end if;
  if not exists (
    select 1 from public.viaggio_journey_people jp
    where jp.journey_id = p_journey_id and jp.id = p_paid_by
  ) then
    raise exception 'paid_by must be on the journey roster';
  end if;

  if p_entry_ids is null then
    v_entry_ids := '{}'::uuid[];
  else
    select coalesce(array_agg(distinct u), '{}'::uuid[])
    into v_entry_ids
    from unnest(p_entry_ids) as u
    where u is not null;
  end if;

  if cardinality(v_entry_ids) = 0 then
    v_primary := null;
  else
    v_primary := coalesce(p_entry_id, v_entry_ids[1]);
    if v_primary is null or not (v_primary = any (v_entry_ids)) then
      raise exception 'primary entry_id must be in entry_ids';
    end if;
    select array_agg(u order by case when u = v_primary then 0 else 1 end, u)
    into v_entry_ids
    from unnest(v_entry_ids) as u;
  end if;

  foreach v_link in array v_entry_ids
  loop
    if public.viaggio_entry_journey_id(v_link) is distinct from p_journey_id then
      raise exception 'entry not found';
    end if;
  end loop;

  select coalesce(sum((s->>'amount_cents')::bigint), 0) into v_sum
  from jsonb_array_elements(coalesce(p_splits, '[]'::jsonb)) s;

  if v_sum <> p_amount_cents then
    raise exception 'splits must sum to amount_cents';
  end if;

  for v_split in
    select coalesce(
             (s->>'journey_person_id')::uuid,
             (s->>'user_id')::uuid
           ) as journey_person_id,
           (s->>'amount_cents')::bigint as amount_cents
    from jsonb_array_elements(coalesce(p_splits, '[]'::jsonb)) s
  loop
    if not exists (
      select 1 from public.viaggio_journey_people jp
      where jp.journey_id = p_journey_id and jp.id = v_split.journey_person_id
    ) then
      raise exception 'split participant must be on the journey roster';
    end if;
  end loop;

  if p_id is null then
    insert into public.viaggio_expenses (
      journey_id, entry_id, title, amount_cents, currency, paid_by, split_mode, category, created_by
    ) values (
      p_journey_id, v_primary, coalesce(p_title, ''), p_amount_cents, p_currency,
      p_paid_by, p_split_mode, p_category, v_uid
    )
    returning * into v_row;
  else
    select * into v_row
    from public.viaggio_expenses x
    where x.id = p_id;
    if v_row.id is null then raise exception 'expense not found'; end if;
    if v_row.journey_id is distinct from p_journey_id then
      raise exception 'expense not found';
    end if;

    update public.viaggio_expenses x set
      entry_id = v_primary,
      title = coalesce(p_title, ''),
      amount_cents = p_amount_cents,
      currency = p_currency,
      paid_by = p_paid_by,
      split_mode = p_split_mode,
      category = p_category,
      updated_at = now()
    where x.id = p_id
    returning * into v_row;
    if v_row.id is null then raise exception 'expense not found'; end if;
    delete from public.viaggio_expense_splits where expense_id = v_row.id;
  end if;

  insert into public.viaggio_expense_splits (expense_id, journey_person_id, amount_cents)
  select
    v_row.id,
    coalesce((s->>'journey_person_id')::uuid, (s->>'user_id')::uuid),
    (s->>'amount_cents')::bigint
  from jsonb_array_elements(coalesce(p_splits, '[]'::jsonb)) s;

  delete from public.viaggio_expense_entries where expense_id = v_row.id;
  if cardinality(v_entry_ids) > 0 then
    insert into public.viaggio_expense_entries (expense_id, entry_id)
    select v_row.id, u
    from unnest(v_entry_ids) as u
    on conflict do nothing;
  end if;

  return v_row;
end;
$$;

revoke all on function public.upsert_expense_with_splits(
  uuid, uuid, uuid, text, bigint, text, uuid, text, text, jsonb, uuid[]
) from public;
grant execute on function public.upsert_expense_with_splits(
  uuid, uuid, uuid, text, bigint, text, uuid, text, text, jsonb, uuid[]
) to authenticated;
