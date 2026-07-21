import { House, LayoutGrid } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './PageShortcuts.module.scss'

// Default sibling shortcuts for the template demo pages. Replace or pass
// a custom `shortcuts` array when your tool grows past Home + DeckDemo.
const DEFAULT_SHORTCUTS = [
  {
    id: 'home',
    label: 'Home',
    icon: House,
    pick: (nav) => nav.goHome,
  },
  {
    id: 'deck-demo',
    label: 'Deck demo',
    icon: LayoutGrid,
    pick: (nav) => nav.goDeckDemo,
  },
]

/**
 * Cross-page shortcuts rendered at the tail of a page's toolbar.
 *
 * The `.separator` uses `margin-left: auto` so the whole group hugs the
 * right edge — the pipe becomes the visual boundary between the page's
 * own toolbar (left) and this nav cluster (right).
 *
 * @param {string} current — route id to filter out of the strip
 * @param {string} [className] — applied to each shortcut button
 * @param {Array} [shortcuts] — override the default Home / DeckDemo set
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
    <>
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
    </>
  )
}
