import { cx } from './cx.js'

export function LoadingState({ children = 'Loading…', className }) {
  return (
    <p
      className={cx('ui-loading', className)}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="ui-loading__dot" aria-hidden="true" />
      {children}
    </p>
  )
}
