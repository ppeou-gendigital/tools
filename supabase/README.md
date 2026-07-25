# Supabase SQL for Viaggio

1. Ensure Auth (email OTP) works.
2. Run shared template pieces if needed (`vault_meta.sql`, user_data prefs table from your project).
3. Run **`viaggio_schema.sql`** in the SQL Editor — creates domain tables, then helpers, RLS, and RPCs (tables must exist before the membership helper functions).
4. Run **`patches/profiles_read_co_travelers.sql`** so Members / expenses can show co-traveler `display_name` (profiles RLS is otherwise read-own-only).
5. On existing projects that already ran an older schema:
   - **`patches/entry_participants.sql`** (if not already applied)
   - **`patches/journey_people.sql`** — personal people library + journey roster; migrates entry participants and expense splits to `journey_person_id`
6. **`patches/journey_archives.sql`** — archive table + `archive_journey` / `delete_journey_archive` RPCs (store snapshot JSON, hard-delete live journey).
7. **`patches/place_ideas.sql`** — shared map shortlist (`viaggio_place_ideas`) for brainstorming places before promoting to activities.
8. **`patches/attachments_expense_id.sql`** — optional `expense_id` on `viaggio_attachments` for expense receipts (cascade delete with the expense).
9. **`patches/todos.sql`** — shared journey checklist (`viaggio_todos`) for pre-trip prep items (Visa, eSim, etc.).
10. **`patches/todo_assignees.sql`** — multi-assignee junction (`viaggio_todo_assignees`); migrates legacy single-assignee column if present.
11. **`patches/todo_assignee_done.sql`** — per-assignee `done` / `done_at` + rollup to todo.done; adds assignee UPDATE RLS.

Fresh `viaggio_schema.sql` already includes the traveler people model, place ideas, todos (+ assignees), and attachment `expense_id`.

Portable import/export format: **`docs/journey-snapshot.md`** (sample: `src/samples/journey-snapshot.sample.json`).

`template_attachments.sql` is superseded by the attachments section inside `viaggio_schema.sql` (entry-scoped paths).

## Reset test data

To empty all Viaggio domain tables while keeping `auth.users`, `profiles`, and shared `user_data`, run [`scripts/wipe_viaggio_app_data.sql`](scripts/wipe_viaggio_app_data.sql) in the SQL Editor. Irreversible. Then empty the `viaggio-attachments` bucket in Dashboard → Storage (SQL cannot delete `storage.objects` directly).

## Edge Function: invite email

Sends a Supabase Auth magic-link / invite email for a roster person.

```bash
# From repo root (requires Supabase CLI + linked project)
supabase functions deploy invite-journey-person

supabase secrets set INVITE_REDIRECT_URL=http://localhost:5173
# production example:
# supabase secrets set INVITE_REDIRECT_URL=https://your-app.example
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically to Edge Functions.

Client calls `sendInviteEmail({ inviteId, journeyId })` after `createInvite(...)`. Mailto / SMS / copy-link remain available as fallbacks.

## Edge Function: flight status

Live delay / gate / terminal for flight timeline entries. API keys stay server-side.

**Providers (in order):**
1. **[AeroDataBox](https://aerodatabox.com/)** via RapidAPI — primary (flight number + date)
2. **[Aviationstack](https://aviationstack.com/)** — optional fallback (real-time only on free)

```bash
# From repo root (requires Supabase CLI + linked project)
supabase functions deploy flight-status

# Primary (RapidAPI → AeroDataBox subscription key)
supabase secrets set AERODATABOX_API_KEY=your_rapidapi_key

# Optional fallback
supabase secrets set AVIATIONSTACK_API_KEY=your_aviationstack_key
```

Or set both in Dashboard → **Edge Functions → Secrets**.

`SUPABASE_URL` and `SUPABASE_ANON_KEY` are provided automatically.

Client: `src/lib/flightStatus.js` → `supabase.functions.invoke('flight-status', { body: { airline, flightNumber, date } })`.

**App UX:** Journey does **not** auto-poll. Editors tap the plane icon on a flight row to fetch live status, see it in a popup, store the edge JSON on `details.flight_live`, and optionally update `occurs_at` / `ends_at` when times are valid. The UI formats that blob on the fly.

**Test (Dashboard sample style — publishable key is fine):**

```bash
curl -L -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/flight-status' \
  -H "Authorization: Bearer YOUR_PUBLISHABLE_OR_ANON_KEY" \
  -H "apikey: YOUR_PUBLISHABLE_OR_ANON_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"airline":"TP","flightNumber":"440","date":"2026-07-24"}'
```

Successful responses include `"provider": "aerodatabox"` or `"aviationstack"`.

**Quotas:** AeroDataBox free BASIC is ~600 units/mo (flight status is Tier 2 ≈ 2 units/call). Aviationstack free is ~100 req/mo and cannot filter by date. Prefer AeroDataBox for itinerary dates. The client caches ~12 minutes between forced refreshes.

Flight entries need `details.airline` (IATA) + `details.flight_number` (+ `occurs_at` for the date). Confirmation / PNR is stored for the traveler but is not used for status lookup.
