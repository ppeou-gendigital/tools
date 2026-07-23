/**
 * Client catalogs: presets, activities, schemas (JSON under src/).
 * Schema on an entry is resolved from activity.schema at write time.
 */

const presetModules = import.meta.glob('../presets/*.json', {
  eager: true,
  import: 'default',
})
const activityModules = import.meta.glob('../activities/*.json', {
  eager: true,
  import: 'default',
})
import schemasDoc from '@/presets/_activitySchemas.json'

const ROLE_LABELS_BY_TYPE = {
  trip: { owner: 'Organizer', editor: 'Traveler', viewer: 'Follower' },
  journal: { owner: 'Keeper', editor: 'Contributor', viewer: 'Reader' },
}

function fileId(path) {
  const base = path.split('/').pop() || ''
  return base.replace(/\.json$/, '')
}

export const PRESETS = Object.entries(presetModules)
  .filter(([path]) => !fileId(path).startsWith('_'))
  .map(([, mod]) => mod)
  .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))

export const PRESETS_BY_ID = Object.fromEntries(PRESETS.map((p) => [p.id, p]))

export const ACTIVITIES = Object.values(activityModules)
export const ACTIVITIES_BY_ID = Object.fromEntries(
  ACTIVITIES.map((a) => [a.id, a]),
)

export const SCHEMAS = schemasDoc.schemas ?? []
export const SCHEMAS_BY_ID = Object.fromEntries(SCHEMAS.map((s) => [s.id, s]))

export function getPreset(id) {
  return PRESETS_BY_ID[id] ?? null
}

export function getActivity(id) {
  return ACTIVITIES_BY_ID[id] ?? null
}

/**
 * Create-time participant selection default.
 * lodging → all journey members; everything else → empty (pick who goes).
 */
export function defaultParticipantMode(activityId) {
  const activity = getActivity(activityId)
  return activity?.schema === 'lodging' ? 'all' : 'none'
}

export function getSchema(id) {
  return SCHEMAS_BY_ID[id] ?? null
}

/** Resolve schema id from activity catalog; throws if unknown. */
export function resolveSchemaForActivity(activityId) {
  const activity = getActivity(activityId)
  if (!activity?.schema) {
    throw new Error(`Unknown activity: ${activityId}`)
  }
  if (!getSchema(activity.schema)) {
    throw new Error(`Unknown schema: ${activity.schema}`)
  }
  return activity.schema
}

export function roleLabelsForJourney(journey) {
  const preset = getPreset(journey?.preset)
  if (preset?.roleLabels) return { ...ROLE_LABELS_BY_TYPE.trip, ...preset.roleLabels }
  return ROLE_LABELS_BY_TYPE[journey?.type] ?? ROLE_LABELS_BY_TYPE.trip
}

export function labelForRole(journey, role) {
  return roleLabelsForJourney(journey)[role] ?? role
}

/** Primary Add-menu activity ids: preset primaries ∪ pack primaries (deduped). */
export function primaryActivityIds(journey) {
  const seen = new Set()
  const ids = []
  const pushFrom = (presetId) => {
    const p = getPreset(presetId)
    for (const id of p?.primaryActivities ?? []) {
      if (!seen.has(id) && getActivity(id)) {
        seen.add(id)
        ids.push(id)
      }
    }
  }
  if (journey?.preset) pushFrom(journey.preset)
  for (const pack of journey?.activity_packs ?? journey?.activityPacks ?? []) {
    pushFrom(pack)
  }
  return ids
}

export function isDualZoneSchema(schemaId) {
  return schemaId === 'transit' || schemaId === 'rental'
}

export function guessDeviceTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export function guessDeviceLocale() {
  try {
    return navigator.language || 'en-US'
  } catch {
    return 'en-US'
  }
}

export function guessDeviceCurrency() {
  try {
    const locale = guessDeviceLocale()
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).formatToParts(1)
    // Prefer locale region → common mapping; fall back USD
    const region = locale.split('-')[1]?.toUpperCase()
    const map = {
      US: 'USD',
      AU: 'AUD',
      CA: 'CAD',
      GB: 'GBP',
      JP: 'JPY',
      EU: 'EUR',
      DE: 'EUR',
      FR: 'EUR',
      IT: 'EUR',
      ES: 'EUR',
      NZ: 'NZD',
      SG: 'SGD',
      TH: 'THB',
      KH: 'KHR',
    }
    if (region && map[region]) return map[region]
    void parts
    return 'USD'
  } catch {
    return 'USD'
  }
}

export const COMMON_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'CAD',
  'JPY',
  'NZD',
  'SGD',
  'THB',
  'KHR',
  'CHF',
  'MXN',
]
