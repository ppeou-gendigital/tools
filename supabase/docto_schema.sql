-- Docto domain tables (encrypted personal health tracker).
-- Assumes auth.users, public.vault_meta already exist.
-- Run in Supabase → SQL Editor. Safe to re-run.

-- ---------------------------------------------------------------------------
-- Patients
-- ---------------------------------------------------------------------------
create table if not exists public.docto_patients (
  id            uuid        primary key default gen_random_uuid(),
  owner_user_id uuid        not null references auth.users(id) on delete cascade,
  ciphertext    text        not null,
  iv            text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists docto_patients_owner_idx
  on public.docto_patients (owner_user_id);

alter table public.docto_patients enable row level security;

drop policy if exists "docto_patients owner-all" on public.docto_patients;
create policy "docto_patients owner-all"
  on public.docto_patients for all
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

-- ---------------------------------------------------------------------------
-- Family members + invites (Phase 2 RLS will widen; v1 owner-only writes)
-- ---------------------------------------------------------------------------
create table if not exists public.docto_family_members (
  id              uuid        primary key default gen_random_uuid(),
  patient_id      uuid        not null references public.docto_patients(id) on delete cascade,
  user_id         uuid        not null references auth.users(id) on delete cascade,
  role            text        not null check (role in ('owner', 'helper', 'viewer')),
  status          text        not null default 'active'
                    check (status in ('active', 'revoked')),
  pubkey          text,
  wrapped_dek     text,
  wrapped_dek_iv  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (patient_id, user_id)
);

create index if not exists docto_family_members_user_idx
  on public.docto_family_members (user_id);

alter table public.docto_family_members enable row level security;

drop policy if exists "docto_family_members self-or-owner" on public.docto_family_members;
create policy "docto_family_members self-or-owner"
  on public.docto_family_members for all
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.docto_patients p
      where p.id = patient_id and p.owner_user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    or exists (
      select 1 from public.docto_patients p
      where p.id = patient_id and p.owner_user_id = auth.uid()
    )
  );

create table if not exists public.docto_family_invites (
  id              uuid        primary key default gen_random_uuid(),
  patient_id      uuid        not null references public.docto_patients(id) on delete cascade,
  invited_email   text        not null,
  role            text        not null check (role in ('helper', 'viewer')),
  token_hash      text        not null,
  expires_at      timestamptz not null,
  invited_by      uuid        not null references auth.users(id) on delete cascade,
  accepted_at     timestamptz,
  revoked_at      timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists docto_family_invites_patient_idx
  on public.docto_family_invites (patient_id);

alter table public.docto_family_invites enable row level security;

drop policy if exists "docto_family_invites owner" on public.docto_family_invites;
create policy "docto_family_invites owner"
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

-- Helper: caller owns the patient (v1; Phase 2 expands via family_members)
create or replace function public.docto_owns_patient(p_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.docto_patients
    where id = p_patient_id and owner_user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Doctors
-- ---------------------------------------------------------------------------
create table if not exists public.docto_doctors (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.docto_patients(id) on delete cascade,
  created_by    uuid        not null references auth.users(id) on delete cascade,
  updated_by    uuid        not null references auth.users(id) on delete cascade,
  ciphertext    text        not null,
  iv            text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists docto_doctors_patient_idx
  on public.docto_doctors (patient_id, updated_at desc);

alter table public.docto_doctors enable row level security;

drop policy if exists "docto_doctors owner" on public.docto_doctors;
create policy "docto_doctors owner"
  on public.docto_doctors for all
  using (public.docto_owns_patient(patient_id))
  with check (public.docto_owns_patient(patient_id));

-- ---------------------------------------------------------------------------
-- Appointments
-- ---------------------------------------------------------------------------
create table if not exists public.docto_appointments (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.docto_patients(id) on delete cascade,
  doctor_id     uuid        references public.docto_doctors(id) on delete set null,
  visit_id      uuid,
  starts_at     timestamptz not null,
  status        text        not null default 'scheduled'
                  check (status in ('scheduled', 'done', 'cancelled')),
  kind          text        not null default 'other'
                  check (kind in (
                    'checkup', 'follow_up', 'blood_draw', 'xray',
                    'mri', 'ultrasound', 'lab', 'procedure', 'other'
                  )),
  created_by    uuid        not null references auth.users(id) on delete cascade,
  updated_by    uuid        not null references auth.users(id) on delete cascade,
  ciphertext    text        not null,
  iv            text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists docto_appointments_patient_starts_idx
  on public.docto_appointments (patient_id, starts_at);

alter table public.docto_appointments enable row level security;

drop policy if exists "docto_appointments owner" on public.docto_appointments;
create policy "docto_appointments owner"
  on public.docto_appointments for all
  using (public.docto_owns_patient(patient_id))
  with check (public.docto_owns_patient(patient_id));

-- ---------------------------------------------------------------------------
-- Visits
-- ---------------------------------------------------------------------------
create table if not exists public.docto_visits (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.docto_patients(id) on delete cascade,
  doctor_id     uuid        references public.docto_doctors(id) on delete set null,
  kind          text        not null default 'doctor_visit'
                  check (kind in ('doctor_visit', 'procedure')),
  visit_date    date        not null,
  created_by    uuid        not null references auth.users(id) on delete cascade,
  updated_by    uuid        not null references auth.users(id) on delete cascade,
  ciphertext    text        not null,
  iv            text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists docto_visits_patient_date_idx
  on public.docto_visits (patient_id, visit_date desc);

alter table public.docto_visits enable row level security;

drop policy if exists "docto_visits owner" on public.docto_visits;
create policy "docto_visits owner"
  on public.docto_visits for all
  using (public.docto_owns_patient(patient_id))
  with check (public.docto_owns_patient(patient_id));

alter table public.docto_appointments
  drop constraint if exists docto_appointments_visit_id_fkey;
alter table public.docto_appointments
  add constraint docto_appointments_visit_id_fkey
  foreign key (visit_id) references public.docto_visits(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Medications + doses
-- ---------------------------------------------------------------------------
create table if not exists public.docto_medications (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.docto_patients(id) on delete cascade,
  is_active     boolean     not null default true,
  refill_date   date,
  created_by    uuid        not null references auth.users(id) on delete cascade,
  updated_by    uuid        not null references auth.users(id) on delete cascade,
  ciphertext    text        not null,
  iv            text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists docto_medications_patient_idx
  on public.docto_medications (patient_id, is_active, updated_at desc);

alter table public.docto_medications enable row level security;

drop policy if exists "docto_medications owner" on public.docto_medications;
create policy "docto_medications owner"
  on public.docto_medications for all
  using (public.docto_owns_patient(patient_id))
  with check (public.docto_owns_patient(patient_id));

create table if not exists public.docto_doses (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.docto_patients(id) on delete cascade,
  medication_id uuid        not null references public.docto_medications(id) on delete cascade,
  taken_at      timestamptz not null,
  created_by    uuid        not null references auth.users(id) on delete cascade,
  updated_by    uuid        not null references auth.users(id) on delete cascade,
  ciphertext    text,
  iv            text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists docto_doses_med_idx
  on public.docto_doses (medication_id, taken_at desc);

alter table public.docto_doses enable row level security;

drop policy if exists "docto_doses owner" on public.docto_doses;
create policy "docto_doses owner"
  on public.docto_doses for all
  using (public.docto_owns_patient(patient_id))
  with check (public.docto_owns_patient(patient_id));

-- ---------------------------------------------------------------------------
-- Readings
-- ---------------------------------------------------------------------------
create table if not exists public.docto_readings (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.docto_patients(id) on delete cascade,
  measured_at   timestamptz not null,
  created_by    uuid        not null references auth.users(id) on delete cascade,
  updated_by    uuid        not null references auth.users(id) on delete cascade,
  ciphertext    text        not null,
  iv            text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists docto_readings_patient_idx
  on public.docto_readings (patient_id, measured_at desc);

alter table public.docto_readings enable row level security;

drop policy if exists "docto_readings owner" on public.docto_readings;
create policy "docto_readings owner"
  on public.docto_readings for all
  using (public.docto_owns_patient(patient_id))
  with check (public.docto_owns_patient(patient_id));

-- ---------------------------------------------------------------------------
-- Files (insurance cards, paperwork metadata)
-- ---------------------------------------------------------------------------
create table if not exists public.docto_files (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.docto_patients(id) on delete cascade,
  category      text        not null default 'other'
                  check (category in ('insurance', 'lab', 'imaging', 'other')),
  created_by    uuid        not null references auth.users(id) on delete cascade,
  updated_by    uuid        not null references auth.users(id) on delete cascade,
  ciphertext    text        not null,
  iv            text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists docto_files_patient_idx
  on public.docto_files (patient_id, category, updated_at desc);

alter table public.docto_files enable row level security;

drop policy if exists "docto_files owner" on public.docto_files;
create policy "docto_files owner"
  on public.docto_files for all
  using (public.docto_owns_patient(patient_id))
  with check (public.docto_owns_patient(patient_id));

-- ---------------------------------------------------------------------------
-- Uploads (photos / PDFs / voice) — replaces template attachments for care data
-- ---------------------------------------------------------------------------
create table if not exists public.docto_uploads (
  id               uuid        primary key default gen_random_uuid(),
  patient_id       uuid        not null references public.docto_patients(id) on delete cascade,
  parent_type      text        not null check (parent_type in ('visit', 'file', 'medication')),
  parent_id        uuid        not null,
  kind             text        not null check (kind in ('photo_or_pdf', 'voice')),
  mime_type        text        not null default 'application/octet-stream',
  byte_size        bigint      not null default 0,
  storage_path     text        not null unique,
  iv               text,
  ciphertext_meta  text,
  iv_meta          text,
  uploaded_by      uuid        not null references auth.users(id) on delete cascade,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists docto_uploads_parent_idx
  on public.docto_uploads (patient_id, parent_type, parent_id, created_at desc);

alter table public.docto_uploads enable row level security;

drop policy if exists "docto_uploads owner" on public.docto_uploads;
create policy "docto_uploads owner"
  on public.docto_uploads for all
  using (public.docto_owns_patient(patient_id))
  with check (public.docto_owns_patient(patient_id));

insert into storage.buckets (id, name, public)
values ('docto-uploads', 'docto-uploads', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "docto_uploads storage read" on storage.objects;
drop policy if exists "docto_uploads storage insert" on storage.objects;
drop policy if exists "docto_uploads storage update" on storage.objects;
drop policy if exists "docto_uploads storage delete" on storage.objects;

-- Paths: {patient_id}/{parent_id}/{upload_id}
create policy "docto_uploads storage read"
  on storage.objects for select
  using (
    bucket_id = 'docto-uploads'
    and public.docto_owns_patient(((storage.foldername(name))[1])::uuid)
  );

create policy "docto_uploads storage insert"
  on storage.objects for insert
  with check (
    bucket_id = 'docto-uploads'
    and public.docto_owns_patient(((storage.foldername(name))[1])::uuid)
  );

create policy "docto_uploads storage update"
  on storage.objects for update
  using (
    bucket_id = 'docto-uploads'
    and public.docto_owns_patient(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'docto-uploads'
    and public.docto_owns_patient(((storage.foldername(name))[1])::uuid)
  );

create policy "docto_uploads storage delete"
  on storage.objects for delete
  using (
    bucket_id = 'docto-uploads'
    and public.docto_owns_patient(((storage.foldername(name))[1])::uuid)
  );
