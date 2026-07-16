// Pure per-domain operators consumed by applyDomainOp. Each factory
// returns a `(paths) => nextPaths` function that:
//   - Never mutates the input.
//   - Is pure (deterministic given inputs).
//   - Returns the same object identity when the op is a no-op, so the
//     CAS layer can skip the write.
//
// The whole point of splitting these out is that the CAS loop in
// applyDomainOp reads the LATEST remote state before each attempt and
// re-applies the operator against it. So the operator has to be safe
// to run repeatedly across different snapshots.
//
// FavValue shape (matches favorites.js):
//   { title: string, addedAt: iso8601 }

function safeString(v) {
  return typeof v === 'string' ? v : ''
}

function nowIso() {
  return new Date().toISOString()
}

// Add a path, or refresh its title if already present. Matches the
// semantics of addFavoriteToBucket in src/lib/favorites.js:
//   - New path: insert with the given title + addedAt (or now).
//   - Existing path with different (non-empty) title: refresh title,
//     keep the ORIGINAL addedAt so the freshness signal from the first
//     save survives a re-bookmark.
//   - Existing path with same title (or blank new title): no-op.
export function opAddPath(path, entry) {
  const key = safeString(path).trim()
  const title = safeString(entry?.title)
  const addedAt = safeString(entry?.addedAt) || nowIso()
  return (paths) => {
    if (!key) return paths
    const existing = paths[key]
    if (existing) {
      const nextTitle = title || existing.title || ''
      if (nextTitle === (existing.title ?? '')) return paths
      return { ...paths, [key]: { ...existing, title: nextTitle } }
    }
    return { ...paths, [key]: { title, addedAt } }
  }
}

// Remove a path. No-op when the path is already absent (returns the
// same paths reference so applyDomainOp short-circuits the write). If
// this leaves the bucket empty, applyDomainOp will DELETE the row.
export function opRemovePath(path) {
  const key = safeString(path).trim()
  return (paths) => {
    if (!key) return paths
    if (!(key in paths)) return paths
    const next = { ...paths }
    delete next[key]
    return next
  }
}

// Set the title on an existing path. If the path doesn't exist we
// treat this as an insert (matches the "if not, add" semantics
// requested for edit operations — the user can rename an entry that
// was concurrently removed by another device without losing their
// intent). Uses `now` for addedAt in that fallback since we don't
// have the original.
export function opSetTitle(path, title) {
  const key = safeString(path).trim()
  const nextTitle = safeString(title)
  return (paths) => {
    if (!key) return paths
    const existing = paths[key]
    if (!existing) {
      return { ...paths, [key]: { title: nextTitle, addedAt: nowIso() } }
    }
    if ((existing.title ?? '') === nextTitle) return paths
    return { ...paths, [key]: { ...existing, title: nextTitle } }
  }
}

// Rename a path within the same domain. Combines a remove + add
// atomically within a single CAS attempt so we can never leave the
// bucket half-updated.
//
// Preservation rules:
//   - New path is fresh: keep the source's addedAt (rename shouldn't
//     erase freshness).
//   - New path already exists (collision): keep the older of the two
//     addedAt values, matching mergeFavoritePathObjects semantics.
//   - Source path missing: no-op (someone else removed it; respect
//     that rather than resurrecting a stale entry).
export function opRenameWithinDomain(oldPath, newPath, title) {
  const oldKey = safeString(oldPath).trim()
  const newKey = safeString(newPath).trim()
  const nextTitle = safeString(title)
  return (paths) => {
    if (!oldKey || !newKey) return paths
    if (!(oldKey in paths)) return paths
    const source = paths[oldKey]
    const sourceAddedAt = source?.addedAt ?? nowIso()

    // No-op if the target is the same key and the title didn't change.
    if (oldKey === newKey) {
      if ((source.title ?? '') === nextTitle) return paths
      return { ...paths, [oldKey]: { ...source, title: nextTitle } }
    }

    const next = { ...paths }
    delete next[oldKey]
    const collision = next[newKey]
    const mergedAddedAt =
      collision?.addedAt && collision.addedAt <= sourceAddedAt
        ? collision.addedAt
        : sourceAddedAt
    next[newKey] = { title: nextTitle, addedAt: mergedAddedAt }
    return next
  }
}

// Union-merge a batch of paths INTO the current remote bucket. Used by
// the one-shot migration bridge in PrefsSync to upload any pre-refactor
// local favorites that never made it to the server. Never removes
// anything, and preserves the older addedAt on collisions.
export function opUnionPaths(localPaths) {
  const safeLocal =
    localPaths && typeof localPaths === 'object' && !Array.isArray(localPaths)
      ? localPaths
      : {}
  return (paths) => {
    const out = { ...paths }
    let changed = false
    for (const [key, entry] of Object.entries(safeLocal)) {
      if (!entry || typeof entry !== 'object') continue
      const existing = out[key]
      if (!existing) {
        out[key] = {
          title: safeString(entry.title),
          addedAt: safeString(entry.addedAt) || nowIso(),
        }
        changed = true
        continue
      }
      const eAt = existing.addedAt ?? ''
      const nAt = entry.addedAt ?? ''
      const olderAt = eAt && (!nAt || eAt <= nAt) ? eAt : nAt || eAt
      const newerTitle =
        (eAt >= nAt ? existing.title : entry.title) ||
        existing.title ||
        entry.title ||
        ''
      if (olderAt === (existing.addedAt ?? '') && newerTitle === (existing.title ?? '')) {
        continue
      }
      out[key] = { title: safeString(newerTitle), addedAt: olderAt }
      changed = true
    }
    return changed ? out : paths
  }
}
