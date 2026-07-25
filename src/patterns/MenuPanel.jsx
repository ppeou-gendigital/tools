import { Divider } from '@tools/ui'
import {
  AppearanceRow,
  DevBadgeItem,
  MenuPanel as ToolsMenuPanel,
} from '@tools/behavioral'
import { useAuth } from '@tools/service'
import { LineStyle } from 'lucide-react'
import { APP_VERSION, devAutoLoginConfig } from '@/env'
import { AccountRow } from '@/patterns/AccountRow'
import { AppNavItems } from '@/patterns/AppNavItems'

const TOOL_NAME = 'Notas'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const signedIn = !!user
  const dev = devAutoLoginConfig()

  return (
    <ToolsMenuPanel
      corner={corner}
      onClose={onClose}
      brandConfig={{ name: TOOL_NAME, icon: LineStyle, logoAlt: TOOL_NAME }}
      version={APP_VERSION}
      footer={<DevBadgeItem email={dev?.email} />}
    >
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      <Divider />
      <AppNavItems onClose={onClose} />
    </ToolsMenuPanel>
  )
}
