// Normalizers for local UI prefs (theme, font size, FAB corners).

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
