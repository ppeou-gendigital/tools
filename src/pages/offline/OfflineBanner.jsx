import styles from './Offline.module.scss'

export function OfflineBanner({ syncedAt }) {
  const when = syncedAt
    ? new Date(syncedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null
  return (
    <p className={styles.banner} role="status">
      Offline{when ? ` · last synced ${when}` : ''} · read-only
    </p>
  )
}
