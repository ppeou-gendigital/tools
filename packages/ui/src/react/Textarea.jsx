import { forwardRef } from 'react'
import { cx } from './cx.js'

export const Textarea = forwardRef(function Textarea(
  { className, rows = 3, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx('ui-textarea', className)}
      {...rest}
    />
  )
})
