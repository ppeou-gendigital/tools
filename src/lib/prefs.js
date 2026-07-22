// Normalizers for the user_data `data` blob. Kept in one place so the
// provider setters and PrefsSync agree on what a sane value looks like
// when clamping remote / imported payloads.

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
// applying it via the provider setters. Drops unknown keys and clamps bad
// values. Preserves `workspace` when present.
export function normalizeRemotePrefs(remote) {
  const prefs = {
    theme: normalizeTheme(remote?.theme),
    fontSize: normalizeFontSize(remote?.fontSize),
    fabCorner: normalizeFabCorner(remote?.fabCorner),
  }
  if (remote?.workspace != null) {
    prefs.workspace = normalizeRemoteWorkspace(remote.workspace)
  }
  return prefs
}
