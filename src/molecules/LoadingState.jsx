import { cx } from '@/lib/cx'
import styles from './LoadingState.module.scss'

/**
 * Consistent loading status for page bodies and panels.
 */
export function LoadingState({ children = 'Loading…', className }) {
  return (
    <p
      className={cx(styles.loading, className)}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </p>
  )
}
