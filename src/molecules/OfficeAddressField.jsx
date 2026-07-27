import { useEffect, useRef } from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { GOOGLE_MAPS_API_KEY } from '@/env'
import {
  parsePlaceAddress,
  placeDisplayName,
  placeToOffice,
  readLatLng,
} from '@/lib/placeAddress'
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

function placeToPick(place) {
  const office = placeToOffice(place)
  return {
    displayName: placeDisplayName(place),
    addressLine1: office.addressLine1,
    addressLine2: office.addressLine2 || '',
    city: office.city,
    region: office.region,
    postalCode: office.postalCode,
    country: office.country || 'US',
    phone: office.phone,
    website: office.website,
    googlePlaceId: office.googlePlaceId || null,
    lat: office.lat ?? null,
    lng: office.lng ?? null,
  }
}

// Re-export for any callers that imported from this module historically.
export { parsePlaceAddress, placeDisplayName, readLatLng }

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
    <div className={styles.wrap}>
      <Label>Find office</Label>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <AutocompleteMount disabled={disabled} onPick={onPick} />
      </APIProvider>
      <p className={styles.meta}>
        Pick a result to fill street, city, state, ZIP, and maps pin.
      </p>
    </div>
  )
}
