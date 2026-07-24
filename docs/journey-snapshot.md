# Viaggio journey snapshot (import / export)

Portable JSON for moving a journey between Viaggio instances or generating compatible data from another system.

| | |
|---|---|
| **Format id** | `viaggio.journey_snapshot` |
| **Current version** | `1` |
| **Sample file** | [`src/samples/journey-snapshot.sample.json`](../src/samples/journey-snapshot.sample.json) |
| **Builder / importer** | `src/lib/journeySnapshot.js` |

## Envelope

```json
{
  "format": "viaggio.journey_snapshot",
  "version": 1,
  "exported_at": "2026-07-23T18:00:00.000Z",
  "journey": { },
  "people": [],
  "contacts": [],
  "entries": [],
  "entry_participants": [],
  "expenses": [],
  "expense_splits": [],
  "playlist": [],
  "place_ideas": [],
  "todos": []
}
```

- `format` (required) — must equal `viaggio.journey_snapshot`.
- `version` (required) — integer; importers accept `1` today.
- `exported_at` (optional) — ISO-8601 timestamp of export.
- All ids inside the file are **opaque strings** used only for cross-references within that file. On import, Viaggio generates new UUIDs.

## `journey` (required)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Non-empty |
| `type` | `"trip"` \| `"journal"` | yes | |
| `preset` | string | yes | Catalog id, e.g. `leisure_trip`, `road_trip` |
| `activity_packs` | string[] | no | Default `[]` |
| `default_timezone` | string | yes | IANA tz, e.g. `Europe/Lisbon` |
| `default_currency` | string | yes | ISO 4217 uppercase, e.g. `EUR` |
| `starts_on` | `YYYY-MM-DD` \| null | no | Calendar date |
| `ends_on` | `YYYY-MM-DD` \| null | no | Calendar date |

## `people` (required array)

Journey roster. Import creates guests except one seat merged to the signed-in importer (see Import rules).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Local id referenced by participants / expenses |
| `display_name` | string | yes | |
| `email` | string \| null | no | |
| `phone_e164` | string \| null | no | E.164 preferred |
| `member_role` | `"owner"` \| `"editor"` \| `"viewer"` \| null | no | Hint only; not ACL on import |

## `contacts` (optional)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Local id; referenced by `entries[].contact_id` |
| `kind` | `"person"` \| `"place"` \| `"business"` | Default `person` |
| `display_name` | string | |
| `phone_e164`, `email`, `notes` | string \| null | |

## `entries` (optional)

Timeline activities. `activity_id` must exist in the Viaggio activity catalog (`flight`, `hotel`, `meal`, `sightseeing`, `ferry`, `train`, …). `schema` should match that activity’s schema (`transit`, `lodging`, `meal`, `place`, `event`, …).

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Local id |
| `activity_id` | string | Catalog activity id |
| `schema` | string | Catalog schema id |
| `title` | string | |
| `body` | object | Free-form JSON (default `{}`) |
| `details` | object | Hint fields (confirmation, from/to, …) |
| `occurs_on` | `YYYY-MM-DD` \| null | Date-only activities |
| `occurs_at` / `ends_at` | ISO-8601 \| null | Instants (UTC `Z` recommended) |
| `timezone`, `start_timezone`, `end_timezone` | string \| null | IANA |
| `place_name`, `address`, `phone_e164` | string \| null | |
| `lat`, `lng` | number \| null | |
| `contact_id` | string \| null | Local contact id |

## `entry_participants` (optional)

Who is on each activity.

| Field | Type |
|-------|------|
| `entry_id` | local entry id |
| `person_id` | local person id |

## `expenses` (optional)

Each expense belongs to an entry.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Local id |
| `entry_id` | string | Local entry id |
| `title` | string | |
| `amount_cents` | integer | Minor units (≥ 0) |
| `currency` | string | ISO 4217 |
| `paid_by_person_id` | string | Local person id |
| `split_mode` | `"equal"` \| `"custom"` | |
| `category` | string \| null | e.g. `food`, `transport`, `tickets` |

## `expense_splits` (optional)

Must sum to `amount_cents` for that expense. If missing or inconsistent, import falls back to charging the payer the full amount.

| Field | Type |
|-------|------|
| `expense_id` | local expense id |
| `person_id` | local person id |
| `amount_cents` | integer |

## `playlist` (optional)

| Field | Type | Notes |
|-------|------|-------|
| `url` | string | `http` or `https` |
| `title` | string | |
| `platform` | string \| null | `spotify`, `youtube`, or omit |
| `sort_order` | integer | Ascending |

## `place_ideas` (optional)

Map brainstorming shortlist (shared per journey).

| Field | Type | Notes |
|-------|------|-------|
| `google_place_id` | string \| null | Google Places id (dedupe hint) |
| `name` | string | Required on import |
| `address` | string \| null | |
| `lat`, `lng` | number | Required; skipped if missing |
| `note` | string | Default `""` |
| `sort_order` | integer | Ascending |
| `entry_id` | string \| null | Local entry id if already promoted |

## `todos` (optional)

Shared journey checklist (pre-trip prep, etc.).

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required on import |
| `notes` | string | Default `""` |
| `done` | boolean | Default `false` |
| `due_on` | `YYYY-MM-DD` \| null | Calendar date |
| `assignee_person_ids` | string[] | Local person ids; unmapped ids dropped |
| `assignees` | `{ person_id, done }[]` | Per-person completion; preferred on import |
| `assignee_person_id` | string \| null | Legacy single assignee; accepted on import |
| `sort_order` | integer | Ascending |

When `assignees` is present, each person’s `done` is restored. Otherwise `done` applies to the whole item (and to every assignee if only ids are listed).

## Not included (by design)

- Auth users / passwords / OTP
- Invite tokens
- Live membership ACL (except `member_role` hints on people)
- Attachment binary blobs (metadata may be added in a later version)
- Block lists

## Import rules (Viaggio app)

1. Signed-in user becomes the new journey **owner**.
2. Person with `member_role: "owner"`, or matching the importer’s email, maps to the owner’s roster seat; others are created as **guests** (no account).
3. All local ids are remapped to new UUIDs.
4. Entries use known `activity_id` values; unknown activities fail import.
5. Import order: journey → people → contacts → entries (+ participants) → expenses (+ splits) → playlist → place ideas → todos.

## Archive vs export

| | Export | Archive |
|---|--------|---------|
| Result | Downloadable `.json` file | Row in `viaggio_journey_archives.snapshot` |
| Live journey | Unchanged | **Deleted** from regular tables after snapshot is stored |
| Restore | Import file → new journey | Restore archive → import snapshot → remove archive row |

## Minimal valid example

See [`src/samples/journey-snapshot.sample.json`](../src/samples/journey-snapshot.sample.json).
