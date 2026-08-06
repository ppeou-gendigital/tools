import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { cx } from '@/lib/cx'
import styles from './TransferList.module.scss'

/**
 * Dual-list picker. Pass a stable `key` from the parent when the profile
 * (or selected set identity) changes so local state remounts cleanly.
 *
 * Until the user edits, `selected` from the parent is shown (so async profile
 * hydrate appears without a sync effect). After edit, local draft wins.
 */
export function TransferList({
  itemKey = 'id',
  available = [],
  selected = [],
  onChange,
  getLabel = (item) => item.name ?? String(item[itemKey]),
  searchable = false,
  onSearch,
  searchPlaceholder = 'Search…',
}) {
  const [draft, setDraft] = useState(null)
  const dest = draft ?? selected
  const [query, setQuery] = useState('')
  const [availPick, setAvailPick] = useState(() => new Set())
  const [destPick, setDestPick] = useState(() => new Set())

  function commit(next) {
    setDraft(next)
    onChange?.(next)
  }

  function togglePick(setter, key, additive) {
    setter((prev) => {
      if (additive) {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      }
      if (prev.has(key) && prev.size === 1) return new Set()
      return new Set([key])
    })
  }

  function addKeys(keys) {
    if (!keys.size) return
    const existing = new Set(dest.map((item) => item[itemKey]))
    const picks = available.filter(
      (item) => keys.has(item[itemKey]) && !existing.has(item[itemKey]),
    )
    if (!picks.length) return
    commit([...dest, ...picks])
    setAvailPick(new Set())
  }

  function removeKeys(keys) {
    if (!keys.size) return
    commit(dest.filter((item) => !keys.has(item[itemKey])))
    setDestPick(new Set())
  }

  function addSelected() {
    addKeys(availPick)
  }

  function addAll() {
    const existing = new Set(dest.map((item) => item[itemKey]))
    commit([
      ...dest,
      ...available.filter((item) => !existing.has(item[itemKey])),
    ])
    setAvailPick(new Set())
  }

  function removeSelected() {
    removeKeys(destPick)
  }

  function removeAll() {
    commit([])
    setDestPick(new Set())
  }

  function handleSearch(e) {
    e?.preventDefault?.()
    if (!query.trim() || !onSearch) return
    onSearch(query.trim())
    setAvailPick(new Set())
  }

  function renderList({
    items,
    pick,
    setPick,
    label,
    emptyText,
    onActivate,
  }) {
    return (
      <div
        className={styles.list}
        role="listbox"
        aria-multiselectable="true"
        aria-label={label}
      >
        {items.length === 0 ? (
          <div className={styles.emptyState}>{emptyText}</div>
        ) : (
          items.map((item, idx) => {
            const key = item[itemKey]
            const text = getLabel(item, idx)
            const isSelected = pick.has(key)
            return (
              <button
                key={`${key}-${idx}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cx(styles.option, isSelected && styles.optionSelected)}
                title={text}
                onClick={(e) => {
                  togglePick(setPick, key, e.metaKey || e.ctrlKey)
                }}
                onDoubleClick={() => onActivate(new Set([key]))}
              >
                {text}
              </button>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {searchable && (
        <form className={styles.search} onSubmit={handleSearch}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search"
            iconStart={<Search size={14} />}
          />
          <Button
            type="submit"
            className={styles.searchBtn}
            disabled={!query.trim()}
          >
            Search
          </Button>
        </form>
      )}

      <div className={styles.pane}>
        <div className={styles.availLabel}>
          Available
          {available.length > 0 && (
            <span className={styles.count}>{available.length}</span>
          )}
        </div>
        <div className={styles.destLabel}>
          Selected
          {dest.length > 0 && (
            <span className={styles.count}>{dest.length}</span>
          )}
        </div>

        <div className={styles.availList}>
          {renderList({
            items: available,
            pick: availPick,
            setPick: setAvailPick,
            label: 'Available',
            emptyText: searchable
              ? 'Search to see results'
              : 'Nothing available',
            onActivate: addKeys,
          })}
        </div>

        <div className={styles.actions} role="group" aria-label="Transfer">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={styles.xferBtn}
            onClick={addSelected}
            disabled={!availPick.size}
            aria-label="Add selected"
            title="Add selected"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={styles.xferBtn}
            onClick={addAll}
            disabled={!available.length}
            aria-label="Add all"
            title="Add all"
          >
            <ChevronsRight size={18} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={styles.xferBtn}
            onClick={removeSelected}
            disabled={!destPick.size}
            aria-label="Remove selected"
            title="Remove selected"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={styles.xferBtn}
            onClick={removeAll}
            disabled={!dest.length}
            aria-label="Remove all"
            title="Remove all"
          >
            <ChevronsLeft size={18} aria-hidden="true" />
          </Button>
        </div>

        <div className={styles.destList}>
          {renderList({
            items: dest,
            pick: destPick,
            setPick: setDestPick,
            label: 'Selected',
            emptyText: 'Nothing selected',
            onActivate: removeKeys,
          })}
        </div>
      </div>
    </div>
  )
}
