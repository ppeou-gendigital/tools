-- Many-to-many expense ↔ activity links.
-- Primary activity remains viaggio_expenses.entry_id (receipts / cascade).
-- Junction holds all linked entries (including primary).

create table if not exists public.viaggio_expense_entries (
  expense_id  uuid not null references public.viaggio_expenses(id) on delete cascade,
  entry_id    uuid not null references public.viaggio_entries(id) on delete cascade,
  primary key (expense_id, entry_id)
);

create index if not exists viaggio_expense_entries_entry_idx
  on public.viaggio_expense_entries (entry_id);

alter table public.viaggio_expense_entries enable row level security;

drop policy if exists "viaggio_expense_entries select" on public.viaggio_expense_entries;
drop policy if exists "viaggio_expense_entries insert" on public.viaggio_expense_entries;
drop policy if exists "viaggio_expense_entries update" on public.viaggio_expense_entries;
drop policy if exists "viaggio_expense_entries delete" on public.viaggio_expense_entries;

create policy "viaggio_expense_entries select"
  on public.viaggio_expense_entries for select
  using (public.viaggio_can_access_entry(entry_id));

create policy "viaggio_expense_entries insert"
  on public.viaggio_expense_entries for insert
  with check (public.viaggio_can_edit_entry(entry_id));

create policy "viaggio_expense_entries update"
  on public.viaggio_expense_entries for update
  using (public.viaggio_can_edit_entry(entry_id))
  with check (public.viaggio_can_edit_entry(entry_id));

create policy "viaggio_expense_entries delete"
  on public.viaggio_expense_entries for delete
  using (public.viaggio_can_edit_entry(entry_id));

-- Backfill from primary entry_id
insert into public.viaggio_expense_entries (expense_id, entry_id)
select x.id, x.entry_id
from public.viaggio_expenses x
on conflict do nothing;

-- Replace upsert: p_entry_ids = all linked activities (must include primary p_entry_id).
-- Null p_entry_ids → single primary link (backward compatible).
drop function if exists public.upsert_expense_with_splits(
  uuid, uuid, text, bigint, text, uuid, text, text, jsonb
);

create or replace function public.upsert_expense_with_splits(
  p_id uuid,
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
  v_journey_id uuid;
  v_row public.viaggio_expenses;
  v_sum bigint;
  v_split record;
  v_entry_ids uuid[];
  v_link uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  v_journey_id := public.viaggio_entry_journey_id(p_entry_id);
  if v_journey_id is null then raise exception 'entry not found'; end if;
  if not public.viaggio_is_editor(v_journey_id) then
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
    where jp.journey_id = v_journey_id and jp.id = p_paid_by
  ) then
    raise exception 'paid_by must be on the journey roster';
  end if;

  -- Normalize entry links: primary first, unique, all on same journey.
  if p_entry_ids is null or cardinality(p_entry_ids) = 0 then
    v_entry_ids := array[p_entry_id];
  else
    if not (p_entry_id = any (p_entry_ids)) then
      raise exception 'primary entry_id must be in entry_ids';
    end if;
    select array_agg(u order by case when u = p_entry_id then 0 else 1 end, u)
    into v_entry_ids
    from (
      select distinct unnest(p_entry_ids) as u
    ) d;
  end if;

  foreach v_link in array v_entry_ids
  loop
    if public.viaggio_entry_journey_id(v_link) is distinct from v_journey_id then
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
      where jp.journey_id = v_journey_id and jp.id = v_split.journey_person_id
    ) then
      raise exception 'split participant must be on the journey roster';
    end if;
  end loop;

  if p_id is null then
    insert into public.viaggio_expenses (
      entry_id, title, amount_cents, currency, paid_by, split_mode, category, created_by
    ) values (
      p_entry_id, coalesce(p_title, ''), p_amount_cents, p_currency,
      p_paid_by, p_split_mode, p_category, v_uid
    )
    returning * into v_row;
  else
    select * into v_row
    from public.viaggio_expenses x
    where x.id = p_id;
    if v_row.id is null then raise exception 'expense not found'; end if;
    if public.viaggio_entry_journey_id(v_row.entry_id) is distinct from v_journey_id then
      raise exception 'expense not found';
    end if;

    update public.viaggio_expenses x set
      entry_id = p_entry_id,
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
  insert into public.viaggio_expense_entries (expense_id, entry_id)
  select v_row.id, u
  from unnest(v_entry_ids) as u
  on conflict do nothing;

  return v_row;
end;
$$;

revoke all on function public.upsert_expense_with_splits(
  uuid, uuid, text, bigint, text, uuid, text, text, jsonb, uuid[]
) from public;
grant execute on function public.upsert_expense_with_splits(
  uuid, uuid, text, bigint, text, uuid, text, text, jsonb, uuid[]
) to authenticated;
