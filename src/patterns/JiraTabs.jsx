import { useEffect, useImperativeHandle, useRef } from 'react'
import { House } from 'lucide-react'
import { cx } from '@/lib/cx'
import { JIRA_SLIDES } from '@/lib/jira/slides'
import styles from './JiraTabs.module.scss'

export function JiraTabs({ activeId, onSelect, onHome, className, ref }) {
  const rootRef = useRef(null)

  useImperativeHandle(ref, () => ({
    setActive(id) {
      const root = rootRef.current
      if (!root) return
      for (const btn of root.querySelectorAll('[data-tab]')) {
        const on = btn.getAttribute('data-tab') === id
        btn.classList.toggle(styles.tabActive, on)
        if (on) {
          btn.setAttribute('aria-current', 'page')
          btn.scrollIntoView({
            behavior: 'auto',
            inline: 'nearest',
            block: 'nearest',
          })
        } else {
          btn.removeAttribute('aria-current')
        }
      }
    },
  }))

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const active = root.querySelector(`[data-tab="${CSS.escape(activeId)}"]`)
    active?.scrollIntoView({
      behavior: 'auto',
      inline: 'nearest',
      block: 'nearest',
    })
  }, [activeId])

  return (
    <nav
      ref={rootRef}
      className={cx(styles.tabs, className)}
      aria-label="Jira sections"
    >
      <ul className={styles.list}>
        {onHome && (
          <li className={styles.homeItem}>
            <button
              type="button"
              className={styles.home}
              onClick={onHome}
              aria-label="Profiles"
              title="Profiles"
            >
              <House size={16} aria-hidden="true" />
            </button>
          </li>
        )}
        {JIRA_SLIDES.map(({ id, label }) => {
          const active = id === activeId
          return (
            <li key={id}>
              <button
                type="button"
                data-tab={id}
                className={cx(styles.tab, active && styles.tabActive)}
                aria-current={active ? 'page' : undefined}
                onClick={() => onSelect?.(id)}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
