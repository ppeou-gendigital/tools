import { useCallback, useEffect, useMemo } from 'react'
import { STORAGE_KEYS } from '../lib/jira/config.js'
import { parseProfile } from '../lib/jira/profiles.js'
import { pruneLocalProfiles } from '../lib/jira/remote.js'
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
// importedAt, profile, source }] }. Profiles can only come from a JSON
// attachment on a Jira ticket, so entries without a Jira source are pruned on
// load (including the local-file profiles from earlier builds).
export function useProfiles() {
  const [index, setIndex, ready] = useChromeStorage(STORAGE_KEYS.profiles, EMPTY_INDEX)

  const pruned = useMemo(() => pruneLocalProfiles(index), [index])
  const items = pruned.index.items
  const activeId = pruned.index.activeId
  const activeEntry = items.find((item) => item.id === activeId) ?? null
  const removedIds = pruned.removedIds

  const needsPrune =
    removedIds.length > 0 ||
    (index?.items?.length ?? 0) !== items.length ||
    (index?.activeId ?? '') !== activeId

  useEffect(() => {
    if (!ready || !needsPrune) return
    for (const id of removedIds) removeKey(STORAGE_KEYS.working(id))
    setIndex({ activeId, items })
  }, [ready, needsPrune, removedIds, activeId, items, setIndex])

  const persist = useCallback(
    (nextItems, nextActiveId) => {
      setIndex({ activeId: nextActiveId, items: nextItems })
    },
    [setIndex],
  )

  // Imports one or more attachments in a single storage write. Importing the
  // same name replaces the entry, which also drops its working config so the
  // imported values take effect.
  const importProfiles = useCallback(
    (files) => {
      const prepared = (Array.isArray(files) ? files : []).map((file) => {
        if (!file?.source) {
          throw new Error('Profiles must come from a Jira attachment.')
        }
        const label =
          String(file.name ?? file.raw?.name ?? 'Imported profile').trim() ||
          'Imported profile'
        return {
          label,
          source: file.source,
          profile: parseProfile(file.raw, { fallbackName: label }),
        }
      })

      let next = items
      let nextActiveId = activeId
      const imported = []

      for (const entry of prepared) {
        for (const replaced of next.filter((item) => item.name === entry.label)) {
          removeKey(STORAGE_KEYS.working(replaced.id))
        }

        const item = {
          id: newId(),
          name: entry.label,
          importedAt: new Date().toISOString(),
          profile: { ...entry.profile, name: entry.label },
          source: entry.source,
        }

        next = [item, ...next.filter((existing) => existing.name !== entry.label)]
        nextActiveId = item.id
        imported.push(item)
      }

      if (imported.length > 0) persist(next, nextActiveId)
      return imported
    },
    [items, activeId, persist],
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

  // Used by the field-list refresh and by a completed Jira sync: the working
  // selection (and its storage key) stays untouched.
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

  const updateProfileSource = useCallback(
    (id, source) => {
      persist(
        items.map((item) =>
          item.id === id
            ? { ...item, source: { ...item.source, ...source } }
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
    importProfiles,
    removeProfile,
    selectProfile,
    updateProfile,
    updateProfileSource,
  }
}
