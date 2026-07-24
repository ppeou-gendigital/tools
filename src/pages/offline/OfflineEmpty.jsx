import { WifiOff } from 'lucide-react'
import { PageHeader } from '@/patterns/PageHeader'
import styles from './Offline.module.scss'

export function OfflineEmpty() {
  return (
    <div className={styles.page}>
      <PageHeader title="Accesso" />
      <div className={styles.empty}>
        <WifiOff size={28} aria-hidden="true" />
        <p className={styles.error}>You’re offline</p>
        <p className={styles.hint}>
          Connect once, unlock your vault, then use{' '}
          <strong>Available offline</strong> in Settings → Vault before you lose
          network. Secrets stay encrypted on this device until you unlock.
        </p>
      </div>
    </div>
  )
}
