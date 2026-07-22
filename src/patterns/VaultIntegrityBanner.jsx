import { TriangleAlert } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useVault } from '@/providers/VaultProvider'
import styles from './VaultIntegrityBanner.module.scss'

// Shown when every vault row on a list page failed to decrypt under
// the current key. Unlock only proves the verifier; this catches
// meta/row key-generation mismatches that would otherwise look like
// 200+ identical row errors.
export function VaultIntegrityBanner({ itemLabel = 'entries' }) {
  const vault = useVault()

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.copy}>
        <TriangleAlert size={16} aria-hidden="true" className={styles.icon} />
        <div className={styles.text}>
          <p className={styles.title}>Vault key doesn’t match stored {itemLabel}</p>
          <p className={styles.body}>
            Unlock succeeded, but nothing could be decrypted. Lock and re-enter
            your passphrase, or retry loading vault metadata. If this persists,
            the vault may have been reset without re-encrypting existing items.
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => vault.retryLoad()}
        >
          Retry load
        </Button>
        <Button
          size="sm"
          onClick={() => {
            vault.lock()
            vault.requestUnlock({ dismissible: false })
          }}
        >
          Lock & re-enter
        </Button>
      </div>
    </div>
  )
}
