import { cx } from '@/lib/cx'
import styles from './Label.module.scss'

export function Label({ className, ...rest }) {
  return <label className={cx(styles.label, className)} {...rest} />
}
