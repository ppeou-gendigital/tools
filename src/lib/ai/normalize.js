import {
  knownActivityIds,
  schemaForActivity,
} from '@/lib/ai/catalogContext'
import {
  JOURNEY_SNAPSHOT_FORMAT,
  JOURNEY_SNAPSHOT_VERSION,
  validateJourneySnapshot,
} from '@/lib/journeySnapshot'
import { parseMediaLink } from '@/lib/mediaEmbed'

const ACTIVITY_SET = new Set(knownActivityIds())
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const ISO_INSTANT =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:?\d{2})?$/i

function asString(v, fallback = '') {
  if (v == null) return fallback
  return String(v)
}

function asNullableString(v) {
  if (v == null || v === '') return null
  return String(v)
}

function asNumberOrNull(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** Split Gemini Scope.field:value mashups into primary + recovered fields. */
export function splitScopeLeak(raw) {
  const text = asString(raw)
  if (!text || !/scope\./i.test(text)) {
    return { primary: text || null, recovered: {} }
  }
  const parts = text.split(/scope\./i)
  const primary = parts[0]?.trim() || null
  const recovered = {}
  for (let i = 1; i < parts.length; i += 1) {
    const chunk = parts[i]
    const colon = chunk.indexOf(':')
    if (colon < 0) continue
    const key = chunk.slice(0, colon).trim()
    let val = chunk.slice(colon + 1).trim()
    // Drop trailing JSON noise after a field (next quote-comma patterns)
    val = val.replace(/",\s*"[a-z_]+".*$/i, '"').replace(/,$/, '').trim()
    if (val.startsWith('"') && val.endsWith('"')) {
      try {
        val = JSON.parse(val)
      } catch {
        val = val.slice(1, -1)
      }
    }
    if (key) recovered[key] = val
  }
  return { primary, recovered }
}

export function asIsoDate(value) {
  const { primary, recovered } = splitScopeLeak(value)
  const candidate = asString(primary).trim()
  if (ISO_DATE.test(candidate)) return { date: candidate, recovered }
  const m = candidate.match(/(\d{4}-\d{2}-\d{2})/)
  if (m) return { date: m[1], recovered }
  return { date: null, recovered }
}

export function asIsoInstant(value) {
  const { primary, recovered } = splitScopeLeak(value)
  let candidate = asString(primary).trim()
  if (!candidate) return { instant: null, recovered }
  if (!candidate.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(candidate)) {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(candidate)) {
      candidate = `${candidate}${candidate.length === 16 ? ':00' : ''}Z`
    }
  }
  if (!ISO_INSTANT.test(candidate) && Number.isNaN(Date.parse(candidate))) {
    return { instant: null, recovered }
  }
  const d = new Date(candidate)
  if (Number.isNaN(d.getTime())) return { instant: null, recovered }
  return { instant: d.toISOString(), recovered }
}

export function asIanaTimezone(value, fallback = 'UTC') {
  const { primary, recovered } = splitScopeLeak(value)
  let candidate = asString(primary).trim() || null
  if (candidate) {
    // Strip trailing garbage after a valid Zone/City pattern
    const m = candidate.match(/^([A-Za-z_]+\/[A-Za-z0-9_+\-]+|UTC)/)
    if (m) candidate = m[1]
  }
  if (!candidate) return { timezone: fallback, recovered }
  try {
    Intl.DateTimeFormat(undefined, { timeZone: candidate })
    return { timezone: candidate, recovered }
  } catch {
    return { timezone: fallback, recovered }
  }
}

function parseDetails(raw) {
  if (raw == null || raw === '') return {}
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw
  if (typeof raw === 'string') {
    const { primary } = splitScopeLeak(raw)
    try {
      const parsed = JSON.parse(primary || raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      return { note: primary || raw }
    }
  }
  return {}
}

function mergeRecoveredIntoEntry(entry, recovered) {
  if (!recovered || !Object.keys(recovered).length) return entry
  const next = { ...entry }
  if (recovered.address && !next.address) {
    next.address = asNullableString(recovered.address)
  }
  if (recovered.place_name && !next.place_name) {
    next.place_name = asNullableString(recovered.place_name)
  }
  if (recovered.details && (!next.details || !Object.keys(next.details).length)) {
    next.details = parseDetails(recovered.details)
  }
  if (recovered.lat != null && next.lat == null) {
    next.lat = asNumberOrNull(recovered.lat)
  }
  if (recovered.lng != null && next.lng == null) {
    next.lng = asNumberOrNull(recovered.lng)
  }
  return next
}

/** Map common model mistakes onto catalog activity ids. */
export function coerceActivityId(rawId) {
  const raw = asString(rawId)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
  if (!raw) return null
  if (ACTIVITY_SET.has(raw)) return raw

  const aliases = {
    drive: 'drive_leg',
    driving: 'drive_leg',
    car: 'drive_leg',
    road: 'drive_leg',
    road_trip: 'drive_leg',
    day_leg: 'drive_leg',
    museum: 'sightseeing',
    museums: 'sightseeing',
    attraction: 'sightseeing',
    attractions: 'sightseeing',
    tour: 'sightseeing',
    gallery: 'sightseeing',
    park: 'sightseeing',
    food: 'meal',
    dinner: 'meal',
    lunch: 'meal',
    breakfast: 'meal',
    brunch: 'meal',
    bbq: 'meal',
    korean_bbq: 'meal',
    kbbq: 'meal',
    k_bbq: 'meal',
    cafe: 'meal',
    coffee: 'meal',
    dining: 'meal',
    eat: 'meal',
    hotel_stay: 'hotel',
    airbnb: 'lodging',
    stay: 'lodging',
    accommodation: 'lodging',
    sleep: 'lodging',
    activity: 'group_activity',
    event: 'venue',
    concert: 'venue',
    show: 'venue',
    taxi: 'rideshare',
    uber: 'rideshare',
    lyft: 'rideshare',
    gas: 'fuel',
  }
  if (aliases[raw]) return aliases[raw]
  if (raw.includes('drive') || raw.includes('road')) return 'drive_leg'
  if (
    raw.includes('museum') ||
    raw.includes('sight') ||
    raw.includes('gallery')
  ) {
    return 'sightseeing'
  }
  if (
    raw.includes('bbq') ||
    raw.includes('meal') ||
    raw.includes('food') ||
    raw.includes('dinner') ||
    raw.includes('lunch') ||
    raw.includes('breakfast') ||
    raw.includes('restaurant') ||
    raw.includes('dining')
  ) {
    return raw.includes('restaurant') ? 'restaurant' : 'meal'
  }
  if (raw.includes('hotel')) return 'hotel'
  if (raw.includes('lodg') || raw.includes('airbnb')) return 'lodging'
  if (raw.includes('flight') || raw.includes('plane')) return 'flight'
  if (raw.includes('train')) return 'train'
  return null
}

/** Coerce activity_id aliases on entries; never invent entries from place_ideas. */
export function prepareSnapshotEntries(raw) {
  const entriesIn = Array.isArray(raw?.entries) ? raw.entries : []
  return {
    ...raw,
    entries: entriesIn.map((e) => {
      const coerced = coerceActivityId(e?.activity_id || e?.activityId)
      return coerced
        ? { ...e, activity_id: coerced, activityId: coerced }
        : e
    }),
  }
}

export function normalizeEntry(raw, index = 0, { defaultTimezone = 'UTC' } = {}) {
  const activityId =
    coerceActivityId(raw?.activity_id || raw?.activityId) ||
    asString(raw?.activity_id || raw?.activityId).trim()
  if (!ACTIVITY_SET.has(activityId)) return null
  const schema = schemaForActivity(activityId)
  const id = asString(raw?.id).trim() || `entry-${index + 1}`

  const occursOn = asIsoDate(raw?.occurs_on ?? raw?.occursOn)
  const occursAt = asIsoInstant(raw?.occurs_at ?? raw?.occursAt)
  const endsAt = asIsoInstant(raw?.ends_at ?? raw?.endsAt)
  const tz = asIanaTimezone(raw?.timezone, defaultTimezone)
  const startTz = asIanaTimezone(
    raw?.start_timezone ?? raw?.startTimezone,
    tz.timezone,
  )
  const endTz = asIanaTimezone(
    raw?.end_timezone ?? raw?.endTimezone,
    tz.timezone,
  )

  let entry = {
    id,
    activity_id: activityId,
    schema,
    title: asString(raw?.title).trim() || activityId,
    body: {},
    occurs_on: occursOn.date,
    occurs_at: occursAt.instant,
    ends_at: endsAt.instant,
    timezone: tz.timezone,
    start_timezone: startTz.timezone,
    end_timezone: endTz.timezone,
    place_name: asNullableString(raw?.place_name ?? raw?.placeName),
    address: asNullableString(raw?.address),
    lat: asNumberOrNull(raw?.lat),
    lng: asNumberOrNull(raw?.lng),
    phone_e164: null,
    contact_id: null,
    details: parseDetails(raw?.details),
  }

  entry = mergeRecoveredIntoEntry(entry, tz.recovered)
  entry = mergeRecoveredIntoEntry(entry, occursOn.recovered)
  entry = mergeRecoveredIntoEntry(entry, occursAt.recovered)
  return entry
}

export function normalizePlaceIdea(raw) {
  const nameLeak = splitScopeLeak(raw?.name)
  const name = asString(nameLeak.primary || raw?.name).trim()
  let lat = asNumberOrNull(raw?.lat)
  let lng = asNumberOrNull(raw?.lng)
  if (nameLeak.recovered.lat != null) lat = asNumberOrNull(nameLeak.recovered.lat)
  if (nameLeak.recovered.lng != null) lng = asNumberOrNull(nameLeak.recovered.lng)
  if (!name || lat == null || lng == null) return null
  return {
    name,
    address: asNullableString(raw?.address || nameLeak.recovered.address),
    lat,
    lng,
    note: asString(raw?.note),
  }
}

export function normalizeTodo(raw) {
  const title = asString(raw?.title).trim()
  if (!title) return null
  const due = asIsoDate(raw?.due_on ?? raw?.dueOn)
  return {
    title,
    notes: asString(raw?.notes),
    due_on: due.date,
    done: !!raw?.done,
  }
}

/** Rewrite YouTube Music watch/playlist shares to youtube.com for the in-app Player. */
function rewriteYoutubeMusicUrl(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
  const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
  if (host !== 'music.youtube.com') return url

  const videoId = parsed.searchParams.get('v')
  if (videoId) {
    return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
  }
  const list = parsed.searchParams.get('list')
  if (list && (parsed.pathname === '/playlist' || parsed.pathname.startsWith('/playlist'))) {
    return `https://www.youtube.com/playlist?list=${encodeURIComponent(list)}`
  }
  // search / browse / etc. — not embeddable
  return null
}

/**
 * Keep only playlist rows the in-app Player can embed.
 * Drops search URLs, fakes, and title-only suggestions.
 */
export function normalizePlaylistItem(raw) {
  const title = asString(raw?.title).trim() || 'Track'
  const id = asString(raw?.id).trim() || null
  let platform = asString(raw?.platform).toLowerCase()
  if (platform !== 'spotify' && platform !== 'youtube') {
    platform = null
  }
  let url = asString(raw?.url).trim()
  if (!url) return null

  const fakeHint =
    /example|placeholder|fake|dummy|lorem|test[_-]?id/i.test(url) ||
    /example|placeholder|fake|dummy/i.test(title)
  if (fakeHint) return null

  const rewritten = rewriteYoutubeMusicUrl(url)
  if (rewritten == null && /music\.youtube\.com/i.test(url)) return null
  if (rewritten) url = rewritten

  const target = parseMediaLink(url)
  if (!target.playable) return null

  if (!platform) {
    if (target.platform === 'spotify') platform = 'spotify'
    else if (target.platform === 'youtube') platform = 'youtube'
  }

  return {
    ...(id ? { id } : {}),
    title,
    url,
    platform: platform === 'spotify' || platform === 'youtube' ? platform : null,
  }
}

/**
 * Coerce model / import JSON into a valid viaggio.journey_snapshot.
 */
export function normalizeJourneySnapshot(raw, { importerName, overrides } = {}) {
  const prepared = prepareSnapshotEntries(raw && typeof raw === 'object' ? raw : {})
  const journeyIn = prepared?.journey || {}
  const peopleIn = Array.isArray(prepared?.people) ? prepared.people : []
  const ownerName =
    asString(importerName).trim() ||
    asString(peopleIn[0]?.display_name || peopleIn[0]?.displayName).trim() ||
    'Traveler'

  const starts = asIsoDate(journeyIn.starts_on ?? journeyIn.startsOn)
  let ends = asIsoDate(journeyIn.ends_on ?? journeyIn.endsOn)
  if (!ends.date && starts.recovered.ends_on) {
    ends = asIsoDate(starts.recovered.ends_on)
  }
  const tz = asIanaTimezone(
    journeyIn.default_timezone || journeyIn.defaultTimezone,
    'UTC',
  )

  const people = [
    {
      id: 'person-owner',
      display_name: ownerName,
      email: null,
      phone_e164: null,
      member_role: 'owner',
    },
    ...peopleIn
      .slice(0, 8)
      .map((p, i) => ({
        id: asString(p.id).trim() || `person-${i + 2}`,
        display_name: asString(p.display_name || p.displayName).trim(),
        email: null,
        phone_e164: null,
        member_role: null,
      }))
      .filter((p) => p.display_name && p.display_name !== ownerName),
  ]

  const defaultTimezone = tz.timezone
  const entries = (Array.isArray(prepared?.entries) ? prepared.entries : [])
    .map((e, i) => normalizeEntry(e, i, { defaultTimezone }))
    .filter(Boolean)

  const place_ideas = (Array.isArray(prepared?.place_ideas)
    ? prepared.place_ideas
    : []
  )
    .map(normalizePlaceIdea)
    .filter(Boolean)

  const todos = (Array.isArray(prepared?.todos) ? prepared.todos : [])
    .map(normalizeTodo)
    .filter(Boolean)

  const playlist = (Array.isArray(prepared?.playlist) ? prepared.playlist : [])
    .map(normalizePlaylistItem)
    .filter(Boolean)

  const currency = asString(journeyIn.default_currency || journeyIn.defaultCurrency)
    .trim()
    .toUpperCase()

  const ov = overrides || {}
  const snap = {
    format: JOURNEY_SNAPSHOT_FORMAT,
    version: JOURNEY_SNAPSHOT_VERSION,
    exported_at: new Date().toISOString(),
    journey: {
      title: asString(ov.title ?? journeyIn.title).trim() || 'AI trip',
      type:
        (ov.type ?? journeyIn.type) === 'journal' ? 'journal' : 'trip',
      preset: asString(ov.preset ?? journeyIn.preset).trim() || 'leisure_trip',
      activity_packs: [],
      default_timezone: ov.defaultTimezone || defaultTimezone,
      default_currency: /^[A-Z]{3}$/.test(ov.defaultCurrency || currency)
        ? ov.defaultCurrency || currency
        : 'USD',
      starts_on: ov.startsOn !== undefined ? ov.startsOn : starts.date,
      ends_on: ov.endsOn !== undefined ? ov.endsOn : ends.date,
    },
    people,
    contacts: [],
    entries,
    entry_participants: [],
    expenses: [],
    expense_splits: [],
    playlist,
    place_ideas,
    todos,
  }

  return validateJourneySnapshot(snap)
}

export function normalizeEnrichment(raw, { defaultTimezone = 'UTC' } = {}) {
  return {
    notes: asString(raw?.notes),
    entries: (Array.isArray(raw?.entries) ? raw.entries : [])
      .map((e, i) => normalizeEntry(e, i, { defaultTimezone }))
      .filter(Boolean),
    todos: (Array.isArray(raw?.todos) ? raw.todos : [])
      .map(normalizeTodo)
      .filter(Boolean),
    place_ideas: (Array.isArray(raw?.place_ideas) ? raw.place_ideas : [])
      .map(normalizePlaceIdea)
      .filter(Boolean),
    playlist: (Array.isArray(raw?.playlist) ? raw.playlist : [])
      .map(normalizePlaylistItem)
      .filter(Boolean),
  }
}

const CHAT_ACTION_TYPES = new Set([
  'add_entries',
  'update_entries',
  'remove_entries',
  'add_todos',
  'update_todos',
  'remove_todos',
  'add_place_ideas',
  'update_place_ideas',
  'remove_place_ideas',
  'add_playlist',
  'update_playlist',
  'remove_playlist',
  'add_expense',
  'update_expense',
  'remove_expenses',
  'update_journey',
])

function normalizeExpenseAction(raw, { requireId = false } = {}) {
  const src = raw?.expense && typeof raw.expense === 'object' ? raw.expense : raw
  const id = asString(src?.id).trim()
  if (requireId && !id) return null
  const entryId = asString(src?.entry_id).trim()
  const title = asString(src?.title).trim()
  let amountCents = Math.round(Number(src?.amount_cents))
  if (!Number.isFinite(amountCents) && src?.amount != null) {
    const major = Number(src.amount)
    if (Number.isFinite(major)) amountCents = Math.round(major * 100)
  }
  const currency = asString(src?.currency || src?.default_currency)
    .trim()
    .toUpperCase()
  const paidBy = asString(
    src?.paid_by_person_id || src?.paid_by || src?.paidBy,
  ).trim()
  const splitMode =
    asString(src?.split_mode || src?.splitMode).trim() === 'custom'
      ? 'custom'
      : 'equal'
  const category = asNullableString(src?.category)
  if (!entryId || !title || !Number.isFinite(amountCents) || amountCents < 0) {
    return null
  }
  if (!/^[A-Z]{3}$/.test(currency) || !paidBy) return null

  const splitsIn = Array.isArray(src?.splits) ? src.splits : []
  const splits = splitsIn
    .map((s) => {
      const journeyPersonId = asString(
        s?.journey_person_id || s?.journeyPersonId,
      ).trim()
      const cents = Math.round(Number(s?.amount_cents ?? s?.amountCents))
      if (!journeyPersonId || !Number.isFinite(cents)) return null
      return { journey_person_id: journeyPersonId, amount_cents: cents }
    })
    .filter(Boolean)

  return {
    ...(id ? { id } : {}),
    entry_id: entryId,
    title,
    amount_cents: amountCents,
    currency,
    paid_by_person_id: paidBy,
    split_mode: splitMode,
    category,
    splits,
  }
}

function collectActionIds(a) {
  const fromIds = (Array.isArray(a?.ids) ? a.ids : [])
    .map((id) => asString(id).trim())
    .filter(Boolean)
  if (fromIds.length) return [...new Set(fromIds)]
  const bags = [
    a?.entries,
    a?.todos,
    a?.place_ideas,
    a?.playlist,
    a?.expenses,
  ]
  const extracted = []
  for (const bag of bags) {
    if (!Array.isArray(bag)) continue
    for (const row of bag) {
      const id = asString(row?.id).trim()
      if (id) extracted.push(id)
    }
  }
  return [...new Set(extracted)]
}

function normalizeTodoUpdate(raw) {
  const id = asString(raw?.id).trim()
  if (!id) return null
  const title = asString(raw?.title).trim()
  const due = asIsoDate(raw?.due_on ?? raw?.dueOn)
  return {
    id,
    title: title || null,
    notes: raw?.notes !== undefined ? asString(raw.notes) : undefined,
    due_on: raw?.due_on !== undefined || raw?.dueOn !== undefined ? due.date : undefined,
    done: raw?.done !== undefined ? !!raw.done : undefined,
  }
}

function normalizePlaceIdeaUpdate(raw) {
  const id = asString(raw?.id).trim()
  if (!id) return null
  const name = asString(raw?.name).trim()
  return {
    id,
    name: name || null,
    address: raw?.address !== undefined ? asNullableString(raw.address) : undefined,
    note: raw?.note !== undefined ? asString(raw.note) : undefined,
    lat: raw?.lat !== undefined ? asNumberOrNull(raw.lat) : undefined,
    lng: raw?.lng !== undefined ? asNumberOrNull(raw.lng) : undefined,
  }
}

function normalizeJourneyPatch(raw) {
  const src = raw?.journey && typeof raw.journey === 'object' ? raw.journey : raw
  if (!src || typeof src !== 'object') return null
  const patch = {}
  if (src.title != null) {
    const title = asString(src.title).trim()
    if (title) patch.title = title
  }
  if (src.starts_on !== undefined || src.startsOn !== undefined) {
    patch.starts_on = asIsoDate(src.starts_on ?? src.startsOn).date
  }
  if (src.ends_on !== undefined || src.endsOn !== undefined) {
    patch.ends_on = asIsoDate(src.ends_on ?? src.endsOn).date
  }
  if (src.default_timezone != null || src.defaultTimezone != null) {
    const tz = asIanaTimezone(
      src.default_timezone || src.defaultTimezone,
      null,
    )
    if (tz.timezone) patch.default_timezone = tz.timezone
  }
  if (src.default_currency != null || src.defaultCurrency != null) {
    const currency = asString(src.default_currency || src.defaultCurrency)
      .trim()
      .toUpperCase()
    if (/^[A-Z]{3}$/.test(currency)) patch.default_currency = currency
  }
  return Object.keys(patch).length ? patch : null
}

function emptyActionFields() {
  return {
    ids: [],
    entries: [],
    todos: [],
    place_ideas: [],
    playlist: [],
    expense: null,
    journey: null,
  }
}

export function normalizeChatTurn(raw) {
  const actionsIn = Array.isArray(raw?.actions) ? raw.actions : []
  const actions = actionsIn
    .map((a, i) => {
      const type = asString(a?.type).trim()
      if (!CHAT_ACTION_TYPES.has(type)) return null
      const label = asString(a?.label).trim() || type.replace(/_/g, ' ')
      const base = {
        id: `action-${i + 1}`,
        type,
        label,
        ...emptyActionFields(),
      }

      if (type.startsWith('remove_')) {
        const ids = collectActionIds(a)
        if (!ids.length) return null
        return { ...base, ids }
      }

      if (type === 'add_expense' || type === 'update_expense') {
        const expense = normalizeExpenseAction(a, {
          requireId: type === 'update_expense',
        })
        if (!expense) return null
        return {
          ...base,
          label:
            label ||
            `${type === 'update_expense' ? 'Update' : 'Add'} expense: ${expense.title}`,
          expense,
        }
      }

      if (type === 'update_journey') {
        const journey = normalizeJourneyPatch(a)
        if (!journey) return null
        return { ...base, journey }
      }

      if (type === 'update_entries') {
        const updates = (Array.isArray(a?.entries) ? a.entries : [])
          .map((e, idx) => {
            const id = asString(e?.id).trim()
            if (!id) return null
            const n = normalizeEntry(e, idx)
            if (!n) return null
            return { ...n, id }
          })
          .filter(Boolean)
        if (!updates.length) return null
        return { ...base, entries: updates }
      }

      if (type === 'update_todos') {
        const todos = (Array.isArray(a?.todos) ? a.todos : [])
          .map(normalizeTodoUpdate)
          .filter(Boolean)
        if (!todos.length) return null
        return { ...base, todos }
      }

      if (type === 'update_place_ideas') {
        const place_ideas = (Array.isArray(a?.place_ideas) ? a.place_ideas : [])
          .map(normalizePlaceIdeaUpdate)
          .filter(Boolean)
        if (!place_ideas.length) return null
        return { ...base, place_ideas }
      }

      if (type === 'update_playlist') {
        const playlist = (Array.isArray(a?.playlist) ? a.playlist : [])
          .map((p) => {
            const id = asString(p?.id).trim()
            if (!id) return null
            const n = normalizePlaylistItem(p)
            return n ? { ...n, id } : null
          })
          .filter(Boolean)
        if (!playlist.length) return null
        return { ...base, playlist }
      }

      const enrichment = normalizeEnrichment(a)
      if (type === 'add_entries') {
        if (!enrichment.entries.length) return null
        return { ...base, entries: enrichment.entries }
      }
      if (type === 'add_todos') {
        if (!enrichment.todos.length) return null
        return { ...base, todos: enrichment.todos }
      }
      if (type === 'add_place_ideas') {
        if (!enrichment.place_ideas.length) return null
        return { ...base, place_ideas: enrichment.place_ideas }
      }
      if (type === 'add_playlist') {
        if (!enrichment.playlist.length) return null
        return { ...base, playlist: enrichment.playlist }
      }
      return null
    })
    .filter(Boolean)

  return {
    assistant_message:
      asString(raw?.assistant_message || raw?.message).trim() ||
      'Here are some ideas.',
    actions,
  }
}

/** Collect human-readable validation issues without throwing. */
export function collectSnapshotIssues(raw) {
  const issues = []
  try {
    normalizeJourneySnapshot(raw)
  } catch (err) {
    issues.push(err.message || String(err))
  }
  if (!raw || typeof raw !== 'object') {
    issues.push('Root must be a JSON object')
  }
  const entries = Array.isArray(raw?.entries) ? raw.entries : []
  entries.forEach((e, i) => {
    const aid = asString(e?.activity_id).trim()
    if (aid && !ACTIVITY_SET.has(aid)) {
      issues.push(`entries[${i}]: unknown activity_id “${aid}”`)
    }
    if (/scope\./i.test(asString(e?.timezone))) {
      issues.push(`entries[${i}]: timezone contains Scope.* mashup`)
    }
  })
  if (/scope\./i.test(asString(raw?.journey?.starts_on))) {
    issues.push('journey.starts_on contains Scope.* mashup')
  }
  return [...new Set(issues)]
}
