import { forwardRef } from 'react'
import { cx } from './cx.js'

export const Select = forwardRef(function Select(
  { className, children, fit = false, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cx('ui-select', fit && 'ui-select--fit', className)}
      {...rest}
    >
      {children}
    </select>
  )
})
