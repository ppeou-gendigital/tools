# Supabase SQL for Viaggio

1. Ensure Auth (email OTP) works.
2. Run shared template pieces if needed (`vault_meta.sql`, user_data prefs table from your project).
3. Run **`viaggio_schema.sql`** in the SQL Editor — creates domain tables, then helpers, RLS, and RPCs (tables must exist before the membership helper functions).
4. Run **`patches/profiles_read_co_travelers.sql`** so Members / expenses can show co-traveler `display_name` (profiles RLS is otherwise read-own-only).
5. On existing projects that already ran an older schema:
   - **`patches/entry_participants.sql`** (if not already applied)
   - **`patches/journey_people.sql`** — personal people library + journey roster; migrates entry participants and expense splits to `journey_person_id`
6. **`patches/journey_archives.sql`** — archive table + `archive_journey` / `delete_journey_archive` RPCs (store snapshot JSON, hard-delete live journey).

Fresh `viaggio_schema.sql` already includes the traveler people model.

Portable import/export format: **`docs/journey-snapshot.md`** (sample: `src/samples/journey-snapshot.sample.json`).

`template_attachments.sql` is superseded by the attachments section inside `viaggio_schema.sql` (entry-scoped paths).

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
