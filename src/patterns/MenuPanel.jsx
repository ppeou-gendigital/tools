import { Divider } from '@tools/ui'
import {
  AppearanceRow,
  DevBadgeItem,
  MenuPanel as ToolsMenuPanel,
  MenuSectionLabel,
} from '@tools/behavioral'
import { useAuth } from '@tools/service'
import { Wrench } from 'lucide-react'
import { APP_VERSION, devAutoLoginConfig } from '@/env'
import { AccountRow } from '@/patterns/AccountRow'
import { AppNavItems } from '@/patterns/AppNavItems'

const TOOL_NAME = 'TOOLNAME'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const signedIn = !!user
  const dev = devAutoLoginConfig()

  return (
    <ToolsMenuPanel
      corner={corner}
      onClose={onClose}
      brandConfig={{ name: TOOL_NAME, icon: Wrench, logoAlt: TOOL_NAME }}
      version={APP_VERSION}
      footer={<DevBadgeItem email={dev?.email} />}
    >
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      {signedIn && (
        <>
          <Divider />
          <MenuSectionLabel>App</MenuSectionLabel>
          <AppNavItems onClose={onClose} />
        </>
      )}
    </ToolsMenuPanel>
  )
}
