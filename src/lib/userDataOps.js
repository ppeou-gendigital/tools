// Pure operators for the user_data prefs row. Consumed by
// applySyncOp({ stream: 'prefs', op }). Each factory returns
// `(row) => nextRow` that:
//   - Never mutates the input.
//   - Only touches the field(s) it owns so a CAS miss + re-apply
//     preserves concurrent edits to other columns.
//   - Returns the same row reference when the op is a no-op.
//
// When you add a new JSONB column on user_data, add a normalizer in
// prefs.js and an op factory here. See tool/loopy for multi-column
// examples (aemDomains, pinnedSites, …).

import {
  normalizeFabCorner,
  normalizeFontSize,
  normalizeRemotePrefs,
  normalizeTheme,
} from '@/lib/prefs'

function emptyRow() {
  return {
    data: { theme: 'system', fontSize: 16, fabCorner: 'bottom-right' },
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
    return withData(cur, { fabCorner: next })
  }
}
