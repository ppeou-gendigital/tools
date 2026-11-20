import { useCallback } from 'react'
import { STORAGE_KEYS } from '../lib/jira/config.js'
import { parseProfile } from '../lib/jira/profiles.js'
import { useChromeStorage } from '../hooks/useChromeStorage.js'
import { removeKey } from '../runtime/storage.js'

const EMPTY_INDEX = { activeId: '', items: [] }

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `profile-${Date.now()}`
}

// Profiles live in one storage key: { activeId, items: [{ id, name,
// importedAt, profile }] }. Importing the same name replaces the entry, which
// also drops its working config so the imported values take effect.
export function useProfiles() {
  const [index, setIndex, ready] = useChromeStorage(STORAGE_KEYS.profiles, EMPTY_INDEX)

  const items = index?.items ?? []
  const activeId = index?.activeId ?? ''
  const activeEntry = items.find((item) => item.id === activeId) ?? null

  const persist = useCallback(
    (nextItems, nextActiveId) => {
      setIndex({ activeId: nextActiveId, items: nextItems })
    },
    [setIndex],
  )

  const importProfile = useCallback(
    (raw, { name } = {}) => {
      const label = String(name ?? raw?.name ?? 'Imported profile').trim()
      const profile = parseProfile(raw, { fallbackName: label })
      const id = newId()

      const replaced = items.filter((item) => item.name === label)
      for (const entry of replaced) removeKey(STORAGE_KEYS.working(entry.id))

      const entry = {
        id,
        name: label,
        importedAt: new Date().toISOString(),
        profile: { ...profile, name: label },
      }

      persist([entry, ...items.filter((item) => item.name !== label)], id)
      return entry
    },
    [items, persist],
  )

  const removeProfile = useCallback(
    (id) => {
      const remaining = items.filter((item) => item.id !== id)
      removeKey(STORAGE_KEYS.working(id))
      const nextActiveId =
        activeId === id ? (remaining[0]?.id ?? '') : activeId
      persist(remaining, nextActiveId)
    },
    [activeId, items, persist],
  )

  const selectProfile = useCallback(
    (id) => {
      if (!items.some((item) => item.id === id)) return
      persist(items, id)
    },
    [items, persist],
  )

  // Used by the field-list refresh: the catalog grows from Jira, while the
  // working selection (and its storage key) stays untouched.
  const updateProfile = useCallback(
    (id, patch) => {
      persist(
        items.map((item) =>
          item.id === id
            ? { ...item, profile: { ...item.profile, ...patch } }
            : item,
        ),
        activeId,
      )
    },
    [activeId, items, persist],
  )

  return {
    ready,
    items,
    activeId,
    activeEntry,
    activeProfile: activeEntry?.profile ?? null,
    importProfile,
    removeProfile,
    selectProfile,
    updateProfile,
  }
}
