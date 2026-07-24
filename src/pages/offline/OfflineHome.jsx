import { useEffect } from 'react'
import { CreditCard, KeyRound, Loader2, Lock } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { useVault } from '@/providers/VaultProvider'
import { OfflineBanner } from './OfflineBanner'
import styles from './Offline.module.scss'

export function OfflineHome() {
  const { primaryPack } = useOffline()
  const vault = useVault()
  const nav = useNavigation()

  useEffect(() => {
    if (vault.isLocked) {
      vault.requestUnlock({ dismissible: false })
    }
  }, [vault.isLocked, vault])

  if (vault.isLoading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Offline vault" />
        <p className={styles.hint}>
          <Loader2 size={14} aria-hidden="true" /> Loading…
        </p>
      </div>
    )
  }

  if (vault.error && vault.status === 'error') {
    return (
      <div className={styles.page}>
        <PageHeader title="Offline vault" />
        <p className={styles.error}>{vault.error.message}</p>
        <Button variant="outline" onClick={() => vault.retryLoad()}>
          Retry
        </Button>
      </div>
    )
  }

  const credCount = primaryPack?.credentials?.length ?? 0
  const cardCount = primaryPack?.creditCards?.length ?? 0

  return (
    <div className={styles.page}>
      <PageHeader title="Offline vault" />
      <OfflineBanner syncedAt={primaryPack?.syncedAt} />

      {vault.isLocked ? (
        <div className={styles.empty}>
          <Lock size={22} aria-hidden="true" />
          <p className={styles.hint}>
            Unlock with your passphrase to decrypt credentials on this device.
          </p>
          <Button onClick={() => vault.requestUnlock({ dismissible: false })}>
            Unlock
          </Button>
        </div>
      ) : (
        <>
          <p className={styles.hint}>
            {credCount} credential{credCount === 1 ? '' : 's'} · {cardCount}{' '}
            card{cardCount === 1 ? '' : 's'}
          </p>
          <div className={styles.navRow}>
            <Button
              variant="outline"
              onClick={() => nav.goCredentials()}
            >
              <KeyRound size={14} aria-hidden="true" />
              Credentials
            </Button>
            <Button variant="outline" onClick={() => nav.goCreditCards()}>
              <CreditCard size={14} aria-hidden="true" />
              Credit cards
            </Button>
            <Button variant="ghost" size="sm" onClick={() => vault.lock()}>
              Lock
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
