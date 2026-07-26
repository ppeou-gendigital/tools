import { planningClockContext } from '@/lib/ai/planningClock'
import {
  getJourney,
  listEntries,
  listExpensesForJourney,
  listJourneyPeople,
  listPlaceIdeas,
  listPlaylist,
  listTodos,
} from '@/lib/viaggioApi'

function normalizeMapFocus(mapFocus) {
  const lat = Number(mapFocus?.lat)
  const lng = Number(mapFocus?.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng, source: mapFocus?.source || 'map' }
}

/**
 * Compact journey summary for prompts (no emails / invites / attachments).
 * @param {string} journeyId
 * @param {{
 *   userId?: string | null,
 *   preferredCurrency?: string | null,
 *   displayLocale?: string | null,
 *   mapFocus?: { lat: number, lng: number, source?: string } | null,
 * }} [opts]
 */
export async function buildJourneyAiContext(
  journeyId,
  {
    userId = null,
    preferredCurrency = null,
    displayLocale = null,
    mapFocus = null,
  } = {},
) {
  const clock = planningClockContext(displayLocale)
  const [journey, entries, placeIdeas, todos, playlist, people, expenses] =
    await Promise.all([
      getJourney(journeyId),
      listEntries(journeyId),
      listPlaceIdeas(journeyId),
      listTodos(journeyId),
      listPlaylist(journeyId),
      listJourneyPeople(journeyId),
      listExpensesForJourney(journeyId),
    ])
  if (!journey) throw new Error('Journey not found')

  const entryLines = (entries ?? []).slice(0, 80).map((e) => ({
    id: e.id,
    activity_id: e.activityId,
    title: e.title,
    occurs_on: e.occursOn,
    occurs_at: e.occursAt,
    ends_at: e.endsAt,
    place_name: e.placeName,
    lat: e.lat,
    lng: e.lng,
  }))

  const ideaLines = (placeIdeas ?? []).slice(0, 60).map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    lat: p.lat,
    lng: p.lng,
    note: p.note ? String(p.note).slice(0, 160) : '',
  }))

  const todoLines = (todos ?? []).slice(0, 60).map((t) => ({
    id: t.id,
    title: t.title,
    done: !!t.done,
    due_on: t.dueOn,
    notes: t.notes ? String(t.notes).slice(0, 120) : '',
  }))

  const playlistLines = (playlist ?? []).slice(0, 30).map((p) => ({
    id: p.id,
    title: p.title,
    url: p.url,
    platform: p.platform,
  }))

  const peopleLines = (people ?? []).slice(0, 40).map((p) => ({
    id: p.id,
    display_name: p.displayName,
    linked_user_id: p.linkedUserId || null,
    is_current_user: !!(userId && p.linkedUserId && p.linkedUserId === userId),
  }))

  const expenseLines = (expenses ?? []).slice(0, 40).map((e) => ({
    id: e.id,
    entry_id: e.entryId,
    title: e.title,
    amount_cents: e.amountCents,
    currency: e.currency,
    category: e.category || null,
  }))

  const prefCurrency = String(preferredCurrency || '')
    .trim()
    .toUpperCase()
  const prefLocale = String(displayLocale || '').trim()
  const focus = normalizeMapFocus(mapFocus)

  return {
    journey: {
      id: journey.id,
      title: journey.title,
      type: journey.type,
      preset: journey.preset,
      default_timezone: journey.defaultTimezone,
      default_currency: journey.defaultCurrency,
      starts_on: journey.startsOn,
      ends_on: journey.endsOn,
    },
    user_prefs: {
      preferred_currency: /^[A-Z]{3}$/.test(prefCurrency)
        ? prefCurrency
        : journey.defaultCurrency || null,
      display_locale: prefLocale || null,
    },
    clock,
    map_focus: focus,
    current_user_id: userId || null,
    people: peopleLines,
    entries: entryLines,
    expenses: expenseLines,
    place_ideas: ideaLines,
    todos: todoLines,
    playlist: playlistLines,
  }
}

export function journeyContextPromptBlock(ctx) {
  return [
    'Current journey context (JSON):',
    JSON.stringify(ctx, null, 2),
    'You have full CRUD on trip content via actions: add_*/update_*/remove_* for entries, todos, place_ideas, playlist, expenses; update_journey for title/dates/timezone/currency.',
    'Always use existing ids from this context for update/remove. Never invent ids. Never touch people, members, or delete the whole journey.',
    'Money talk: journey.default_currency is trip bookkeeping; user_prefs.preferred_currency is how to talk to this user. When discussing prices/budgets, lead with preferred_currency and optionally show local currency in parentheses. Format amounts naturally for user_prefs.display_locale when set.',
    'Dates: clock.today / clock.weekday / clock.timeZone are authoritative. Relative phrases use that calendar; do not invent outdated years.',
    'For add_expense / update_expense: use an existing entry_id from context (same-day or most recent activity if unsure), paid_by_person_id from people (prefer is_current_user), store currency from the receipt (or journey.default_currency if unclear) — do not invent converted cents as the stored amount. split_mode "equal" by default.',
    'Playlist: to search/add music, emit add_playlist with titles (optional search_query). Never invent video IDs/URLs — the app looks up real YouTube watch links. If the user pasted a real youtube.com/watch or Spotify URL, include that url. Replacing Spotify → remove_playlist by id + add_playlist with new titles.',
    'Place suggestions (Suggest places): when the user asks for places, ideas, or “near here/the map”, emit add_place_ideas with distinct name + approximate lat/lng (+ optional note/address). Prefer map_focus when set; otherwise stay near the trip destination / existing pins. Do not duplicate place_ideas or entry places already in context. Typically 5–10 ideas.',
    'Avoid duplicating places/todos/entries that already exist unless the user asks.',
  ].join('\n')
}
