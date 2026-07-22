// Pure operators for the user_data prefs row. Consumed by
// applySyncOp({ stream: 'prefs', op }). Each factory returns
// `(row) => nextRow` that:
//   - Never mutates the input.
//   - Only touches the field(s) it owns so a CAS miss + re-apply
//     preserves concurrent edits and sibling-tool keys on `data`.
//   - Returns the same row reference when the op is a no-op.
//
// When you add a new owned prefs key, add it to PREFS_OWNED_KEYS in
// prefs.js and an op factory here.

import {
  normalizeAemDomains,
  normalizeFabCorner,
  normalizeFontSize,
  normalizeRemotePrefs,
  normalizeTheme,
} from '@/lib/prefs'
import {
  moveFavoriteDomain,
  normalizeFavoritesOrder,
  stableFavoritesOrderKey,
} from '@/lib/favoritesOrder'
import {
  movePinned,
  normalizePinnedSites,
  stablePinnedKey,
} from '@/lib/pinnedSites'
import {
  normalizeTrackedHostnames,
  stableHostsKey,
} from '@/lib/trackedHostnames'

function emptyRow() {
  return {
    data: { theme: 'system', fontSize: 16, fabCorner: 'bottom-right' },
    aemDomains: [],
    trackedHostnames: {},
    pinnedSites: [],
    favoritesOrder: [],
  }
}

function cloneRow(row) {
  const base = row ?? emptyRow()
  const prefs = normalizeRemotePrefs(base.data)
  return {
    data: { ...prefs },
    aemDomains: normalizeAemDomains(base.aemDomains),
    trackedHostnames: normalizeTrackedHostnames(base.trackedHostnames),
    pinnedSites: normalizePinnedSites(base.pinnedSites),
    favoritesOrder: normalizeFavoritesOrder(base.favoritesOrder),
  }
}

function withData(row, patch) {
  const next = cloneRow(row)
  next.data = { ...next.data, ...patch }
  return next
}

export function opSetTheme(theme) {
  const next = normalizeTheme(theme)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.theme === next) return row ?? cur
    return withData(cur, { theme: next })
  }
}

export function opSetFontSize(size) {
  const next = normalizeFontSize(size)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.fontSize === next) return row ?? cur
    return withData(cur, { fontSize: next })
  }
}

export function opSetFabCorner(corner) {
  const next = normalizeFabCorner(corner)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.fabCorner === next) return row ?? cur
    return withData(cur, { fabCorner: next })
  }
}

export function opSetAemDomains(list) {
  const next = normalizeAemDomains(list)
  return (row) => {
    const cur = cloneRow(row)
    if (JSON.stringify(cur.aemDomains) === JSON.stringify(next)) {
      return row ?? cur
    }
    return { ...cur, aemDomains: next }
  }
}

export function opSetTrackedHostnames(hosts) {
  const next = normalizeTrackedHostnames(hosts)
  return (row) => {
    const cur = cloneRow(row)
    if (stableHostsKey(cur.trackedHostnames) === stableHostsKey(next)) {
      return row ?? cur
    }
    return { ...cur, trackedHostnames: next }
  }
}

export function opSetPinnedSites(list) {
  const next = normalizePinnedSites(list)
  return (row) => {
    const cur = cloneRow(row)
    if (stablePinnedKey(cur.pinnedSites) === stablePinnedKey(next)) {
      return row ?? cur
    }
    return { ...cur, pinnedSites: next }
  }
}

export function opTogglePinned(host) {
  const key = String(host ?? '')
    .trim()
    .toLowerCase()
  return (row) => {
    if (!key) return row ?? cloneRow(row)
    const cur = cloneRow(row)
    const idx = cur.pinnedSites.indexOf(key)
    const next =
      idx === -1
        ? [...cur.pinnedSites, key]
        : cur.pinnedSites.filter((h) => h !== key)
    if (stablePinnedKey(cur.pinnedSites) === stablePinnedKey(next)) {
      return row ?? cur
    }
    return { ...cur, pinnedSites: next }
  }
}

export function opMovePinned(host, direction) {
  const key = String(host ?? '')
    .trim()
    .toLowerCase()
  const delta = Math.sign(direction ?? 0)
  return (row) => {
    if (!key || delta === 0) return row ?? cloneRow(row)
    const cur = cloneRow(row)
    const next = movePinned(cur.pinnedSites, key, delta)
    if (stablePinnedKey(cur.pinnedSites) === stablePinnedKey(next)) {
      return row ?? cur
    }
    return { ...cur, pinnedSites: next }
  }
}

export function opSetFavoritesOrder(list) {
  const next = normalizeFavoritesOrder(list)
  return (row) => {
    const cur = cloneRow(row)
    if (
      stableFavoritesOrderKey(cur.favoritesOrder) ===
      stableFavoritesOrderKey(next)
    ) {
      return row ?? cur
    }
    return { ...cur, favoritesOrder: next }
  }
}

export function opMoveFavoritesOrder(host, direction) {
  const key = String(host ?? '')
    .trim()
    .toLowerCase()
  const delta = Math.sign(direction ?? 0)
  return (row) => {
    if (!key || delta === 0) return row ?? cloneRow(row)
    const cur = cloneRow(row)
    const seeded = cur.favoritesOrder.includes(key)
      ? cur.favoritesOrder
      : [...cur.favoritesOrder, key]
    const next = moveFavoriteDomain(seeded, key, delta)
    if (
      stableFavoritesOrderKey(cur.favoritesOrder) ===
      stableFavoritesOrderKey(next)
    ) {
      return row ?? cur
    }
    return { ...cur, favoritesOrder: next }
  }
}
