import { useMemo, useRef, useState } from 'react'
import { Plus, Star, X } from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import popoverStyles from '@/molecules/AnchoredPopover.module.scss'
import { Input } from '@/molecules/Input'
import { getActivity } from '@/lib/catalog'
import { formatRelativeDay } from '@/lib/format'
import { cx } from '@/lib/cx'
import styles from './ParticipantChips.module.scss'

function entryLabel(entry) {
  return entry?.title?.trim() || 'Untitled activity'
}

function entryMeta(entry, displayLocale) {
  const type = getActivity(entry?.activityId)?.label || entry?.activityId
  const when = formatRelativeDay(
    entry?.occursAt || entry?.occursOn || entry?.endsAt,
    displayLocale,
  )
  return [type, when].filter(Boolean).join(' · ')
}

/**
 * Multi-select journey activities (expense primary optional).
 *
 * @param {object[]} entries
 * @param {Set<string>} selected
 * @param {string | null} [primaryId]
 * @param {(id: string) => void} onToggle
 * @param {(id: string) => void} [onSetPrimary]
 * @param {boolean} [showPrimary=true]
 * @param {string} [emptySelectedHint]
 * @param {boolean} [readOnly]
 * @param {string} [displayLocale]
 */
export function ActivityLinkChips({
  entries = [],
  selected,
  primaryId = null,
  onToggle,
  onSetPrimary,
  showPrimary = true,
  emptySelectedHint,
  readOnly = false,
  displayLocale,
}) {
  const [picking, setPicking] = useState(false)
  const [query, setQuery] = useState('')
  const addRef = useRef(null)

  const selectedList = useMemo(() => {
    const byId = new Map(entries.map((e) => [e.id, e]))
    const ids = [...selected]
    if (showPrimary && primaryId) {
      ids.sort((a, b) => {
        if (a === primaryId) return -1
        if (b === primaryId) return 1
        return 0
      })
    }
    return ids.map((id) => byId.get(id)).filter(Boolean)
  }, [entries, selected, primaryId, showPrimary])

  const available = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      if (selected.has(e.id)) return false
      if (!q) return true
      const hay = `${entryLabel(e)} ${getActivity(e.activityId)?.label || ''} ${e.activityId || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [entries, selected, query])

  if (entries.length === 0) {
    return (
      <p className={styles.emptyHint}>
        No activities on this journey yet. Add one on the timeline first.
      </p>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.chipRow} role="list" aria-label="Linked activities">
        {selectedList.map((entry) => {
          const label = entryLabel(entry)
          const isPrimary = showPrimary && entry.id === primaryId
          return (
            <span
              key={entry.id}
              className={cx(styles.chip, isPrimary && styles.chipPrimary)}
              role="listitem"
            >
              {!readOnly && showPrimary && onSetPrimary && (
                <button
                  type="button"
                  className={cx(styles.remove, isPrimary && styles.primaryStar)}
                  onClick={() => onSetPrimary(entry.id)}
                  aria-label={
                    isPrimary
                      ? `${label} is primary activity`
                      : `Make ${label} primary`
                  }
                  title={isPrimary ? 'Primary activity' : 'Make primary'}
                  disabled={isPrimary}
                >
                  <Star
                    size={12}
                    aria-hidden="true"
                    fill={isPrimary ? 'currentColor' : 'none'}
                  />
                </button>
              )}
              <span className={styles.chipLabel}>{label}</span>
              {!readOnly && (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => onToggle(entry.id)}
                  aria-label={`Unlink ${label}`}
                  title={`Unlink ${label}`}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              )}
            </span>
          )
        })}
        {!readOnly && available.length > 0 && (
          <button
            ref={addRef}
            type="button"
            className={cx(styles.addChip, picking && styles.addChipOpen)}
            onClick={() => setPicking((v) => !v)}
            aria-expanded={picking}
            aria-haspopup="listbox"
          >
            <Plus size={14} aria-hidden="true" />
            Add activity
          </button>
        )}
      </div>

      {!selected.size && (
        <p className={styles.emptyHint}>
          {emptySelectedHint ||
            (showPrimary
              ? 'No activities linked — counted as a journey expense.'
              : 'No activities linked.')}
        </p>
      )}

      <AnchoredPopover
        open={!readOnly && picking}
        onClose={() => {
          setPicking(false)
          setQuery('')
        }}
        anchorRef={addRef}
        align="start"
        role="listbox"
        aria-label="Choose activities"
      >
        <div className={cx(popoverStyles.menu, styles.pickerMenu)}>
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities"
            aria-label="Search activities"
            autoFocus
          />
          <ul className={styles.pickerList}>
            {available.length === 0 ? (
              <li className={styles.emptyHint}>No activities match.</li>
            ) : (
              available.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={styles.pickerRow}
                    role="option"
                    onClick={() => {
                      onToggle(entry.id)
                      setQuery('')
                    }}
                  >
                    <span className={styles.chipLabel}>{entryLabel(entry)}</span>
                    <span className={styles.pickerMeta}>
                      {entryMeta(entry, displayLocale)}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </AnchoredPopover>
    </div>
  )
}
