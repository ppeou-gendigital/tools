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
  const q = formatAddress(office)
  if (!q) return null
  const encoded = encodeURIComponent(q)
  const ua = globalThis.navigator?.userAgent ?? ''
  const isApple = /iPhone|iPad|iPod|Macintosh/i.test(ua)
  if (isApple) return `https://maps.apple.com/?q=${encoded}`
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`
}
