// Normalizers for the user_data `data` blob. Kept in one place so the
// provider setters and PrefsSync agree on what a sane value looks like
// when clamping remote / imported payloads.
//
// This row is shared across sibling tools on the same Supabase project.
// Own only theme/font/fab (plus updatedAt). Pass every other key through
// opaquely so prefs CAS never wipes sibling fields. Crypto salt/verifier
// live in public.vault_meta (see vaultMetaApi.js), not here.

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

/** Keys this tool normalizes and may rewrite on the shared prefs blob. */
export const PREFS_OWNED_KEYS = new Set([
  'theme',
  'fontSize',
  'fabCorner',
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
// sibling-tool keys opaquely (including legacy `vault` if still present).
export function normalizeRemotePrefs(remote) {
  return {
    ...extractForeignPrefs(remote),
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

// Legacy: vault meta used to ride on user_data.data.vault. Accesso now
// stores salt/verifier in public.vault_meta (see vaultMetaApi.js). Kept
// only for one-off debugging of old cached blobs.
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
// any sibling keys. Theme writes must never invent vault meta.
export function mergePrefsIntoData(existingData, nextPrefs) {
  return {
    ...(existingData ?? {}),
    theme: nextPrefs.theme,
    fontSize: nextPrefs.fontSize,
    fabCorner: nextPrefs.fabCorner,
    updatedAt: nextPrefs.updatedAt ?? new Date().toISOString(),
  }
}
