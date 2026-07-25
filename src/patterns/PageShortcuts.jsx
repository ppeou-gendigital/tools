import { PageShortcuts as ToolsPageShortcuts } from '@tools/behavioral'
import { useAppShortcutItems } from '@/patterns/AppNavItems'

export function PageShortcuts({ current, className, shortcuts }) {
  const defaults = useAppShortcutItems()
  return (
    <ToolsPageShortcuts
      current={current}
      className={className}
      items={shortcuts ?? defaults}
    />
  )
}
