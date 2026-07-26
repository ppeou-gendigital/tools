import { asyncStorage } from '@/lib/storage'

const STORAGE_KEY = 'viaggio.themeCoords'
const PROMPTED_KEY = 'viaggio.geoPrompted'

const POSITION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 30 * 60 * 1000,
}

function validCoords(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

/** @returns {Promise<'granted' | 'denied' | 'prompt' | 'unknown'>} */
export async function queryGeoPermission() {
  try {
    const perms = globalThis.navigator?.permissions
    if (!perms?.query) return 'unknown'
    const status = await perms.query({ name: 'geolocation' })
    const state = String(status?.state || '')
    if (state === 'granted' || state === 'denied' || state === 'prompt') {
      return state
    }
  } catch {
    /* Safari / older browsers may reject geolocation permission queries */
  }
  return 'unknown'
}

export async function hasGeoPrompted() {
  const raw = await asyncStorage.getItem(PROMPTED_KEY)
  return raw === '1' || raw === 'true'
}

export async function markGeoPrompted() {
  await asyncStorage.setItem(PROMPTED_KEY, '1')
}

/** @returns {Promise<{ lat: number, lng: number, source: 'cache' } | null>} */
export async function loadCachedCoords() {
  const raw = await asyncStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    const lat = Number(parsed?.lat)
    const lng = Number(parsed?.lng)
    if (!validCoords(lat, lng)) return null
    return { lat, lng, source: 'cache' }
  } catch {
    return null
  }
}

export async function saveCachedCoords({ lat, lng }) {
  if (!validCoords(lat, lng)) return
  await asyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ lat, lng, savedAt: Date.now() }),
  )
}

/**
 * One-shot geolocation request. Resolves null on deny / unavailable / timeout.
 * @returns {Promise<{ lat: number, lng: number, source: 'live' } | null>}
 */
export function requestPosition() {
  return new Promise((resolve) => {
    const geo = globalThis.navigator?.geolocation
    if (!geo?.getCurrentPosition) {
      resolve(null)
      return
    }
    geo.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        if (!validCoords(lat, lng)) {
          resolve(null)
          return
        }
        resolve({ lat, lng, source: 'live' })
      },
      () => resolve(null),
      POSITION_OPTIONS,
    )
  })
}

async function applyLiveOrCache(cached) {
  const live = await requestPosition()
  if (live) {
    await saveCachedCoords(live)
    return live
  }
  return cached
}

/**
 * Resolve device coords without spamming the system permission dialog.
 *
 * - interactive: false (default) — cache, or live only if already granted
 * - interactive: true — may prompt at most once (tracked via viaggio.geoPrompted)
 *
 * @param {{ interactive?: boolean }} [opts]
 * @returns {Promise<{ lat: number, lng: number, source: 'live' | 'cache' } | null>}
 */
export async function resolveCoords({ interactive = false } = {}) {
  const cached = await loadCachedCoords()
  const perm = await queryGeoPermission()

  if (perm === 'denied') return cached

  if (!interactive) {
    if (perm === 'granted') return applyLiveOrCache(cached)
    return cached
  }

  // Interactive path
  if (perm === 'granted') return applyLiveOrCache(cached)

  const prompted = await hasGeoPrompted()
  // Already asked once and still not sticky-granted — use cache, no dialog.
  if (prompted) return cached

  await markGeoPrompted()
  return applyLiveOrCache(cached)
}
