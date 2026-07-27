import { AppShell as ToolsAppShell } from '@tools/behavioral'
import { FloatingMenu } from '@/blocks/FloatingMenu'
import { useOfflineOptional } from '@/providers/OfflineProvider'

export function AppShell({ children }) {
  const offline = useOfflineOptional()
  const hideChrome = offline?.isOfflineMode || offline?.isOfflineEmpty

  return (
    <ToolsAppShell
      hideChrome={hideChrome}
      chrome={<FloatingMenu />}
    >
      <div className="is-fluid-width">{children}</div>
    </ToolsAppShell>
  )
}
