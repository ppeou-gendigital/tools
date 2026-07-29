/**
 * Docto-style deep validators for viaggio.journey_snapshot.
 * Runtime authority for import / AI repair issue lists (not ajv).
 */

import {
  coerceActivityId,
  knownActivityIds,
  knownPresetIds,
  schemaForActivity,
} from '@/lib/ai/catalogContext'

/** Keep in sync with JOURNEY_SNAPSHOT_* in journeySnapshot.js (no import cycle). */
const JOURNEY_SNAPSHOT_FORMAT = 'viaggio.journey_snapshot'
const JOURNEY_SNAPSHOT_VERSION = 1

const ACTIVITY_SET = new Set(knownActivityIds())
const PRESET_SET = new Set(knownPresetIds())
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const ARRAY_KEYS = [
  'contacts',
  'entries',
  'entry_participants',
  'expenses',
  'expense_splits',
  'playlist',
  'place_ideas',
  'todos',
]

function asString(v) {
  if (v == null) return ''
  return String(v)
}

function hasScopeMashup(value) {
  return /scope\./i.test(asString(value))
}

function isValidIana(value) {
  const tz = asString(value).trim()
  if (!tz) return false
  if (hasScopeMashup(tz)) return false
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz })
    return true
  } catch {
    return false
  }
}

function resolveActivityId(rawId) {
  const coerced = coerceActivityId(rawId)
  if (coerced && ACTIVITY_SET.has(coerced)) return coerced
  const raw = asString(rawId).trim()
  if (ACTIVITY_SET.has(raw)) return raw
  return null
}

/**
 * Collect field-path issues for a snapshot (raw or normalized).
 * Does not throw. Envelope + per-entity + cross-ref checks.
 *
 * @param {unknown} raw
 * @param {{ requireLodgingCheckout?: boolean, requirePlaceCoords?: boolean }} [opts]
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateSnapshotDeep(
  raw,
  { requireLodgingCheckout = false, requirePlaceCoords = false } = {},
) {
  const errors = []

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['Snapshot must be a JSON object'] }
  }

  if (raw.format !== JOURNEY_SNAPSHOT_FORMAT) {
    errors.push(
      `format must be "${JOURNEY_SNAPSHOT_FORMAT}" (got ${JSON.stringify(raw.format)})`,
    )
  }

  const version = Number(raw.version)
  if (
    !Number.isInteger(version) ||
    version < 1 ||
    version > JOURNEY_SNAPSHOT_VERSION
  ) {
    errors.push(`Unsupported snapshot version: ${JSON.stringify(raw.version)}`)
  }

  if (!raw.journey || typeof raw.journey !== 'object') {
    errors.push('journey is required')
  } else {
    const j = raw.journey
    if (!asString(j.title).trim()) errors.push('journey.title is required')
    if (j.type !== 'trip' && j.type !== 'journal') {
      errors.push('journey.type must be "trip" or "journal"')
    }
    const preset = asString(j.preset).trim()
    if (!preset) errors.push('journey.preset is required')
    else if (!PRESET_SET.has(preset)) {
      errors.push(`journey.preset unknown catalog id “${preset}”`)
    }
    const tz = j.default_timezone ?? j.defaultTimezone
    if (!asString(tz).trim()) {
      errors.push('journey.default_timezone is required')
    } else if (hasScopeMashup(tz)) {
      errors.push('journey.default_timezone contains Scope.* mashup')
    } else if (!isValidIana(tz)) {
      errors.push(
        `journey.default_timezone is not a valid IANA id (“${asString(tz).trim()}”)`,
      )
    }
    const currency = asString(j.default_currency ?? j.defaultCurrency)
      .trim()
      .toUpperCase()
    if (!/^[A-Z]{3}$/.test(currency)) {
      errors.push('journey.default_currency must be ISO 4217 (e.g. EUR)')
    }
    for (const key of ['starts_on', 'ends_on', 'startsOn', 'endsOn']) {
      const v = j[key]
      if (v == null || v === '') continue
      if (hasScopeMashup(v)) {
        errors.push(`journey.${key} contains Scope.* mashup`)
      } else if (!ISO_DATE.test(asString(v).trim())) {
        errors.push(`journey.${key} must be YYYY-MM-DD`)
      }
    }
  }

  if (!Array.isArray(raw.people)) {
    errors.push('people must be an array')
  } else if (raw.people.length < 1) {
    errors.push('people must include at least one person')
  }

  for (const key of ARRAY_KEYS) {
    if (raw[key] != null && !Array.isArray(raw[key])) {
      errors.push(`${key} must be an array`)
    }
  }

  const people = Array.isArray(raw.people) ? raw.people : []
  const personIds = new Set()
  people.forEach((p, i) => {
    if (!p || typeof p !== 'object') {
      errors.push(`people[${i}]: must be an object`)
      return
    }
    const id = asString(p.id).trim()
    const name = asString(p.display_name ?? p.displayName).trim()
    if (!id) errors.push(`people[${i}]: id is required`)
    else if (personIds.has(id)) errors.push(`people[${i}]: duplicate id “${id}”`)
    else personIds.add(id)
    if (!name) errors.push(`people[${i}]: display_name is required`)
  })

  const entries = Array.isArray(raw.entries) ? raw.entries : []
  const entryIds = new Set()
  entries.forEach((e, i) => {
    if (!e || typeof e !== 'object') {
      errors.push(`entries[${i}]: must be an object`)
      return
    }
    const id = asString(e.id).trim()
    if (!id) errors.push(`entries[${i}]: id is required`)
    else if (entryIds.has(id)) errors.push(`entries[${i}]: duplicate id “${id}”`)
    else entryIds.add(id)

    const rawAid = e.activity_id ?? e.activityId
    const activityId = resolveActivityId(rawAid)
    if (!asString(rawAid).trim()) {
      errors.push(`entries[${i}]: activity_id is required`)
    } else if (!activityId) {
      errors.push(
        `entries[${i}]: unknown activity_id “${asString(rawAid).trim()}”`,
      )
    } else {
      const schema = schemaForActivity(activityId)
      if (
        requireLodgingCheckout &&
        schema === 'lodging' &&
        e.ends_at == null &&
        e.endsAt == null &&
        e.ends_at_local == null &&
        e.endsAtLocal == null
      ) {
        errors.push(
          `entries[${i}]: lodging “${activityId}” should include ends_at_local (checkout)`,
        )
      }
    }

    for (const field of [
      'timezone',
      'start_timezone',
      'end_timezone',
      'occurs_on',
      'occurs_at',
      'ends_at',
      'occurs_at_local',
      'ends_at_local',
      'address',
      'place_name',
    ]) {
      if (hasScopeMashup(e[field])) {
        errors.push(`entries[${i}].${field} contains Scope.* mashup`)
      }
    }

    const occursOn = e.occurs_on ?? e.occursOn
    if (occursOn != null && occursOn !== '') {
      const d = asString(occursOn).trim()
      if (!hasScopeMashup(d) && !ISO_DATE.test(d)) {
        errors.push(`entries[${i}].occurs_on must be YYYY-MM-DD`)
      }
    }

    if (e.details != null && typeof e.details === 'string') {
      const trimmed = e.details.trim()
      if (trimmed && (trimmed[0] === '{' || trimmed[0] === '[')) {
        try {
          JSON.parse(trimmed)
        } catch {
          errors.push(`entries[${i}].details is not valid JSON`)
        }
      }
    } else if (
      e.details != null &&
      (typeof e.details !== 'object' || Array.isArray(e.details))
    ) {
      errors.push(`entries[${i}].details must be an object`)
    }

    const pids =
      e.participant_ids ?? e.participantIds ?? e.participants ?? null
    if (Array.isArray(pids) && personIds.size) {
      pids.forEach((pid, pi) => {
        const id = asString(pid).trim()
        if (id && !personIds.has(id)) {
          errors.push(
            `entries[${i}].participant_ids[${pi}]: unknown person id “${id}”`,
          )
        }
      })
    }
  })

  const participants = Array.isArray(raw.entry_participants)
    ? raw.entry_participants
    : []
  participants.forEach((row, i) => {
    if (!row || typeof row !== 'object') {
      errors.push(`entry_participants[${i}]: must be an object`)
      return
    }
    const entryId = asString(row.entry_id ?? row.entryId).trim()
    const personId = asString(row.person_id ?? row.personId).trim()
    if (!entryId) {
      errors.push(`entry_participants[${i}]: entry_id is required`)
    } else if (entryIds.size && !entryIds.has(entryId)) {
      errors.push(
        `entry_participants[${i}]: unknown entry_id “${entryId}”`,
      )
    }
    if (!personId) {
      errors.push(`entry_participants[${i}]: person_id is required`)
    } else if (personIds.size && !personIds.has(personId)) {
      errors.push(
        `entry_participants[${i}]: unknown person_id “${personId}”`,
      )
    }
  })

  const expenses = Array.isArray(raw.expenses) ? raw.expenses : []
  const expenseIds = new Set()
  expenses.forEach((ex, i) => {
    if (!ex || typeof ex !== 'object') {
      errors.push(`expenses[${i}]: must be an object`)
      return
    }
    const id = asString(ex.id).trim()
    if (!id) errors.push(`expenses[${i}]: id is required`)
    else expenseIds.add(id)
    const entryId = asString(ex.entry_id ?? ex.entryId).trim()
    if (entryId && entryIds.size && !entryIds.has(entryId)) {
      errors.push(`expenses[${i}]: unknown entry_id “${entryId}”`)
    }
    const linked = Array.isArray(ex.entry_ids)
      ? ex.entry_ids
      : Array.isArray(ex.entryIds)
        ? ex.entryIds
        : null
    if (linked) {
      linked.forEach((rawId, j) => {
        const lid = asString(rawId).trim()
        if (!lid) return
        if (entryIds.size && !entryIds.has(lid)) {
          errors.push(
            `expenses[${i}].entry_ids[${j}]: unknown entry_id “${lid}”`,
          )
        }
      })
      if (
        entryId &&
        linked.length &&
        !linked.map((v) => asString(v).trim()).includes(entryId)
      ) {
        errors.push(
          `expenses[${i}]: entry_id must be included in entry_ids`,
        )
      }
    } else if (!entryId) {
      // Journey-level expense (no activities) — allowed.
    }
    const amount = Number(ex.amount_cents ?? ex.amountCents)
    if (!Number.isFinite(amount) || amount < 0) {
      errors.push(`expenses[${i}]: amount_cents must be a non-negative integer`)
    }
    const currency = asString(ex.currency).trim().toUpperCase()
    if (currency && !/^[A-Z]{3}$/.test(currency)) {
      errors.push(`expenses[${i}]: currency must be ISO 4217`)
    }
    const payer = asString(
      ex.paid_by_person_id ?? ex.paidByPersonId,
    ).trim()
    if (payer && personIds.size && !personIds.has(payer)) {
      errors.push(`expenses[${i}]: unknown paid_by_person_id “${payer}”`)
    }
  })

  const splits = Array.isArray(raw.expense_splits) ? raw.expense_splits : []
  splits.forEach((s, i) => {
    if (!s || typeof s !== 'object') {
      errors.push(`expense_splits[${i}]: must be an object`)
      return
    }
    const expenseId = asString(s.expense_id ?? s.expenseId).trim()
    const personId = asString(
      s.journey_person_id ?? s.journeyPersonId ?? s.person_id,
    ).trim()
    if (expenseId && expenseIds.size && !expenseIds.has(expenseId)) {
      errors.push(`expense_splits[${i}]: unknown expense_id “${expenseId}”`)
    }
    if (personId && personIds.size && !personIds.has(personId)) {
      errors.push(
        `expense_splits[${i}]: unknown journey_person_id “${personId}”`,
      )
    }
  })

  const placeIdeas = Array.isArray(raw.place_ideas) ? raw.place_ideas : []
  placeIdeas.forEach((p, i) => {
    if (!p || typeof p !== 'object') {
      errors.push(`place_ideas[${i}]: must be an object`)
      return
    }
    const name = asString(p.name).trim()
    if (!name) {
      errors.push(`place_ideas[${i}]: name is required`)
      return
    }
    if (hasScopeMashup(p.name) || hasScopeMashup(p.address)) {
      errors.push(`place_ideas[${i}]: contains Scope.* mashup`)
    }
    const lat = Number(p.lat)
    const lng = Number(p.lng)
    if (requirePlaceCoords && (!Number.isFinite(lat) || !Number.isFinite(lng))) {
      errors.push(`place_ideas[${i}]: lat and lng are required`)
    }
  })

  const todos = Array.isArray(raw.todos) ? raw.todos : []
  todos.forEach((t, i) => {
    if (!t || typeof t !== 'object') {
      errors.push(`todos[${i}]: must be an object`)
      return
    }
    if (!asString(t.title).trim()) {
      errors.push(`todos[${i}]: title is required`)
    }
    const due = t.due_on ?? t.dueOn
    if (due != null && due !== '') {
      if (hasScopeMashup(due)) {
        errors.push(`todos[${i}].due_on contains Scope.* mashup`)
      } else if (!ISO_DATE.test(asString(due).trim())) {
        errors.push(`todos[${i}].due_on must be YYYY-MM-DD`)
      }
    }
  })

  const playlist = Array.isArray(raw.playlist) ? raw.playlist : []
  playlist.forEach((item, i) => {
    if (!item || typeof item !== 'object') {
      errors.push(`playlist[${i}]: must be an object`)
      return
    }
    if (!asString(item.title).trim() && !asString(item.url).trim()) {
      errors.push(`playlist[${i}]: title or url is required`)
    }
  })

  const unique = [...new Set(errors)]
  return { ok: unique.length === 0, errors: unique }
}

/** Throw if deep validation fails. Returns raw on success. */
export function assertSnapshotValid(raw) {
  const { ok, errors } = validateSnapshotDeep(raw)
  if (!ok) {
    throw new Error(errors.join('; ') || 'Invalid journey snapshot')
  }
  return raw
}
