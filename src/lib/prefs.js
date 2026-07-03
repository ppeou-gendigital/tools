// Normalizers for the user_data pref fields. Kept in one place so the
// provider setters and PrefsSync agree on what a sane value looks like when
// clamping remote / imported payloads.

const THEMES = ['light', 'dark', 'system']
const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

const FONT_MIN = 12
const FONT_MAX = 24
const FONT_STEP = 2
const FONT_DEFAULT = 16

// AEM Jump domain enums. Kept together so Settings selects, the block
// header chips, and the normalizer all agree on the allowed values.
export const AEM_KINDS = ['traditional', 'cloud', 'eds-da', 'eds-ue', 'local-sdk']
export const AEM_ROLES = [
  'author',
  'publisher',
  'dispatcher',
  'web-origin',
  'vanity',
]
export const AEM_ENVS = ['local', 'dev', 'qa', 'stage', 'prod']

const AEM_KIND_DEFAULT = 'traditional'
const AEM_ROLE_DEFAULT = 'author'
const AEM_ENV_DEFAULT = 'qa'
const AEM_REF_DEFAULT = 'main'

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

// Kind-based capability probes. Iteration 1 only actually renders
// trad/cloud, but the discriminated union is validated for every kind so
// EDS entries survive a save/load round-trip untouched.
export function kindHasOrigin(kind) {
  return kind === 'traditional' || kind === 'cloud'
}

export function kindHasRepo(kind) {
  return kind === 'eds-da' || kind === 'eds-ue'
}

// Local AEM SDK: a `localhost`-style Cloud author that runs traditional-style
// paths (no `/ui#/aem/` shell). Carries the eds-ue link inline so a pasted
// SDK URL can produce a Universal Editor jump back to the Cloud author host.
export function kindHasLocalSdk(kind) {
  return kind === 'local-sdk'
}

// The origin an AemJumpBlock should rebase the source URL onto for a given
// domain. Different kinds store this address under different keys:
//   - traditional / cloud / local-sdk -> `origin`
//   - eds-ue                          -> `authorOrigin` (the Cloud author
//                                        hosting the UE SPA + Sites shell)
//   - eds-da                          -> null (no jump-block support yet)
export function getRebaseOrigin(domain) {
  if (!domain) return null
  if (kindHasOrigin(domain.kind) || kindHasLocalSdk(domain.kind)) {
    return domain.origin || null
  }
  if (domain.kind === 'eds-ue') return domain.authorOrigin || null
  return null
}

function safeString(v, fallback = '') {
  return typeof v === 'string' ? v : fallback
}

// Preserve whatever the user typed (empty OK; partial "https:/" OK) so
// mid-typing in Settings doesn't get its entry dropped by the normalizer.
// If the value is a syntactically-valid absolute URL we canonicalize it
// to `.origin`; otherwise we return the raw trimmed string. Downstream
// (`isDomainRenderable`) is responsible for deciding whether the entry
// is actually usable.
function normalizeOrigin(v) {
  if (typeof v !== 'string') return ''
  const trimmed = v.trim()
  if (!trimmed) return ''
  try {
    return new URL(trimmed).origin
  } catch {
    return trimmed
  }
}

function genId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  // Non-secure fallback for environments without crypto.randomUUID —
  // fine here because these ids only need to be unique per user.
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

function pickEnum(v, allowed, fallback) {
  return allowed.includes(v) ? v : fallback
}

// Normalize a single AEM domain entry. Returns null only when the shape
// is unrecoverable (non-object, or missing an `id`-derivable field). Any
// partial per-kind field values are preserved as-is so a half-filled
// Settings row survives a save/reload cycle; consumers use
// `isDomainRenderable` to decide whether to actually render.
function normalizeDomainEntry(raw) {
  if (!raw || typeof raw !== 'object') return null

  const kind = pickEnum(raw.kind, AEM_KINDS, AEM_KIND_DEFAULT)
  const role = pickEnum(raw.role, AEM_ROLES, AEM_ROLE_DEFAULT)
  const env = pickEnum(raw.env, AEM_ENVS, AEM_ENV_DEFAULT)
  const id = safeString(raw.id) || genId()
  const label = safeString(raw.label)
  // Default true: only the literal `false` hides the entry. Any missing /
  // legacy / truthy value round-trips as visible so existing user rows
  // stay visible after this field lands.
  const visible = raw.visible !== false

  if (kindHasOrigin(kind)) {
    return {
      id,
      kind,
      role,
      env,
      label,
      visible,
      origin: normalizeOrigin(raw.origin),
    }
  }

  if (kindHasLocalSdk(kind)) {
    return {
      id,
      kind,
      role,
      env,
      label,
      visible,
      origin: normalizeOrigin(raw.origin),
      // Same lower-cased match key as the eds-ue kind, so the block can
      // pair localhost:4502 and localhost:14502 rows by `siteName`.
      siteName: safeString(raw.siteName).trim().toLowerCase(),
      imsOrg: safeString(raw.imsOrg).trim(),
      authorOrigin: normalizeOrigin(raw.authorOrigin),
    }
  }

  if (kindHasRepo(kind)) {
    const owner = safeString(raw.owner).trim()
    const repo = safeString(raw.repo).trim()
    const ref = safeString(raw.ref).trim() || AEM_REF_DEFAULT
    if (kind === 'eds-ue') {
      return {
        id,
        kind,
        role,
        env,
        label,
        visible,
        owner,
        repo,
        ref,
        authorOrigin: normalizeOrigin(raw.authorOrigin),
        // Site name matches the first segment under `/content/`, e.g.
        // `lifelock-eds-ue`. Lower-cased so a case-insensitive URL match
        // (Cloud is case-sensitive but users type inconsistently) works.
        siteName: safeString(raw.siteName).trim().toLowerCase(),
        // Adobe IMS org shortname, the `@symantec` slug that shows up in
        // Universal Editor URLs.
        imsOrg: safeString(raw.imsOrg).trim(),
      }
    }
    return { id, kind, role, env, label, visible, owner, repo, ref }
  }

  return null
}

export function normalizeAemDomains(list) {
  if (!Array.isArray(list)) return []
  const out = []
  const seenIds = new Set()
  for (const raw of list) {
    const entry = normalizeDomainEntry(raw)
    if (!entry) continue
    // De-dupe ids in case a malformed payload repeats them; give the
    // duplicate a fresh id rather than dropping the entry outright.
    if (seenIds.has(entry.id)) entry.id = genId()
    seenIds.add(entry.id)
    out.push(entry)
  }
  return out
}

function isParseableUrl(v) {
  if (typeof v !== 'string' || !v) return false
  try {
    new URL(v)
    return true
  } catch {
    return false
  }
}

// Answer "does this entry have enough filled in to render its jump block?"
// Used by the AEM Jump page to skip drafts (mid-typing origins, empty
// repo names, etc.) while still letting Settings display those drafts.
// Keep in sync with the Settings validator.
export function isDomainRenderable(entry) {
  if (!entry || typeof entry !== 'object') return false
  if (kindHasOrigin(entry.kind)) return isParseableUrl(entry.origin)
  if (kindHasLocalSdk(entry.kind)) {
    if (!isParseableUrl(entry.origin)) return false
    if (!isParseableUrl(entry.authorOrigin)) return false
    // siteName + imsOrg carry the UE flag; without them the SDK entry
    // can't produce a Universal Editor jump.
    if (!entry.siteName || !entry.imsOrg) return false
    return true
  }
  if (kindHasRepo(entry.kind)) {
    if (!entry.owner || !entry.repo) return false
    if (entry.kind === 'eds-ue') {
      if (!isParseableUrl(entry.authorOrigin)) return false
      // siteName + imsOrg are the flag that makes the UE link resolvable.
      // Without them the entry is a draft and the Jump page skips it.
      if (!entry.siteName || !entry.imsOrg) return false
    }
    return true
  }
  return false
}

// Sanitize a (possibly untrusted / partial) remote prefs blob before
// applying it via the provider setters. Drops unknown keys and clamps bad
// values.
//
// Only the `data` column shape is normalized here. The AEM domain list
// lives in its own `aem_domains` column on `user_data` and is handled by
// `normalizeAemDomains` directly.
export function normalizeRemotePrefs(remote) {
  return {
    theme: normalizeTheme(remote?.theme),
    fontSize: normalizeFontSize(remote?.fontSize),
    fabCorner: normalizeFabCorner(remote?.fabCorner),
  }
}
