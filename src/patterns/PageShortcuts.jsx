import { PageShortcuts as ToolsPageShortcuts } from '@tools/behavioral'
import { useNavigation } from '@/providers/NavigationProvider'
import { APP_NAV } from '@/patterns/AppNavItems'

const DEFAULT_SHORTCUTS = APP_NAV.map(({ id, label, icon, go }) => ({
  id,
  label,
  icon,
  pick: (nav) => nav[go],
}))

/**
 * Cross-page shortcuts rendered at the tail of a page's toolbar.
 *
 * Pass `shortcuts` to override the default app-nav set.
 * Each entry uses `pick(nav) => onClick` so pages can close over route ids.
 */
export function PageShortcuts({
  current,
  className,
  shortcuts = DEFAULT_SHORTCUTS,
}) {
  const nav = useNavigation()
  const items = shortcuts.map(({ id, label, icon, pick, onClick }) => ({
    id,
    label,
    icon,
    onClick: onClick ?? pick?.(nav),
  }))

  return (
    <ToolsPageShortcuts
      current={current}
      className={className}
      items={items}
    />
  )
}
