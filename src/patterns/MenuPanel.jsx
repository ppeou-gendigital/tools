import { AboutRow, Divider } from '@tools/ui'
import {
  AppearanceRow,
  DevBadgeItem,
  MenuPanel as ToolsMenuPanel,
} from '@tools/behavioral'
import { useAuth } from '@tools/service'
import { APP_VERSION, devAutoLoginConfig } from '@/env'
import { useVault } from '@/providers/VaultProvider'
import { AccountRow } from '@/patterns/AccountRow'
import { CredentialsItem } from '@/patterns/CredentialsItem'
import { CreditCardsItem } from '@/patterns/CreditCardsItem'
import { UnlockVaultItem } from '@/patterns/UnlockVaultItem'
import { ProjectSiteItem } from '@/patterns/ProjectSiteItem'

const TOOL_NAME = 'Accesso'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const vault = useVault()
  const signedIn = !!user
  const showUnlock = signedIn && vault.isLocked
  const dev = devAutoLoginConfig()

  return (
    <ToolsMenuPanel
      corner={corner}
      onClose={onClose}
      footer={
        <>
          <DevBadgeItem email={dev?.email} />
          <AboutRow name={TOOL_NAME} version={APP_VERSION} />
        </>
      }
    >
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      <Divider />
      {signedIn && <CredentialsItem onClose={onClose} />}
      {signedIn && <CreditCardsItem onClose={onClose} />}
      {showUnlock && <UnlockVaultItem onClose={onClose} />}
      <ProjectSiteItem onClose={onClose} />
    </ToolsMenuPanel>
  )
}
