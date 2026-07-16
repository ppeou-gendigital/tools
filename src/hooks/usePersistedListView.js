import { useEffect, useState } from 'react'
import { asyncStorage } from '@/lib/storage'

// Persists search / sort / filter for a list page across reloads
// (and across popup opens in the extension). Uses asyncStorage so
// the same code path works for web localStorage and chrome.storage.local.
//
// Persist is gated on `ready` so the seeded defaults never overwrite a
// stored value before the cold-start read finishes (same race that
// broke last-route restore).

/**
 * @param {object} options
 * @param {string} options.storageKey
 * @param {string[]} options.sortValues
 * @param {string[]} options.filterValues
 * @param {{ search?: string, sort?: string, filter?: string }} [options.defaults]
 */
export function usePersistedListView({
  storageKey,
  sortValues,
  filterValues,
  defaults = {},
} = {}) {
  const defaultSearch = defaults.search ?? ''
  const defaultSort = defaults.sort ?? sortValues[0]
  const defaultFilter = defaults.filter ?? filterValues[0]

  const [search, setSearch] = useState(defaultSearch)
  const [sort, setSort] = useState(defaultSort)
  const [filter, setFilter] = useState(defaultFilter)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!storageKey) {
      setReady(true)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const raw = await asyncStorage.getItem(storageKey)
        if (cancelled || typeof raw !== 'string' || !raw) return
        let parsed
        try {
          parsed = JSON.parse(raw)
        } catch {
          return
        }
        if (!parsed || typeof parsed !== 'object') return
        if (typeof parsed.search === 'string') setSearch(parsed.search)
        if (
          typeof parsed.sort === 'string' &&
          sortValues.includes(parsed.sort)
        ) {
          setSort(parsed.sort)
        }
        if (
          typeof parsed.filter === 'string' &&
          filterValues.includes(parsed.filter)
        ) {
          setFilter(parsed.filter)
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
    // sortValues / filterValues are expected to be stable module consts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  useEffect(() => {
    if (!ready || !storageKey) return
    asyncStorage.setItem(
      storageKey,
      JSON.stringify({ search, sort, filter }),
    )
  }, [ready, storageKey, search, sort, filter])

  return { search, setSearch, sort, setSort, filter, setFilter, ready }
}
