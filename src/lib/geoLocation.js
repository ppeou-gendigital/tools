import { asyncStorage } from '@/lib/storage'

const STORAGE_KEY = 'viaggio.themeCoords'

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

/**
 * Prefer a live fix; fall back to cache when the live request fails.
 * @returns {Promise<{ lat: number, lng: number, source: 'live' | 'cache' } | null>}
 */
export async function resolveCoords() {
  const live = await requestPosition()
  if (live) {
    await saveCachedCoords(live)
    return live
  }
  return loadCachedCoords()
}
