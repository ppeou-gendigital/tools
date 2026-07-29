// Normalizers for the user_data `data` blob. Kept in one place so the
// provider setters and PrefsSync agree on what a sane value looks like
// when clamping remote / imported payloads.
//
// This row is shared across sibling tools on the same Supabase project.
// Own only theme/font/fab (plus updatedAt). Pass every other key through
// opaquely so prefs CAS never wipes sibling fields. Crypto salt/verifier
// must NOT live here — use public.vault_meta (see vaultMetaApi.js).

import {
  DEFAULT_AI_CELL,
  DEFAULT_MENU_CELL,
  normalizeAiFabCell,
  normalizeFabCell,
  oppositeFabCell,
} from '@tools/service/fabCell'

const THEMES = ['light', 'dark', 'system']

const FONT_MIN = 12
const FONT_MAX = 24
const FONT_STEP = 2
const FONT_DEFAULT = 16

const DEFAULTS = {
  theme: 'system',
  fontSize: FONT_DEFAULT,
  fabCorner: DEFAULT_MENU_CELL,
  aiFabCorner: DEFAULT_AI_CELL,
}

/** Keys this tool normalizes and may rewrite on the shared prefs blob. */
export const PREFS_OWNED_KEYS = new Set([
  'theme',
  'fontSize',
  'fabCorner',
  'aiFabCorner',
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

/** FAB cell token ("col:row" in XL space) or legacy corner → XL cell. */
export function normalizeFabCorner(v) {
  return normalizeFabCell(v)
}

/** Horizontal opposite in XL space — keeps FABs from stacking on migrate. */
export function oppositeFabCorner(corner) {
  return oppositeFabCell(normalizeFabCell(corner))
}

/** AI FAB cell; missing/invalid → opposite of menu; never equal to menu. */
export function normalizeAiFabCorner(v, menuCorner) {
  return normalizeAiFabCell(v, menuCorner)
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

// Sanitize a (possibly untrusted / partial) remote prefs blob before
// applying it via the provider setters. Clamps owned keys; preserves
// sibling-tool keys opaquely.
export function normalizeRemotePrefs(remote) {
  const fabCorner = normalizeFabCell(remote?.fabCorner)
  return {
    ...extractForeignPrefs(remote),
    theme: normalizeTheme(remote?.theme),
    fontSize: normalizeFontSize(remote?.fontSize),
    fabCorner,
    aiFabCorner: normalizeAiFabCell(remote?.aiFabCorner, fabCorner),
  }
}
