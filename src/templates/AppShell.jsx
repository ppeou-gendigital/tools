import { AppShell as ToolsAppShell } from '@tools/behavioral'
import { FloatingAiButton } from '@/blocks/FloatingAiButton'
import { FloatingMenu } from '@/blocks/FloatingMenu'

export function AppShell({ children }) {
  return (
    <ToolsAppShell
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
