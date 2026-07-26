/**
 * Compact JSON shapes embedded in prompts (avoid Firebase responseSchema
 * which can emit Scope.field:value mashups with Gemini 3.6).
 */

export const ENTRY_FIELDS_PROMPT = `
Entry object fields:
- id, activity_id, schema, title
- occurs_on: YYYY-MM-DD | null
- occurs_at_local / ends_at_local: "YYYY-MM-DDTHH:mm" wall times at the activity location(s) (preferred)
- timezone: IANA (single-location activities)
- start_timezone / end_timezone: IANA (transit + rental — depart/pickup vs arrive/dropoff)
- occurs_at / ends_at: real UTC ISO only if you must; prefer *_local + zones (app converts)
- place_name, address, lat, lng, details, participant_ids (journey person ids from context)
`.trim()

export const JOURNEY_SNAPSHOT_PROMPT_SCHEMA = `
Return JSON only, matching this shape (no markdown):
{
  "format": "viaggio.journey_snapshot",
  "version": 1,
  "journey": {
    "title": string,
    "type": "trip" | "journal",
    "preset": string (catalog id e.g. leisure_trip or household),
    "default_timezone": IANA string (e.g. "Asia/Taipei"),
    "default_currency": "USD" | "EUR" | … (3-letter),
    "starts_on": "YYYY-MM-DD" | null,
    "ends_on": "YYYY-MM-DD" | null
  },
  "people": [{ "id": string, "display_name": string }],
  "entries": [{
    "id": string,
    "activity_id": catalog activity id,
    "schema": string,
    "title": string,
    "occurs_on": "YYYY-MM-DD" | null,
    "occurs_at_local": "YYYY-MM-DDTHH:mm" | null,
    "ends_at_local": "YYYY-MM-DDTHH:mm" | null,
    "occurs_at": ISO-8601 UTC instant | null,
    "ends_at": ISO-8601 UTC instant | null,
    "timezone": IANA string,
    "start_timezone": IANA | null,
    "end_timezone": IANA | null,
    "place_name": string | null,
    "address": string | null,
    "lat": number | null,
    "lng": number | null,
    "details": object,
    "participant_ids": [person id strings]
  }],
  "place_ideas": [{ "name", "address?", "lat", "lng", "note?" }],
  "todos": [{ "title", "notes?", "due_on?", "done?" }],
  "playlist": [{ "title", "url", "platform?": "spotify"|"youtube" }],
  "summary": string (optional short plan blurb)
}

${ENTRY_FIELDS_PROMPT}

Rules:
- Never concatenate schema paths into values (no "Scope.field:…").
- dates are plain YYYY-MM-DD; timezones are plain IANA ids.
- Prefer occurs_at_local/ends_at_local + timezone(s). Never encode local clock as …Z.
- Multi-night lodging must include ends_at_local (checkout). Checkout before return transit on the last day.
- Transit/rental: start_timezone + end_timezone required when origin ≠ destination zone.
- details is a JSON object, not a string.
- Match journey.type to preset (trip vs journal).
- Playlist: prefer { title, search_query? } without inventing URLs — the app resolves YouTube watch links. Only include url when the user pasted a real youtube.com/watch or open.spotify.com track/album/playlist link.
`.trim()

export const CHAT_TURN_PROMPT_SCHEMA = `
Return JSON only:
{
  "assistant_message": string,
  "actions": [{
    "type": "add_entries" | "update_entries" | "remove_entries"
      | "add_todos" | "update_todos" | "remove_todos"
      | "add_place_ideas" | "update_place_ideas" | "remove_place_ideas"
      | "add_playlist" | "update_playlist" | "remove_playlist"
      | "add_expense" | "update_expense" | "remove_expenses"
      | "update_journey",
    "label": string,
    "ids": [existing ids from context…],  // for remove_* actions
    "entries": [entry objects…],
    "todos": [todo objects with id for update…],
    "place_ideas": [place idea objects with id for update…],
    "playlist": [playlist objects with id for update…],
    "expense": {
      "id": existing expense id (required for update_expense),
      "entry_id": existing entry id from context,
      "title": string,
      "amount_cents": integer,
      "currency": "USD" | "EUR" | …,
      "paid_by_person_id": journey person id from context,
      "split_mode": "equal" | "custom",
      "category": string | null,
      "splits": [{ "journey_person_id": string, "amount_cents": integer }]
    },
    "journey": {
      "title"?, "starts_on"?, "ends_on"?, "default_timezone"?, "default_currency"?
    }
  }]
}

${ENTRY_FIELDS_PROMPT}

Rules:
- Use existing ids from current_journey_context for every update_* / remove_*. Never invent ids.
- remove_* uses "ids": [...]. update_* includes id on each object (or expense.id / journey fields).
- Prefer occurs_at_local/ends_at_local + timezone(s). Never encode local clock as …Z.
- Lodging checkout = ends_at_local on the hotel/lodging entry — never a separate checkout entry.
- update_entries for time fixes: only touch affected ids; do not move unrelated days' occurs_on.
- participant_ids: set when tagging who goes (parallel/split-group activities OK). Omit on update to leave participants unchanged.
- Receipt photo/PDF → propose add_expense (one per receipt).
- Playlist search/add: emit add_playlist with 3–8 { title, search_query? } items — do NOT invent youtube/spotify URLs. The app resolves real youtube.com/watch links. Include url only if the user pasted a real link. Replacing Spotify → remove_playlist by id + add_playlist titles.
- Do not delete people/members or the whole journey. Never emit Scope.* mashups.
`.trim()

export const ENRICHMENT_PROMPT_SCHEMA = `
Return JSON only:
{
  "notes": string,
  "entries": [entry objects…],
  "todos": [todo objects…],
  "place_ideas": [place idea objects…],
  "playlist": [playlist objects…]
}
Prefer occurs_at_local/ends_at_local + IANA timezones. No Scope.* mashups. details is an object.
Playlist: titles (+ optional search_query) OK without urls; app resolves YouTube. Never invent video IDs.
`.trim()
