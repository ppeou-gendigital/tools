import { haversineMeters } from '@/lib/mapsLinks'

/** Max distance labels drawn on the map (nearest first). List shows all. */
const MAX_MAP_LABELS = 8

/**
 * Format a straight-line distance for UI (metric).
 * @param {number} meters
 * @returns {string}
 */
export function formatDistanceMeters(meters) {
  if (!Number.isFinite(meters) || meters < 0) return ''
  if (meters < 1000) {
    const rounded =
      meters < 100 ? Math.round(meters) : Math.round(meters / 10) * 10
    if (rounded >= 1000) return '1 km'
    return `${rounded} m`
  }
  const km = meters / 1000
  if (km < 10) {
    const rounded = Math.round(km * 10) / 10
    return `${rounded} km`
  }
  return `${Math.round(km)} km`
}

/**
 * Straight-line segments from the selected Idea to every other Idea.
 * @param {Array<{ id: string, lat: number, lng: number, name?: string }>} ideas
 * @param {string | null | undefined} selectedId
 * @returns {Array<{
 *   id: string,
 *   name: string,
 *   from: { lat: number, lng: number },
 *   to: { lat: number, lng: number },
 *   midpoint: { lat: number, lng: number },
 *   meters: number,
 *   label: string,
 * }>}
 */
export function proximitySegments(ideas, selectedId) {
  if (!selectedId || !Array.isArray(ideas) || ideas.length < 2) return []
  const selected = ideas.find((i) => i.id === selectedId)
  if (
    !selected ||
    !Number.isFinite(selected.lat) ||
    !Number.isFinite(selected.lng)
  ) {
    return []
  }

  const from = { lat: selected.lat, lng: selected.lng }
  const segments = []

  for (const idea of ideas) {
    if (idea.id === selectedId) continue
    if (!Number.isFinite(idea.lat) || !Number.isFinite(idea.lng)) continue
    const to = { lat: idea.lat, lng: idea.lng }
    const meters = haversineMeters(from, to)
    if (!Number.isFinite(meters) || meters === Infinity) continue
    segments.push({
      id: idea.id,
      name: idea.name || '',
      from,
      to,
      midpoint: {
        lat: (from.lat + to.lat) / 2,
        lng: (from.lng + to.lng) / 2,
      },
      meters,
      label: formatDistanceMeters(meters),
    })
  }

  segments.sort((a, b) => a.meters - b.meters)
  return segments
}

/**
 * Segments to draw on the map (nearest capped to limit clutter).
 * @param {ReturnType<typeof proximitySegments>} segments
 * @param {number} [maxLabels]
 */
export function proximityMapSegments(segments, maxLabels = MAX_MAP_LABELS) {
  if (!Array.isArray(segments) || segments.length === 0) return []
  return segments.slice(0, maxLabels)
}

/**
 * Lookup distance from selected Idea to another by id.
 * @param {ReturnType<typeof proximitySegments>} segments
 * @param {string} ideaId
 */
export function segmentForIdea(segments, ideaId) {
  if (!ideaId || !Array.isArray(segments)) return null
  return segments.find((s) => s.id === ideaId) || null
}
