// Pure operators for the user_data prefs row. Consumed by
// applySyncOp({ stream: 'prefs', op }). Each factory returns
// `(row) => nextRow` that:
//   - Never mutates the input.
//   - Only touches the field(s) it owns so a CAS miss + re-apply
//     preserves concurrent edits and sibling-tool keys.
//   - Returns the same row reference when the op is a no-op.
//
// When you add a new owned prefs key, add it to PREFS_OWNED_KEYS in
// prefs.js and an op factory here. See tool/loopy for multi-column
// examples (aemDomains, pinnedSites, …).

import {
  normalizeAiFabCorner,
  normalizeDefaultCurrency,
  normalizeDisplayLocale,
  normalizeFabCorner,
  normalizeFontSize,
  normalizeMapsProvider,
  normalizePrefsConfirmed,
  normalizeRemotePrefs,
  normalizeTheme,
} from '@/lib/prefs'

function emptyRow() {
  return {
    data: {
      theme: 'daynight',
      fontSize: 16,
      fabCorner: '11:15',
      aiFabCorner: '0:15',
      displayLocale: null,
      defaultCurrency: null,
      mapsProvider: 'google',
      prefsConfirmed: false,
    },
  }
}

function cloneRow(row) {
  const base = row ?? emptyRow()
  const prefs = normalizeRemotePrefs(base.data)
  return {
    data: { ...prefs },
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
    // Keep AI FAB off the same corner if menu moves onto it.
    const aiFabCorner = normalizeAiFabCorner(cur.data.aiFabCorner, next)
    return withData(cur, { fabCorner: next, aiFabCorner })
  }
}

export function opSetAiFabCorner(corner) {
  return (row) => {
    const cur = cloneRow(row)
    const next = normalizeAiFabCorner(corner, cur.data.fabCorner)
    if (cur.data.aiFabCorner === next) return row ?? cur
    return withData(cur, { aiFabCorner: next })
  }
}

export function opSetDisplayLocale(locale) {
  const next = normalizeDisplayLocale(locale)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.displayLocale === next) return row ?? cur
    return withData(cur, { displayLocale: next })
  }
}

export function opSetDefaultCurrency(currency) {
  const next = normalizeDefaultCurrency(currency)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.defaultCurrency === next) return row ?? cur
    return withData(cur, { defaultCurrency: next })
  }
}

export function opSetMapsProvider(provider) {
  const next = normalizeMapsProvider(provider)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.mapsProvider === next) return row ?? cur
    return withData(cur, { mapsProvider: next })
  }
}

export function opSetPrefsConfirmed(confirmed) {
  const next = normalizePrefsConfirmed(confirmed)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.prefsConfirmed === next) return row ?? cur
    return withData(cur, { prefsConfirmed: next })
  }
}

/** Confirm onboarding: locale + currency + prefsConfirmed in one CAS write. */
export function opConfirmDisplayPrefs({ locale, currency }) {
  const nextLocale = normalizeDisplayLocale(locale)
  const nextCurrency = normalizeDefaultCurrency(currency)
  return (row) => {
    const cur = cloneRow(row)
    if (
      cur.data.displayLocale === nextLocale &&
      cur.data.defaultCurrency === nextCurrency &&
      cur.data.prefsConfirmed === true
    ) {
      return row ?? cur
    }
    return withData(cur, {
      displayLocale: nextLocale,
      defaultCurrency: nextCurrency,
      prefsConfirmed: true,
    })
  }
}
