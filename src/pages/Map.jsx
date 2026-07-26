import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  APIProvider,
  Map as GoogleMap,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps'
import {
  ArrowLeft,
  Banknote,
  BedDouble,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleParking,
  Clapperboard,
  Coffee,
  ExternalLink,
  Fuel,
  Grip,
  Hospital,
  Landmark,
  ListChecks,
  ListMusic,
  LocateFixed,
  Component,
  MapPin,
  Pill,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Toilet,
  TrainFront,
  Trash2,
  Utensils,
  Users,
  CircleDollarSign,
  X,
} from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import { AiPlannerButton } from '@/molecules/AiPlannerButton'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { Textarea } from '@/molecules/Textarea'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { GOOGLE_MAPS_API_KEY } from '@/env'
import { applySelectedPlaceIdeas } from '@/lib/ai/applyActions'
import { isAiPlanningEnabled } from '@/lib/ai/enabled'
import { mapAiError } from '@/lib/ai/errors'
import { suggestPlacesForJourney } from '@/lib/ai/suggestPlaces'
import aiStyles from './Ai.module.scss'
import { cx } from '@/lib/cx'
import { resolveCoords } from '@/lib/geoLocation'
import {
  proximityMapSegments,
  proximitySegments,
  segmentForIdea,
} from '@/lib/mapProximity'
import { googleMapsPlaceUrl, openMapsRouteUrl } from '@/lib/mapsLinks'
import {
  addPlaceIdea,
  deletePlaceIdea,
  getJourney,
  listPlaceIdeas,
  myMembership,
  promotePlaceIdea,
  updatePlaceIdea,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Page.module.scss'

const DEFAULT_CENTER = { lat: 48.8566, lng: 2.3522 }
const DEFAULT_ZOOM = 11
const SEARCH_RESULT_LIMIT = 12

const QUICK_SEARCHES = [
  { id: 'restaurants', label: 'Restaurants', query: 'restaurants', Icon: Utensils },
  { id: 'hotels', label: 'Hotels', query: 'hotels', Icon: BedDouble },
  { id: 'things', label: 'Things to do', query: 'things to do', Icon: Camera },
  { id: 'museums', label: 'Museums', query: 'museums', Icon: Landmark },
  { id: 'coffee', label: 'Cafés', query: 'cafe coffee', Icon: Coffee },
  { id: 'convenience', label: 'Convenience', query: 'convenience store', Icon: Store },
  { id: 'supermarket', label: 'Supermarket', query: 'supermarket', Icon: ShoppingCart },
  { id: 'pharmacy', label: 'Pharmacy', query: 'pharmacy', Icon: Pill },
  { id: 'gas', label: 'Gas station', query: 'gas station', Icon: Fuel },
  { id: 'shopping', label: 'Shopping', query: 'shopping mall', Icon: ShoppingBag },
  { id: 'movies', label: 'Movies', query: 'movie theater', Icon: Clapperboard },
  { id: 'restroom', label: 'Restroom', query: 'public restroom', Icon: Toilet },
  { id: 'atm', label: 'ATM', query: 'ATM', Icon: Banknote },
  { id: 'parking', label: 'Parking', query: 'parking', Icon: CircleParking },
  { id: 'transit', label: 'Transit', query: 'train station subway', Icon: TrainFront },
  { id: 'hospital', label: 'Hospital', query: 'hospital', Icon: Hospital },
  { id: 'police', label: 'Police', query: 'police station', Icon: Shield },
]

const PLACE_SEARCH_FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'viewport',
  'types',
  'primaryType',
  'rating',
  'userRatingCount',
  'photos',
  'googleMapsURI',
]

/** Category-ish queries should stay biased to the current map view. */
function shouldBiasToMap(query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return false
  if (QUICK_SEARCHES.some((chip) => chip.query === q)) return true
  // Short generic terms: restaurants, coffee, ramen, hotels…
  if (!/[,]/.test(q) && q.split(/\s+/).length <= 3 && !/\d/.test(q)) {
    const areaHints = [
      'city',
      'japan',
      'tokyo',
      'oslo',
      'paris',
      'london',
      'houston',
      'country',
    ]
    // Still bias categories; city names usually contain a proper noun and
    // searchByText finds them even with a soft bias — but skip bias when the
    // whole query looks like a destination name with a comma (Tokyo, Japan).
    if (areaHints.some((h) => q === h || q.startsWith(`${h} `))) return false
  }
  if (/,/.test(q)) return false
  return true
}

function photoUrlFromPlace(place, maxWidth = 120) {
  const photo = place?.photos?.[0]
  if (!photo) return null
  try {
    if (typeof photo.getURI === 'function') {
      return photo.getURI({ maxWidth })
    }
    if (typeof photo.getUrl === 'function') {
      return photo.getUrl({ maxWidth })
    }
  } catch {
    return null
  }
  return null
}

function placeToResultCard(place, index = 0) {
  const coords = readLatLng(place?.location)
  if (!coords) return null
  const rating =
    typeof place.rating === 'number' && Number.isFinite(place.rating)
      ? place.rating
      : null
  const ratingCount =
    typeof place.userRatingCount === 'number' &&
    Number.isFinite(place.userRatingCount)
      ? place.userRatingCount
      : null
  return {
    key: place.id || `result-${index}-${coords.lat},${coords.lng}`,
    googlePlaceId: place.id || null,
    name: placeDisplayName(place, 'Place'),
    address: place.formattedAddress || null,
    lat: coords.lat,
    lng: coords.lng,
    viewport: readViewport(place.viewport),
    isArea: isAreaPlace(place),
    rating,
    ratingCount,
    photoUrl: photoUrlFromPlace(place),
    googleMapsUri: place.googleMapsURI || null,
    primaryType: place.primaryType || null,
    label: String(index + 1),
  }
}

/** Pin payload for the map marker layer (search / inspect). */
function placeToMapPin(place, label = '1') {
  if (!place || !Number.isFinite(place.lat) || !Number.isFinite(place.lng)) {
    return null
  }
  return {
    key:
      place.key ||
      place.googlePlaceId ||
      `pin-${place.lat},${place.lng}`,
    lat: place.lat,
    lng: place.lng,
    name: place.name || 'Place',
    label: String(label),
    googlePlaceId: place.googlePlaceId || null,
  }
}

/** Geographic areas: selecting these flies the map there (doesn’t open place details). */
const AREA_TYPES = new Set([
  'country',
  'administrative_area_level_1',
  'administrative_area_level_2',
  'administrative_area_level_3',
  'locality',
  'postal_town',
  'colloquial_area',
  'continent',
  'archipelago',
  'neighborhood',
  'sublocality',
  'sublocality_level_1',
])

function readLatLng(location) {
  if (!location) return null
  const lat =
    typeof location.lat === 'function' ? location.lat() : Number(location.lat)
  const lng =
    typeof location.lng === 'function' ? location.lng() : Number(location.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

function readViewport(viewport) {
  if (!viewport) return null
  if (typeof viewport.getNorthEast === 'function') {
    const ne = viewport.getNorthEast()
    const sw = viewport.getSouthWest()
    return {
      north: ne.lat(),
      east: ne.lng(),
      south: sw.lat(),
      west: sw.lng(),
    }
  }
  if (
    Number.isFinite(viewport.north) &&
    Number.isFinite(viewport.south) &&
    Number.isFinite(viewport.east) &&
    Number.isFinite(viewport.west)
  ) {
    return {
      north: viewport.north,
      east: viewport.east,
      south: viewport.south,
      west: viewport.west,
    }
  }
  return null
}

function isAreaPlace(place) {
  const primary = place?.primaryType
  if (primary && AREA_TYPES.has(primary)) return true
  const types = place?.types || []
  return types.some((t) => AREA_TYPES.has(t))
}

function placeDisplayName(place, fallbackName = 'Place') {
  const name = place?.displayName
  if (typeof name === 'string' && name.trim()) return name
  if (name?.text && String(name.text).trim()) return String(name.text)
  if (place?.formattedAddress) return place.formattedAddress
  return fallbackName
}

async function fetchPlaceCard(placesLib, placeId) {
  if (!placesLib?.Place || !placeId) return null
  const place = new placesLib.Place({ id: placeId })
  await place.fetchFields({ fields: PLACE_SEARCH_FIELDS })
  return placeToResultCard(place)
}

/**
 * Full Place Details content (closer to Google Maps than all-content alone).
 * Order is ignored by the widget; it always renders in its fixed layout.
 */
function appendPlaceContent(parent) {
  const config = document.createElement('gmp-place-content-config')
  const tags = [
    'gmp-place-media',
    'gmp-place-address',
    'gmp-place-rating',
    'gmp-place-type',
    'gmp-place-price',
    'gmp-place-accessible-entrance-icon',
    'gmp-place-opening-hours',
    'gmp-place-website',
    'gmp-place-phone-number',
    'gmp-place-summary',
    'gmp-place-type-specific-highlights',
    'gmp-place-review-summary',
    'gmp-place-reviews',
    'gmp-place-feature-list',
    'gmp-place-attribution',
  ]
  for (const tag of tags) {
    const el = document.createElement(tag)
    if (tag === 'gmp-place-media') {
      el.setAttribute('lightbox-preferred', '')
    }
    if (tag === 'gmp-place-attribution') {
      el.setAttribute('light-scheme-color', 'gray')
      el.setAttribute('dark-scheme-color', 'white')
    }
    config.appendChild(el)
  }
  parent.appendChild(config)
}

/** Reports map viewport bounds to a parent. */
function MapBoundsBridge({ onBounds }) {
  const map = useMap()
  const onBoundsRef = useRef(onBounds)

  useEffect(() => {
    onBoundsRef.current = onBounds
  }, [onBounds])

  useEffect(() => {
    if (!map) return undefined
    const emit = () => {
      const bounds = map.getBounds()
      if (bounds) onBoundsRef.current?.(bounds)
    }
    emit()
    const listener = map.addListener('bounds_changed', emit)
    return () => listener?.remove?.()
  }, [map])

  return null
}

/** Fly the map to a search focus target (city viewport or place point). */
function MapFocus({ target }) {
  const map = useMap()

  useEffect(() => {
    if (!map || !target) return
    // Prev/next between results: pan only — keep the user's zoom.
    if (
      target.preserveZoom &&
      Number.isFinite(target.lat) &&
      Number.isFinite(target.lng)
    ) {
      map.panTo({ lat: target.lat, lng: target.lng })
      return
    }
    if (target.viewport) {
      const bounds = new globalThis.google.maps.LatLngBounds(
        { lat: target.viewport.south, lng: target.viewport.west },
        { lat: target.viewport.north, lng: target.viewport.east },
      )
      map.fitBounds(bounds, 64)
      return
    }
    if (Array.isArray(target.points) && target.points.length > 1) {
      const bounds = new globalThis.google.maps.LatLngBounds()
      for (const point of target.points) {
        if (Number.isFinite(point.lat) && Number.isFinite(point.lng)) {
          bounds.extend(point)
        }
      }
      if (!bounds.isEmpty()) map.fitBounds(bounds, 72)
      return
    }
    if (Number.isFinite(target.lat) && Number.isFinite(target.lng)) {
      map.panTo({ lat: target.lat, lng: target.lng })
      map.setZoom(target.zoom ?? 14)
    }
  }, [map, target])

  return null
}

function MapCamera({ ideas, selectedId, fallbackCenter, searchFocus }) {
  const map = useMap()
  const appliedFallbackKey = useRef('')
  const fittedIdeasKey = useRef('')
  const ideasRef = useRef(ideas)
  const layoutKey = ideas
    .map((i) => `${i.id}:${i.lat}:${i.lng}`)
    .join('|')

  useEffect(() => {
    ideasRef.current = ideas
  }, [ideas])

  useEffect(() => {
    if (!map) return
    if (searchFocus) return

    const list = ideasRef.current
    if (selectedId) {
      const selected = list.find((i) => i.id === selectedId)
      if (
        selected &&
        Number.isFinite(selected.lat) &&
        Number.isFinite(selected.lng)
      ) {
        map.panTo({ lat: selected.lat, lng: selected.lng })
        const zoom = map.getZoom()
        if (zoom != null && zoom < 14) map.setZoom(14)
      }
      return
    }

    if (list.length > 0 && fittedIdeasKey.current !== layoutKey) {
      fittedIdeasKey.current = layoutKey
      if (list.length === 1) {
        const only = list[0]
        map.panTo({ lat: only.lat, lng: only.lng })
        map.setZoom(14)
        return
      }
      const bounds = new globalThis.google.maps.LatLngBounds()
      for (const idea of list) {
        if (Number.isFinite(idea.lat) && Number.isFinite(idea.lng)) {
          bounds.extend({ lat: idea.lat, lng: idea.lng })
        }
      }
      if (!bounds.isEmpty()) map.fitBounds(bounds, 64)
      return
    }

    if (
      list.length === 0 &&
      fallbackCenter &&
      Number.isFinite(fallbackCenter.lat) &&
      Number.isFinite(fallbackCenter.lng)
    ) {
      const key = `${fallbackCenter.lat},${fallbackCenter.lng}`
      // Re-apply when geolocation arrives after the Paris default mount.
      if (appliedFallbackKey.current === key) return
      map.panTo(fallbackCenter)
      map.setZoom(DEFAULT_ZOOM)
      appliedFallbackKey.current = key
    }
  }, [map, layoutKey, selectedId, fallbackCenter, searchFocus])

  return null
}

/** Size/Point may be missing while the Maps script is still bootstrapping. */
function mapsSize(width, height) {
  const Size = globalThis.google?.maps?.Size
  if (typeof Size === 'function') return new Size(width, height)
  return { width, height }
}

function mapsPoint(x, y) {
  const Point = globalThis.google?.maps?.Point
  if (typeof Point === 'function') return new Point(x, y)
  return { x, y }
}

function ideaPinIcon(labelText, { selected = false } = {}) {
  const fill = selected ? '#2563eb' : '#ea4335'
  const stroke = selected ? '#1d4ed8' : '#c5221f'
  const safe = String(labelText || '')
    .slice(0, 2)
    .replace(/[<>&'"]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
  <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
  <circle cx="14" cy="14" r="7.5" fill="#ffffff"/>
  <text x="14" y="17.5" text-anchor="middle" font-size="11" font-weight="700" font-family="system-ui,sans-serif" fill="${fill}">${safe}</text>
</svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: mapsSize(28, 40),
    anchor: mapsPoint(14, 40),
  }
}

function distanceLabelIcon(labelText) {
  const text = String(labelText || '').replace(/[<>&'"]/g, '')
  const width = Math.max(44, Math.min(88, 10 + text.length * 7))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="22" viewBox="0 0 ${width} 22">
  <rect x="0.5" y="0.5" width="${width - 1}" height="21" rx="11" fill="#ffffff" fill-opacity="0.94" stroke="#94a3b8"/>
  <text x="${width / 2}" y="15" text-anchor="middle" font-size="11" font-weight="600" font-family="system-ui,sans-serif" fill="#0f172a">${text}</text>
</svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: mapsSize(width, 22),
    anchor: mapsPoint(width / 2, 11),
  }
}

/** Straight-line connectors + distance labels from the reference Idea. */
function ProximityOverlays({ segments, labelSegments }) {
  const map = useMap()
  const polylinesRef = useRef([])
  const labelsRef = useRef([])
  const overlayKey = (segments || [])
    .map((s) => `${s.id}:${Math.round(s.meters)}`)
    .join('|')
  const labelKey = (labelSegments || [])
    .map((s) => `${s.id}:${s.label}`)
    .join('|')

  useEffect(() => {
    for (const line of polylinesRef.current) line.setMap(null)
    for (const marker of labelsRef.current) marker.setMap(null)
    polylinesRef.current = []
    labelsRef.current = []

    const g = globalThis.google?.maps
    if (!map || !g || !segments?.length) return undefined

    for (const seg of segments) {
      const line = new g.Polyline({
        path: [seg.from, seg.to],
        strokeColor: '#2563eb',
        strokeOpacity: 0.65,
        strokeWeight: 2,
        geodesic: true,
        clickable: false,
        zIndex: 1,
        map,
      })
      polylinesRef.current.push(line)
    }

    for (const seg of labelSegments || []) {
      const icon = distanceLabelIcon(seg.label)
      if (!icon) continue
      const marker = new g.Marker({
        position: seg.midpoint,
        map,
        icon,
        clickable: false,
        zIndex: 2,
        title: seg.label,
      })
      labelsRef.current.push(marker)
    }

    return () => {
      for (const line of polylinesRef.current) line.setMap(null)
      for (const marker of labelsRef.current) marker.setMap(null)
      polylinesRef.current = []
      labelsRef.current = []
    }
  }, [map, overlayKey, labelKey, segments, labelSegments])

  return null
}

/** Tap a Google POI on the map → inspect it; empty map click dismisses. */
function MapPoiClick({ onPlaceId, onEmptyMapClick }) {
  const map = useMap()
  const onPlaceRef = useRef(onPlaceId)
  const onEmptyRef = useRef(onEmptyMapClick)

  useEffect(() => {
    onPlaceRef.current = onPlaceId
  }, [onPlaceId])

  useEffect(() => {
    onEmptyRef.current = onEmptyMapClick
  }, [onEmptyMapClick])

  useEffect(() => {
    if (!map) return undefined

    // Prefer classic clickable POI icons (restaurants, hotels, etc.).
    map.setOptions?.({ clickableIcons: true })

    const listener = map.addListener('click', (event) => {
      const placeId = event?.placeId
      if (!placeId) {
        onEmptyRef.current?.()
        return
      }
      // Take over from the default Maps info window so our card can show.
      event.stop?.()
      onPlaceRef.current?.(placeId, { latLng: event.latLng })
    })

    return () => listener?.remove?.()
  }, [map])

  return null
}

/**
 * Google-style autocomplete search box (cities + places).
 * Prediction list lives in the widget shadow DOM — host must allow overflow.
 */
function PlaceAutocompleteBar({ bounds, disabled, onPlacePick, onRawSearch }) {
  const hostRef = useRef(null)
  const elementRef = useRef(null)
  const places = useMapsLibrary('places')
  const onPlacePickRef = useRef(onPlacePick)
  const onRawSearchRef = useRef(onRawSearch)
  const boundsRef = useRef(bounds)
  const PlaceAutocompleteElement = places?.PlaceAutocompleteElement
  const unavailable =
    Boolean(places) && typeof PlaceAutocompleteElement !== 'function'

  useEffect(() => {
    onPlacePickRef.current = onPlacePick
  }, [onPlacePick])

  useEffect(() => {
    onRawSearchRef.current = onRawSearch
  }, [onRawSearch])

  useEffect(() => {
    boundsRef.current = bounds
  }, [bounds])

  useEffect(() => {
    if (!places || !hostRef.current) return undefined
    if (typeof PlaceAutocompleteElement !== 'function') {
      console.warn(
        'PlaceAutocompleteElement unavailable — enable Places API (New).',
      )
      return undefined
    }

    const el = new PlaceAutocompleteElement({
      placeholder: 'Search Google Maps',
    })
    el.setAttribute('aria-label', 'Search places or areas')
    hostRef.current.replaceChildren(el)
    elementRef.current = el

    const onSelect = async (event) => {
      try {
        const prediction = event?.placePrediction
        if (!prediction?.toPlace) return
        const place = prediction.toPlace()
        await place.fetchFields({ fields: PLACE_SEARCH_FIELDS })
        const card = placeToResultCard(place)
        if (!card) return
        onPlacePickRef.current?.(card)
        if ('value' in el) el.value = ''
      } catch (err) {
        console.warn('Autocomplete select failed', err)
      }
    }

    const onKeyDown = (event) => {
      if (event.key !== 'Enter' || event.isComposing) return
      // If the user hits Enter without picking a suggestion, run text search.
      // Selection via gmp-select clears the input; if text remains after a tick,
      // treat it as a raw text search (broken listOpen checks always matched the
      // host element itself).
      const text = String(el.value || '').trim()
      if (!text) return
      window.setTimeout(() => {
        const still = String(el.value || '').trim()
        if (!still) return
        onRawSearchRef.current?.(still)
      }, 0)
    }

    el.addEventListener('gmp-select', onSelect)
    el.addEventListener('keydown', onKeyDown)

    return () => {
      el.removeEventListener('gmp-select', onSelect)
      el.removeEventListener('keydown', onKeyDown)
      el.remove()
      elementRef.current = null
    }
  }, [places, PlaceAutocompleteElement])

  useEffect(() => {
    const el = elementRef.current
    if (!el || !bounds) return
    el.locationBias = bounds
    try {
      el.locationRestriction = null
    } catch {
      // older builds
    }
  }, [bounds, places])

  useEffect(() => {
    const el = elementRef.current
    if (!el) return
    el.disabled = Boolean(disabled)
  }, [disabled, places])

  // Keep the mount host free of React children so reconcile doesn't wipe
  // the PlaceAutocompleteElement appended in the effect.
  if (unavailable) {
    return (
      <div className={styles.mapAutocompleteHost}>
        <p className={styles.mapAutocompleteUnavailable} role="status">
          Place search unavailable — enable Places API (New).
        </p>
      </div>
    )
  }

  return <div ref={hostRef} className={styles.mapAutocompleteHost} />
}

/**
 * Explore panel: autocomplete + category search + inspect sheet (POI / result).
 */
function PlacesExplorePanel({
  bounds,
  detailsPlaceId,
  onDetailsPlaceId,
  onResultPins,
  onInspectPin,
  onFocusMap,
  canEdit,
  alreadySaved,
  onAddIdea,
  adding,
  onShowSaved,
  onLocate,
  locating = false,
}) {
  const placesLib = useMapsLibrary('places')
  const boundsRef = useRef(bounds)
  const searchGenRef = useRef(0)
  const detailsGenRef = useRef(0)
  const onFocusMapRef = useRef(onFocusMap)
  const onInspectPinRef = useRef(onInspectPin)
  const onResultPinsRef = useRef(onResultPins)
  /** When true, next details focus pans without changing zoom. */
  const preserveZoomOnDetailsRef = useRef(false)
  const chipMenuBtnRef = useRef(null)
  const searchHostRef = useRef(null)

  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsFallback, setDetailsFallback] = useState(null)
  const [chipMenuOpen, setChipMenuOpen] = useState(false)
  // Map-first: keep results as pins + chip; list expands only on demand.
  const [listCollapsed, setListCollapsed] = useState(true)
  /** Google Maps–style full place sheet (Places UI Kit). */
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const [richDetailsLoaded, setRichDetailsLoaded] = useState(false)
  const [detailsHostEl, setDetailsHostEl] = useState(null)

  useEffect(() => {
    boundsRef.current = bounds
  }, [bounds])

  useEffect(() => {
    onFocusMapRef.current = onFocusMap
  }, [onFocusMap])

  useEffect(() => {
    onInspectPinRef.current = onInspectPin
  }, [onInspectPin])

  useEffect(() => {
    onResultPinsRef.current = onResultPins
  }, [onResultPins])

  // Compact place card — Place API fields only.
  useEffect(() => {
    if (!detailsPlaceId || !placesLib) return undefined

    let cancelled = false
    const gen = ++detailsGenRef.current
    queueMicrotask(() => {
      if (cancelled || gen !== detailsGenRef.current) return
      setDetailsLoading(true)
      setSearchError('')
      setDetailsFallback(null)
      setRichDetailsLoaded(false)
      setListCollapsed(true)
      setChipMenuOpen(false)
    })

    ;(async () => {
      try {
        const card = await fetchPlaceCard(placesLib, detailsPlaceId)
        if (cancelled || gen !== detailsGenRef.current) return
        setDetailsFallback(card)
        if (card) {
          const pin = placeToMapPin(card, '•')
          if (pin) {
            onInspectPinRef.current?.(pin)
            // Keep a numbered result pin so the place stays marked after close.
            onResultPinsRef.current?.((prev) => {
              const list = Array.isArray(prev) ? prev : []
              if (
                list.some(
                  (p) =>
                    p.googlePlaceId === pin.googlePlaceId ||
                    p.key === pin.key,
                )
              ) {
                return list
              }
              return [
                ...list,
                { ...pin, label: String(list.length + 1) },
              ]
            })
          }
          const keepZoom = preserveZoomOnDetailsRef.current
          preserveZoomOnDetailsRef.current = false
          onFocusMapRef.current?.({
            key: `detail-${card.googlePlaceId || card.key}`,
            lat: card.lat,
            lng: card.lng,
            // fitBounds on viewport resets zoom — skip when browsing results.
            viewport: keepZoom ? null : card.viewport,
            zoom: card.isArea ? 11 : 16,
            preserveZoom: keepZoom,
          })
        } else {
          setSearchError('Could not load that place.')
        }
      } catch (err) {
        if (cancelled || gen !== detailsGenRef.current) return
        console.warn('Place details fetch failed', err)
        setDetailsFallback(null)
        setSearchError(err.message || 'Could not load that place.')
      } finally {
        if (!cancelled && gen === detailsGenRef.current) {
          setDetailsLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [detailsPlaceId, placesLib])

  // Rich Google place sheet (reviews, hours, photos, features) when expanded.
  useEffect(() => {
    if (!placesLib || !detailsPlaceId || !detailsExpanded || !detailsHostEl) {
      return undefined
    }

    let cancelled = false
    let detailsEl = null
    let onDetailsLoad = null
    let revealTimer = 0

    ;(async () => {
      try {
        if (globalThis.customElements?.whenDefined) {
          await globalThis.customElements.whenDefined('gmp-place-details')
        }
      } catch {
        // Element registry may already be ready.
      }
      if (cancelled) return

      detailsEl = document.createElement('gmp-place-details')
      const detailsRequest = document.createElement(
        'gmp-place-details-place-request',
      )
      detailsRequest.setAttribute('place', detailsPlaceId)
      detailsRequest.place = detailsPlaceId
      detailsEl.appendChild(detailsRequest)
      appendPlaceContent(detailsEl)
      detailsHostEl.replaceChildren(detailsEl)

      onDetailsLoad = () => {
        if (!cancelled) setRichDetailsLoaded(true)
      }
      detailsEl.addEventListener('gmp-load', onDetailsLoad)

      // Reveal even if gmp-load is slow/missing so the host isn’t stuck hidden.
      revealTimer = window.setTimeout(() => {
        if (!cancelled) setRichDetailsLoaded(true)
      }, 1800)
    })()

    return () => {
      cancelled = true
      if (revealTimer) window.clearTimeout(revealTimer)
      if (detailsEl && onDetailsLoad) {
        detailsEl.removeEventListener('gmp-load', onDetailsLoad)
      }
      detailsEl?.remove()
      detailsHostEl.replaceChildren()
    }
  }, [placesLib, detailsPlaceId, detailsExpanded, detailsHostEl])

  async function runTextSearch(nextQuery, { biasToMap } = {}) {
    const text = String(nextQuery || '').trim()
    if (!placesLib?.Place?.searchByText) {
      setSearchError(
        'Places library not ready. Enable Places API (New) and refresh.',
      )
      return
    }
    if (!text) {
      setSearchError('Enter a place, city, or category (e.g. restaurants).')
      return
    }

    setSearchError('')
    setSearching(true)
    // Keep the map visible — pins are the primary result surface.
    setListCollapsed(true)
    onDetailsPlaceId?.(null)
    onInspectPin?.(null)
    setDetailsFallback(null)

    const gen = ++searchGenRef.current
    const useBias = biasToMap != null ? biasToMap : shouldBiasToMap(text)

    try {
      const request = {
        textQuery: text,
        fields: PLACE_SEARCH_FIELDS,
        maxResultCount: SEARCH_RESULT_LIMIT,
      }
      const mapBounds = boundsRef.current
      if (useBias && mapBounds) {
        request.locationBias = mapBounds.getCenter
          ? mapBounds.getCenter()
          : mapBounds
      }

      const { places: found = [] } = await placesLib.Place.searchByText(request)
      if (gen !== searchGenRef.current) return

      const cards = found
        .map((place, index) => placeToResultCard(place, index))
        .filter(Boolean)

      setResults(cards)
      onResultPins?.(cards)
      setListCollapsed(true)

      if (cards.length === 0) {
        setSearchError(`No places found for “${text}”.`)
        return
      }

      const primary = cards[0]
      if (cards.length === 1 && !primary.isArea && primary.googlePlaceId) {
        // Single place → open compact card (Google Maps-like).
        onDetailsPlaceId?.(primary.googlePlaceId)
        return
      }
      if (cards.length === 1 || primary.isArea) {
        onFocusMap?.({
          key: `search-${primary.googlePlaceId || primary.key}`,
          lat: primary.lat,
          lng: primary.lng,
          viewport: primary.viewport,
          zoom: primary.isArea ? 11 : 15,
        })
      } else {
        onFocusMap?.({
          key: `results-${cards.map((p) => p.googlePlaceId).join(',')}`,
          points: cards.map((p) => ({ lat: p.lat, lng: p.lng })),
        })
      }
    } catch (err) {
      if (gen !== searchGenRef.current) return
      console.warn('Place search failed', err)
      setResults([])
      onResultPins?.([])
      setSearchError(err.message || 'Search failed. Check Places API (New).')
    } finally {
      if (gen === searchGenRef.current) setSearching(false)
    }
  }

  function showPlacePin(
    place,
    { openDetails = true, asSoleResult = false, preserveZoom = false } = {},
  ) {
    const pin = placeToMapPin(place, '1')
    if (!pin) return
    onInspectPin?.(pin)
    if (asSoleResult) {
      onResultPins?.([{ ...pin, label: '1' }])
    } else {
      onResultPins?.((prev) => {
        const list = Array.isArray(prev) ? prev : []
        if (
          list.some(
            (p) =>
              (pin.googlePlaceId && p.googlePlaceId === pin.googlePlaceId) ||
              p.key === pin.key,
          )
        ) {
          return list
        }
        return [...list, { ...pin, label: String(list.length + 1) }]
      })
    }
    if (openDetails && place.googlePlaceId) {
      preserveZoomOnDetailsRef.current = Boolean(preserveZoom)
      onDetailsPlaceId?.(place.googlePlaceId)
      if (preserveZoom) {
        onFocusMap?.({
          key: `browse-${pin.key}`,
          lat: pin.lat,
          lng: pin.lng,
          preserveZoom: true,
        })
      }
      return
    }
    onFocusMap?.({
      key: `pin-${pin.key}`,
      lat: pin.lat,
      lng: pin.lng,
      viewport: preserveZoom ? null : place.viewport,
      zoom: 16,
      preserveZoom,
    })
  }

  function handleAutocompletePick(card) {
    if (!card) return
    setSearchError('')
    setResults([])
    if (card.isArea) {
      // Cities/regions still get a pin so the pick is visible; no place card
      // (areas aren’t addable to Ideas).
      const pin = placeToMapPin(card, '1')
      if (pin) {
        onInspectPin?.(pin)
        onResultPins?.([{ ...pin, label: '1' }])
      } else {
        onInspectPin?.(null)
        onResultPins?.([])
      }
      onDetailsPlaceId?.(null)
      setDetailsFallback(null)
      onFocusMap?.({
        key: `area-${card.googlePlaceId || card.key}`,
        lat: card.lat,
        lng: card.lng,
        viewport: card.viewport,
        zoom: 11,
      })
      return
    }
    showPlacePin(card, {
      openDetails: Boolean(card.googlePlaceId),
      asSoleResult: true,
    })
  }

  function clearSearch() {
    searchGenRef.current += 1
    detailsGenRef.current += 1
    setSearchError('')
    setSearching(false)
    setResults([])
    setListCollapsed(true)
    setDetailsFallback(null)
    setDetailsLoading(false)
    setDetailsExpanded(false)
    setRichDetailsLoaded(false)
    onDetailsPlaceId?.(null)
    onResultPins?.([])
    onInspectPin?.(null)
  }

  function closePlaceCard() {
    detailsGenRef.current += 1
    setDetailsFallback(null)
    setDetailsLoading(false)
    setDetailsExpanded(false)
    setRichDetailsLoaded(false)
    onDetailsPlaceId?.(null)
    onInspectPin?.(null)
  }

  function goAdjacentResult(delta) {
    if (!detailsPlaceId || results.length < 2) return
    const index = results.findIndex(
      (r) => r.googlePlaceId === detailsPlaceId || r.key === detailsPlaceId,
    )
    if (index < 0) return
    const next = results[index + delta]
    if (!next?.googlePlaceId && !next) return
    showPlacePin(next, {
      openDetails: Boolean(next.googlePlaceId),
      preserveZoom: true,
    })
  }

  function handleAddFromDetails() {
    const place = detailsFallback
    if (!place || place.isArea || !canEdit || adding) return
    onAddIdea?.({
      googlePlaceId: place.googlePlaceId,
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
    })
  }

  const showingDetails = Boolean(detailsPlaceId)
  const activeDetails = showingDetails ? detailsFallback : null
  const showResultsChip =
    !showingDetails && !searching && results.length > 0 && listCollapsed
  const showResultsList =
    !showingDetails && !searching && results.length > 0 && !listCollapsed
  const libReady = Boolean(placesLib?.Place?.searchByText)
  const detailsMapsUrl = googleMapsPlaceUrl(activeDetails)
  const resultIndex =
    !detailsPlaceId || results.length === 0
      ? -1
      : results.findIndex(
          (r) =>
            r.googlePlaceId === detailsPlaceId || r.key === detailsPlaceId,
        )
  const canBrowseResults = resultIndex >= 0 && results.length > 1
  const canPrevResult = canBrowseResults && resultIndex > 0
  const canNextResult = canBrowseResults && resultIndex < results.length - 1

  return (
    <>
      <aside className={styles.mapExploreDock} aria-label="Explore places">
        <div className={styles.mapExploreTop}>
          <div ref={searchHostRef} className={styles.mapExploreSearch}>
            <PlaceAutocompleteBar
              bounds={bounds}
              disabled={false}
              onPlacePick={handleAutocompletePick}
              onRawSearch={(text) => void runTextSearch(text)}
            />
          </div>

          {onLocate ? (
            <button
              type="button"
              className={styles.mapLocateBtn}
              onClick={() => void onLocate()}
              disabled={locating}
              aria-label={
                locating ? 'Finding your location' : 'Go to my location'
              }
              title="My location"
            >
              <LocateFixed
                size={16}
                aria-hidden="true"
                className={locating ? styles.spin : undefined}
              />
            </button>
          ) : null}

          <button
            ref={chipMenuBtnRef}
            type="button"
            className={styles.mapChipMenuBtn}
            onClick={() => setChipMenuOpen((open) => !open)}
            aria-label="Place categories"
            aria-expanded={chipMenuOpen}
            aria-haspopup="dialog"
            disabled={!libReady}
          >
            <Grip size={16} aria-hidden="true" />
          </button>
          <AnchoredPopover
            open={chipMenuOpen}
            onClose={() => setChipMenuOpen(false)}
            anchorRef={searchHostRef}
            guardRef={chipMenuBtnRef}
            matchAnchorWidth
            align="start"
            aria-label="Place categories"
            className={styles.mapChipMenuPanel}
          >
            <div className={styles.mapChipMenuGrid} role="list">
              {QUICK_SEARCHES.map(({ id, label, query: chipQuery, Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="listitem"
                  className={styles.mapChipMenuItem}
                  onClick={() => {
                    setChipMenuOpen(false)
                    void runTextSearch(chipQuery, { biasToMap: true })
                  }}
                  disabled={!libReady || searching}
                >
                  <Icon size={14} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </AnchoredPopover>
        </div>

        {searching ? (
          <p className={styles.mapExploreStatus} role="status">
            Searching…
          </p>
        ) : null}

        {searchError && !showingDetails ? (
          <p className={styles.mapExploreStatusError} role="alert">
            {searchError}
            <button
              type="button"
              className={styles.mapExploreStatusDismiss}
              onClick={() => setSearchError('')}
              aria-label="Dismiss"
            >
              <X size={12} aria-hidden="true" />
            </button>
          </p>
        ) : null}

        {showResultsChip ? (
          <div className={styles.mapExploreCollapsedBar}>
            <button
              type="button"
              className={styles.mapExploreCollapsedBtn}
              onClick={() => setListCollapsed(false)}
              aria-expanded={false}
              aria-label={`Show ${results.length} results`}
            >
              <span>
                {results.length} result{results.length === 1 ? '' : 's'} on map
              </span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.mapExploreCollapsedClose}
              onClick={clearSearch}
              aria-label="Clear results"
              title="Clear results"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {showResultsList ? (
          <div className={styles.mapExploreResultsSheet}>
            <div className={styles.mapExploreListBar}>
              <span className={styles.mapExploreListCount}>
                {results.length} result{results.length === 1 ? '' : 's'}
              </span>
              <div className={styles.mapExploreListBarActions}>
                <button
                  type="button"
                  className={styles.mapExploreListCollapse}
                  onClick={() => setListCollapsed(true)}
                  aria-expanded={true}
                  aria-label="Hide results list"
                  title="Hide list"
                >
                  <ChevronUp size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.mapExploreListCollapse}
                  onClick={clearSearch}
                  aria-label="Clear results"
                  title="Clear results"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
            <ul className={styles.mapResultList}>
              {results.map((place) => (
                <li key={place.key}>
                  <button
                    type="button"
                    className={styles.mapResultRow}
                    onClick={() => {
                      showPlacePin(place, { openDetails: Boolean(place.googlePlaceId) })
                    }}
                  >
                    <span className={styles.mapResultCopy}>
                      <span className={styles.mapResultName}>
                        <span className={styles.mapResultIndex}>
                          {place.label}
                        </span>
                        {place.name}
                      </span>
                      {place.rating != null ? (
                        <span className={styles.mapResultRating}>
                          <Star size={12} aria-hidden="true" />
                          {place.rating.toFixed(1)}
                          {place.ratingCount != null
                            ? ` (${place.ratingCount})`
                            : ''}
                        </span>
                      ) : null}
                      {place.address ? (
                        <span className={styles.mapResultMeta}>
                          {place.address}
                        </span>
                      ) : null}
                    </span>
                    {place.photoUrl ? (
                      <img
                        className={styles.mapResultPhoto}
                        src={place.photoUrl}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <span className={styles.mapResultPhotoFallback}>
                        <MapPin size={16} aria-hidden="true" />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      {showingDetails && !detailsExpanded ? (
        <div
          className={styles.mapPlaceCard}
          role="dialog"
          aria-label={activeDetails?.name || 'Place details'}
        >
          <div className={styles.mapPlaceCardBar}>
            {results.length > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={closePlaceCard}
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Results
              </Button>
            ) : (
              <span className={styles.mapPlaceCardHint}>
                Tap the map to browse
              </span>
            )}
            <div className={styles.mapExploreDetailsActions}>
              {!detailsLoading && activeDetails && alreadySaved ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onShowSaved}
                >
                  <Check size={14} aria-hidden="true" />
                  In Ideas
                </Button>
              ) : null}
              {!detailsLoading &&
              activeDetails &&
              !alreadySaved &&
              canEdit &&
              !activeDetails.isArea ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddFromDetails}
                  disabled={adding}
                >
                  <Plus size={14} aria-hidden="true" />
                  {adding ? 'Adding…' : 'Add to Ideas'}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                aria-label="Close"
                title="Close"
                onClick={closePlaceCard}
              >
                <X size={14} aria-hidden="true" />
              </Button>
            </div>
          </div>

          {canBrowseResults ? (
            <div className={styles.mapPlaceCardPager}>
              <button
                type="button"
                className={styles.mapPlacePagerBtn}
                disabled={!canPrevResult}
                onClick={() => goAdjacentResult(-1)}
                aria-label="Previous result"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <span className={styles.mapPlacePagerLabel}>
                {resultIndex + 1} of {results.length}
              </span>
              <button
                type="button"
                className={styles.mapPlacePagerBtn}
                disabled={!canNextResult}
                onClick={() => goAdjacentResult(1)}
                aria-label="Next result"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {detailsLoading ? (
            <p className={styles.mapExploreHint}>Loading place…</p>
          ) : null}

          {searchError && showingDetails ? (
            <p className={styles.mapExploreError} role="alert">
              {searchError}
            </p>
          ) : null}

          {!detailsLoading && activeDetails ? (
            <div className={styles.mapPlaceCardBody}>
              <div className={styles.mapDetailsFallbackTop}>
                <div className={styles.mapDetailsFallbackCopy}>
                  <p className={styles.mapDetailsFallbackName}>
                    {activeDetails.name}
                  </p>
                  {activeDetails.rating != null ? (
                    <p className={styles.mapResultRating}>
                      <Star size={12} aria-hidden="true" />
                      {activeDetails.rating.toFixed(1)}
                      {activeDetails.ratingCount != null
                        ? ` (${activeDetails.ratingCount})`
                        : ''}
                    </p>
                  ) : null}
                  {activeDetails.address ? (
                    <p className={styles.mapResultMeta}>
                      {activeDetails.address}
                    </p>
                  ) : null}
                </div>
                {activeDetails.photoUrl ? (
                  <img
                    className={styles.mapResultPhoto}
                    src={activeDetails.photoUrl}
                    alt=""
                  />
                ) : null}
              </div>
              <div className={styles.mapPlaceCardActions}>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setRichDetailsLoaded(false)
                    setDetailsExpanded(true)
                  }}
                >
                  See more details
                </Button>
                {detailsMapsUrl ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        detailsMapsUrl,
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    Google Maps
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {showingDetails && detailsExpanded ? (
        <div className={styles.mapPlaceDetailOverlay}>
          <button
            type="button"
            className={styles.mapPlaceDetailBackdrop}
            aria-label="Close place details"
            onClick={() => setDetailsExpanded(false)}
          />
          <div
            className={styles.mapPlaceDetailSheet}
            role="dialog"
            aria-modal="true"
            aria-label={activeDetails?.name || 'Place details'}
          >
            <div className={styles.mapPlaceDetailHeader}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDetailsExpanded(false)}
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Summary
              </Button>
              {canBrowseResults ? (
                <div className={styles.mapPlaceCardPager}>
                  <button
                    type="button"
                    className={styles.mapPlacePagerBtn}
                    disabled={!canPrevResult}
                    onClick={() => goAdjacentResult(-1)}
                    aria-label="Previous result"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <span className={styles.mapPlacePagerLabel}>
                    {resultIndex + 1} of {results.length}
                  </span>
                  <button
                    type="button"
                    className={styles.mapPlacePagerBtn}
                    disabled={!canNextResult}
                    onClick={() => goAdjacentResult(1)}
                    aria-label="Next result"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <span className={styles.mapPlaceCardHint}>Details</span>
              )}
              <div className={styles.mapExploreDetailsActions}>
                {!detailsLoading && activeDetails && alreadySaved ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onShowSaved}
                  >
                    <Check size={14} aria-hidden="true" />
                    In Ideas
                  </Button>
                ) : null}
                {!detailsLoading &&
                activeDetails &&
                !alreadySaved &&
                canEdit &&
                !activeDetails.isArea ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddFromDetails}
                    disabled={adding}
                  >
                    <Plus size={14} aria-hidden="true" />
                    {adding ? 'Adding…' : 'Add to Ideas'}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={styles.iconBtn}
                  aria-label="Close"
                  title="Close"
                  onClick={closePlaceCard}
                >
                  <X size={14} aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className={styles.mapPlaceDetailBody}>
              {!richDetailsLoaded && activeDetails ? (
                <div className={styles.mapDetailsFallback}>
                  <div className={styles.mapDetailsFallbackTop}>
                    <div className={styles.mapDetailsFallbackCopy}>
                      <p className={styles.mapDetailsFallbackName}>
                        {activeDetails.name}
                      </p>
                      {activeDetails.rating != null ? (
                        <p className={styles.mapResultRating}>
                          <Star size={12} aria-hidden="true" />
                          {activeDetails.rating.toFixed(1)}
                          {activeDetails.ratingCount != null
                            ? ` (${activeDetails.ratingCount})`
                            : ''}
                        </p>
                      ) : null}
                      {activeDetails.address ? (
                        <p className={styles.mapResultMeta}>
                          {activeDetails.address}
                        </p>
                      ) : null}
                    </div>
                    {activeDetails.photoUrl ? (
                      <img
                        className={styles.mapResultPhoto}
                        src={activeDetails.photoUrl}
                        alt=""
                      />
                    ) : null}
                  </div>
                  <p className={styles.mapExploreHint}>Loading full details…</p>
                </div>
              ) : null}
              <div
                ref={setDetailsHostEl}
                className={cx(
                  styles.mapPlaceDetailsHost,
                  !richDetailsLoaded && styles.mapPlaceDetailsHostPending,
                )}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function journeyShortcuts(journeyId, go) {
  return [
    {
      id: 'members',
      label: 'Travelers',
      icon: Users,
      pick: () => () => go.goMembers(journeyId),
    },
    {
      id: 'spending',
      label: 'Spending',
      icon: CircleDollarSign,
      pick: () => () => go.goSpending(journeyId),
    },
    {
      id: 'playlist',
      label: 'Playlist',
      icon: ListMusic,
      pick: () => () => go.goPlaylist(journeyId),
    },
    {
      id: 'todos',
      label: 'To-dos',
      icon: ListChecks,
      pick: () => () => go.goTodos(journeyId),
    },
    {
      id: 'map',
      label: 'Map',
      icon: MapPin,
      pick: () => () => go.goMap(journeyId),
    },
    {
      id: 'journey-settings',
      label: 'Settings',
      icon: Settings,
      pick: () => () => go.goJourneySettings(journeyId),
    },
  ]
}

export function Map() {
  const nav = useNavigation()
  const { params, goBack, previousRouteLabel, goEntryEdit } = nav
  const journeyId = params.journeyId
  const { user } = useAuth()
  const { mapsProvider } = useDisplayPrefs()
  const qc = useQueryClient()

  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [mapBounds, setMapBounds] = useState(null)
  const [resultPins, setResultPins] = useState([])
  /** Prominent pin for the place currently opened from search / POI. */
  const [inspectPin, setInspectPin] = useState(null)
  const [searchFocus, setSearchFocus] = useState(null)
  const searchFocusKeyRef = useRef(0)
  const [detailsPlaceId, setDetailsPlaceId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [noteDrafts, setNoteDrafts] = useState({})
  const [actionError, setActionError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [promotingId, setPromotingId] = useState(null)
  const [ideasOpen, setIdeasOpen] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiError, setAiError] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [aiSelected, setAiSelected] = useState(() => new Set())
  const [aiBusy, setAiBusy] = useState(false)
  const [aiApplying, setAiApplying] = useState(false)
  /** Ignore the map click that follows a marker click (avoids instant dismiss). */
  const ignoreEmptyMapClickRef = useRef(false)
  const aiEnabled = isAiPlanningEnabled()

  useEffect(() => {
    let cancelled = false
    resolveCoords().then((coords) => {
      if (cancelled || !coords) return
      setCenter({ lat: coords.lat, lng: coords.lng })
      setUserLocation({ lat: coords.lat, lng: coords.lng })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const { data: journey } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: membership, isLoading: membershipLoading } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const {
    data: ideas = [],
    isLoading,
    isFetching,
    error: loadError,
    refetch,
  } = useQuery({
    queryKey: ['viaggio', 'place-ideas', journeyId],
    queryFn: () => listPlaceIdeas(journeyId),
    enabled: !!journeyId,
  })

  /** Optional: open Ideas shortlist in preferred Maps app to compare proximity. */
  const ideasProximityUrl = useMemo(
    () =>
      openMapsRouteUrl(ideas, {
        provider: mapsProvider,
        fromCurrentLocation: false,
      }),
    [ideas, mapsProvider],
  )

  const proximity = useMemo(
    () => proximitySegments(ideas, selectedId),
    [ideas, selectedId],
  )
  const mapProximity = useMemo(
    () => proximityMapSegments(proximity),
    [proximity],
  )
  const selectedIdea = useMemo(
    () => ideas.find((i) => i.id === selectedId) || null,
    [ideas, selectedId],
  )

  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ['viaggio', 'place-ideas', journeyId] })

  const addMut = useMutation({
    mutationFn: (place) =>
      addPlaceIdea(
        journeyId,
        {
          googlePlaceId: place.googlePlaceId,
          name: place.name,
          address: place.address,
          lat: place.lat,
          lng: place.lng,
        },
        user.id,
      ),
    onSuccess: (idea) => {
      setActionError('')
      setSelectedId(idea.id)
      setIdeasOpen(true)
      invalidate()
    },
    onError: (err) => setActionError(err.message || 'Could not add place.'),
  })

  const noteMut = useMutation({
    mutationFn: ({ id, note }) => updatePlaceIdea(id, { note }),
    onSuccess: () => {
      setActionError('')
      invalidate()
    },
    onError: (err) => setActionError(err.message || 'Could not save note.'),
  })

  const promoteMut = useMutation({
    mutationFn: (idea) => promotePlaceIdea(idea),
    onMutate: (idea) => setPromotingId(idea.id),
    onSuccess: ({ idea }) => {
      setActionError('')
      setPromotingId(null)
      setSelectedId(idea.id)
      invalidate()
      qc.invalidateQueries({ queryKey: ['viaggio', 'entries', journeyId] })
    },
    onError: (err) => {
      setPromotingId(null)
      setActionError(err.message || 'Could not add to journey.')
    },
  })

  function focusMapOn(target) {
    if (!target) return
    searchFocusKeyRef.current += 1
    setSearchFocus({
      ...target,
      key: target.key || searchFocusKeyRef.current,
    })
  }

  function fitAllIdeas() {
    const points = ideas
      .filter((i) => Number.isFinite(i.lat) && Number.isFinite(i.lng))
      .map((i) => ({ lat: i.lat, lng: i.lng }))
    if (points.length === 0) return
    setDetailsPlaceId(null)
    if (points.length === 1) {
      focusMapOn({
        key: `fit-one-${points[0].lat},${points[0].lng}`,
        lat: points[0].lat,
        lng: points[0].lng,
        zoom: 14,
      })
      return
    }
    focusMapOn({
      key: `fit-ideas-${points.length}-${Date.now()}`,
      points,
    })
  }

  async function goToMyLocation() {
    if (locating) return
    setLocating(true)
    setActionError('')
    try {
      const coords = await resolveCoords()
      if (!coords) {
        setActionError(
          'Could not get your location. Allow location access in the browser, then try again.',
        )
        return
      }
      const next = { lat: coords.lat, lng: coords.lng }
      setUserLocation(next)
      setCenter(next)
      setSelectedId(null)
      setDetailsPlaceId(null)
      focusMapOn({
        key: `me-${next.lat},${next.lng},${Date.now()}`,
        lat: next.lat,
        lng: next.lng,
        zoom: 14,
      })
    } finally {
      setLocating(false)
    }
  }

  function openPlaceDetails(placeId) {
    if (!placeId) return
    ignoreEmptyMapClickRef.current = true
    setSelectedId(null)
    setIdeasOpen(false)
    setDetailsPlaceId(placeId)
  }

  function dismissPlaceCard() {
    if (ignoreEmptyMapClickRef.current) {
      ignoreEmptyMapClickRef.current = false
      return
    }
    setDetailsPlaceId(null)
    setInspectPin(null)
  }

  function selectIdeaFromMap(ideaId) {
    ignoreEmptyMapClickRef.current = true
    setDetailsPlaceId(null)
    setInspectPin(null)
    setSelectedId(ideaId)
    setIdeasOpen(true)
    setSearchFocus(null)
  }

  const detailsAlreadySaved = detailsPlaceId
    ? ideas.some((idea) => idea.googlePlaceId === detailsPlaceId)
    : false
  const detailsSavedIdea = detailsAlreadySaved
    ? ideas.find((idea) => idea.googlePlaceId === detailsPlaceId)
    : null

  async function confirmDeleteIdea() {
    if (!confirmDelete) return
    setDeleting(true)
    setActionError('')
    try {
      await deletePlaceIdea(confirmDelete.id)
      if (selectedId === confirmDelete.id) setSelectedId(null)
      setConfirmDelete(null)
      await invalidate()
    } catch (err) {
      setActionError(err.message || 'Could not remove place.')
    } finally {
      setDeleting(false)
    }
  }

  const hasMapsKey = Boolean(GOOGLE_MAPS_API_KEY)
  const shortcuts = journeyShortcuts(journeyId, nav)
  const ready = !isLoading && !membershipLoading && !loadError

  return (
    <div className={cx(styles.page, styles.mapPage)} data-map-page>
      <PageHeader
        title="Map"
        subtitle={journey?.title || 'Brainstorm places'}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          <div className={styles.toolbar}>
            {canEdit && aiEnabled && (
              <AiPlannerButton
                journeyId={journeyId}
                className={styles.iconBtn}
              />
            )}
            {canEdit && aiEnabled && (
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={() => {
                  setAiError('')
                  setAiOpen(true)
                }}
                aria-label="Suggest places with AI"
                title="Suggest places"
              >
                <Sparkles size={14} aria-hidden="true" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={styles.iconBtn}
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh ideas"
              title="Refresh"
            >
              <RefreshCw
                size={14}
                aria-hidden="true"
                className={isFetching ? styles.spin : undefined}
              />
            </Button>
          </div>
        }
        shortcuts={
          <PageShortcuts
            current="map"
            className={styles.iconBtn}
            shortcuts={shortcuts}
          />
        }
      />

      {(isLoading || membershipLoading) && (
        <div className={styles.mapStatus}>
          <LoadingState>Loading map…</LoadingState>
        </div>
      )}

      {loadError && (
        <div className={styles.mapStatus}>
          <p className={styles.error} role="alert">
            Could not load ideas. ({loadError.message})
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {ready && (
        <div className={styles.mapStage}>
          {!hasMapsKey ? (
            <div className={styles.mapMissingKey}>
              <MapPin size={28} aria-hidden="true" />
              <p className={styles.rowTitle}>Google Maps key required</p>
              <p className={styles.hint}>
                Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your{' '}
                <code>.env</code>, enable Maps JavaScript API, Places API
                (New), and Places UI Kit (for search), then restart the
                dev server.
              </p>
            </div>
          ) : (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
              <div className={styles.mapCanvas}>
                <GoogleMap
                  defaultCenter={center}
                  defaultZoom={DEFAULT_ZOOM}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  mapTypeControl={false}
                  streetViewControl={false}
                  fullscreenControl={false}
                  clickableIcons
                  style={{ width: '100%', height: '100%' }}
                >
                  <MapCamera
                    ideas={ideas}
                    selectedId={selectedId}
                    fallbackCenter={center}
                    searchFocus={searchFocus}
                  />
                  <MapFocus target={searchFocus} />
                  <MapBoundsBridge onBounds={setMapBounds} />
                  <MapPoiClick
                    onPlaceId={openPlaceDetails}
                    onEmptyMapClick={dismissPlaceCard}
                  />
                  <ProximityOverlays
                    segments={proximity}
                    labelSegments={mapProximity}
                  />
                  {resultPins.map((pin) => {
                    const isInspect =
                      inspectPin &&
                      ((pin.googlePlaceId &&
                        pin.googlePlaceId === inspectPin.googlePlaceId) ||
                        pin.key === inspectPin.key)
                    // Active inspect pin is drawn separately (blue).
                    if (isInspect) return null
                    return (
                      <Marker
                        key={`result-${pin.key}`}
                        position={{ lat: pin.lat, lng: pin.lng }}
                        title={pin.name}
                        label={{
                          text: pin.label,
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                        onClick={() => {
                          if (pin.googlePlaceId) {
                            openPlaceDetails(pin.googlePlaceId)
                          }
                        }}
                      />
                    )
                  })}
                  {inspectPin ? (
                    <Marker
                      key={`inspect-${inspectPin.key}`}
                      position={{ lat: inspectPin.lat, lng: inspectPin.lng }}
                      title={inspectPin.name}
                      icon={ideaPinIcon('•', { selected: true })}
                      zIndex={2000}
                      onClick={() => {
                        if (inspectPin.googlePlaceId) {
                          openPlaceDetails(inspectPin.googlePlaceId)
                        }
                      }}
                    />
                  ) : null}
                  {ideas.map((idea, index) => {
                    const isSelected = idea.id === selectedId
                    const pinIcon = ideaPinIcon(String(index + 1), {
                      selected: isSelected,
                    })
                    return (
                      <Marker
                        key={idea.id}
                        position={{ lat: idea.lat, lng: idea.lng }}
                        title={idea.name}
                        icon={pinIcon}
                        zIndex={isSelected ? 1000 : index + 1}
                        onClick={() => selectIdeaFromMap(idea.id)}
                      />
                    )
                  })}
                  {userLocation &&
                  globalThis.google?.maps?.SymbolPath?.CIRCLE != null ? (
                    <Marker
                      position={userLocation}
                      title="Your location"
                      clickable={false}
                      icon={{
                        path: globalThis.google.maps.SymbolPath.CIRCLE,
                        scale: 9,
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                      }}
                    />
                  ) : null}
                </GoogleMap>
              </div>

              <PlacesExplorePanel
                bounds={mapBounds}
                detailsPlaceId={detailsPlaceId}
                onDetailsPlaceId={setDetailsPlaceId}
                onResultPins={setResultPins}
                onInspectPin={setInspectPin}
                onFocusMap={focusMapOn}
                canEdit={canEdit}
                alreadySaved={detailsAlreadySaved}
                onAddIdea={(place) => addMut.mutate(place)}
                adding={addMut.isPending}
                onShowSaved={() => {
                  if (!detailsSavedIdea) return
                  setSelectedId(detailsSavedIdea.id)
                  setIdeasOpen(true)
                }}
                onLocate={goToMyLocation}
                locating={locating}
              />

              {actionError && (
                <p className={styles.mapFloatErrorBanner} role="alert">
                  {actionError}
                </p>
              )}
              {!canEdit && (
                <p className={styles.mapFloatHintBanner}>
                  View-only — editors can add places to Ideas.
                </p>
              )}
            </APIProvider>
          )}

          <aside
            className={cx(
              styles.mapIdeasPanel,
              !ideasOpen && styles.mapIdeasPanelCollapsed,
              detailsPlaceId && styles.mapIdeasPanelHidden,
            )}
            aria-label="Ideas"
            aria-hidden={Boolean(detailsPlaceId)}
          >
            <div className={styles.mapIdeasHeader}>
              <button
                type="button"
                className={styles.mapIdeasToggle}
                onClick={() => setIdeasOpen((open) => !open)}
                aria-expanded={ideasOpen}
                aria-controls="map-ideas-body"
              >
                <MapPin size={14} aria-hidden="true" />
                <span className={styles.mapIdeasTitle}>Ideas</span>
                <span className={styles.mapIdeasCount}>{ideas.length}</span>
              </button>
              {ideas.length > 0 ? (
                <button
                  type="button"
                  className={styles.mapIdeasFitBtn}
                  onClick={fitAllIdeas}
                  title="Show all Ideas on the map"
                  aria-label="Show all Ideas on the map"
                >
                  <Component size={14} aria-hidden="true" />
                </button>
              ) : null}
              <button
                type="button"
                className={styles.mapIdeasChevronBtn}
                onClick={() => setIdeasOpen((open) => !open)}
                aria-expanded={ideasOpen}
                aria-controls="map-ideas-body"
                aria-label={ideasOpen ? 'Collapse Ideas' : 'Expand Ideas'}
              >
                {ideasOpen ? (
                  <ChevronDown size={16} aria-hidden="true" />
                ) : (
                  <ChevronUp size={16} aria-hidden="true" />
                )}
              </button>
            </div>

            {ideasOpen && (
              <div id="map-ideas-body" className={styles.mapIdeasBody}>
                <p className={styles.mapIdeasBlurb}>
                  Pin places, then tap one to measure straight-line distances to
                  the others. Promote a pin to the journey timeline when you
                  decide to go.
                </p>
                {ideas.length >= 2 && ideasProximityUrl ? (
                  <div
                    className={styles.mapIdeasProximity}
                    aria-label="Open Ideas in Maps"
                  >
                    <a
                      className={styles.mapRouteLink}
                      href={ideasProximityUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={`Open all Ideas in ${mapsProvider === 'apple' ? 'Apple' : 'Google'} Maps`}
                    >
                      Open all in Maps
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  </div>
                ) : null}

                {ideas.length === 0 ? (
                  <p className={styles.mapIdeasEmpty}>
                    {canEdit
                      ? 'Browse search results, read reviews, then tap Add to Ideas.'
                      : 'No ideas yet.'}
                  </p>
                ) : (
                  <ul className={styles.mapIdeaList}>
                    {ideas.map((idea) => {
                      const noteValue =
                        noteDrafts[idea.id] !== undefined
                          ? noteDrafts[idea.id]
                          : idea.note || ''
                      const isSelected = selectedId === idea.id
                      const promoted = Boolean(idea.entryId)
                      const fromSelected = segmentForIdea(proximity, idea.id)
                      return (
                        <li
                          key={idea.id}
                          className={cx(
                            styles.mapIdeaRow,
                            isSelected && styles.mapIdeaRowSelected,
                          )}
                        >
                          <button
                            type="button"
                            className={styles.mapIdeaSelect}
                            onClick={() => setSelectedId(idea.id)}
                          >
                            <span className={styles.rowTitle}>{idea.name}</span>
                            {idea.address ? (
                              <span className={styles.rowMeta}>
                                {idea.address}
                              </span>
                            ) : null}
                            {isSelected ? (
                              <span
                                className={cx(
                                  styles.mapBadge,
                                  styles.mapBadgeReference,
                                )}
                              >
                                Reference
                              </span>
                            ) : fromSelected ? (
                              <span className={styles.mapIdeaDistance}>
                                {fromSelected.label}
                                {selectedIdea?.name
                                  ? ` from ${selectedIdea.name}`
                                  : ' from selected'}
                              </span>
                            ) : null}
                            {promoted ? (
                              <span className={styles.mapBadge}>
                                <Check size={12} aria-hidden="true" />
                                Added to journey
                              </span>
                            ) : null}
                          </button>

                          {canEdit && (
                            <div className={styles.mapIdeaNote}>
                              <Label htmlFor={`place-note-${idea.id}`}>
                                Note
                              </Label>
                              <Input
                                id={`place-note-${idea.id}`}
                                value={noteValue}
                                placeholder="Why this place?"
                                onChange={(e) =>
                                  setNoteDrafts((prev) => ({
                                    ...prev,
                                    [idea.id]: e.target.value,
                                  }))
                                }
                                onBlur={() => {
                                  const next = String(noteValue || '')
                                  if (next === (idea.note || '')) return
                                  noteMut.mutate({ id: idea.id, note: next })
                                }}
                              />
                            </div>
                          )}

                          <div className={styles.mapIdeaActions}>
                            {promoted ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  goEntryEdit({
                                    journeyId,
                                    entryId: idea.entryId,
                                    activityId: 'place',
                                  })
                                }
                              >
                                <ExternalLink size={14} aria-hidden="true" />
                                Open
                              </Button>
                            ) : canEdit ? (
                              <Button
                                size="sm"
                                onClick={() => promoteMut.mutate(idea)}
                                disabled={promotingId === idea.id}
                              >
                                <Plus size={14} aria-hidden="true" />
                                {promotingId === idea.id
                                  ? 'Adding…'
                                  : 'Add to journey'}
                              </Button>
                            ) : null}
                            {canEdit && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className={styles.iconBtnDanger}
                                aria-label={`Remove ${idea.name}`}
                                title="Remove"
                                onClick={() => setConfirmDelete(idea)}
                              >
                                <Trash2 size={14} aria-hidden="true" />
                              </Button>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onDismiss={() => !deleting && setConfirmDelete(null)}
        title="Remove idea?"
        message={
          confirmDelete
            ? `"${confirmDelete.name}" will leave Ideas. Journey activities already created stay on the timeline.`
            : undefined
        }
        confirmLabel="Remove"
        busyLabel="Removing…"
        confirming={deleting}
        onConfirm={confirmDeleteIdea}
      />

      <Modal
        open={aiOpen}
        onDismiss={() => !aiBusy && !aiApplying && setAiOpen(false)}
        title="Suggest places"
      >
        <div className={aiStyles.sheet}>
          <div className={styles.field}>
            <Label htmlFor="ai-places-prompt">What should we look for?</Label>
            <Textarea
              id="ai-places-prompt"
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Scenic viewpoints, late-night eats, rainy-day museums…"
            />
          </div>
          {aiError && (
            <p className={styles.error} role="alert">
              {aiError}
            </p>
          )}
          <Button
            onClick={async () => {
              setAiBusy(true)
              setAiError('')
              try {
                const res = await suggestPlacesForJourney({
                  journeyId,
                  prompt: aiPrompt,
                  lat: center?.lat,
                  lng: center?.lng,
                })
                setAiSuggestions(res.placeIdeas)
                setAiSelected(
                  new Set(res.placeIdeas.map((_, i) => String(i))),
                )
              } catch (err) {
                setAiError(mapAiError(err))
              } finally {
                setAiBusy(false)
              }
            }}
            disabled={aiBusy || aiApplying}
            fullWidth
          >
            <Sparkles size={14} />
            {aiBusy ? 'Suggesting…' : 'Suggest places'}
          </Button>
          {aiSuggestions.length > 0 && (
            <ul className={aiStyles.previewList}>
              {aiSuggestions.map((idea, i) => {
                const key = String(i)
                return (
                  <li key={key} className={aiStyles.previewItem}>
                    <input
                      type="checkbox"
                      checked={aiSelected.has(key)}
                      onChange={() => {
                        setAiSelected((prev) => {
                          const next = new Set(prev)
                          if (next.has(key)) next.delete(key)
                          else next.add(key)
                          return next
                        })
                      }}
                    />
                    <span>
                      <strong>{idea.name}</strong>
                      {idea.note ? (
                        <span className={styles.hint}> — {idea.note}</span>
                      ) : null}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
          {aiSuggestions.length > 0 && (
            <Button
              onClick={async () => {
                setAiApplying(true)
                setAiError('')
                try {
                  const picked = aiSuggestions.filter((_, i) =>
                    aiSelected.has(String(i)),
                  )
                  const { errors } = await applySelectedPlaceIdeas(
                    journeyId,
                    picked,
                    user.id,
                  )
                  invalidate()
                  setIdeasOpen(true)
                  if (errors.length) {
                    setAiError(errors.join('; '))
                  } else {
                    setAiOpen(false)
                    setAiSuggestions([])
                    setAiPrompt('')
                  }
                } catch (err) {
                  setAiError(err.message || 'Could not add places')
                } finally {
                  setAiApplying(false)
                }
              }}
              disabled={aiApplying || aiSelected.size === 0}
              fullWidth
            >
              {aiApplying
                ? 'Adding…'
                : `Add selected (${aiSelected.size})`}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  )
}
