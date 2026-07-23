import { useId, useMemo, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { filterTimeZones, shortTimeZoneLabel } from '@/lib/timezone'
import { Input } from '@/molecules/Input'
import styles from './TimezoneAutocomplete.module.scss'

/**
 * Combobox for IANA time zones. Filters as you type; Enter / click commits.
 * Remount with key={value} from parent if you need to reset draft text.
 */
export function TimezoneAutocomplete({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = 'Search city or region…',
  className,
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const [draft, setDraft] = useState(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const query = draft ?? value ?? ''
  const options = useMemo(
    () => filterTimeZones(open ? query : value || query, 10),
    [open, query, value],
  )

  function commit(zone) {
    if (!zone) return
    onChange?.(zone)
    setDraft(null)
    setOpen(false)
    setActive(0)
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
      if (open && options[active]) commit(options[active])
      else if (query) {
        const match =
          options.find((z) => z.toLowerCase() === query.trim().toLowerCase()) ||
          options[0]
        if (match) commit(match)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setDraft(null)
      setActive(0)
    }
  }

  const hint = value && !open ? shortTimeZoneLabel(value) : ''

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, className)}
      onBlur={(e) => {
        if (rootRef.current?.contains(e.relatedTarget)) return
        setOpen(false)
        if (draft != null && draft !== value) {
          const exact = options.find(
            (z) => z.toLowerCase() === draft.trim().toLowerCase(),
          )
          if (exact) commit(exact)
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
      {hint && <span className={styles.hint}>{hint}</span>}
      {open && options.length > 0 && (
        <ul id={listId} role="listbox" className={styles.list}>
          {options.map((zone, i) => (
            <li key={zone} role="option" aria-selected={i === active}>
              <button
                type="button"
                className={cx(styles.option, i === active && styles.optionActive)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  commit(zone)
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span className={styles.zone}>{zone}</span>
                <span className={styles.abbr}>{shortTimeZoneLabel(zone)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
