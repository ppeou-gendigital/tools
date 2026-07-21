// Normalizers for the user_data `data` blob. Kept in one place so the
// provider setters and PrefsSync agree on what a sane value looks like
// when clamping remote / imported payloads.

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

// Sanitize a (possibly untrusted / partial) remote prefs blob before
// applying it via the provider setters. Drops unknown keys and clamps bad
// values.
export function normalizeRemotePrefs(remote) {
  return {
    theme: normalizeTheme(remote?.theme),
    fontSize: normalizeFontSize(remote?.fontSize),
    fabCorner: normalizeFabCorner(remote?.fabCorner),
  }
}

// Optional plaintext reminder shown on the unlock screen. Never used
// for crypto — keep it short and never put the passphrase itself here.
export const PASSPHRASE_HINT_MAX_LENGTH = 80

export function normalizePassphraseHint(v) {
  if (typeof v !== 'string') return null
  const trimmed = v.trim().replace(/\s+/g, ' ')
  if (!trimmed) return null
  return trimmed.slice(0, PASSPHRASE_HINT_MAX_LENGTH)
}

// Extract the vault meta subtree from a `user_data.data` blob. Kept
// separate from normalizeRemotePrefs so a vault write never has to
// re-run the prefs normalizer, and vice versa. Returns null when no
// vault has been set up yet.
export function extractVaultMeta(data) {
  const vault = data?.vault
  if (!vault) return null
  const { salt, iterations, verifier } = vault
  if (typeof salt !== 'string' || typeof iterations !== 'number') return null
  if (!verifier || typeof verifier.ciphertext !== 'string' || typeof verifier.iv !== 'string') {
    return null
  }
  const hint = normalizePassphraseHint(vault.hint)
  return hint
    ? { salt, iterations, verifier, hint }
    : { salt, iterations, verifier }
}

// Merge a fresh prefs blob into the existing `user_data.data`, keeping
// any keys we don't own (currently: `vault`). Used by PrefsSync so
// writing a theme change doesn't clobber the vault metadata.
export function mergePrefsIntoData(existingData, nextPrefs) {
  return {
    ...(existingData ?? {}),
    theme: nextPrefs.theme,
    fontSize: nextPrefs.fontSize,
    fabCorner: nextPrefs.fabCorner,
    updatedAt: nextPrefs.updatedAt ?? new Date().toISOString(),
  }
}
