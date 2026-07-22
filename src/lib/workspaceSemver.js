// Workspace sync semver (lockbox lifecycle). Separate from document schema
// `version: 1` on the workspace JSON.
//
// Rules:
//   0.0.0          — fresh / unset
//   0.0.1          — Napkin Notes seeded (or existing cloud content migrated)
//   bump minor     — add or delete lockbox
//   bump patch     — update existing lockbox meta/passphrase
//   -1             — intentional full wipe sentinel

export const SEMVER_FRESH = '0.0.0'
export const SEMVER_SEEDED = '0.0.1'
export const SEMVER_WIPE = '-1'

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)$/

export function isWipeSemver(v) {
  return String(v ?? '').trim() === SEMVER_WIPE
}

export function parseSemver(v) {
  if (isWipeSemver(v)) return null
  const m = SEMVER_RE.exec(String(v ?? '').trim())
  if (!m) return null
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
  }
}

export function formatSemver({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`
}

/** Missing / invalid → 0.0.0. Wipe sentinel stays "-1". */
export function normalizeSemver(v) {
  if (isWipeSemver(v)) return SEMVER_WIPE
  const parsed = parseSemver(v)
  if (!parsed) return SEMVER_FRESH
  return formatSemver(parsed)
}

/**
 * Compare two semvers.
 * Returns negative if a < b, 0 if equal, positive if a > b.
 * Wipe (-1) compares as less than any normal semver.
 */
export function compareSemver(a, b) {
  const na = normalizeSemver(a)
  const nb = normalizeSemver(b)
  if (na === nb) return 0
  if (isWipeSemver(na)) return -1
  if (isWipeSemver(nb)) return 1
  const pa = parseSemver(na)
  const pb = parseSemver(nb)
  if (pa.major !== pb.major) return pa.major - pb.major
  if (pa.minor !== pb.minor) return pa.minor - pb.minor
  return pa.patch - pb.patch
}

export function bumpMinor(v) {
  const parsed = parseSemver(normalizeSemver(v)) ?? { major: 0, minor: 0, patch: 0 }
  return formatSemver({
    major: parsed.major,
    minor: parsed.minor + 1,
    patch: 0,
  })
}

export function bumpPatch(v) {
  const parsed = parseSemver(normalizeSemver(v)) ?? { major: 0, minor: 0, patch: 0 }
  return formatSemver({
    major: parsed.major,
    minor: parsed.minor,
    patch: parsed.patch + 1,
  })
}
