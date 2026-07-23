import { useId, useMemo, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { filterLocales, isValidLocale, localeLabel } from '@/lib/locale'
import { Input } from '@/molecules/Input'
import styles from './TimezoneAutocomplete.module.scss'

/**
 * Combobox for BCP 47 display locales. Filters as you type; Enter / click commits.
 */
export function LocaleAutocomplete({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = 'Search language or region…',
  className,
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const [draft, setDraft] = useState(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const query = draft ?? value ?? ''
  const options = useMemo(
    () => filterLocales(open ? query : value || query, 10, value),
    [open, query, value],
  )

  function commit(tag) {
    if (!tag) return
    onChange?.(tag)
    setDraft(null)
    setOpen(false)
    setActive(0)
  }

  function tryCommitQuery() {
    const trimmed = query.trim().replace(/_/g, '-')
    if (!trimmed) return
    const exact = options.find(
      (t) => t.toLowerCase() === trimmed.toLowerCase(),
    )
    if (exact) {
      commit(exact)
      return
    }
    if (isValidLocale(trimmed)) {
      commit(Intl.getCanonicalLocales(trimmed)[0] || trimmed)
      return
    }
    if (options[0]) commit(options[0])
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
      else tryCommitQuery()
    } else if (e.key === 'Escape') {
      setOpen(false)
      setDraft(null)
      setActive(0)
    }
  }

  const hint = value && !open ? localeLabel(value) : ''

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, className)}
      onBlur={(e) => {
        if (rootRef.current?.contains(e.relatedTarget)) return
        setOpen(false)
        if (draft != null && draft !== value) {
          const exact = options.find(
            (t) => t.toLowerCase() === draft.trim().toLowerCase(),
          )
          if (exact) commit(exact)
          else if (isValidLocale(draft)) {
            const canon = Intl.getCanonicalLocales(draft.trim().replace(/_/g, '-'))[0]
            commit(canon)
          } else setDraft(null)
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
          {options.map((tag, i) => (
            <li key={tag} role="option" aria-selected={i === active}>
              <button
                type="button"
                className={cx(styles.option, i === active && styles.optionActive)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  commit(tag)
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span className={styles.zone}>{localeLabel(tag)}</span>
                <span className={styles.abbr}>{tag}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
