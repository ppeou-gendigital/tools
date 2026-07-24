-- Wipe all Viaggio domain data while keeping auth accounts and shared user tables.
--
-- DESTROYED:
--   - All public.viaggio_* tables (TRUNCATE … CASCADE)
--   - vault_meta rows for viaggio / TOOLNAME app ids (if table exists)
--
-- KEPT:
--   - auth.users
--   - public.profiles
--   - public.user_data (shared prefs across tools on this project)
--   - vault_meta for other apps
--
-- STORAGE:
--   Supabase blocks DELETE on storage.objects from SQL. Empty the
--   `viaggio-attachments` bucket in Dashboard → Storage (or via Storage API).
--
-- Run in Supabase → SQL Editor (postgres / service role). Irreversible.

begin;

do $$
declare
  stmt text;
begin
  select 'truncate table '
      || string_agg(format('%I.%I', schemaname, tablename), ', ' order by tablename)
      || ' restart identity cascade'
    into stmt
  from pg_tables
  where schemaname = 'public'
    and tablename like 'viaggio_%';

  if stmt is null then
    raise notice 'No public.viaggio_* tables found — nothing to truncate.';
  else
    raise notice 'Running: %', stmt;
    execute stmt;
  end if;
end $$;

do $$
begin
  if to_regclass('public.vault_meta') is not null then
    delete from public.vault_meta
    where app_id in ('viaggio', 'TOOLNAME')
       or app_id like 'viaggio:%';
  end if;
end $$;

commit;

-- Verification (expect all zeros)
select c.relname as tablename,
       (xpath(
          '//row/c/text()',
          query_to_xml(
            format('select count(*) as c from public.%I', c.relname),
            false, true, ''
          )
        ))[1]::text::int as row_count
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname like 'viaggio_%'
order by c.relname;
