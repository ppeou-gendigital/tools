// Normalizers for the user_data `data` blob. Kept in one place so the
// provider setters and PrefsSync agree on what a sane value looks like
// when clamping remote / imported payloads.
//
// This row is shared with sibling tools (Accesso / Loopy). Notas owns a
// small set of keys; everything else (e.g. Accesso's `vault`) is passed
// through opaquely so prefs CAS never wipes sibling crypto meta.

import { normalizeWorkspace } from '@/lib/workspaceModel'

const THEMES = ['light', 'dark', 'system']
const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

const FONT_MIN = 12
const FONT_MAX = 24
const FONT_STEP = 2
const FONT_DEFAULT = 16

const DEFAULTS = {
  theme: 'system',
  fontSize: FONT_DEFAULT,
  fabCorner: 'bottom-right',
}

/** Keys Notas normalizes and may rewrite on the shared prefs blob. */
export const PREFS_OWNED_KEYS = new Set([
  'theme',
  'fontSize',
  'fabCorner',
  'workspace',
  'updatedAt',
])

/** Opaque sibling-tool fields (e.g. Accesso `vault`) — never validate. */
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

/** Normalize workspace blob for user_data; returns null if absent/invalid. */
export function normalizeRemoteWorkspace(remote) {
  if (remote == null) return null
  return normalizeWorkspace(remote)
}

// Sanitize a (possibly untrusted / partial) remote prefs blob before
// applying it via the provider setters. Clamps owned keys; preserves
// sibling-tool keys opaquely; preserves `workspace` when present.
export function normalizeRemotePrefs(remote) {
  const prefs = {
    ...extractForeignPrefs(remote),
    theme: normalizeTheme(remote?.theme),
    fontSize: normalizeFontSize(remote?.fontSize),
    fabCorner: normalizeFabCorner(remote?.fabCorner),
  }
  if (remote?.workspace != null) {
    prefs.workspace = normalizeRemoteWorkspace(remote.workspace)
  }
  return prefs
}
