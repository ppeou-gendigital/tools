import { useCallback } from 'react'
import { STORAGE_KEYS } from '../lib/jira/config.js'
import { normalizeSelection } from '../lib/jira/profiles.js'
import { useChromeStorage } from '../hooks/useChromeStorage.js'

// Working copy of the active profile's selection. Stored per profile entry so
// edits never mutate the imported document; re-importing a profile creates a
// new entry id and therefore starts from the imported values again.
//
// The stored value is re-normalized on read, so a hand-edited or truncated
// working document cannot leave the popup with strings where it expects
// { id, name } items, or with a missing filter group.
export function useConfig(entry) {
  const fallback = normalizeSelection(entry?.profile?.selection ?? {})
  const key = STORAGE_KEYS.working(entry?.id ?? 'none')

  const [stored, setConfig, ready] = useChromeStorage(key, fallback)
  const config = normalizeSelection(stored ?? {})

  const update = useCallback(
    (patch) => {
      setConfig((previous) => ({
        ...normalizeSelection(previous ?? {}),
        ...(typeof patch === 'function' ? patch(previous) : patch),
      }))
    },
    [setConfig],
  )

  return { config, setConfig, update, ready }
}
