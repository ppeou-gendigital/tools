import { useEffect, useRef } from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { GOOGLE_MAPS_API_KEY } from '@/env'
import { Label } from '@/molecules/Label'
import styles from './OfficeAddressField.module.scss'

const PLACE_FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'addressComponents',
  'nationalPhoneNumber',
  'websiteURI',
]

function readLatLng(location) {
  if (!location) return null
  const lat =
    typeof location.lat === 'function' ? location.lat() : Number(location.lat)
  const lng =
    typeof location.lng === 'function' ? location.lng() : Number(location.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

function placeDisplayName(place, fallback = '') {
  const name = place?.displayName
  if (typeof name === 'string' && name.trim()) return name
  if (name?.text && String(name.text).trim()) return String(name.text)
  if (place?.formattedAddress) return place.formattedAddress
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
  // Legacy Places shape
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

  const region = shortByType('administrative_area_level_1') || byType('administrative_area_level_1')
  const postalCode = byType('postal_code')
  const country = shortByType('country') || byType('country') || 'US'

  if (!addressLine1 && place?.formattedAddress) {
    // Fallback: first segment of formatted address is usually the street.
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

function placeToPick(place) {
  const coords = readLatLng(place.location)
  const address = parsePlaceAddress(place)
  const phone =
    typeof place?.nationalPhoneNumber === 'string'
      ? place.nationalPhoneNumber.trim()
      : ''
  const website =
    typeof place?.websiteURI === 'string' ? place.websiteURI.trim() : ''

  return {
    displayName: placeDisplayName(place),
    ...address,
    phone: phone || undefined,
    website: website || undefined,
    googlePlaceId: place?.id || null,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
  }
}

function AutocompleteMount({ disabled, onPick }) {
  const hostRef = useRef(null)
  const places = useMapsLibrary('places')
  const onPickRef = useRef(onPick)
  const PlaceAutocompleteElement = places?.PlaceAutocompleteElement
  const unavailable =
    Boolean(places) && typeof PlaceAutocompleteElement !== 'function'

  useEffect(() => {
    onPickRef.current = onPick
  }, [onPick])

  useEffect(() => {
    if (!places || !hostRef.current) return undefined
    if (typeof PlaceAutocompleteElement !== 'function') return undefined

    const el = new PlaceAutocompleteElement({
      placeholder: 'Search clinic or office…',
    })
    el.setAttribute('aria-label', 'Search clinic or office')
    if (disabled) el.disabled = true
    hostRef.current.replaceChildren(el)

    const onSelect = async (event) => {
      try {
        const prediction = event?.placePrediction
        if (!prediction?.toPlace) return
        const place = prediction.toPlace()
        await place.fetchFields({ fields: PLACE_FIELDS })
        const picked = placeToPick(place)
        if (!picked.addressLine1 && !picked.googlePlaceId) return
        onPickRef.current?.(picked)
        if ('value' in el) el.value = ''
      } catch (err) {
        console.warn('Office place pick failed', err)
      }
    }

    el.addEventListener('gmp-select', onSelect)
    return () => {
      el.removeEventListener('gmp-select', onSelect)
      el.remove()
    }
  }, [places, PlaceAutocompleteElement, disabled])

  if (unavailable) {
    return (
      <p className={styles.unavailable} role="status">
        Place search unavailable — enable Places API (New).
      </p>
    )
  }

  return <div ref={hostRef} className={styles.host} />
}

/**
 * Google Places autocomplete for doctor offices.
 * Calls onPick with parsed office fields when a place is selected.
 * Renders nothing when Maps API key is missing (caller keeps manual fields).
 */
export function OfficeAddressField({ disabled = false, onPick }) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <p className={styles.meta}>
        Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to search clinics instead of
        typing the address.
      </p>
    )
  }

  return (
    <div>
      <Label>Find clinic or office</Label>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <AutocompleteMount disabled={disabled} onPick={onPick} />
      </APIProvider>
      <p className={styles.meta}>
        Pick a result to fill street, city, state, ZIP, and maps pin.
      </p>
    </div>
  )
}
