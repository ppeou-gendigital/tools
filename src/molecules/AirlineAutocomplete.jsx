import { useId, useMemo, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { airlineLabel, filterAirlines } from '@/lib/airlines'
import { normalizeAirline } from '@/lib/flightIdentity'
import { Input } from '@/molecules/Input'
import styles from './TimezoneAutocomplete.module.scss'

/**
 * Combobox for IATA airlines. Filters as you type; free-text 2-letter IATA OK.
 */
export function AirlineAutocomplete({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = 'Search airline or IATA…',
  className,
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const [draft, setDraft] = useState(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const query = draft ?? (value ? airlineLabel(value) : '')
  const options = useMemo(
    () => filterAirlines(open ? draft ?? value ?? '' : value || draft || '', 12),
    [open, draft, value],
  )

  function commit(iata) {
    const code = normalizeAirline(iata)
    if (!code) return
    onChange?.(code)
    setDraft(null)
    setOpen(false)
    setActive(0)
  }

  function commitFreeText() {
    const code = normalizeAirline(draft ?? value)
    if (code.length >= 2) commit(code)
    else {
      setDraft(null)
      setOpen(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, Math.max(options.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && options[active]) commit(options[active].iata)
      else commitFreeText()
    } else if (e.key === 'Escape') {
      setOpen(false)
      setDraft(null)
      setActive(0)
    }
  }

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, className)}
      onBlur={(e) => {
        if (rootRef.current?.contains(e.relatedTarget)) return
        setOpen(false)
        if (draft != null) {
          const code = normalizeAirline(draft)
          if (code && code !== value) commit(code)
          else setDraft(null)
        }
      }}
    >
      <Input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={query}
        onFocus={() => {
          setOpen(true)
          setActive(0)
        }}
        onChange={(e) => {
          setDraft(e.target.value)
          setOpen(true)
          setActive(0)
        }}
        onKeyDown={onKeyDown}
      />
      {open && options.length > 0 && (
        <ul id={listId} role="listbox" className={styles.list}>
          {options.map((a, i) => (
            <li key={a.iata} role="option" aria-selected={i === active}>
              <button
                type="button"
                className={cx(styles.option, i === active && styles.optionActive)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  commit(a.iata)
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span className={styles.zone}>{a.name}</span>
                <span className={styles.abbr}>{a.iata}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
