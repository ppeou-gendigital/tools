import { useCallback } from 'react'
import { STORAGE_KEYS } from '../lib/jira/config.js'
import { createSelection } from '../lib/jira/profiles.js'
import { useChromeStorage } from '../hooks/useChromeStorage.js'

// Working copy of the active profile's selection. Stored per profile entry so
// edits never mutate the imported document; re-importing a profile creates a
// new entry id and therefore starts from the imported values again.
export function useConfig(entry) {
  const fallback = entry?.profile?.selection ?? createSelection()
  const key = STORAGE_KEYS.working(entry?.id ?? 'none')

  const [config, setConfig, ready] = useChromeStorage(key, fallback)

  const update = useCallback(
    (patch) => {
      setConfig((previous) => ({
        ...previous,
        ...(typeof patch === 'function' ? patch(previous) : patch),
      }))
    },
    [setConfig],
  )

  return { config, setConfig, update, ready }
}
