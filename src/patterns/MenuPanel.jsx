import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { Divider } from '@/molecules/Divider'
import { AboutRow } from '@/patterns/AboutRow'
import { AccountRow } from '@/patterns/AccountRow'
import { AppearanceRow } from '@/patterns/AppearanceRow'
import { CredentialsItem } from '@/patterns/CredentialsItem'
import { UnlockVaultItem } from '@/patterns/UnlockVaultItem'
import { DeckDemoItem } from '@/patterns/DeckDemoItem'
import { DevBadgeItem } from '@/patterns/DevBadgeItem'
import styles from './MenuPanel.module.scss'

const VERSION = '0.1.0'
const TOOL_NAME = 'Acceso'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const vault = useVault()
  const signedIn = !!user
  // Show the unlock shortcut only when it would actually do something:
  // user is signed in, vault has already been set up, and it's not
  // already unlocked.
  const showUnlock = signedIn && vault.isLocked

  return (
    <div role="menu" className={styles.panel} data-corner={corner}>
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      <Divider />
      {signedIn && <CredentialsItem onClose={onClose} />}
      {showUnlock && <UnlockVaultItem onClose={onClose} />}
      <DeckDemoItem onClose={onClose} />
      <DevBadgeItem />
      <AboutRow name={TOOL_NAME} version={VERSION} />
    </div>
  )
}
