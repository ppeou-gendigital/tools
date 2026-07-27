import { useEffect, useRef } from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { GOOGLE_MAPS_API_KEY } from '@/env'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { cx } from '@/lib/cx'
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

function AutocompleteMount({ disabled, onPick, locationBias }) {
  const hostRef = useRef(null)
  const elementRef = useRef(null)
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
    elementRef.current = el

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
      elementRef.current = null
    }
  }, [places, PlaceAutocompleteElement])

  useEffect(() => {
    const el = elementRef.current
    if (!el) return
    if (locationBias) {
      el.locationBias = locationBias
      try {
        el.locationRestriction = null
      } catch {
        // older builds
      }
    } else {
      try {
        el.locationBias = null
      } catch {
        // ignore
      }
    }
  }, [locationBias, places])

  useEffect(() => {
    const el = elementRef.current
    if (!el) return
    el.disabled = Boolean(disabled)
  }, [disabled, places])

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
 *
 * @param {object} [props.locationBias] — soft bias (center or LatLngBoundsLiteral)
 * @param {Array<{ id: string, label: string }>} [props.cities] — multi-city chips
 * @param {string|null} [props.selectedCityId]
 * @param {(id: string) => void} [props.onCityChange]
 */
export function PlaceLocationField({
  placeName,
  address,
  lat,
  lng,
  disabled = false,
  onChange,
  locationBias = null,
  cities = [],
  selectedCityId = null,
  onCityChange,
}) {
  const hasKey = Boolean(GOOGLE_MAPS_API_KEY)
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)
  const showCityChips = cities.length > 1

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
        {showCityChips ? (
          <div
            className={styles.cityChips}
            role="group"
            aria-label="Search near city"
          >
            {cities.map((city) => (
              <button
                key={city.id}
                type="button"
                className={cx(
                  styles.cityChip,
                  selectedCityId === city.id && styles.cityChipActive,
                )}
                disabled={disabled}
                aria-pressed={selectedCityId === city.id}
                onClick={() => onCityChange?.(city.id)}
              >
                {city.label}
              </button>
            ))}
          </div>
        ) : null}
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
          <AutocompleteMount
            disabled={disabled}
            locationBias={locationBias}
            onPick={(picked) => patch(picked)}
          />
        </APIProvider>
        {selectedCityId && showCityChips ? (
          <p className={styles.meta}>
            Ranking places near{' '}
            {cities.find((c) => c.id === selectedCityId)?.label || 'this city'}.
          </p>
        ) : locationBias ? (
          <p className={styles.meta}>Ranking places near your itinerary.</p>
        ) : null}
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
