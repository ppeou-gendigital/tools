// Pure helpers for the Visited URLs feature. Shared by:
//   - background.js       (service worker: on tab navigation)
//   - VisitedUrlsProvider (React: read from storage, expose to UI)
//   - PrefsSync           (React: diff against baseline, per-domain upsert)
//
// Data model matches the (user_id, domain, paths) table exactly:
//
//   byDomain = {
//     '<hostname>': {
//       paths: {
//         '<path+search>': PathValue,
//         ...
//       },
//       updatedAt: '<iso>',
//     },
//     ...
//   }
//
// The path string is the map key, so duplicates are impossible by
// construction. PathValue is the per-entry metadata (path is the key,
// not repeated in the value):
//
//   PathValue = {
//     title:           'Tab title at time of visit',
//     matchedDomainId: 'd_abc123',                       // AEM domain entry id
//     firstVisitedAt:  '<iso>',
//     lastVisitedAt:   '<iso>',
//     visitCount:      3,
//   }
//
// Cap: MAX_PATHS_PER_DOMAIN keys per domain, evict the oldest by
// lastVisitedAt. Server-side trigger mirrors this bound so a client bug
// can't balloon a single row past what the free tier can hold.

import { preferTitle } from '@/lib/pageTitle'

export const MAX_PATHS_PER_DOMAIN = 200

// Human-friendly relative timestamp for the visited-URLs UI. Falls back
// to a locale date once the delta exceeds a week, and to an em-dash when
// the value is missing or unparseable. Shared between the full Visited
// URLs page and the inline strip on the AEM Jump source card so the two
// surfaces read the same way.
export function formatWhen(iso) {
  if (!iso) return '—'
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return '—'
  const d = new Date(t)
  const now = Date.now()
  const delta = now - t
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  if (delta < minute) return 'just now'
  if (delta < hour) return `${Math.floor(delta / minute)}m ago`
  if (delta < day) return `${Math.floor(delta / hour)}h ago`
  if (delta < 7 * day) return `${Math.floor(delta / day)}d ago`
  return d.toLocaleDateString()
}

function safeString(v) {
  return typeof v === 'string' ? v : ''
}

function safeIso(v) {
  if (typeof v !== 'string') return null
  const t = Date.parse(v)
  return Number.isFinite(t) ? new Date(t).toISOString() : null
}

// Coerce a (path, raw) pair from storage / Supabase into a PathValue.
// Returns null when the path key is missing/blank or the value is not
// an object.
function normalizePathValue(path, raw, fallbackAt) {
  if (!path || typeof path !== 'string') return null
  if (!raw || typeof raw !== 'object') return null
  const last = safeIso(raw.lastVisitedAt) ?? fallbackAt
  const first = safeIso(raw.firstVisitedAt) ?? last
  const count = Number.isFinite(raw.visitCount)
    ? Math.max(1, Math.floor(raw.visitCount))
    : 1
  return {
    title: safeString(raw.title),
    matchedDomainId: safeString(raw.matchedDomainId),
    firstVisitedAt: first,
    lastVisitedAt: last,
    visitCount: count,
  }
}

// Newest-first ordering on [path, value] entries. Ties break by path so
// sorts are stable across rehydration cycles.
function byEntryLastVisitedDesc(a, b) {
  const aLast = a[1].lastVisitedAt ?? ''
  const bLast = b[1].lastVisitedAt ?? ''
  if (aLast === bLast) {
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
  }
  return aLast < bLast ? 1 : -1
}

// Reduce a paths object to its <= MAX_PATHS_PER_DOMAIN newest entries.
// Returns a new object; no-op reference-wise if already under the cap.
function capPathsObject(paths) {
  const entries = Object.entries(paths)
  if (entries.length <= MAX_PATHS_PER_DOMAIN) return paths
  entries.sort(byEntryLastVisitedDesc)
  const out = {}
  for (let i = 0; i < MAX_PATHS_PER_DOMAIN; i++) {
    const [k, v] = entries[i]
    out[k] = v
  }
  return out
}

export function normalizeVisitedByDomain(raw) {
  if (!raw || typeof raw !== 'object') return {}
  const now = new Date().toISOString()
  const out = {}
  for (const [domainKey, value] of Object.entries(raw)) {
    const hostname = safeString(domainKey).trim().toLowerCase()
    if (!hostname) continue
    const bucket = value && typeof value === 'object' ? value : {}
    const rawPaths =
      bucket.paths && typeof bucket.paths === 'object' && !Array.isArray(bucket.paths)
        ? bucket.paths
        : {}
    const paths = {}
    let newestLastVisited = null
    for (const [pathKey, rawValue] of Object.entries(rawPaths)) {
      const path = safeString(pathKey).trim()
      const norm = normalizePathValue(path, rawValue, now)
      if (!norm) continue
      paths[path] = norm
      if (!newestLastVisited || norm.lastVisitedAt > newestLastVisited) {
        newestLastVisited = norm.lastVisitedAt
      }
    }
    if (Object.keys(paths).length === 0) continue
    const capped = capPathsObject(paths)
    out[hostname] = {
      paths: capped,
      updatedAt: safeIso(bucket.updatedAt) ?? newestLastVisited ?? now,
    }
  }
  return out
}

// Merge one visit into a domain bucket. Returns a *new* bucket (never
// mutates its input) so React state comparisons stay simple.
//
// Behavior:
//   - If a matching path exists, bump visitCount + lastVisitedAt + title.
//   - Otherwise add a fresh entry under bucket.paths[path].
//   - Cap total keys at MAX_PATHS_PER_DOMAIN by dropping the oldest.
//   - Updates bucket.updatedAt so the storage-level "did anything
//     change" shortcut in the sync layer stays accurate.
export function mergeVisit(prevBucket, visit) {
  const at = safeIso(visit?.at) ?? new Date().toISOString()
  const path = safeString(visit?.path).trim()
  if (!path) return prevBucket ?? { paths: {}, updatedAt: at }
  const title = safeString(visit?.title)
  const matchedDomainId = safeString(visit?.matchedDomainId)

  const prevPaths =
    prevBucket?.paths &&
    typeof prevBucket.paths === 'object' &&
    !Array.isArray(prevBucket.paths)
      ? prevBucket.paths
      : {}
  const existing = prevPaths[path]

  const nextEntry = existing
    ? {
        ...existing,
        // Prefer a more specific title so SPA shell labels ("Jira")
        // don't stick once the real issue / page heading arrives, and
        // so a later generic title can't clobber a good one.
        title: preferTitle(existing.title, title),
        matchedDomainId: matchedDomainId || existing.matchedDomainId,
        lastVisitedAt: at,
        visitCount: (existing.visitCount ?? 1) + 1,
      }
    : {
        title: preferTitle('', title),
        matchedDomainId,
        firstVisitedAt: at,
        lastVisitedAt: at,
        visitCount: 1,
      }

  const nextPaths = { ...prevPaths, [path]: nextEntry }
  const capped =
    Object.keys(nextPaths).length > MAX_PATHS_PER_DOMAIN
      ? capPathsObject(nextPaths)
      : nextPaths
  return { paths: capped, updatedAt: at }
}

// Patch the title of an existing path without bumping visitCount.
// Used when a SPA hydrates the real heading after the initial capture.
// Returns the previous bucket unchanged when the path is unknown or the
// candidate title isn't an improvement.
export function updateVisitTitle(prevBucket, path, title) {
  const pathKey = safeString(path).trim()
  if (!pathKey) return prevBucket ?? { paths: {}, updatedAt: new Date().toISOString() }
  const prevPaths =
    prevBucket?.paths &&
    typeof prevBucket.paths === 'object' &&
    !Array.isArray(prevBucket.paths)
      ? prevBucket.paths
      : {}
  const existing = prevPaths[pathKey]
  if (!existing) return prevBucket ?? { paths: {}, updatedAt: new Date().toISOString() }
  const nextTitle = preferTitle(existing.title, title)
  if (nextTitle === (existing.title || '')) {
    return prevBucket
  }
  const at = new Date().toISOString()
  return {
    paths: {
      ...prevPaths,
      [pathKey]: { ...existing, title: nextTitle },
    },
    updatedAt: at,
  }
}

// Merge two paths objects into one, deduped by key. Same rules used by
// mergeVisitedByDomain for shared keys:
//   lastVisitedAt  = max(a, b)         (most recent wins)
//   firstVisitedAt = min(a, b)         (earliest known)
//   visitCount     = max(a, b)         (counts aren't clock-synced
//                                       across devices; sum would
//                                       double-count once both sides
//                                       have converged)
//   title / matchedDomainId = prefer the newer side's value if
//                             non-empty, else the older side.
//
// Result is NOT capped — that's normalizeVisitedByDomain / capPathsObject.
export function mergePathObjects(a, b) {
  const out = {}
  const left = a && typeof a === 'object' && !Array.isArray(a) ? a : {}
  const right = b && typeof b === 'object' && !Array.isArray(b) ? b : {}
  for (const [k, v] of Object.entries(left)) {
    if (v && typeof v === 'object') out[k] = v
  }
  for (const [k, v] of Object.entries(right)) {
    if (!v || typeof v !== 'object') continue
    const existing = out[k]
    if (!existing) {
      out[k] = v
      continue
    }
    const aLast = existing.lastVisitedAt ?? ''
    const bLast = v.lastVisitedAt ?? ''
    const newer = bLast >= aLast ? v : existing
    const older = newer === v ? existing : v
    out[k] = {
      title: preferTitle(older.title, newer.title),
      matchedDomainId:
        newer.matchedDomainId || older.matchedDomainId || '',
      firstVisitedAt:
        older.firstVisitedAt && newer.firstVisitedAt
          ? older.firstVisitedAt < newer.firstVisitedAt
            ? older.firstVisitedAt
            : newer.firstVisitedAt
          : older.firstVisitedAt || newer.firstVisitedAt,
      lastVisitedAt: newer.lastVisitedAt,
      visitCount: Math.max(existing.visitCount ?? 1, v.visitCount ?? 1),
    }
  }
  return out
}

// Union-merge two byDomain maps. Used on sign-in so pulling a remote
// snapshot never destroys local visits captured before the pull settled.
//
// Rules:
//   - Domain union: any domain present in either side survives.
//   - Path union within a domain: via mergePathObjects.
//
// The result runs through normalizeVisitedByDomain so cap/sort/dedupe
// invariants hold.
export function mergeVisitedByDomain(a, b) {
  const left = a ?? {}
  const right = b ?? {}
  const domains = new Set([...Object.keys(left), ...Object.keys(right)])
  const out = {}
  for (const domain of domains) {
    const aBucket = left[domain]
    const bBucket = right[domain]
    if (!aBucket) {
      out[domain] = bBucket
      continue
    }
    if (!bBucket) {
      out[domain] = aBucket
      continue
    }
    out[domain] = {
      paths: mergePathObjects(aBucket.paths, bBucket.paths),
      updatedAt:
        (aBucket.updatedAt ?? '') >= (bBucket.updatedAt ?? '')
          ? aBucket.updatedAt
          : bBucket.updatedAt,
    }
  }
  return normalizeVisitedByDomain(out)
}

// True when two byDomain buckets are structurally equal at the level
// the sync layer cares about (dirty vs clean). Cheap enough given the
// 200-per-domain cap.
export function domainBucketsEqual(a, b) {
  if (a === b) return true
  if (!a || !b) return false
  return stableStringify(a) === stableStringify(b)
}

function stableStringify(bucket) {
  const paths =
    bucket?.paths && typeof bucket.paths === 'object' && !Array.isArray(bucket.paths)
      ? bucket.paths
      : {}
  // Sort by key so JSON.stringify is deterministic even though the
  // input insertion order isn't guaranteed across storage round-trips.
  const keys = Object.keys(paths).sort()
  return JSON.stringify(
    keys.map((k) => {
      const v = paths[k] ?? {}
      return [
        k,
        v.title ?? '',
        v.matchedDomainId ?? '',
        v.firstVisitedAt ?? '',
        v.lastVisitedAt ?? '',
        v.visitCount ?? 0,
      ]
    }),
  )
}

// Compute the set of dirty domain keys between two byDomain maps.
export function diffByDomain(current, baseline) {
  const upserts = []
  const deletes = []
  const cur = current ?? {}
  const base = baseline ?? {}
  for (const [domain, bucket] of Object.entries(cur)) {
    if (!domainBucketsEqual(bucket, base[domain])) upserts.push(domain)
  }
  for (const domain of Object.keys(base)) {
    if (!(domain in cur)) deletes.push(domain)
  }
  return { upserts, deletes }
}
