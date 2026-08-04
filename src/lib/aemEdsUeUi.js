// Per-site UI form state for AEM EDS-UE slides (search + tree collapse).
// Synced to localStorage for a synchronous first paint (same pattern as
// loopy.lastRoute). Kind is stored separately on the site catalog.
// Deck scroll position is a separate key (per Author host).

export const AEM_EDS_UE_UI_KEY = 'loopy.aemEdsUeUi'
/** `{ [authorHost]: sitePath | '__domain' }` */
export const AEM_EDS_UE_DECK_KEY = 'loopy.aemEdsUeDeck'

export const EDS_UE_DOMAIN_SLIDE = '__domain'

function safeParse(raw) {
  if (!raw || typeof raw !== 'string') return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch {
    return {}
  }
}

function readAll() {
  try {
    return safeParse(globalThis.localStorage?.getItem(AEM_EDS_UE_UI_KEY))
  } catch {
    return {}
  }
}

function writeAll(next) {
  try {
    globalThis.localStorage?.setItem(AEM_EDS_UE_UI_KEY, JSON.stringify(next))
  } catch {
    // ignore quota / private-mode errors
  }
}

/** Stable key for one Author host + site path. */
export function edsUeUiSiteKey(authorHost, sitePath) {
  const host = String(authorHost || '')
    .trim()
    .toLowerCase()
  const path = String(sitePath || '').trim()
  if (!host || !path) return null
  return `${host}::${path}`
}

/**
 * @returns {{ query: string, collapsed: string[] }}
 */
export function readEdsUeUi(siteKey) {
  if (!siteKey) return { query: '', collapsed: [] }
  const entry = readAll()[siteKey]
  if (!entry || typeof entry !== 'object') return { query: '', collapsed: [] }
  const query = typeof entry.query === 'string' ? entry.query : ''
  const collapsed = Array.isArray(entry.collapsed)
    ? entry.collapsed.filter((p) => typeof p === 'string' && p)
    : []
  return { query, collapsed }
}

export function writeEdsUeUi(siteKey, { query, collapsed }) {
  if (!siteKey) return
  const all = readAll()
  const nextQuery = typeof query === 'string' ? query : ''
  const nextCollapsed = Array.isArray(collapsed)
    ? collapsed.filter((p) => typeof p === 'string' && p)
    : []
  // Drop empty entries so the blob stays small.
  if (!nextQuery && nextCollapsed.length === 0) {
    if (!(siteKey in all)) return
    delete all[siteKey]
    writeAll(all)
    return
  }
  all[siteKey] = { query: nextQuery, collapsed: nextCollapsed }
  writeAll(all)
}

function normalizeHost(authorHost) {
  return String(authorHost || '')
    .trim()
    .toLowerCase()
}

function readDeckAll() {
  try {
    return safeParse(globalThis.localStorage?.getItem(AEM_EDS_UE_DECK_KEY))
  } catch {
    return {}
  }
}

function writeDeckAll(next) {
  try {
    globalThis.localStorage?.setItem(AEM_EDS_UE_DECK_KEY, JSON.stringify(next))
  } catch {
    // ignore quota / private-mode errors
  }
}

/**
 * Last focused deck slide for an Author host.
 * @returns {string|null} site path, `__domain`, or null if unset
 */
export function readEdsUeDeckSlide(authorHost) {
  const host = normalizeHost(authorHost)
  if (!host) return null
  const raw = readDeckAll()[host]
  return typeof raw === 'string' && raw ? raw : null
}

/** Persist which slide was snapped into view. */
export function writeEdsUeDeckSlide(authorHost, slideKey) {
  const host = normalizeHost(authorHost)
  const key = typeof slideKey === 'string' ? slideKey.trim() : ''
  if (!host || !key) return
  const all = readDeckAll()
  if (all[host] === key) return
  all[host] = key
  writeDeckAll(all)
}

/**
 * Pick the slide closest to the deck's left edge (scroll-snap start).
 * @param {HTMLElement|null} deck
 * @returns {string|null}
 */
export function activeSlideKeyFromDeck(deck) {
  if (!deck) return null
  const slides = deck.querySelectorAll('[data-eds-slide]')
  if (!slides.length) return null
  const left = deck.scrollLeft
  let bestKey = null
  let bestDist = Infinity
  for (const slide of slides) {
    const key = slide.getAttribute('data-eds-slide')
    if (!key) continue
    const dist = Math.abs(slide.offsetLeft - left)
    if (dist < bestDist) {
      bestDist = dist
      bestKey = key
    }
  }
  return bestKey
}

/**
 * Scroll a deck to the slide with `data-eds-slide`, if present.
 * @returns {boolean} whether a matching slide was found
 */
export function scrollDeckToSlide(deck, slideKey) {
  if (!deck || !slideKey) return false
  const slide = deck.querySelector(
    `[data-eds-slide="${CSS.escape(slideKey)}"]`,
  )
  if (!(slide instanceof HTMLElement)) return false
  // Prefer assigning scrollLeft so we don't drag the whole popup vertically.
  deck.scrollLeft = slide.offsetLeft
  return true
}
