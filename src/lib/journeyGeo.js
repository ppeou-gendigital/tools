/**
 * Journey geo helpers for place-search bias (soft locationBias).
 * Skips null-island 0,0 placeholders from AI/import.
 */

const CLUSTER_RADIUS_KM = 80
const BOUNDS_PAD_DEG = 0.12

export function isUsableCoords(lat, lng) {
  const la = Number(lat)
  const ln = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return false
  // Null island / AI placeholder coords
  if (Math.abs(la) < 0.01 && Math.abs(ln) < 0.01) return false
  return true
}

function haversineKm(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const r = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Best-effort city label from place name / formatted address. */
export function labelFromPlace(name, address) {
  if (address) {
    const parts = String(address)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length >= 4) return parts[parts.length - 3]
    if (parts.length === 3) {
      const mid = parts[1]
      // "City, ST, Country" → parts[0]; "Street, City, Country" → parts[1]
      if (/^[A-Z]{2}\b/.test(mid) || /^\d{4,}/.test(mid)) return parts[0]
      return mid
    }
    if (parts.length === 2) return parts[0]
  }
  const n = String(name || '').trim()
  return n ? n.slice(0, 40) : null
}

/**
 * @param {Array<{ lat?: number, lng?: number, placeName?: string, address?: string, occursOn?: string|null, name?: string }>} entries
 * @param {Array<{ lat?: number, lng?: number, name?: string, address?: string }>} [placeIdeas]
 */
export function collectJourneyGeoPoints(entries = [], placeIdeas = []) {
  const points = []
  for (const e of entries) {
    if (!isUsableCoords(e.lat, e.lng)) continue
    points.push({
      lat: Number(e.lat),
      lng: Number(e.lng),
      labelHint: labelFromPlace(e.placeName ?? e.name, e.address),
      occursOn: e.occursOn || null,
    })
  }
  for (const p of placeIdeas) {
    if (!isUsableCoords(p.lat, p.lng)) continue
    points.push({
      lat: Number(p.lat),
      lng: Number(p.lng),
      labelHint: labelFromPlace(p.name, p.address),
      occursOn: null,
    })
  }
  return points
}

function avgCenter(points) {
  let lat = 0
  let lng = 0
  for (const p of points) {
    lat += p.lat
    lng += p.lng
  }
  const n = points.length || 1
  return { lat: lat / n, lng: lng / n }
}

function boundsOf(points) {
  let south = Infinity
  let west = Infinity
  let north = -Infinity
  let east = -Infinity
  for (const p of points) {
    south = Math.min(south, p.lat)
    north = Math.max(north, p.lat)
    west = Math.min(west, p.lng)
    east = Math.max(east, p.lng)
  }
  return { south, west, north, east }
}

function paddedBounds(bounds, pad = BOUNDS_PAD_DEG) {
  if (!bounds) return null
  const latPad = Math.max(pad, (bounds.north - bounds.south) * 0.15)
  const lngPad = Math.max(pad, (bounds.east - bounds.west) * 0.15)
  return {
    south: bounds.south - latPad,
    west: bounds.west - lngPad,
    north: bounds.north + latPad,
    east: bounds.east + lngPad,
  }
}

function majorityLabel(points) {
  const counts = new Map()
  for (const p of points) {
    const key = p.labelHint?.trim()
    if (!key) continue
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  let best = null
  let bestN = 0
  for (const [k, n] of counts) {
    if (n > bestN) {
      best = k
      bestN = n
    }
  }
  return best
}

/**
 * Cluster itinerary pins into city-scale groups.
 * @returns {Array<{ id: string, label: string, center: {lat,lng}, bounds: object, count: number, points: array }>}
 */
export function clusterJourneyPlaces(
  points,
  { radiusKm = CLUSTER_RADIUS_KM } = {},
) {
  if (!points.length) return []

  const clusters = []
  for (const p of points) {
    let best = null
    let bestD = Infinity
    for (const c of clusters) {
      const d = haversineKm(p, c.center)
      if (d < bestD) {
        bestD = d
        best = c
      }
    }
    if (best && bestD <= radiusKm) {
      best.points.push(p)
      best.center = avgCenter(best.points)
    } else {
      clusters.push({
        id: `city-${clusters.length}`,
        points: [p],
        center: { lat: p.lat, lng: p.lng },
        label: p.labelHint || `Area ${clusters.length + 1}`,
      })
    }
  }

  const usedLabels = new Set()
  return clusters
    .map((c, i) => {
      let label = majorityLabel(c.points) || c.label || `Area ${i + 1}`
      if (usedLabels.has(label)) label = `${label} (${i + 1})`
      usedLabels.add(label)
      const rawBounds = boundsOf(c.points)
      return {
        id: c.id || `city-${i}`,
        label,
        center: avgCenter(c.points),
        bounds: paddedBounds(rawBounds),
        count: c.points.length,
        points: c.points,
      }
    })
    .sort((a, b) => b.count - a.count)
}

/**
 * Pick default city cluster: same-day stops if possible, else largest.
 */
export function defaultCluster({ clusters, entryOccursOn, entries = [] } = {}) {
  if (!clusters?.length) return null
  if (clusters.length === 1) return clusters[0]

  if (entryOccursOn) {
    const dayCoords = (entries || []).filter(
      (e) => e.occursOn === entryOccursOn && isUsableCoords(e.lat, e.lng),
    )
    if (dayCoords.length) {
      const scores = clusters.map((c) => {
        let n = 0
        for (const e of dayCoords) {
          if (
            haversineKm({ lat: e.lat, lng: e.lng }, c.center) <=
            CLUSTER_RADIUS_KM
          ) {
            n += 1
          }
        }
        return { c, n }
      })
      scores.sort((a, b) => b.n - a.n)
      if (scores[0].n > 0) return scores[0].c
    }
  }

  return clusters[0]
}

/** Soft bias value for PlaceAutocompleteElement.locationBias */
export function biasForCluster(cluster) {
  if (!cluster) return null
  if (cluster.bounds) return cluster.bounds
  if (cluster.center) return cluster.center
  return null
}
