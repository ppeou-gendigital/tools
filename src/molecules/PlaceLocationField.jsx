import { useEffect, useRef } from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { GOOGLE_MAPS_API_KEY } from '@/env'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import styles from './PlaceLocationField.module.scss'

const PLACE_FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
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
      placeholder: 'Search for a place…',
    })
    el.setAttribute('aria-label', 'Search for a place')
    if (disabled) el.disabled = true
    hostRef.current.replaceChildren(el)

    const onSelect = async (event) => {
      try {
        const prediction = event?.placePrediction
        if (!prediction?.toPlace) return
        const place = prediction.toPlace()
        await place.fetchFields({ fields: PLACE_FIELDS })
        const coords = readLatLng(place.location)
        if (!coords) return
        onPickRef.current?.({
          placeName: placeDisplayName(place),
          address: place.formattedAddress || '',
          lat: coords.lat,
          lng: coords.lng,
          googlePlaceId: place.id || null,
        })
        if ('value' in el) el.value = ''
      } catch (err) {
        console.warn('Place pick failed', err)
      }
    }

    el.addEventListener('gmp-select', onSelect)
    return () => {
      el.removeEventListener('gmp-select', onSelect)
      el.remove()
    }
  }, [places, disabled, PlaceAutocompleteElement])

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
 * Place picker that fills placeName / address / lat / lng via Google Places.
 * Falls back to plain text fields when Maps API key is missing.
 */
export function PlaceLocationField({
  placeName,
  address,
  lat,
  lng,
  disabled = false,
  onChange,
}) {
  const hasKey = Boolean(GOOGLE_MAPS_API_KEY)
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)

  function patch(partial) {
    onChange?.({
      placeName,
      address,
      lat,
      lng,
      ...partial,
    })
  }

  if (!hasKey) {
    return (
      <>
        <div>
          <Label htmlFor="place">Place</Label>
          <Input
            id="place"
            value={placeName || ''}
            disabled={disabled}
            onChange={(e) => patch({ placeName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address || ''}
            disabled={disabled}
            onChange={(e) => patch({ address: e.target.value })}
          />
          <p className={styles.meta}>
            Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to pin this stop on the
            map.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <div>
        <Label>Find on map</Label>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
          <AutocompleteMount
            disabled={disabled}
            onPick={(picked) => patch(picked)}
          />
        </APIProvider>
      </div>
      <div>
        <Label htmlFor="place">Place</Label>
        <Input
          id="place"
          value={placeName || ''}
          disabled={disabled}
          onChange={(e) => patch({ placeName: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address || ''}
          disabled={disabled}
          onChange={(e) => patch({ address: e.target.value })}
        />
        {hasCoords ? (
          <p className={styles.meta}>
            Pinned · {lat.toFixed(5)}, {lng.toFixed(5)}{' '}
            {!disabled ? (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => patch({ lat: null, lng: null })}
              >
                Clear pin
              </button>
            ) : null}
          </p>
        ) : (
          <p className={styles.meta}>
            Search above to pin coordinates for map routes.
          </p>
        )}
      </div>
    </>
  )
}
