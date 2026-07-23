import { forwardRef } from 'react'
import { cx } from '@/lib/cx'
import styles from './Select.module.scss'

export const Select = forwardRef(function Select(
  { className, children, fit = false, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cx(styles.select, fit && styles.fit, className)}
      {...rest}
    >
      {children}
    </select>
  )
})
