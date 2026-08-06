import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { cx } from '@/lib/cx'
import styles from './SortableList.module.scss'

function moveElement(srcArr, fromIndex, toIndex) {
  const arr = [...srcArr]
  const [element] = arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
  return arr
}

/** Pass a `key` from the parent when the item set identity changes. */
export function SortableList({
  label,
  items = [],
  onChange,
  getLabel = (item) => item.name,
}) {
  const [draft, setDraft] = useState(null)
  const list = draft ?? items
  const [selectedIndex, setSelectedIndex] = useState(0)

  function commit(next, nextIndex = selectedIndex) {
    setDraft(next)
    setSelectedIndex(Math.max(0, Math.min(nextIndex, next.length - 1)))
    onChange?.(next)
  }

  const canMoveUp = list.length > 0 && selectedIndex > 0
  const canMoveDown = list.length > 0 && selectedIndex < list.length - 1

  const moveTop = () => {
    if (canMoveUp) commit(moveElement(list, selectedIndex, 0), 0)
  }
  const moveUp = () => {
    if (canMoveUp) {
      const next = selectedIndex - 1
      commit(moveElement(list, selectedIndex, next), next)
    }
  }
  const moveDown = () => {
    if (canMoveDown) {
      const next = selectedIndex + 1
      commit(moveElement(list, selectedIndex, next), next)
    }
  }
  const moveBottom = () => {
    const next = list.length - 1
    if (canMoveDown) commit(moveElement(list, selectedIndex, next), next)
  }

  return (
    <div className={styles.root}>
      {label && <h3 className={styles.label}>{label}</h3>}
      <div className={styles.pane}>
        <div
          className={styles.list}
          role="listbox"
          aria-label={label || 'Reorder list'}
        >
          {list.length === 0 ? (
            <div className={styles.emptyState}>Nothing to reorder</div>
          ) : (
            list.map((item, idx) => {
              const text = getLabel(item, idx)
              const selected = idx === selectedIndex
              return (
                <button
                  key={`${item.id ?? item.name}-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cx(
                    styles.option,
                    selected && styles.optionSelected,
                  )}
                  title={text}
                  onClick={() => setSelectedIndex(idx)}
                >
                  <span className={styles.index}>{idx + 1}</span>
                  <span className={styles.optionLabel}>{text}</span>
                </button>
              )
            })
          )}
        </div>

        <div className={styles.actions} role="group" aria-label="Reorder">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={styles.xferBtn}
            onClick={moveTop}
            disabled={!canMoveUp}
            aria-label="Move to top"
            title="Move to top"
          >
            <ChevronsUp size={18} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={styles.xferBtn}
            onClick={moveUp}
            disabled={!canMoveUp}
            aria-label="Move up"
            title="Move up"
          >
            <ChevronUp size={18} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={styles.xferBtn}
            onClick={moveDown}
            disabled={!canMoveDown}
            aria-label="Move down"
            title="Move down"
          >
            <ChevronDown size={18} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={styles.xferBtn}
            onClick={moveBottom}
            disabled={!canMoveDown}
            aria-label="Move to bottom"
            title="Move to bottom"
          >
            <ChevronsDown size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
