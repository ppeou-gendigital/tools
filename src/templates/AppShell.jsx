import { AppShell as ToolsAppShell } from '@tools/behavioral'
import { FloatingAiButton } from '@/blocks/FloatingAiButton'
import { FloatingMenu } from '@/blocks/FloatingMenu'
import { PlaylistPlaybackHost } from '@/patterns/PlaylistPlaybackHost'
import { useAiPlanner } from '@/providers/AiPlannerProvider'
import { useFilePreview } from '@/providers/FilePreviewProvider'
import { useOfflineOptional } from '@/providers/OfflineProvider'

export function AppShell({ children }) {
  const offline = useOfflineOptional()
  const { open: aiOpen } = useAiPlanner()
  const { isOpen: previewOpen } = useFilePreview()
  const hideChrome =
    offline?.isOfflineMode ||
    offline?.isOfflineEmpty ||
    aiOpen ||
    previewOpen

  return (
    <ToolsAppShell
      fabClearance
      hideChrome={hideChrome}
      hosts={<PlaylistPlaybackHost />}
      chrome={
        <>
          <FloatingMenu />
          <FloatingAiButton />
        </>
      }
    >
      {children}
    </ToolsAppShell>
  )
}
