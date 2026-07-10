// Pure helpers for the Fav Links feature. Shared by:
//   - FavoritesProvider (React: read from storage, expose to UI)
//   - PrefsSync         (React: diff against baseline, per-domain upsert)
//   - favoritesApi      (Supabase read/write; uses mergeFavoritePathObjects)
//
// Data model mirrors user_visits so the sync layer follows the exact same
// per-domain upsert pattern:
//
//   byDomain = {
//     '<hostname>': {
//       paths: {
//         '<path+search>': FavValue,
//         ...
//       },
//       updatedAt: '<iso>',
//     },
//     ...
//   }
//
// The path string is the map key, so duplicates are impossible by
// construction. FavValue is the per-favorite metadata (path is the key,
// not repeated in the value):
//
//   FavValue = {
//     title:   'Tab title at time of bookmark',
//     addedAt: '<iso>',
//   }
//
// Cap: MAX_PATHS_PER_DOMAIN keys per domain — favorites are user-driven
// and tend to be small, but the server-side trigger enforces the same
// bound so we mirror it client-side too.

export const MAX_PATHS_PER_DOMAIN = 200

function safeString(v) {
  return typeof v === 'string' ? v : ''
}

function safeIso(v) {
  if (typeof v !== 'string') return null
  const t = Date.parse(v)
  return Number.isFinite(t) ? new Date(t).toISOString() : null
}

// Coerce a (path, raw) pair from storage / Supabase into a FavValue.
// Returns null when the path key is missing/blank or the value is not
// an object.
function normalizeFavValue(path, raw, fallbackAt) {
  if (!path || typeof path !== 'string') return null
  if (!raw || typeof raw !== 'object') return null
  const addedAt = safeIso(raw.addedAt) ?? fallbackAt
  return {
    title: safeString(raw.title),
    addedAt,
  }
}

// Newest-first ordering on [path, value] entries. Ties break by path so
// sorts are stable across rehydration cycles.
function byEntryAddedAtDesc(a, b) {
  const aAt = a[1].addedAt ?? ''
  const bAt = b[1].addedAt ?? ''
  if (aAt === bAt) {
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
  }
  return aAt < bAt ? 1 : -1
}

// Reduce a paths object to its <= MAX_PATHS_PER_DOMAIN newest entries.
// Returns a new object; no-op reference-wise if already under the cap.
function capPathsObject(paths) {
  const entries = Object.entries(paths)
  if (entries.length <= MAX_PATHS_PER_DOMAIN) return paths
  entries.sort(byEntryAddedAtDesc)
  const out = {}
  for (let i = 0; i < MAX_PATHS_PER_DOMAIN; i++) {
    const [k, v] = entries[i]
    out[k] = v
  }
  return out
}

export function normalizeFavoritesByDomain(raw) {
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
    let newestAddedAt = null
    for (const [pathKey, rawValue] of Object.entries(rawPaths)) {
      const path = safeString(pathKey).trim()
      const norm = normalizeFavValue(path, rawValue, now)
      if (!norm) continue
      paths[path] = norm
      if (!newestAddedAt || norm.addedAt > newestAddedAt) {
        newestAddedAt = norm.addedAt
      }
    }
    if (Object.keys(paths).length === 0) continue
    const capped = capPathsObject(paths)
    out[hostname] = {
      paths: capped,
      updatedAt: safeIso(bucket.updatedAt) ?? newestAddedAt ?? now,
    }
  }
  return out
}

// Add one favorite entry to a domain bucket. Returns a *new* bucket
// (never mutates its input) so React state comparisons stay simple.
//
// Behavior:
//   - If the path already exists, refresh its title + addedAt (a repeat
//     bookmark should feel like a fresh save, not a no-op).
//   - Otherwise add a fresh entry under bucket.paths[path].
//   - Cap total keys at MAX_PATHS_PER_DOMAIN by dropping the oldest.
//   - Bump bucket.updatedAt so the storage-level "did anything change"
//     shortcut in the sync layer stays accurate.
export function addFavorite(prevBucket, fav) {
  const at = safeIso(fav?.addedAt) ?? new Date().toISOString()
  const path = safeString(fav?.path).trim()
  if (!path) return prevBucket ?? { paths: {}, updatedAt: at }
  const title = safeString(fav?.title)

  const prevPaths =
    prevBucket?.paths &&
    typeof prevBucket.paths === 'object' &&
    !Array.isArray(prevBucket.paths)
      ? prevBucket.paths
      : {}
  const existing = prevPaths[path]

  const nextEntry = existing
    ? {
        // Prefer a non-empty new title so tabs whose title arrives late
        // don't get stuck on the loading placeholder.
        title: title || existing.title,
        addedAt: at,
      }
    : {
        title,
        addedAt: at,
      }

  const nextPaths = { ...prevPaths, [path]: nextEntry }
  const capped =
    Object.keys(nextPaths).length > MAX_PATHS_PER_DOMAIN
      ? capPathsObject(nextPaths)
      : nextPaths
  return { paths: capped, updatedAt: at }
}

// Merge two paths objects into one, deduped by key. Same rules used by
// mergeFavoritesByDomain for shared keys:
//   addedAt = max(a, b)                 (newest bookmark wins)
//   title   = prefer the newer side's value if non-empty, else the older
//
// Result is NOT capped — that's normalizeFavoritesByDomain / capPathsObject.
export function mergeFavoritePathObjects(a, b) {
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
    const aAt = existing.addedAt ?? ''
    const bAt = v.addedAt ?? ''
    const newer = bAt >= aAt ? v : existing
    const older = newer === v ? existing : v
    out[k] = {
      title: newer.title || older.title || '',
      addedAt: newer.addedAt ?? older.addedAt ?? '',
    }
  }
  return out
}

// Union-merge two byDomain maps. Used on sign-in so pulling a remote
// snapshot never destroys local favorites captured before the pull
// settled.
//
// Rules:
//   - Domain union: any domain present in either side survives.
//   - Path union within a domain: via mergeFavoritePathObjects.
//
// The result runs through normalizeFavoritesByDomain so cap/sort/dedupe
// invariants hold.
export function mergeFavoritesByDomain(a, b) {
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
      paths: mergeFavoritePathObjects(aBucket.paths, bBucket.paths),
      updatedAt:
        (aBucket.updatedAt ?? '') >= (bBucket.updatedAt ?? '')
          ? aBucket.updatedAt
          : bBucket.updatedAt,
    }
  }
  return normalizeFavoritesByDomain(out)
}

// True when two byDomain buckets are structurally equal at the level
// the sync layer cares about (dirty vs clean).
export function favoriteBucketsEqual(a, b) {
  if (a === b) return true
  if (!a || !b) return false
  return stableStringifyBucket(a) === stableStringifyBucket(b)
}

function stableStringifyBucket(bucket) {
  const paths =
    bucket?.paths && typeof bucket.paths === 'object' && !Array.isArray(bucket.paths)
      ? bucket.paths
      : {}
  const keys = Object.keys(paths).sort()
  return JSON.stringify(
    keys.map((k) => {
      const v = paths[k] ?? {}
      return [k, v.title ?? '', v.addedAt ?? '']
    }),
  )
}

// Cheap deterministic key over the whole byDomain map. Used by the sync
// layer to answer "did the favorites change since the last pull?".
export function stableFavoritesKey(byDomain) {
  const map = byDomain ?? {}
  const domains = Object.keys(map).sort()
  return JSON.stringify(
    domains.map((d) => [d, stableStringifyBucket(map[d])]),
  )
}

// Compute the set of dirty domain keys between two byDomain maps.
export function diffFavoritesByDomain(current, baseline) {
  const upserts = []
  const deletes = []
  const cur = current ?? {}
  const base = baseline ?? {}
  for (const [domain, bucket] of Object.entries(cur)) {
    if (!favoriteBucketsEqual(bucket, base[domain])) upserts.push(domain)
  }
  for (const domain of Object.keys(base)) {
    if (!(domain in cur)) deletes.push(domain)
  }
  return { upserts, deletes }
}
