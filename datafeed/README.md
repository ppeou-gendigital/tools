# Docto patient datafeed

JSON contract for importing and exporting a **patient record** (doctors,
appointments, visits, medications, doses, readings, files).

**Live agent URLs:** [llms.txt](https://project-docto.web.app/agent/llms.txt) ·
[schema](https://project-docto.web.app/agent/import.schema.json) ·
[sample](https://project-docto.web.app/agent/sample.json)

Use the sample files in this folder as templates when building feeds from
another system (EHR export, spreadsheet converter, migration script, etc.).

Exported files contain **plaintext health details**. Treat them as highly
sensitive: encrypt at rest, transmit over trusted channels, and delete after
import.

Binary uploads (photos, PDFs, voice memos) are **not** included in v1 — only
structured records. Re-attach media in the app after import if needed.

## Ready-to-import test file

For manual QA in the app, import
[`patient.test-import.json`](./patient.test-import.json)
via **Settings → Import / Export → Choose JSON file** (vault unlocked, owner or
Can help).

That file seeds multiple doctors (with offices), appointments, visits,
medications + doses, readings, and file metadata. It also sets the patient
display name to **Test Patient** — change it afterward in Profile if you want.

## Envelope

Every feed is a single JSON object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | number | yes | Format version. Currently `1`. |
| `type` | string | yes | See [Types](#types). |
| `exportedAt` | string | no | ISO-8601 timestamp (export fills this). |
| `patient` | object | for `patient` | Patient profile fields. |
| `doctors` | array | for `patient` | Doctor profiles (with `offices`). |
| `appointments` | array | for `patient` | Scheduled / past appointments. |
| `visits` | array | for `patient` | Visit records. |
| `medications` | array | for `patient` | Medications. |
| `doses` | array | for `patient` | Dose log entries. |
| `readings` | array | for `patient` | BP / weight / height / pulse. |
| `files` | array | for `patient` | Insurance and other file metadata. |
| `items` | array | for typed feeds | Item list when `type` is a single collection. |

Unknown fields are ignored. Extra keys on items are ignored.

**Legacy alias:** `type: "docto-backup"` is accepted on import as a synonym for
`patient` (same collections). Prefer `patient` for new exporters.

## Stable ids (cross-references)

Optional string `id` on doctors, appointments, visits, medications, offices,
etc. is used **only within the file** to re-link foreign keys on import
(`doctorId`, `officeId`, `medicationId`, `appointmentId`).

Docto always creates **new** database rows on import and remaps those ids.
Do not expect ids to match production UUIDs from another system — any unique
string within the feed works (e.g. `"doc-1"`, `"med-lisinopril"`).

## Types

### `patient` (full record)

See [`patient.sample.json`](./patient.sample.json).

### Typed collection feeds

Useful when another system only exports one domain:

| `type` | Array field | Sample |
|--------|-------------|--------|
| `doctors` | `items` | [`doctors.sample.json`](./doctors.sample.json) |
| `appointments` | `items` | (same item shape as in patient feed) |
| `visits` | `items` | |
| `medications` | `items` | [`medications.sample.json`](./medications.sample.json) |
| `readings` | `items` | |
| `files` | `items` | |

When importing a typed feed that references `doctorId` / `medicationId`, either
(1) include those referenced rows in the same file with matching `id`s, or
(2) omit the foreign key (links are dropped).

## Item shapes

### Patient profile (`patient`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `preferredName` | string | no | Defaults to `"Me"` if blank on import. |
| `birthday` | string | no | Prefer `YYYY-MM-DD`. |
| `sex` | string | no | Free text. |
| `notes` | string | no | Free text. |

### Doctor

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | no | For cross-refs in this file. |
| `name` | string | yes | |
| `specialty` | string | no | |
| `email` | string | no | |
| `website` | string | no | |
| `notes` | string | no | |
| `offices` | array | no | See below. |

### Office (inside `doctor.offices`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | no | For `officeId` on appointments/visits. |
| `label` | string | no | e.g. `"Main office"`. |
| `phone` | string | no | |
| `phoneExt` | string | no | |
| `email` | string | no | |
| `website` | string | no | |
| `addressLine1` | string | no | |
| `addressLine2` | string | no | |
| `city` | string | no | |
| `region` | string | no | State / province. |
| `postalCode` | string | no | |
| `country` | string | no | |
| `googlePlaceId` | string | no | Google Place id (from Places autocomplete). |
| `lat` | number | no | Latitude for maps deep links. |
| `lng` | number | no | Longitude for maps deep links. |

### Appointment

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | no | |
| `title` | string | no | |
| `kind` | string | no | `checkup` \| `follow_up` \| `blood_draw` \| `xray` \| `mri` \| `ultrasound` \| `lab` \| `procedure` \| `other`. |
| `status` | string | no | `scheduled` \| `done` \| `cancelled`. Default `scheduled`. |
| `startsAt` | string | yes | ISO-8601 datetime. |
| `doctorId` | string | no | Refers to a doctor `id` in this file. |
| `officeId` | string | no | Refers to an office `id` in this file. |
| `instructions` | string | no | |
| `notes` | any | no | Free text or TipTap JSON. |

### Visit

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | no | |
| `title` | string | no | |
| `kind` | string | no | `doctor_visit` \| `procedure`. |
| `visitDate` | string | yes | `YYYY-MM-DD`. |
| `doctorId` | string | no | |
| `officeId` | string | no | |
| `appointmentId` | string | no | Refers to an appointment `id` in this file. |
| `summary` | string | no | |
| `notes` | any | no | TipTap JSON or string. |

### Medication

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | no | For dose `medicationId`. |
| `name` | string | yes | |
| `strength` | string | no | e.g. `"10 mg"`. |
| `isActive` | boolean | no | Default `true`. Prefer `status` when present. |
| `status` | string | no | `active` \| `suspended` \| `stopped`. Default from `isActive`. |
| `suspension` | object | no | `{ note, suspendedAt }` when `status` is `suspended`. |
| `refillDate` | string | no | `YYYY-MM-DD`. |
| `doctorId` | string | no | Optional. Omit for over-the-counter / no doctor. |
| `schedule` | object | no | See schedule shape below. |
| `refill` | object | no | `{ quantity, pillsLeft, rxNumber }`. |

#### Medication schedule

| Field | Type | Notes |
|-------|------|-------|
| `frequency` | string | `daily` \| `weekly` \| `monthly` \| `as_needed`. Default `daily`. |
| `timesPerPeriod` | number | Doses per day/week/month. Ignored for `as_needed`. |
| `timesPerDay` | number | Legacy alias for daily `timesPerPeriod` (still accepted). |
| `times` | string[] | Optional `HH:mm` labels (mainly daily). |
| `instructions` | string | Free text. |

### Dose

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `medicationId` | string | yes | Refers to a medication `id` in this file. |
| `takenAt` | string | yes | ISO-8601 datetime. |
| `note` | string | no | |

### Reading

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `measuredAt` | string | yes | ISO-8601 datetime. |
| `bloodPressure` | object | no | `{ systolic, diastolic }` numbers. |
| `pulse` | number | no | |
| `weightKg` | number | no | |
| `heightCm` | number | no | |
| `notes` | string | no | |

### File (metadata only)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | |
| `category` | string | no | `insurance` \| `lab` \| `imaging` \| `other`. |
| `insuranceCompany` | string | no | |
| `memberId` | string | no | |
| `notes` | string | no | |

## Import behavior (Docto)

1. Vault must be unlocked; active patient is the import target (owner or Can help).
2. Rows are **always created as new** — no merge/update by name or date.
3. Optional `patient` profile **updates** the current patient’s encrypted profile fields (does not create a second patient).
4. Invalid envelope / wrong `version` / wrong `type` rejects the whole file.
5. Per-item validation errors skip that item and continue; the UI reports counts.
6. Unresolvable foreign keys are dropped (item still imports without the link).

## Export behavior (Docto)

Export writes the same shapes as the samples (with `exportedAt` set). Database
timestamps and `patientId` are omitted. In-file `id`s are included so a round-trip
export → import keeps doctor/med links intact.
