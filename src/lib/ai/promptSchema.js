/**
 * Compact JSON shapes embedded in prompts (avoid Firebase responseSchema
 * which can emit Scope.field:value mashups with Gemini 3.6).
 */

export const JOURNEY_SNAPSHOT_PROMPT_SCHEMA = `
Return JSON only, matching this shape (no markdown):
{
  "format": "viaggio.journey_snapshot",
  "version": 1,
  "journey": {
    "title": string,
    "type": "trip" | "journal",
    "preset": string (catalog id e.g. leisure_trip),
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
    "occurs_at": ISO-8601 instant | null,
    "ends_at": ISO-8601 instant | null,
    "timezone": IANA string,
    "place_name": string | null,
    "address": string | null,
    "lat": number | null,
    "lng": number | null,
    "details": object
  }],
  "place_ideas": [{ "name", "address?", "lat", "lng", "note?" }],
  "todos": [{ "title", "notes?", "due_on?", "done?" }],
  "playlist": [{ "title", "url", "platform?": "spotify"|"youtube" }],
  "summary": string (optional short plan blurb)
}

Rules:
- Never concatenate schema paths into values (no "Scope.field:…").
- dates are plain YYYY-MM-DD; timezones are plain IANA ids.
- details is a JSON object, not a string.
- Playlist urls must be embeddable: youtube.com/watch?v=…, youtube.com/playlist?list=…, or open.spotify.com/{track|album|playlist}/…. Never music.youtube.com search, never invent IDs. Omit playlist if you lack a real playable URL.
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

Rules:
- Use existing ids from journey context for every update_* / remove_*. Never invent ids.
- remove_* uses "ids": [...]. update_* includes id on each object (or expense.id / journey fields).
- Receipt photo/PDF → propose add_expense (one per receipt).
- Playlist: only embeddable URLs the in-app Player can play — https://www.youtube.com/watch?v=VIDEO_ID, https://www.youtube.com/playlist?list=LIST_ID, or https://open.spotify.com/{track|album|playlist}/ID. Never music.youtube.com/search, never youtube/spotify search pages, never invent video/playlist IDs.
- If the user asks for songs and you lack real playable URLs: name suggestions in assistant_message and skip add_playlist (or ask them to paste links). Replacing Spotify → remove_playlist by id; only add_playlist when you have real embeddable URLs.
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
Plain ISO dates / IANA timezones only. No Scope.* mashups. details is an object.
Playlist urls must be embeddable youtube.com watch/playlist or open.spotify.com track/album/playlist — never search URLs or invented IDs. Omit playlist if unsure.
`.trim()
