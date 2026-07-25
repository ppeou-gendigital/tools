import { forwardRef } from 'react'
import { cx } from './cx.js'

const VARIANTS = {
  default: null,
  secondary: 'ui-btn--secondary',
  outline: 'ui-btn--outline',
  ghost: 'ui-btn--ghost',
  destructive: 'ui-btn--destructive',
}

const SIZES = {
  default: null,
  sm: 'ui-btn--sm',
  lg: 'ui-btn--lg',
  icon: 'ui-btn--icon',
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
        'ui-btn',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'ui-btn--full',
        className,
      )}
      {...rest}
    />
  )
})
