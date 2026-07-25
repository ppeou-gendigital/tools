import { forwardRef } from 'react'
import { cx } from './cx.js'

/**
 * @param {object} props
 * @param {import('react').ReactNode} [props.iconStart] — leading icon inside the field
 */
export const Input = forwardRef(function Input(
  { className, type = 'text', iconStart, ...rest },
  ref,
) {
  const input = (
    <input
      ref={ref}
      type={type}
      className={cx(
        'ui-input',
        iconStart && 'ui-input--icon-start',
        className,
      )}
      {...rest}
    />
  )

  if (!iconStart) return input

  return (
    <div className="ui-input-wrap">
      <span className="ui-input-wrap__icon" aria-hidden="true">
        {iconStart}
      </span>
      {input}
    </div>
  )
})
