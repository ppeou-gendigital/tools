import { useEffect, useRef, useState } from 'react'
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
  MapPin,
  Pill,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
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
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { GOOGLE_MAPS_API_KEY } from '@/env'
import { cx } from '@/lib/cx'
import { resolveCoords } from '@/lib/geoLocation'
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

function googleMapsPlaceUrl(place) {
  if (place?.googleMapsUri) return place.googleMapsUri
  if (place?.googlePlaceId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(place.googlePlaceId)}`
  }
  if (Number.isFinite(place?.lat) && Number.isFinite(place?.lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`
  }
  return null
}

function appendPlaceContent(parent) {
  parent.appendChild(document.createElement('gmp-place-all-content'))
}

async function fetchPlaceCard(placesLib, placeId) {
  if (!placesLib?.Place || !placeId) return null
  const place = new placesLib.Place({ id: placeId })
  await place.fetchFields({ fields: PLACE_SEARCH_FIELDS })
  return placeToResultCard(place)
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

/** Tap a Google POI on the map → inspect it (never auto-save). */
function MapPoiClick({ onPlaceId }) {
  const map = useMap()
  const onPlaceRef = useRef(onPlaceId)

  useEffect(() => {
    onPlaceRef.current = onPlaceId
  }, [onPlaceId])

  useEffect(() => {
    if (!map) return undefined

    // Prefer classic clickable POI icons.
    map.setOptions?.({ clickableIcons: true })

    const listener = map.addListener('click', (event) => {
      const placeId = event?.placeId
      if (!placeId) return
      // Take over from the default Maps info window so our sheet can show.
      event.stop?.()
      onPlaceRef.current?.(placeId, { latLng: event.latLng })
    })

    return () => listener?.remove?.()
  }, [map])

  return null
}

/**
 * Google-style autocomplete search box (cities + places).
 * Mounted outside the map canvas so the prediction list isn’t clipped.
 */
function PlaceAutocompleteBar({ bounds, disabled, onPlacePick, onRawSearch }) {
  const hostRef = useRef(null)
  const elementRef = useRef(null)
  const places = useMapsLibrary('places')
  const onPlacePickRef = useRef(onPlacePick)
  const onRawSearchRef = useRef(onRawSearch)
  const boundsRef = useRef(bounds)

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

    const PlaceAutocompleteElement = places.PlaceAutocompleteElement
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
      if (event.key !== 'Enter') return
      // If the user hits Enter without picking a suggestion, run text search.
      const text = String(el.value || '').trim()
      if (!text) return
      // Let the widget handle suggestion confirmation when a row is active.
      const listOpen = Boolean(
        document.querySelector('gmp-place-autocomplete, .pac-container'),
      )
      if (listOpen && event.isComposing) return
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
  }, [places])

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
  const detailsHostRef = useRef(null)
  const detailsRequestRef = useRef(null)
  const boundsRef = useRef(bounds)
  const searchGenRef = useRef(0)
  const detailsGenRef = useRef(0)
  const onFocusMapRef = useRef(onFocusMap)
  const chipMenuBtnRef = useRef(null)
  const searchHostRef = useRef(null)

  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsFallback, setDetailsFallback] = useState(null)
  const [chipMenuOpen, setChipMenuOpen] = useState(false)
  const [richDetailsLoaded, setRichDetailsLoaded] = useState(false)
  const [listCollapsed, setListCollapsed] = useState(false)

  useEffect(() => {
    boundsRef.current = bounds
  }, [bounds])

  useEffect(() => {
    onFocusMapRef.current = onFocusMap
  }, [onFocusMap])

  // Load inspect target immediately via Place API (works even if UI Kit fails).
  useEffect(() => {
    if (!detailsPlaceId || !placesLib) return undefined

    let cancelled = false
    const gen = ++detailsGenRef.current
    queueMicrotask(() => {
      if (cancelled || gen !== detailsGenRef.current) return
      setDetailsLoading(true)
      setRichDetailsLoaded(false)
      setSearchError('')
      setDetailsFallback(null)
    })

    ;(async () => {
      try {
        const card = await fetchPlaceCard(placesLib, detailsPlaceId)
        if (cancelled || gen !== detailsGenRef.current) return
        setDetailsFallback(card)
        if (card) {
          onFocusMapRef.current?.({
            key: `detail-${card.googlePlaceId || card.key}`,
            lat: card.lat,
            lng: card.lng,
            viewport: card.viewport,
            zoom: card.isArea ? 11 : 16,
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

  // Optional rich Place Details UI Kit (reviews) once the sheet host exists.
  useEffect(() => {
    if (!placesLib || !detailsPlaceId || !detailsHostRef.current) return undefined

    let cancelled = false
    const detailsEl = document.createElement('gmp-place-details')
    const detailsRequest = document.createElement(
      'gmp-place-details-place-request',
    )
    detailsRequest.place = detailsPlaceId
    detailsEl.appendChild(detailsRequest)
    appendPlaceContent(detailsEl)
    detailsHostRef.current.replaceChildren(detailsEl)
    detailsRequestRef.current = detailsRequest

    const onDetailsLoad = () => {
      if (!cancelled) setRichDetailsLoaded(true)
    }
    detailsEl.addEventListener('gmp-load', onDetailsLoad)

    return () => {
      cancelled = true
      detailsEl.removeEventListener('gmp-load', onDetailsLoad)
      detailsEl.remove()
      detailsRequestRef.current = null
    }
  }, [placesLib, detailsPlaceId])

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
    setListCollapsed(false)
    onDetailsPlaceId?.(null)
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

      if (cards.length === 0) {
        setSearchError(`No places found for “${text}”.`)
        return
      }

      const primary = cards[0]
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

  function handleAutocompletePick(card) {
    if (!card) return
    setSearchError('')
    setResults([])
    onResultPins?.([])
    if (card.isArea) {
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
    if (card.googlePlaceId) onDetailsPlaceId?.(card.googlePlaceId)
  }

  function clearSearch() {
    searchGenRef.current += 1
    detailsGenRef.current += 1
    setSearchError('')
    setSearching(false)
    setResults([])
    setListCollapsed(false)
    setDetailsFallback(null)
    setDetailsLoading(false)
    onDetailsPlaceId?.(null)
    onResultPins?.([])
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
  const sheetOpen =
    showingDetails ||
    results.length > 0 ||
    searching ||
    detailsLoading ||
    Boolean(searchError)
  // Collapse only hides the results list; details / search status stay open.
  const sheetExpanded =
    showingDetails ||
    searching ||
    detailsLoading ||
    Boolean(searchError) ||
    (results.length > 0 && !listCollapsed)
  const listCollapsible =
    !showingDetails && !searching && !searchError && results.length > 0
  const libReady = Boolean(placesLib?.Place?.searchByText)
  const detailsMapsUrl = googleMapsPlaceUrl(activeDetails)

  useEffect(() => {
    if (showingDetails) {
      setChipMenuOpen(false)
      setListCollapsed(false)
    }
  }, [showingDetails])

  return (
    <aside
      className={cx(
        styles.mapExploreDock,
        sheetExpanded && styles.mapExploreDockFilled,
      )}
      aria-label="Explore places"
    >
      {/* Top chrome stays outside the scrolling sheet. */}
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

        {!showingDetails && (
          <>
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
          </>
        )}
      </div>

      {sheetOpen && listCollapsed && listCollapsible ? (
        <div className={styles.mapExploreCollapsedBar}>
          <button
            type="button"
            className={styles.mapExploreCollapsedBtn}
            onClick={() => setListCollapsed(false)}
            aria-expanded={false}
            aria-label={`Show ${results.length} results`}
          >
            <span>
              {results.length} result{results.length === 1 ? '' : 's'}
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

      {sheetExpanded ? (
        <div
          className={cx(
            styles.mapExploreSheet,
            showingDetails && styles.mapExploreSheetDetails,
          )}
        >
          {searchError ? (
            <p className={styles.mapExploreError} role="alert">
              {searchError}
            </p>
          ) : null}

          <div className={styles.mapExploreBody}>
            <div
              className={cx(
                styles.mapExploreListPane,
                showingDetails && styles.mapExplorePaneHidden,
              )}
            >
              {searching ? (
                <p className={styles.mapExploreHint}>Searching…</p>
              ) : null}
              {!searching && results.length > 0 ? (
                <>
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
                            if (!place.googlePlaceId) return
                            onDetailsPlaceId?.(place.googlePlaceId)
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
                </>
              ) : null}
            </div>

            <div
              className={cx(
                styles.mapExploreDetailsPane,
                !showingDetails && styles.mapExplorePaneHidden,
              )}
            >
              <div className={styles.mapExploreDetailsBar}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onDetailsPlaceId?.(null)
                    setDetailsFallback(null)
                  }}
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  {results.length > 0 ? 'Results' : 'Back'}
                </Button>
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
                    onClick={clearSearch}
                  >
                    <X size={14} aria-hidden="true" />
                  </Button>
                </div>
              </div>

              {detailsLoading ? (
                <p className={styles.mapExploreHint}>Loading place…</p>
              ) : null}

              <div className={styles.mapExploreDetailsScroll}>
                {!detailsLoading && activeDetails && !richDetailsLoaded ? (
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
                        Reviews on Google
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                <div
                  ref={detailsHostRef}
                  className={cx(
                    styles.mapPlaceDetailsHost,
                    !richDetailsLoaded && styles.mapPlaceDetailsHostPending,
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
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
  const qc = useQueryClient()

  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [mapBounds, setMapBounds] = useState(null)
  const [resultPins, setResultPins] = useState([])
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
    setSelectedId(null)
    setDetailsPlaceId(placeId)
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
                (New), and Places UI Kit, then restart the dev server.
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
                  <MapPoiClick onPlaceId={openPlaceDetails} />
                  {resultPins.map((pin) => (
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
                        if (pin.googlePlaceId) openPlaceDetails(pin.googlePlaceId)
                      }}
                    />
                  ))}
                  {ideas.map((idea) => (
                    <Marker
                      key={idea.id}
                      position={{ lat: idea.lat, lng: idea.lng }}
                      title={idea.name}
                      onClick={() => {
                        setDetailsPlaceId(null)
                        setSelectedId(idea.id)
                        setIdeasOpen(true)
                        setSearchFocus(null)
                      }}
                    />
                  ))}
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
            )}
            aria-label="Ideas"
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
                  Places you saved while exploring. Add them to the journey when
                  ready.
                </p>

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
    </div>
  )
}
