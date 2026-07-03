import { cx } from '@/lib/cx'
import styles from './Deck.module.scss'

/**
 * Horizontal scroll-snap container. Each child should be a <Slide>. Native
 * scroll + snap - keyboard scroll works via tabIndex; no custom listeners.
 */
export function Deck({ className, children, ...rest }) {
  return (
    <div className={cx(styles.deck, className)} tabIndex={0} {...rest}>
      {children}
    </div>
  )
}

/**
 * A single slide inside a <Deck>. Width is set as `span` columns of a 12-col
 * grid slice of the deck's visible width. Provide per-breakpoint overrides
 * via `spanMd` / `spanLg` / `spanXl`; each cascades down to the previous
 * breakpoint's value when unset. Defaults to full-width (span=12).
 */
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
      className={cx(styles.slide, className)}
      style={{ ...spanVars, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}
