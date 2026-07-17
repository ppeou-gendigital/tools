// Pure operators for the user_data prefs row. Consumed by
// applySyncOp({ stream: 'prefs', op }). Each factory returns
// `(row) => nextRow` that:
//   - Never mutates the input.
//   - Only touches the field(s) it owns so a CAS miss + re-apply
//     preserves concurrent edits to other keys (e.g. vault vs theme).
//   - Returns the same row reference when the op is a no-op.
//
// Acceso stores everything in one JSONB `data` column:
//   { theme, fontSize, fabCorner, updatedAt, vault?: { … } }

import {
  normalizeFabCorner,
  normalizeFontSize,
  normalizeRemotePrefs,
  normalizeTheme,
} from '@/lib/prefs'

function emptyRow() {
  return {
    data: {
      theme: 'system',
      fontSize: 16,
      fabCorner: 'bottom-right',
    },
  }
}

function cloneRow(row) {
  const base = row ?? emptyRow()
  const raw = base.data && typeof base.data === 'object' ? base.data : {}
  const prefs = normalizeRemotePrefs(raw)
  return {
    data: {
      ...raw,
      theme: prefs.theme,
      fontSize: prefs.fontSize,
      fabCorner: prefs.fabCorner,
    },
    updated_at: base.updated_at ?? null,
  }
}

function withPrefs(row, patch) {
  const cur = cloneRow(row)
  return {
    ...cur,
    data: {
      ...cur.data,
      ...patch,
      updatedAt: new Date().toISOString(),
    },
  }
}

export function opSetTheme(theme) {
  const next = normalizeTheme(theme)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.theme === next) return row ?? cur
    return withPrefs(cur, { theme: next })
  }
}

export function opSetFontSize(size) {
  const next = normalizeFontSize(size)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.fontSize === next) return row ?? cur
    return withPrefs(cur, { fontSize: next })
  }
}

export function opSetFabCorner(corner) {
  const next = normalizeFabCorner(corner)
  return (row) => {
    const cur = cloneRow(row)
    if (cur.data.fabCorner === next) return row ?? cur
    return withPrefs(cur, { fabCorner: next })
  }
}

// Shallow-merge a patch into data.vault without touching prefs keys.
export function opPatchVaultMeta(patch) {
  const safePatch =
    patch && typeof patch === 'object' && !Array.isArray(patch) ? patch : {}
  return (row) => {
    if (Object.keys(safePatch).length === 0) return row ?? cloneRow(row)
    const cur = cloneRow(row)
    const prevVault =
      cur.data.vault && typeof cur.data.vault === 'object' ? cur.data.vault : {}
    const nextVault = { ...prevVault, ...safePatch }
    if (JSON.stringify(prevVault) === JSON.stringify(nextVault)) {
      return row ?? cur
    }
    return {
      ...cur,
      data: {
        ...cur.data,
        vault: nextVault,
        updatedAt: new Date().toISOString(),
      },
    }
  }
}
