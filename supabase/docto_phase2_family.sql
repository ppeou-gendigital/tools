-- Phase 2: widen patient access for family members + invitee invite read/accept.
-- Run after docto_schema.sql. Safe to re-run.

create or replace function public.docto_can_access_patient(p_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.docto_patients p
    where p.id = p_patient_id and p.owner_user_id = auth.uid()
  )
  or exists (
    select 1 from public.docto_family_members m
    where m.patient_id = p_patient_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

create or replace function public.docto_can_write_patient(p_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.docto_patients p
    where p.id = p_patient_id and p.owner_user_id = auth.uid()
  )
  or exists (
    select 1 from public.docto_family_members m
    where m.patient_id = p_patient_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('owner', 'helper')
  );
$$;

-- Keep old helper name as alias for access (domain policies may still call it).
create or replace function public.docto_owns_patient(p_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.docto_can_access_patient(p_patient_id);
$$;

-- Patients: members can read; only owner can insert/update/delete patient row
drop policy if exists "docto_patients owner-all" on public.docto_patients;
drop policy if exists "docto_patients member-read" on public.docto_patients;
drop policy if exists "docto_patients owner-write" on public.docto_patients;

create policy "docto_patients member-read"
  on public.docto_patients for select
  using (public.docto_can_access_patient(id));

create policy "docto_patients owner-write"
  on public.docto_patients for all
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- Domain tables: read if access, write if helper/owner
do $$
declare
  t text;
begin
  foreach t in array array[
    'docto_doctors', 'docto_appointments', 'docto_visits',
    'docto_medications', 'docto_doses', 'docto_readings',
    'docto_files', 'docto_uploads'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || ' owner', t);
    execute format('drop policy if exists %I on public.%I', t || ' access-read', t);
    execute format('drop policy if exists %I on public.%I', t || ' access-insert', t);
    execute format('drop policy if exists %I on public.%I', t || ' access-update', t);
    execute format('drop policy if exists %I on public.%I', t || ' access-delete', t);
    execute format(
      'create policy %I on public.%I for select using (public.docto_can_access_patient(patient_id))',
      t || ' access-read', t
    );
    execute format(
      'create policy %I on public.%I for insert with check (public.docto_can_write_patient(patient_id))',
      t || ' access-insert', t
    );
    execute format(
      'create policy %I on public.%I for update using (public.docto_can_write_patient(patient_id)) with check (public.docto_can_write_patient(patient_id))',
      t || ' access-update', t
    );
    execute format(
      'create policy %I on public.%I for delete using (public.docto_can_write_patient(patient_id))',
      t || ' access-delete', t
    );
  end loop;
end $$;

-- Invites: invitee can read pending invites for their email + accept
drop policy if exists "docto_family_invites owner" on public.docto_family_invites;
drop policy if exists "docto_family_invites owner-all" on public.docto_family_invites;
drop policy if exists "docto_family_invites invitee-read" on public.docto_family_invites;
drop policy if exists "docto_family_invites invitee-accept" on public.docto_family_invites;

create policy "docto_family_invites owner-all"
  on public.docto_family_invites for all
  using (
    exists (
      select 1 from public.docto_patients p
      where p.id = patient_id and p.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.docto_patients p
      where p.id = patient_id and p.owner_user_id = auth.uid()
    )
  );

create policy "docto_family_invites invitee-read"
  on public.docto_family_invites for select
  using (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and accepted_at is null
    and revoked_at is null
    and expires_at > now()
  );

create policy "docto_family_invites invitee-accept"
  on public.docto_family_invites for update
  using (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and accepted_at is null
    and revoked_at is null
  )
  with check (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Storage: allow family access via patient folder
drop policy if exists "docto_uploads storage read" on storage.objects;
drop policy if exists "docto_uploads storage insert" on storage.objects;
drop policy if exists "docto_uploads storage update" on storage.objects;
drop policy if exists "docto_uploads storage delete" on storage.objects;

create policy "docto_uploads storage read"
  on storage.objects for select
  using (
    bucket_id = 'docto-uploads'
    and public.docto_can_access_patient(((storage.foldername(name))[1])::uuid)
  );

create policy "docto_uploads storage insert"
  on storage.objects for insert
  with check (
    bucket_id = 'docto-uploads'
    and public.docto_can_write_patient(((storage.foldername(name))[1])::uuid)
  );

create policy "docto_uploads storage update"
  on storage.objects for update
  using (
    bucket_id = 'docto-uploads'
    and public.docto_can_write_patient(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'docto-uploads'
    and public.docto_can_write_patient(((storage.foldername(name))[1])::uuid)
  );

create policy "docto_uploads storage delete"
  on storage.objects for delete
  using (
    bucket_id = 'docto-uploads'
    and public.docto_can_write_patient(((storage.foldername(name))[1])::uuid)
  );
