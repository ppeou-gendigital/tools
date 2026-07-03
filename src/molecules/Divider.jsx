import { cx } from '@/lib/cx'
import styles from './Divider.module.scss'

/**
 * Horizontal 1px separator, typically used between grouped menu rows.
 */
export function Divider({ className, ...rest }) {
  return <div role="separator" className={cx(styles.divider, className)} {...rest} />
}
