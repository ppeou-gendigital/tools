// Pure helpers for the "tracked hostnames" capture list. Shared by:
//   - background.js               (service worker: on tab navigation)
//   - TrackedHostnamesProvider    (React: read from storage, expose to UI)
//   - PrefsSync                   (React: mirror to Supabase)
//   - TrackedHosts page           (React: CRUD editor + live preview)
//
// This is the sole decision engine for whether a tab visit is recorded
// into user_visits. The AEM domain list is not consulted for capture —
// it stays exclusively for the AEM Jump feature.
//
// Data model — a JSONB object keyed by the pattern (canonicalized,
// lowercased):
//
//   hosts = {
//     "*.norton.*":    { id: "h_abc", mode: "include" },
//     "ping.norton.*": { id: "h_def", mode: "exclude" },
//   }
//
// Rationale for keying by pattern (mirrors the paths refactor):
//   - Duplicate patterns become impossible by construction.
//   - Cross-device merge collapses to `{ ...remote, ...local }` if we
//     ever add CAS-style merging to user_data (today it's LWW).
//   - Same pattern with both include and exclude modes is contradictory
//     ("always skip") and now blocked at the storage level rather than
//     relying on normalizer discipline.
//
// The `id` field survives inside each value because
// `user_visits.paths[*].matchedDomainId` references it. Editing a
// pattern in the UI keeps the same `id` so previously-captured visits
// stay linked to the (renamed) rule.
//
// Match semantics: a hostname is captured when it matches at least one
// `include` and no `exclude`. Patterns are simple globs anchored to the
// full hostname, case-insensitive, with `*` matching one or more
// non-`.` characters (i.e. one DNS label). No support yet for `**` or
// regex; single-`*` covers the current use case.

export const TRACKED_MODES = ['include', 'exclude']
const MODE_DEFAULT = 'include'

// Chars we accept in a hostname pattern. Everything else is rejected by
// the normalizer — keeps arbitrary regex meta-characters out of the
// glob-to-regex compiler.
const PATTERN_ALLOWED_CHARS = /^[a-z0-9.\-*]+$/

function safeString(v) {
  return typeof v === 'string' ? v : ''
}

function genId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  return `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

// Turn whatever the user typed into a bare-hostname pattern. Accepts:
//   'https://foo.com/bar'  -> 'foo.com'
//   'FOO.com:8080'         -> 'foo.com'
//   '  *.norton.* '        -> '*.norton.*'
// Returns '' when the input can't be salvaged.
export function canonicalizePattern(raw) {
  let s = safeString(raw).trim().toLowerCase()
  if (!s) return ''
  // Strip scheme (http/https/etc.).
  s = s.replace(/^[a-z][a-z0-9+\-.]*:\/\//, '')
  // Strip everything from the first '/', '?' or '#' (path/query/fragment).
  s = s.replace(/[/?#].*$/, '')
  // Strip port.
  s = s.replace(/:\d+$/, '')
  // Trim any leading/trailing dots — those never carry meaning.
  s = s.replace(/^\.+|\.+$/g, '')
  return s
}

// Reject empty patterns, all-wildcard patterns, and anything containing
// characters we won't compile safely.
export function isValidPattern(pattern) {
  if (!pattern) return false
  if (!PATTERN_ALLOWED_CHARS.test(pattern)) return false
  // Require at least one non-`*` label char so patterns like `*.*`
  // (which would match literally every hostname) don't sneak in.
  if (!/[a-z0-9\-]/.test(pattern.replace(/\*/g, ''))) return false
  return true
}

// Coerce a single raw entry into { id, pattern, mode } shape, or null
// if unrecoverable. Preserves the id when it's a plausible string so
// server round-trips don't rewrite ids and break references from
// user_visits.paths[*].matchedDomainId.
function normalizeEntry(raw) {
  if (!raw || typeof raw !== 'object') return null
  const pattern = canonicalizePattern(raw.pattern)
  if (!isValidPattern(pattern)) return null
  const mode = TRACKED_MODES.includes(raw.mode) ? raw.mode : MODE_DEFAULT
  const rawId = safeString(raw.id).trim()
  const id = rawId || genId()
  return { id, pattern, mode }
}

// Accepts either the current object shape ({ [pattern]: { id, mode } })
// or the legacy array shape ([{ id, pattern, mode }]) — normalizer
// converges both to the object shape. Loose input parsing keeps the
// server column and chrome.storage.local safe when either side was
// written under the older shape.
export function normalizeTrackedHostnames(raw) {
  const out = {}
  const seenIds = new Set()

  const pushEntry = (entry) => {
    if (!entry) return
    // Pattern collision: keep the first occurrence. This matches how
    // JSON parsing handles duplicate keys and mirrors the paths merge
    // semantics — the first writer wins so ids stay stable across
    // repeated normalization passes.
    if (out[entry.pattern]) return
    // Guard against payloads that repeat ids (either legitimately or
    // via a bad import). Preserve the entry with a fresh id rather
    // than dropping it.
    if (seenIds.has(entry.id)) entry.id = genId()
    seenIds.add(entry.id)
    out[entry.pattern] = { id: entry.id, mode: entry.mode }
  }

  if (Array.isArray(raw)) {
    for (const item of raw) {
      pushEntry(normalizeEntry(item))
    }
    return out
  }

  if (raw && typeof raw === 'object') {
    for (const [key, value] of Object.entries(raw)) {
      // `key` is the pattern; merge with the value's optional pattern
      // field so tools that write { id, pattern, mode } as the value
      // (e.g. a bad migration script) still round-trip cleanly.
      const merged =
        value && typeof value === 'object'
          ? { ...value, pattern: value.pattern ?? key }
          : { pattern: key }
      pushEntry(normalizeEntry(merged))
    }
    return out
  }

  return out
}

// Convert an object-shaped hosts store into a list of {id, pattern,
// mode} entries for the editor / iterators that want ordered rows.
// Order is object-insertion order (stable in modern engines).
export function hostsToEntries(hosts) {
  if (!hosts || typeof hosts !== 'object') return []
  return Object.entries(hosts).map(([pattern, value]) => ({
    id: safeString(value?.id) || genId(),
    pattern,
    mode: TRACKED_MODES.includes(value?.mode) ? value.mode : MODE_DEFAULT,
  }))
}

// Convert a list of {id, pattern, mode} entries into the object store,
// skipping rows whose pattern doesn't normalize to a valid pattern.
// Used by the editor to fold local draft rows back into the persistable
// object shape.
export function entriesToHosts(entries) {
  return normalizeTrackedHostnames(entries)
}

// Deterministic stringify for the object store so equality checks and
// change detection don't fire on pure key-order noise (e.g. after a
// JSONB round-trip that may reorder keys).
export function stableHostsKey(hosts) {
  if (!hosts || typeof hosts !== 'object') return '{}'
  const keys = Object.keys(hosts).sort()
  const sorted = {}
  for (const k of keys) {
    const v = hosts[k]
    if (!v || typeof v !== 'object') continue
    sorted[k] = { id: v.id, mode: v.mode }
  }
  return JSON.stringify(sorted)
}

// Convert a validated glob pattern into an anchored, case-insensitive
// RegExp. Escapes every regex metachar, then rewrites `*` to `[^.]+`
// (one or more non-dot chars = one DNS label, greedy within the label).
export function patternToRegex(pattern) {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[^.]+')
  return new RegExp(`^${escaped}$`, 'i')
}

// Precompile a rule set. Callers cache the result across many tab
// events; only rebuild when the underlying object changes. Accepts the
// object store directly.
export function compileRules(hosts) {
  const includes = []
  const excludes = []
  const byId = new Map()
  const entries = hostsToEntries(hosts)
  for (const entry of entries) {
    let re
    try {
      re = patternToRegex(entry.pattern)
    } catch {
      continue
    }
    const compiled = { id: entry.id, pattern: entry.pattern, mode: entry.mode, re }
    byId.set(entry.id, compiled)
    if (entry.mode === 'exclude') excludes.push(compiled)
    else includes.push(compiled)
  }
  return { includes, excludes, byId }
}

// Test a single hostname against a compiled rule set. Returns the
// include entry that matched (so callers can stamp its id onto the
// visit record) or null when the hostname is skipped.
export function testHostname(hostname, compiled) {
  if (typeof hostname !== 'string' || !hostname) return null
  const host = hostname.toLowerCase()
  if (!compiled) return null
  const { includes, excludes } = compiled
  if (!includes || includes.length === 0) return null
  const matchedInclude = includes.find((r) => r.re.test(host))
  if (!matchedInclude) return null
  if (excludes?.some((r) => r.re.test(host))) return null
  return matchedInclude
}

// Given a URL string and a compiled rule set, return the tab-shaped
// facts we want to persist, or null if the tab isn't trackable:
//   - non-http(s)      -> null (chrome://, about:, file:, …)
//   - unparseable      -> null
//   - hostname skipped -> null (no include hit, or excluded)
//
// Fragment is stripped: fragments are UI state (editor panel, scroll
// target) and would spam the list with near-duplicates.
export function matchTabToTrackedHost(rawUrl, compiled) {
  if (typeof rawUrl !== 'string' || !rawUrl) return null
  if (!/^https?:\/\//i.test(rawUrl)) return null
  let url
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }
  const hostname = url.hostname.toLowerCase()
  const hit = testHostname(hostname, compiled)
  if (!hit) return null
  const path = `${url.pathname}${url.search}`
  return { hostname, path, matchedDomainId: hit.id }
}

// Convenience for the Test box in the editor UI: describe exactly why
// a hostname was accepted or rejected. Not used by the SW capture
// path.
export function explainMatch(hostname, compiled) {
  if (typeof hostname !== 'string' || !hostname) {
    return { captured: false, reason: 'empty-hostname', includes: [], excludes: [] }
  }
  const host = hostname.toLowerCase()
  const matchedIncludes = (compiled?.includes ?? []).filter((r) => r.re.test(host))
  const matchedExcludes = (compiled?.excludes ?? []).filter((r) => r.re.test(host))
  const captured = matchedIncludes.length > 0 && matchedExcludes.length === 0
  let reason
  if (matchedIncludes.length === 0) reason = 'no-include-match'
  else if (matchedExcludes.length > 0) reason = 'excluded'
  else reason = 'included'
  return {
    captured,
    reason,
    includes: matchedIncludes.map((r) => ({ id: r.id, pattern: r.pattern })),
    excludes: matchedExcludes.map((r) => ({ id: r.id, pattern: r.pattern })),
  }
}
