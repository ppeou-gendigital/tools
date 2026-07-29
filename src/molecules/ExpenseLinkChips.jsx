import { useMemo, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import popoverStyles from '@/molecules/AnchoredPopover.module.scss'
import { Input } from '@/molecules/Input'
import { centsToDollarsInput, formatMoney } from '@/lib/format'
import { cx } from '@/lib/cx'
import styles from './ParticipantChips.module.scss'

function expenseLabel(expense) {
  return expense?.title?.trim() || 'Untitled expense'
}

function expenseMeta(expense, displayLocale) {
  if (expense?.amountCents == null || !expense?.currency) return ''
  return formatMoney(expense.amountCents, expense.currency, displayLocale)
}

/**
 * Multi-select journey expenses for an attachment.
 *
 * @param {object[]} expenses
 * @param {Set<string>} selected
 * @param {(id: string) => void} onToggle
 * @param {boolean} [readOnly]
 * @param {string} [displayLocale]
 */
export function ExpenseLinkChips({
  expenses = [],
  selected,
  onToggle,
  readOnly = false,
  displayLocale,
}) {
  const [picking, setPicking] = useState(false)
  const [query, setQuery] = useState('')
  const addRef = useRef(null)

  const selectedList = useMemo(() => {
    const byId = new Map(expenses.map((e) => [e.id, e]))
    return [...selected].map((id) => byId.get(id)).filter(Boolean)
  }, [expenses, selected])

  const available = useMemo(() => {
    const q = query.trim().toLowerCase()
    return expenses.filter((e) => {
      if (selected.has(e.id)) return false
      if (!q) return true
      const amount = centsToDollarsInput(e.amountCents)
      const hay = `${expenseLabel(e)} ${e.category || ''} ${amount}`.toLowerCase()
      return hay.includes(q)
    })
  }, [expenses, selected, query])

  if (expenses.length === 0) {
    return (
      <p className={styles.emptyHint}>
        No expenses on this journey yet.
      </p>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.chipRow} role="list" aria-label="Linked expenses">
        {selectedList.map((expense) => {
          const label = expenseLabel(expense)
          return (
            <span key={expense.id} className={styles.chip} role="listitem">
              <span className={styles.chipLabel}>{label}</span>
              {!readOnly && (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => onToggle(expense.id)}
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
            Add expense
          </button>
        )}
      </div>

      {!selected.size && (
        <p className={styles.emptyHint}>No expenses linked.</p>
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
        aria-label="Choose expenses"
      >
        <div className={cx(popoverStyles.menu, styles.pickerMenu)}>
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expenses"
            aria-label="Search expenses"
            autoFocus
          />
          <ul className={styles.pickerList}>
            {available.length === 0 ? (
              <li className={styles.emptyHint}>No expenses match.</li>
            ) : (
              available.map((expense) => (
                <li key={expense.id}>
                  <button
                    type="button"
                    className={styles.pickerRow}
                    role="option"
                    onClick={() => {
                      onToggle(expense.id)
                      setQuery('')
                    }}
                  >
                    <span className={styles.chipLabel}>
                      {expenseLabel(expense)}
                    </span>
                    <span className={styles.pickerMeta}>
                      {expenseMeta(expense, displayLocale)}
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
