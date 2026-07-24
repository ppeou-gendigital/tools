import { WifiOff } from 'lucide-react'
import { PageHeader } from '@/patterns/PageHeader'
import styles from './Offline.module.scss'

/** Shown when there is no network and no pinned workspace pack. */
export function OfflineEmpty() {
  return (
    <div className={styles.page}>
      <PageHeader title="Notas" />
      <div className={styles.body}>
        <div className={styles.empty}>
          <WifiOff size={28} aria-hidden="true" />
          <p className={styles.emptyTitle}>You’re offline</p>
          <p className={styles.hint}>
            Connect once, sign in, then use{' '}
            <strong>Available offline</strong> in Settings before your flight.
          </p>
        </div>
      </div>
    </div>
  )
}
