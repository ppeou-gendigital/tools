import { forwardRef } from 'react'
import { cx } from './cx.js'

export const Deck = forwardRef(function Deck(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('ui-deck', className)}
      tabIndex={0}
      {...rest}
    >
      {children}
    </div>
  )
})

export function Slide({
  span,
  spanMd,
  spanLg,
  spanXl,
  className,
  style,
  children,
  ...rest
}) {
  const spanVars = {}
  if (span !== undefined) spanVars['--slide-span'] = span
  if (spanMd !== undefined) spanVars['--slide-span-md'] = spanMd
  if (spanLg !== undefined) spanVars['--slide-span-lg'] = spanLg
  if (spanXl !== undefined) spanVars['--slide-span-xl'] = spanXl

  return (
    <div
      className={cx('ui-slide', className)}
      style={{ ...spanVars, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}
