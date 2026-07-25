import { cx } from './cx.js'

export function Divider({ className, ...rest }) {
  return <div role="separator" className={cx('ui-divider', className)} {...rest} />
}
