import { forwardRef } from 'react'
import { cx } from '@/lib/cx'
import styles from './Input.module.scss'

export const Input = forwardRef(function Input(
  { className, type = 'text', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cx(styles.input, className)}
      {...rest}
    />
  )
})
