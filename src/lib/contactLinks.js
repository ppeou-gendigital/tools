/**
 * Build tappable contact URLs for doctor / office fields.
 */

export function telHref(phone, ext) {
  if (!phone || typeof phone !== 'string') return null
  const digits = phone.replace(/[^\d+]/g, '')
  if (!digits) return null
  const base = digits.startsWith('+') ? digits : digits
  if (ext && String(ext).trim()) {
    return `tel:${base},${String(ext).replace(/\D/g, '')}`
  }
  return `tel:${base}`
}

export function mailtoHref(email) {
  if (!email || typeof email !== 'string') return null
  const trimmed = email.trim()
  if (!trimmed.includes('@')) return null
  return `mailto:${trimmed}`
}

export function websiteHref(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function formatAddress(office) {
  if (!office || typeof office !== 'object') return ''
  return [
    office.addressLine1,
    office.addressLine2,
    [office.city, office.region].filter(Boolean).join(', '),
    office.postalCode,
    office.country,
  ]
    .filter((p) => typeof p === 'string' && p.trim())
    .join(', ')
}

/** Apple Maps on Apple platforms; Google Maps elsewhere. */
export function mapsHref(office) {
  if (!office || typeof office !== 'object') return null
  const ua = globalThis.navigator?.userAgent ?? ''
  const isApple = /iPhone|iPad|iPod|Macintosh/i.test(ua)
  const lat = Number(office.lat)
  const lng = Number(office.lng)
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)
  const q = formatAddress(office)
  const placeId =
    typeof office.googlePlaceId === 'string' && office.googlePlaceId.trim()
      ? office.googlePlaceId.trim()
      : null

  if (isApple) {
    if (hasCoords) {
      const params = new URLSearchParams({ ll: `${lat},${lng}` })
      params.set('q', q || `${lat},${lng}`)
      return `https://maps.apple.com/?${params.toString()}`
    }
    if (q) return `https://maps.apple.com/?q=${encodeURIComponent(q)}`
    return null
  }

  if (placeId) {
    const params = new URLSearchParams({
      api: '1',
      query_place_id: placeId,
    })
    if (q) params.set('query', q)
    else if (hasCoords) params.set('query', `${lat},${lng}`)
    else params.set('query', 'place')
    return `https://www.google.com/maps/search/?${params.toString()}`
  }
  if (hasCoords) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }
  if (q) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
  }
  return null
}
