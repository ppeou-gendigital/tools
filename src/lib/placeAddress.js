/**
 * Shared Google Places (New) address helpers for office autocomplete + doctor search.
 */

export function readLatLng(location) {
  if (!location) return null
  const lat =
    typeof location.lat === 'function'
      ? location.lat()
      : Number(location.latitude ?? location.lat)
  const lng =
    typeof location.lng === 'function'
      ? location.lng()
      : Number(location.longitude ?? location.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

export function placeDisplayName(place, fallback = '') {
  const name = place?.displayName
  if (typeof name === 'string' && name.trim()) return name.trim()
  if (name?.text && String(name.text).trim()) return String(name.text).trim()
  if (place?.formattedAddress) return String(place.formattedAddress).trim()
  return fallback
}

function componentText(component) {
  if (!component) return ''
  if (typeof component.longText === 'string' && component.longText.trim()) {
    return component.longText.trim()
  }
  if (typeof component.shortText === 'string' && component.shortText.trim()) {
    return component.shortText.trim()
  }
  if (typeof component.long_name === 'string') return component.long_name.trim()
  if (typeof component.short_name === 'string') return component.short_name.trim()
  return ''
}

function componentTypes(component) {
  if (Array.isArray(component?.types)) return component.types
  return []
}

/**
 * Parse Google Places addressComponents into Docto office address fields.
 */
export function parsePlaceAddress(place) {
  const components = Array.isArray(place?.addressComponents)
    ? place.addressComponents
    : []

  const byType = (type) => {
    const match = components.find((c) => componentTypes(c).includes(type))
    return componentText(match)
  }
  const shortByType = (type) => {
    const match = components.find((c) => componentTypes(c).includes(type))
    if (!match) return ''
    if (typeof match.shortText === 'string' && match.shortText.trim()) {
      return match.shortText.trim()
    }
    if (typeof match.short_name === 'string') return match.short_name.trim()
    return componentText(match)
  }

  const streetNumber = byType('street_number')
  const route = byType('route')
  const subpremise = byType('subpremise')
  let addressLine1 = [streetNumber, route].filter(Boolean).join(' ').trim()
  if (subpremise) {
    addressLine1 = addressLine1
      ? `${addressLine1}, ${subpremise}`
      : subpremise
  }

  const city =
    byType('locality') ||
    byType('postal_town') ||
    byType('sublocality') ||
    byType('administrative_area_level_3')

  const region =
    shortByType('administrative_area_level_1') ||
    byType('administrative_area_level_1')
  const postalCode = byType('postal_code')
  const country = shortByType('country') || byType('country') || 'US'

  if (!addressLine1 && place?.formattedAddress) {
    addressLine1 = String(place.formattedAddress).split(',')[0]?.trim() || ''
  }

  return {
    addressLine1,
    addressLine2: '',
    city,
    region,
    postalCode,
    country: country || 'US',
  }
}

export function placeToOffice(place, { label } = {}) {
  const coords = readLatLng(place?.location)
  const address = parsePlaceAddress(place)
  const phone =
    typeof place?.nationalPhoneNumber === 'string'
      ? place.nationalPhoneNumber.trim()
      : ''
  const website =
    (typeof place?.websiteUri === 'string' && place.websiteUri.trim()) ||
    (typeof place?.websiteURI === 'string' && place.websiteURI.trim()) ||
    ''
  const placeId =
    typeof place?.id === 'string'
      ? place.id.replace(/^places\//, '')
      : place?.id || null

  return {
    label: label || placeDisplayName(place) || 'Office',
    ...address,
    phone: phone || undefined,
    website: website || undefined,
    googlePlaceId: placeId || undefined,
    lat: coords?.lat ?? undefined,
    lng: coords?.lng ?? undefined,
  }
}
