import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cx } from '@/lib/cx'
import { labelForJourneyPerson } from '@/lib/format'
import styles from './ParticipantChips.module.scss'

/**
 * Multi-select travelers as removable chips + “Add traveler” picker.
 *
 * @param {object[]} roster — journey people
 * @param {Set<string>} selected — selected journeyPerson ids
 * @param {(id: string) => void} onToggle
 * @param {string} [currentUserId]
 * @param {boolean} [readOnly]
 */
export function ParticipantChips({
  roster = [],
  selected,
  onToggle,
  currentUserId,
  readOnly = false,
}) {
  const [picking, setPicking] = useState(false)
  const selectedList = roster.filter((p) => selected.has(p.id))
  const available = roster.filter((p) => !selected.has(p.id))

  if (roster.length === 0) {
    return (
      <p className={styles.emptyHint}>
        No travelers on this journey yet. Add them under Travelers.
      </p>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.chipRow} role="list" aria-label="Participants">
        {selectedList.map((p) => {
          const label = labelForJourneyPerson(p, currentUserId)
          return (
            <span key={p.id} className={styles.chip} role="listitem">
              <span className={styles.chipLabel}>{label}</span>
              {!readOnly && (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => onToggle(p.id)}
                  aria-label={`Remove ${label}`}
                  title={`Remove ${label}`}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              )}
            </span>
          )
        })}
        {!readOnly && available.length > 0 && (
          <button
            type="button"
            className={cx(styles.addChip, picking && styles.addChipOpen)}
            onClick={() => setPicking((v) => !v)}
            aria-expanded={picking}
            aria-haspopup="listbox"
          >
            <Plus size={14} aria-hidden="true" />
            Add traveler
          </button>
        )}
      </div>

      {!readOnly && picking && available.length > 0 && (
        <div
          className={styles.picker}
          role="listbox"
          aria-label="Add travelers"
        >
          {available.map((p) => {
            const label = labelForJourneyPerson(p, currentUserId)
            return (
              <button
                key={p.id}
                type="button"
                role="option"
                className={styles.pickerOption}
                onClick={() => {
                  onToggle(p.id)
                  if (available.length <= 1) setPicking(false)
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {selectedList.length === 0 && !picking && (
        <p className={styles.emptyHint}>
          {readOnly
            ? 'No participants on this activity.'
            : 'No one tagged yet. Add travelers above.'}
        </p>
      )}
    </div>
  )
}
