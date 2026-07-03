import { forwardRef } from 'react'
import { cx } from '@/lib/cx'
import styles from './Button.module.scss'

const VARIANTS = {
  default: null,
  secondary: styles.secondary,
  outline: styles.outline,
  ghost: styles.ghost,
  destructive: styles.destructive,
}

const SIZES = {
  default: null,
  sm: styles.sizeSm,
  lg: styles.sizeLg,
  icon: styles.sizeIcon,
}

export const Button = forwardRef(function Button(
  {
    variant = 'default',
    size = 'default',
    fullWidth = false,
    className,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        styles.button,
        VARIANTS[variant],
        SIZES[size],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...rest}
    />
  )
})
