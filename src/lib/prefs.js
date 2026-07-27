// Normalizers for the user_data `data` blob. Kept in one place so the
// provider setters and PrefsSync agree on what a sane value looks like
// when clamping remote / imported payloads.
//
// This row is shared across sibling tools on the same Supabase project.
// Own only theme/font/fab (plus updatedAt). Pass every other key through
// opaquely so prefs CAS never wipes sibling fields. Crypto salt/verifier
// must NOT live here — use public.vault_meta (see vaultMetaApi.js).

const THEMES = ['light', 'dark', 'system', 'daynight']
const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const MAPS_PROVIDERS = ['google', 'apple']

const FONT_MIN = 12
const FONT_MAX = 24
const FONT_STEP = 2
const FONT_DEFAULT = 16

const DEFAULTS = {
  theme: 'daynight',
  fontSize: FONT_DEFAULT,
  fabCorner: 'bottom-right',
  aiFabCorner: 'bottom-left',
  displayLocale: null,
  defaultCurrency: null,
  mapsProvider: 'google',
  prefsConfirmed: false,
}

/** Keys this tool normalizes and may rewrite on the shared prefs blob. */
export const PREFS_OWNED_KEYS = new Set([
  'theme',
  'fontSize',
  'fabCorner',
  'aiFabCorner',
  'displayLocale',
  'defaultCurrency',
  'mapsProvider',
  'prefsConfirmed',
  'updatedAt',
])

/** Opaque sibling-tool fields — never validate or drop. */
export function extractForeignPrefs(remote) {
  if (!remote || typeof remote !== 'object' || Array.isArray(remote)) {
    return {}
  }
  const foreign = {}
  for (const [key, value] of Object.entries(remote)) {
    if (!PREFS_OWNED_KEYS.has(key) && value !== undefined) {
      foreign[key] = value
    }
  }
  return foreign
}

export function normalizeTheme(v) {
  return THEMES.includes(v) ? v : DEFAULTS.theme
}

export function normalizeFabCorner(v) {
  return CORNERS.includes(v) ? v : DEFAULTS.fabCorner
}

/** Horizontal opposite — keeps FABs from stacking on first migrate. */
export function oppositeFabCorner(corner) {
  const c = normalizeFabCorner(corner)
  if (c === 'top-left') return 'top-right'
  if (c === 'top-right') return 'top-left'
  if (c === 'bottom-left') return 'bottom-right'
  return 'bottom-left'
}

/** AI FAB corner; missing/invalid → opposite of menu; never equal to menu. */
export function normalizeAiFabCorner(v, menuCorner) {
  const menu = normalizeFabCorner(menuCorner)
  if (CORNERS.includes(v) && v !== menu) return v
  return oppositeFabCorner(menu)
}

// Snap to the FONT_STEP grid inside [MIN, MAX] and rescue any stale
// odd-numbered values from earlier builds.
export function normalizeFontSize(v) {
  const n = typeof v === 'number' ? v : Number.parseInt(v, 10)
  if (!Number.isFinite(n)) return DEFAULTS.fontSize
  const clamped = Math.min(FONT_MAX, Math.max(FONT_MIN, n))
  const snapped =
    FONT_MIN + Math.round((clamped - FONT_MIN) / FONT_STEP) * FONT_STEP
  return Math.min(FONT_MAX, Math.max(FONT_MIN, snapped))
}

export function normalizeDisplayLocale(v) {
  if (typeof v !== 'string' || !v.trim()) return DEFAULTS.displayLocale
  return v.trim()
}

export function normalizeDefaultCurrency(v) {
  if (typeof v !== 'string') return DEFAULTS.defaultCurrency
  const c = v.trim().toUpperCase()
  return /^[A-Z]{3}$/.test(c) ? c : DEFAULTS.defaultCurrency
}

export function normalizeMapsProvider(v) {
  return MAPS_PROVIDERS.includes(v) ? v : DEFAULTS.mapsProvider
}

export function normalizePrefsConfirmed(v) {
  return v === true
}

// Sanitize a (possibly untrusted / partial) remote prefs blob before
// applying it via the provider setters. Clamps owned keys; preserves
// sibling-tool keys opaquely.
export function normalizeRemotePrefs(remote) {
  const fabCorner = normalizeFabCorner(remote?.fabCorner)
  return {
    ...extractForeignPrefs(remote),
    theme: normalizeTheme(remote?.theme),
    fontSize: normalizeFontSize(remote?.fontSize),
    fabCorner,
    aiFabCorner: normalizeAiFabCorner(remote?.aiFabCorner, fabCorner),
    displayLocale: normalizeDisplayLocale(remote?.displayLocale),
    defaultCurrency: normalizeDefaultCurrency(remote?.defaultCurrency),
    mapsProvider: normalizeMapsProvider(remote?.mapsProvider),
    prefsConfirmed: normalizePrefsConfirmed(remote?.prefsConfirmed),
  }
}
