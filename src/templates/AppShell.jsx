import { AppShell as ToolsAppShell } from '@tools/behavioral'
import { FloatingMenu } from '@/blocks/FloatingMenu'
import { PlaylistPlaybackHost } from '@/patterns/PlaylistPlaybackHost'
import { useOfflineOptional } from '@/providers/OfflineProvider'

export function AppShell({ children }) {
  const offline = useOfflineOptional()
  const hideChrome = offline?.isOfflineMode || offline?.isOfflineEmpty

  return (
    <ToolsAppShell
      fabClearance
      hideChrome={hideChrome}
      hosts={<PlaylistPlaybackHost />}
      chrome={<FloatingMenu />}
    >
      {children}
    </ToolsAppShell>
  )
}
