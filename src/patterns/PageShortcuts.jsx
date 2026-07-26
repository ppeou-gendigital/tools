import { useRef, useState } from 'react'
import { Grip } from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import { Button } from '@/molecules/Button'
import { useNavigation } from '@/providers/NavigationProvider'
import { APP_NAV } from '@/patterns/AppNavItems'
import { cx } from '@/lib/cx'
import styles from './PageShortcuts.module.scss'

const DEFAULT_SHORTCUTS = APP_NAV.map(({ id, label, icon, go }) => ({
  id,
  label,
  icon,
  pick: (nav) => nav[go],
}))

/**
 * Cross-page shortcuts at the tail of a page toolbar, behind a Grip menu.
 *
 * Pass `shortcuts` to override the default app-nav set (Home / Settings).
 * Each entry uses `pick(nav) => onClick` so journey pages can close over an id.
 */
export function PageShortcuts({
  current,
  className,
  shortcuts,
}) {
  const nav = useNavigation()
  const btnRef = useRef(null)
  const [open, setOpen] = useState(false)
  const usingCustom = shortcuts != null
  const source = usingCustom ? shortcuts : DEFAULT_SHORTCUTS
  const menuLabel = usingCustom ? 'Journey menu' : 'App menu'

  const items = source
    .filter((s) => s.id !== current)
    .map(({ id, label, icon, pick, onClick }) => ({
      id,
      label,
      icon,
      onClick: onClick ?? pick?.(nav),
    }))
    .filter((s) => typeof s.onClick === 'function')

  if (items.length === 0) return null

  return (
    <div className={styles.strip} role="group" aria-label={menuLabel}>
      <span
        aria-hidden="true"
        role="separator"
        aria-orientation="vertical"
        className={styles.separator}
      />
      <Button
        ref={btnRef}
        type="button"
        variant="ghost"
        size="sm"
        className={cx(className)}
        aria-label={menuLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        title={menuLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <Grip size={14} aria-hidden="true" />
      </Button>
      <AnchoredPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        align="end"
        fluid
        role="menu"
        aria-label={menuLabel}
      >
        <ul className={styles.menu}>
          {items.map(({ id, label, icon: Icon, onClick }) => (
            <li key={id} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                onClick={() => {
                  setOpen(false)
                  onClick()
                }}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </AnchoredPopover>
    </div>
  )
}
