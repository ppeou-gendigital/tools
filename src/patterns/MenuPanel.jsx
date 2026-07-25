import { HeartPlus, Lock } from 'lucide-react'
import { Divider, MenuRow } from '@tools/ui'
import {
  AppearanceRow,
  DevBadgeItem,
  MenuPanel as ToolsMenuPanel,
  MenuSectionLabel,
} from '@tools/behavioral'
import { useAuth } from '@tools/service'
import { APP_VERSION, devAutoLoginConfig } from '@/env'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { AccountRow } from '@/patterns/AccountRow'
import { AppNavItems } from '@/patterns/AppNavItems'

const TOOL_NAME = 'Docto'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const vault = usePatientVault()
  const signedIn = !!user
  const dev = devAutoLoginConfig()

  return (
    <ToolsMenuPanel
      corner={corner}
      onClose={onClose}
      brandConfig={{ name: TOOL_NAME, icon: HeartPlus, logoAlt: TOOL_NAME }}
      version={APP_VERSION}
      footer={<DevBadgeItem email={dev?.email} />}
    >
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      {signedIn && vault.isUnlocked && (
        <>
          <Divider />
          <MenuSectionLabel>App</MenuSectionLabel>
          <AppNavItems onClose={onClose} />
          <Divider />
          <MenuRow
            icon={Lock}
            label="Lock vault"
            onClose={onClose}
            onClick={() => vault.lock()}
          />
        </>
      )}
    </ToolsMenuPanel>
  )
}
