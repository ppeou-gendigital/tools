import { ACTIVITIES, PRESETS } from '@/lib/catalog'

/**
 * Compact per-activity details keys from catalog detailHints (matches Entry Edit).
 * Only activities that define hints are listed.
 */
export function activityDetailsPromptLines() {
  return ACTIVITIES.filter(
    (a) => Array.isArray(a.detailHints) && a.detailHints.length > 0,
  )
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((a) => {
      const keys = a.detailHints.map((h) => h.key).filter(Boolean)
      return `- ${a.id}: ${keys.join(', ')}`
    })
}

/** Compact catalog facts for system prompts (token-light). */
export function catalogPromptBlock() {
  const presets = PRESETS.map(
    (p) =>
      `${p.id} (${p.type}: ${p.label}; activities: ${(p.primaryActivities || []).slice(0, 8).join('/')})`,
  ).join('; ')
  const activities = ACTIVITIES.map((a) => `${a.id}/${a.schema}`).join(', ')
  const detailLines = activityDetailsPromptLines()
  return [
    'Viaggio catalog constraints:',
    `- journey.preset must be one of: ${presets}`,
    `- entries[].activity_id must be one of: ${activities}`,
    '- entries[].schema must match the activity schema shown after the slash.',
    '- journey.type is "trip" or "journal" and must match the preset type.',
    '- Dual-zone schemas: transit (flight, train, ferry, boat, drive_leg, rideshare, …) and rental — require start_timezone + end_timezone with local wall times.',
    '- Lodging schema: check-in/out on one entry via occurs_at_local / ends_at_local — never a separate checkout activity.',
    '- journey.default_currency is ISO 4217 uppercase (e.g. EUR).',
    '- journey.default_timezone is an IANA timezone (e.g. Europe/Lisbon).',
    '- Date fields use YYYY-MM-DD. Prefer wall locals (YYYY-MM-DDTHH:mm) + timezone(s); app stores real UTC.',
    '- All snapshot ids are opaque local strings for cross-references only.',
    '- Do not invent member emails, invite tokens, or attachment binaries.',
    '- Parallel activities: multiple entries may share the same time with different participant_ids.',
    'Entry details keys by activity_id (put in details{}, not only title; fill when visible on bookings/user text):',
    ...detailLines,
    '- flight: prefer IATA for airline/from/to (e.g. ZG, IAH, NRT). Do not leave airports only in title.',
    '- hotel|lodging: also set place_name (+ address/lat/lng when known) and ends_at_local for checkout.',
    '- car_rental: pickup/dropoff locations in details; dual-zone times like transit.',
  ].join('\n')
}

export function knownActivityIds() {
  return ACTIVITIES.map((a) => a.id)
}

export function knownPresetIds() {
  return PRESETS.map((p) => p.id)
}

export function schemaForActivity(activityId) {
  const a = ACTIVITIES.find((x) => x.id === activityId)
  return a?.schema || null
}

const ACTIVITY_SET = new Set(knownActivityIds())

/** Map common model mistakes onto catalog activity ids. */
export function coerceActivityId(rawId) {
  const raw = String(rawId ?? '')
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
