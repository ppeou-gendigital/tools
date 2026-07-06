import { Modal } from '@/patterns/Modal'
import { UnlockForm } from '@/pages/VaultUnlock'
import { useVault } from '@/providers/VaultProvider'
import styles from './VaultUnlockOverlay.module.scss'

// Global overlay driven by `vault.unlockPrompt`. Mounted once at the
// AppShell root so it can appear over any page (Credentials, Settings,
// the Deck, etc.) without pushing the router around. The
// VaultProvider auto-clears the prompt when the vault unlocks, so
// there's no bookkeeping here.
export function VaultUnlockOverlay() {
  const vault = useVault()
  const prompt = vault.unlockPrompt
  const shouldShow = Boolean(prompt) && vault.isLocked

  return (
    <Modal
      open={shouldShow}
      onDismiss={vault.dismissUnlock}
      dismissible={prompt?.dismissible ?? true}
      title="Unlock your vault"
    >
      <p className={styles.intro}>
        Enter your master passphrase to decrypt your credentials on this device.
      </p>
      <UnlockForm />
    </Modal>
  )
}
