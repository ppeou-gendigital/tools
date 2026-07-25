/**
 * Deep links into Google Maps / Apple Maps.
 * Route geometry is never stored — these URLs are generated from waypoints.
 */

const WALK_MAX_LEG_M = 1500
const EARTH_RADIUS_M = 6371000

export function googleMapsPlaceUrl(place) {
  if (place?.googleMapsUri) return place.googleMapsUri
  if (place?.googlePlaceId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(place.googlePlaceId)}`
  }
  if (Number.isFinite(place?.lat) && Number.isFinite(place?.lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`
  }
  if (place?.address || place?.name || place?.placeName) {
    const q = place.address || place.name || place.placeName
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
  }
  return null
}

function pointLabel(wp) {
  if (Number.isFinite(wp?.lat) && Number.isFinite(wp?.lng)) {
    return `${wp.lat},${wp.lng}`
  }
  return String(wp?.address || wp?.name || wp?.placeName || '').trim() || null
}

function geoPoints(waypoints) {
  return (waypoints || []).filter(
    (w) => Number.isFinite(w?.lat) && Number.isFinite(w?.lng),
  )
}

function toRad(deg) {
  return (deg * Math.PI) / 180
}

/** Great-circle distance in meters between two lat/lng points. */
export function haversineMeters(a, b) {
  if (
    !Number.isFinite(a?.lat) ||
    !Number.isFinite(a?.lng) ||
    !Number.isFinite(b?.lat) ||
    !Number.isFinite(b?.lng)
  ) {
    return Infinity
  }
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

/**
 * Infer walk vs drive for deep links (no Directions API).
 * - fromCurrentLocation → driving (home → trip start)
 * - any flight stop → driving
 * - any consecutive leg ≥ 1.5 km → driving
 * - else walking
 */
export function inferTravelMode(waypoints, { fromCurrentLocation = false } = {}) {
  if (fromCurrentLocation) return 'driving'
  const pts = geoPoints(waypoints)
  if (pts.some((w) => w.activityId === 'flight')) return 'driving'
  for (let i = 1; i < pts.length; i += 1) {
    if (haversineMeters(pts[i - 1], pts[i]) >= WALK_MAX_LEG_M) {
      return 'driving'
    }
  }
  return 'walking'
}

/**
 * Multi-stop Google directions. `waypoints` is an ordered list of
 * `{ lat, lng }` (or place name/address fallbacks).
 * When `fromCurrentLocation`, origin is Current+Location and waypoints are stops.
 */
export function googleMapsDirectionsUrl(
  waypoints,
  { travelMode = 'walking', fromCurrentLocation = false } = {},
) {
  const pts = (waypoints || []).map(pointLabel).filter(Boolean)
  if (pts.length === 0) return null

  const mode = travelMode === 'driving' ? 'driving' : 'walking'

  if (fromCurrentLocation) {
    const params = new URLSearchParams({
      api: '1',
      origin: 'Current Location',
      destination: pts[pts.length - 1],
      travelmode: mode,
    })
    if (pts.length > 1) {
      params.set('waypoints', pts.slice(0, -1).join('|'))
    }
    return `https://www.google.com/maps/dir/?${params.toString()}`
  }

  if (pts.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pts[0])}`
  }
  const origin = pts[0]
  const destination = pts[pts.length - 1]
  const mid = pts.slice(1, -1)
  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: mode,
  })
  if (mid.length) params.set('waypoints', mid.join('|'))
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

/**
 * Apple Maps directions. Multi-stop URLs are weak — use first→last only.
 * travelMode: 'walking' → dirflg=w, 'driving' → dirflg=d
 * Omit origin (null) or pass fromCurrentLocation to start from device location.
 */
export function appleMapsDirectionsUrl(
  origin,
  destination,
  { travelMode = 'walking', fromCurrentLocation = false } = {},
) {
  const daddr = pointLabel(destination)
  if (!daddr) return null
  const params = new URLSearchParams()
  if (!fromCurrentLocation) {
    const saddr = pointLabel(origin)
    if (saddr) params.set('saddr', saddr)
  }
  params.set('daddr', daddr)
  params.set('dirflg', travelMode === 'driving' ? 'd' : 'w')
  return `https://maps.apple.com/?${params.toString()}`
}

/**
 * Single deep-link for the user's preferred maps app.
 * URLs are computed on the fly — never persist them.
 */
export function openMapsRouteUrl(
  waypoints,
  {
    provider = 'google',
    fromCurrentLocation = false,
    travelMode,
  } = {},
) {
  const pts = geoPoints(waypoints)
  if (pts.length === 0) return null
  const mode =
    travelMode || inferTravelMode(pts, { fromCurrentLocation })

  if (provider === 'apple') {
    if (fromCurrentLocation) {
      return appleMapsDirectionsUrl(null, pts[pts.length - 1], {
        travelMode: mode,
        fromCurrentLocation: true,
      })
    }
    if (pts.length === 1) {
      return appleMapsDirectionsUrl(null, pts[0], { travelMode: mode })
    }
    return appleMapsDirectionsUrl(pts[0], pts[pts.length - 1], {
      travelMode: mode,
    })
  }

  return googleMapsDirectionsUrl(pts, {
    travelMode: mode,
    fromCurrentLocation,
  })
}

/** @deprecated Prefer openMapsRouteUrl with mapsProvider. */
export function dayRouteLinks(
  waypoints,
  { travelMode = 'walking', fromCurrentLocation = false } = {},
) {
  const pts = geoPoints(waypoints)
  const google = googleMapsDirectionsUrl(pts, {
    travelMode,
    fromCurrentLocation,
  })
  const apple =
    pts.length === 0
      ? null
      : fromCurrentLocation
        ? appleMapsDirectionsUrl(null, pts[pts.length - 1], {
            travelMode,
            fromCurrentLocation: true,
          })
        : pts.length >= 2
          ? appleMapsDirectionsUrl(pts[0], pts[pts.length - 1], { travelMode })
          : appleMapsDirectionsUrl(null, pts[0], { travelMode })
  return { google, apple }
}
