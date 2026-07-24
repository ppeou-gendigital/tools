-- Link attachments (receipts) to a specific expense.
-- Safe to re-run.

alter table public.viaggio_attachments
  add column if not exists expense_id uuid
    references public.viaggio_expenses(id) on delete cascade;

create index if not exists viaggio_attachments_expense_idx
  on public.viaggio_attachments (expense_id)
  where expense_id is not null;
