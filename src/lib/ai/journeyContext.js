import { planningClockContext } from '@/lib/ai/planningClock'
import { getPreset, isDualZoneSchema, resolveSchemaForActivity } from '@/lib/catalog'
import { entryDayKey } from '@/lib/format'
import { utcIsoToWallTime } from '@/lib/timezone'
import {
  getJourney,
  listEntries,
  listEntryParticipants,
  listExpensesForJourney,
  listJourneyPeople,
  listPlaceIdeas,
  listPlaylist,
  listTodos,
} from '@/lib/viaggioApi'

const ENTRY_CAP = 80
const DETAIL_MAX = 400
const BODY_MAX = 200

function normalizeMapFocus(mapFocus) {
  const lat = Number(mapFocus?.lat)
  const lng = Number(mapFocus?.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng, source: mapFocus?.source || 'map' }
}

function truncateDetails(details) {
  if (!details || typeof details !== 'object') return {}
  try {
    const s = JSON.stringify(details)
    if (s.length <= DETAIL_MAX) return details
    return { _truncated: true, _preview: s.slice(0, DETAIL_MAX) }
  } catch {
    return {}
  }
}

function truncateBody(body) {
  if (body == null) return null
  if (typeof body === 'string') {
    const t = body.trim()
    if (!t) return null
    return t.length > BODY_MAX ? `${t.slice(0, BODY_MAX)}…` : t
  }
  if (typeof body === 'object') {
    try {
      const s = JSON.stringify(body)
      if (s === '{}' || s === 'null') return null
      return s.length > BODY_MAX ? `${s.slice(0, BODY_MAX)}…` : body
    } catch {
      return null
    }
  }
  return null
}

function durationMinutes(occursAt, endsAt) {
  if (!occursAt || !endsAt) return null
  const a = Date.parse(occursAt)
  const b = Date.parse(endsAt)
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return null
  return Math.round((b - a) / 60000)
}

function journeyPhase(journey, today) {
  const start = journey.startsOn || null
  const end = journey.endsOn || null
  if (!start && !end) return 'open_ended'
  if (end && today > end) return 'past'
  if (start && today < start) return 'upcoming'
  return 'current'
}

function compactEntry(e, participantIds, journeyTz) {
  let schema = e.schema
  try {
    schema = schema || resolveSchemaForActivity(e.activityId)
  } catch {
    schema = e.schema || null
  }
  const dual = isDualZoneSchema(schema)
  const startTz =
    e.startTimezone || e.timezone || journeyTz || 'UTC'
  const endTz = e.endTimezone || e.timezone || journeyTz || 'UTC'
  const singleTz = e.timezone || journeyTz || 'UTC'
  const occursLocal = e.occursAt
    ? utcIsoToWallTime(e.occursAt, dual ? startTz : singleTz)
    : null
  const endsLocal = e.endsAt
    ? utcIsoToWallTime(e.endsAt, dual ? endTz : singleTz)
    : null

  const row = {
    id: e.id,
    activity_id: e.activityId,
    schema,
    title: e.title,
    occurs_on: e.occursOn,
    timezone: singleTz,
    start_timezone: dual ? startTz : null,
    end_timezone: dual ? endTz : null,
    occurs_at_local: occursLocal || null,
    ends_at_local: endsLocal || null,
    occurs_at_utc: e.occursAt || null,
    ends_at_utc: e.endsAt || null,
    duration_minutes: durationMinutes(e.occursAt, e.endsAt),
    place_name: e.placeName,
    address: e.address || null,
    lat: e.lat,
    lng: e.lng,
    participant_ids: participantIds,
    details: truncateDetails(e.details),
  }
  const body = truncateBody(e.body)
  if (body != null) row.body = body
  return row
}

function groupEntriesByDay(entryLines, rawEntries, journeyTz) {
  const byDate = new Map()
  const undated = []
  entryLines.forEach((line, i) => {
    const raw = rawEntries[i]
    const key = entryDayKey({
      occursAt: raw?.occursAt,
      occursOn: raw?.occursOn,
      timezone: raw?.timezone || journeyTz,
    })
    if (key === 'undated') {
      undated.push(line)
      return
    }
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key).push(line)
  })
  const days = [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, entries]) => ({ date, entries }))
  return { days, undated }
}

/**
 * Compact journey summary for prompts (no emails / invites / attachments).
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
  const [journey, entries, placeIdeas, todos, playlist, people, expenses, participants] =
    await Promise.all([
      getJourney(journeyId),
      listEntries(journeyId),
      listPlaceIdeas(journeyId),
      listTodos(journeyId),
      listPlaylist(journeyId),
      listJourneyPeople(journeyId),
      listExpensesForJourney(journeyId),
      listEntryParticipants(journeyId),
    ])
  if (!journey) throw new Error('Journey not found')

  const journeyTz = journey.defaultTimezone || 'UTC'
  const clock = planningClockContext(displayLocale, journeyTz)
  const preset = getPreset(journey.preset)

  const byEntryParticipants = new Map()
  for (const row of participants || []) {
    const list = byEntryParticipants.get(row.entryId) || []
    list.push(row.journeyPersonId)
    byEntryParticipants.set(row.entryId, list)
  }

  const allEntries = entries ?? []
  const truncated = allEntries.length > ENTRY_CAP
  const capped = truncated ? allEntries.slice(0, ENTRY_CAP) : allEntries
  const entryLines = capped.map((e) =>
    compactEntry(e, byEntryParticipants.get(e.id) || [], journeyTz),
  )
  const { days, undated } = groupEntriesByDay(entryLines, capped, journeyTz)

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
    assignee_person_ids: t.assigneeJourneyPersonIds || [],
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
    paid_by_person_id: e.paidBy || null,
    split_mode: e.splitMode || 'equal',
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
      preset_label: preset?.label || null,
      preset_primary_activities: preset?.primaryActivities || [],
      preset_expense_categories: preset?.defaultExpenseCategories || [],
      activity_packs: journey.activityPacks || journey.activity_packs || [],
      default_timezone: journeyTz,
      default_currency: journey.defaultCurrency,
      starts_on: journey.startsOn,
      ends_on: journey.endsOn,
      phase: journeyPhase(journey, clock.today),
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
    entries_meta: {
      total: allEntries.length,
      shown: entryLines.length,
      truncated,
    },
    days,
    undated_entries: undated,
    /** Flat list kept for id lookup; prefer days for timeline reasoning. */
    entries: entryLines,
    expenses: expenseLines,
    place_ideas: ideaLines,
    todos: todoLines,
    playlist: playlistLines,
  }
}

export function modePersonaPromptBlock(ctx) {
  const type = ctx?.journey?.type || 'trip'
  const preset = ctx?.journey?.preset || ''
  const primary = (ctx?.journey?.preset_primary_activities || []).join(', ')
  const categories = (ctx?.journey?.preset_expense_categories || []).join(', ')

  if (type === 'journal') {
    return [
      'Mode: JOURNAL (life log / household — not a vacation itinerary).',
      `Preset: ${preset}${ctx?.journey?.preset_label ? ` (${ctx.journey.preset_label})` : ''}.`,
      primary ? `Prefer activities: ${primary}.` : '',
      categories ? `Typical expense categories: ${categories}.` : '',
      'Open-ended / sparse timelines are normal. Do not invent a trip arc, flights, or hotels unless the user asks.',
      'Focus on bills, chores, milestones, appointments, car/home logs, and shared household costs as appropriate.',
      'Speak as a journal/household assistant — never say “your trip” unless the user does.',
    ]
      .filter(Boolean)
      .join('\n')
  }

  return [
    'Mode: TRIP (itinerary / travel planning).',
    `Preset: ${preset}${ctx?.journey?.preset_label ? ` (${ctx.journey.preset_label})` : ''}.`,
    primary ? `Prefer activities: ${primary}.` : '',
    categories ? `Typical expense categories: ${categories}.` : '',
    'Lodging/hotel: check-in = occurs_at_local, check-out = ends_at_local on the SAME lodging entry. Never add a separate “checkout” activity. Default checkout is morning (~11:00) unless the user says otherwise.',
    'Last hotel night: checkout must be before departure flight/train that day (compare occurs_at_utc / ends_at_utc).',
    'Transit (flight, train, ferry, boat, drive_leg, rideshare) and rental: use start_timezone + occurs_at_local for depart/pickup and end_timezone + ends_at_local for arrive/dropoff. Never one zone for both ends.',
    'Local arrive earlier than local depart is normal across timezones — do not “fix” by swapping; order by UTC.',
    'After landing, hotel/meals use the destination timezone.',
    'Parallel activities OK: overlapping times with different participant_ids (split group). Empty participant_ids means untagged, not “everyone”.',
    'Reorder / fix order: update only affected entry ids; change occurs_at_local/ends_at_local (and zones) — do not rewrite unrelated occurs_on / move other days unless the user asked.',
  ]
    .filter(Boolean)
    .join('\n')
}

export function timeContractPromptBlock() {
  return [
    'Time contract (all activities):',
    '- Think and emit WALL LOCAL times at each activity location + IANA timezone(s).',
    '- Prefer occurs_at_local / ends_at_local (YYYY-MM-DDTHH:mm) with timezone / start_timezone / end_timezone.',
    '- The app converts locals → real UTC for storage. Chronology = UTC sort.',
    '- Never write local clock digits as …Z (e.g. do not emit 11:00Z to mean 11am local).',
    '- occurs_at_utc / ends_at_utc in context are for checking order only.',
    '- clock.timeZone is the journey default timezone (authoritative for “today”).',
  ].join('\n')
}

/** Stable rules for system instruction (no full live state dump). */
export function journeySystemRulesPromptBlock(ctx) {
  const noun = ctx?.journey?.type === 'journal' ? 'journal' : 'trip'
  return [
    modePersonaPromptBlock(ctx),
    timeContractPromptBlock(),
    `You have full CRUD on ${noun} content via actions: add_*/update_*/remove_* for entries, todos, place_ideas, playlist, expenses; update_journey for title/dates/timezone/currency.`,
    'Always use existing ids from current_journey_context for update/remove. Never invent ids. Never touch people, members, or delete the whole journey.',
    'Money talk: journey.default_currency is bookkeeping; user_prefs.preferred_currency is how to talk to this user. Lead with preferred_currency; format for display_locale when set.',
    'Dates: clock.today / clock.weekday / clock.timeZone are authoritative for relative phrases.',
    'For add_expense / update_expense: use an existing entry_id from context, paid_by_person_id from people (prefer is_current_user), store receipt currency — do not invent converted cents. split_mode "equal" by default.',
    'Playlist: emit add_playlist with titles (optional search_query). Never invent video IDs/URLs — the app looks up YouTube. Include url only if the user pasted a real link.',
    'Place suggestions: emit add_place_ideas with name + lat/lng near map_focus or existing pins. Avoid duplicates. Typically 5–10 ideas.',
    'If entries_meta.truncated is true, you only see a subset — do not invent certainty about unseen days.',
    'Avoid duplicating places/todos/entries that already exist unless the user asks.',
  ].join('\n')
}

/** @deprecated Prefer journeySystemRulesPromptBlock + per-turn current_journey_context. */
export function journeyContextPromptBlock(ctx) {
  return [
    'Current journey context (JSON):',
    JSON.stringify(ctx, null, 2),
    journeySystemRulesPromptBlock(ctx),
  ].join('\n')
}
