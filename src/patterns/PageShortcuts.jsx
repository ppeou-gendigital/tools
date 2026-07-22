import { Button } from '@/molecules/Button'
import { useNavigation } from '@/providers/NavigationProvider'
import { APP_NAV } from '@/patterns/AppNavItems'
import styles from './PageShortcuts.module.scss'

// Sibling shortcuts for the app-nav toolbar strip (page header).
const DEFAULT_SHORTCUTS = APP_NAV.map(({ id, label, icon, go }) => ({
  id,
  label,
  icon,
  pick: (nav) => nav[go],
}))

/**
 * Cross-page shortcuts rendered at the tail of a page's toolbar.
 *
 * Ghost icon-only buttons in a right-aligned strip (separator + icons).
 * Pass `className` (typically a muted `.iconBtn`) for icon color.
 *
 * @param {string} current — route id to filter out of the strip
 * @param {string} [className] — applied to each shortcut button
 * @param {Array} [shortcuts] — override the default app-nav set
 */
export function PageShortcuts({
  current,
  className,
  shortcuts = DEFAULT_SHORTCUTS,
}) {
  const nav = useNavigation()
  const visible = shortcuts.filter((s) => s.id !== current)
  if (visible.length === 0) return null

  return (
    <div className={styles.strip} role="toolbar" aria-label="App">
      <span
        aria-hidden="true"
        role="separator"
        aria-orientation="vertical"
        className={styles.separator}
      />
      {visible.map(({ id, label, icon: Icon, pick }) => (
        <Button
          key={id}
          variant="ghost"
          size="sm"
          onClick={pick(nav)}
          className={className}
          aria-label={label}
          title={label}
        >
          <Icon size={14} aria-hidden="true" />
        </Button>
      ))}
    </div>
  )
}
