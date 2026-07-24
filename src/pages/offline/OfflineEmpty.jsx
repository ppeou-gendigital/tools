import { WifiOff } from 'lucide-react'
import { PageHeader } from '@/patterns/PageHeader'
import { cx } from '@/lib/cx'
import styles from '../Page.module.scss'

/** Shown when there is no network and no pinned journey packs. */
export function OfflineEmpty() {
  return (
    <div className={styles.page}>
      <PageHeader title="Viaggio" />
      <div className={cx('is-fluid-width', styles.body)}>
        <div className={styles.empty}>
          <WifiOff size={28} aria-hidden="true" />
          <p className={styles.error}>You’re offline</p>
          <p className={styles.hint}>
            Connect once and open a journey, then use{' '}
            <strong>Available offline</strong> in journey settings before your
            flight.
          </p>
        </div>
      </div>
    </div>
  )
}
