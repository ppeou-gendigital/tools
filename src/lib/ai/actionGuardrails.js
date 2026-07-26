import { utcIsoToWallTime } from '@/lib/timezone'

/**
 * Soft checks + rewrites on normalized chat actions before Accept.
 * Mutates actions in place; returns warnings[].
 */

function isCheckoutish(entry) {
  const title = String(entry?.title || '').toLowerCase()
  const activity = String(entry?.activity_id || '').toLowerCase()
  if (activity === 'hotel' || activity === 'lodging') return false
  return (
    /\bcheck[\s-]?out\b/.test(title) ||
    title === 'checkout' ||
    /\bhotel check[\s-]?out\b/.test(title)
  )
}

function isLodging(entry) {
  const a = String(entry?.activity_id || '')
  return a === 'hotel' || a === 'lodging'
}

function isTransit(entry) {
  const a = String(entry?.activity_id || '')
  return (
    a === 'flight' ||
    a === 'train' ||
    a === 'ferry' ||
    a === 'boat' ||
    a === 'drive_leg' ||
    a === 'rideshare'
  )
}

function wallHour(iso, tz) {
  if (!iso) return null
  const local = utcIsoToWallTime(iso, tz || 'UTC')
  if (!local || local.length < 13) return null
  const h = Number(local.slice(11, 13))
  return Number.isFinite(h) ? h : null
}

/**
 * @param {{ actions: object[], assistant_message?: string }} turn
 * @param {{ contextEntries?: object[] }} [opts]
 */
export function applyChatActionGuardrails(turn, { contextEntries = [] } = {}) {
  const warnings = [...(turn.warnings || [])]
  const actions = []
  const lodgingById = new Map()
  for (const e of contextEntries || []) {
    if (isLodging(e)) lodgingById.set(e.id, e)
  }

  for (const action of turn.actions || []) {
    if (action.type === 'add_entries') {
      const kept = []
      for (const entry of action.entries || []) {
        if (isCheckoutish(entry)) {
          // Prefer rewriting to hotel ends_at update when a lodging exists.
          const hotels = [...lodgingById.values()]
          const hotel =
            hotels.find((h) => {
              const endOn = (h.ends_at_local || h.occurs_at_local || '').slice(
                0,
                10,
              )
              const wantOn = (
                entry.occurs_at_local ||
                entry.occurs_on ||
                ''
              ).slice(0, 10)
              return wantOn && endOn && wantOn === endOn
            }) || hotels[hotels.length - 1]
          if (hotel?.id) {
            const endsLocal =
              entry.occurs_at_local ||
              entry.ends_at_local ||
              (entry.occurs_on ? `${entry.occurs_on}T11:00` : null)
            actions.push({
              id: `${action.id}-checkout-rewrite`,
              type: 'update_entries',
              label: `Set hotel checkout${endsLocal ? ` (${endsLocal})` : ''}`,
              ids: [],
              entries: [
                {
                  id: hotel.id,
                  activity_id: hotel.activity_id,
                  schema: hotel.schema,
                  title: hotel.title,
                  timezone: hotel.timezone,
                  ends_at_local: endsLocal,
                  ends_at: entry.occurs_at || entry.ends_at || null,
                },
              ],
              todos: [],
              place_ideas: [],
              playlist: [],
              expense: null,
              journey: null,
              risky: false,
              risk_notes: [],
            })
            warnings.push(
              `Rewrote separate “checkout” into hotel ends_at on “${hotel.title}”.`,
            )
            continue
          }
          warnings.push(
            `Skipped checkout-like entry “${entry.title}” — set ends_at_local on the hotel instead.`,
          )
          continue
        }
        kept.push(entry)
      }
      if (!kept.length) continue
      action.entries = kept
    }

    const riskNotes = []
    if (action.type === 'update_entries' || action.type === 'add_entries') {
      for (const entry of action.entries || []) {
        if (isLodging(entry) && entry.ends_at) {
          const hour = wallHour(entry.ends_at, entry.timezone || entry.end_timezone)
          if (hour != null && hour >= 16) {
            riskNotes.push(
              `“${entry.title || 'Hotel'}” checkout wall time looks late (${hour}:00) — confirm timezone (morning checkout is typical).`,
            )
          }
        }
        if (isTransit(entry) && entry.occurs_at && entry.ends_at) {
          if (Date.parse(entry.ends_at) < Date.parse(entry.occurs_at)) {
            riskNotes.push(
              `“${entry.title}” end is before start in UTC — check start/end timezones.`,
            )
          }
        }
      }
      if (action.type === 'update_entries') {
        let dayMoves = 0
        for (const entry of action.entries || []) {
          const prev = lodgingById.get(entry.id) || contextEntries.find((e) => e.id === entry.id)
          if (!prev) continue
          const prevOn = (prev.occurs_on || prev.occurs_at_local || '').slice(0, 10)
          const nextOn = (entry.occurs_on || entry.occurs_at_local || '').slice(0, 10)
          if (prevOn && nextOn && prevOn !== nextOn) dayMoves += 1
        }
        if (dayMoves >= 2) {
          riskNotes.push(
            `This updates occurs_on for ${dayMoves} entries (moves across calendar days).`,
          )
        }
      }
    }

    action.risky = riskNotes.length > 0
    action.risk_notes = riskNotes
    if (riskNotes.length) warnings.push(...riskNotes)
    actions.push(action)
  }

  return {
    ...turn,
    actions,
    warnings: [...new Set(warnings)],
  }
}
