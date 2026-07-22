import { forwardRef } from 'react'
import { cx } from '@/lib/cx'
import styles from './Textarea.module.scss'

export const Textarea = forwardRef(function Textarea(
  { className, rows = 3, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx(styles.textarea, className)}
      {...rest}
    />
  )
})
