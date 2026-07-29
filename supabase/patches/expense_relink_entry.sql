-- Allow update_expense to move an expense onto another entry on the same journey.
-- Previously: WHERE id = p_id AND entry_id = p_entry_id — so changing entry_id
-- (e.g. AI “link this spending to the flight”) always raised "expense not found".

create or replace function public.upsert_expense_with_splits(
  p_id uuid,
  p_entry_id uuid,
  p_title text,
  p_amount_cents bigint,
  p_currency text,
  p_paid_by uuid,
  p_split_mode text,
  p_category text,
  p_splits jsonb
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

  return v_row;
end;
$$;
