import { cx } from './cx.js'

export function Label({ className, ...rest }) {
  return <label className={cx('ui-label', className)} {...rest} />
}
