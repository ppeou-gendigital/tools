import { AppShell as ToolsAppShell } from '@tools/behavioral'
import { FloatingMenu } from '@/blocks/FloatingMenu'

export function AppShell({ children }) {
  return (
    <ToolsAppShell chrome={<FloatingMenu />}>{children}</ToolsAppShell>
  )
}
