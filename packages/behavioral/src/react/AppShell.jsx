import { cx } from '@tools/ui'

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {import('react').ReactNode} [props.chrome] — typically FloatingMenu
 * @param {import('react').ReactNode} [props.hosts] — overlays (playlist dock, …)
 * @param {boolean} [props.hideChrome]
 * @param {boolean} [props.fabClearance] — reserve bottom space under the FAB
 *   (Viaggio only; other tools leave this false)
 */
export function AppShell({
  children,
  chrome,
  hosts,
  hideChrome = false,
  fabClearance = false,
}) {
  return (
    <div
      className={cx('bh-shell', fabClearance && 'bh-shell--fab-clearance')}
      data-app-shell
    >
      <main className="bh-shell__main">{children}</main>
      {!hideChrome && hosts}
      {!hideChrome && chrome}
    </div>
  )
}
