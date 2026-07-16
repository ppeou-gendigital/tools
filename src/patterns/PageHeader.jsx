import { forwardRef } from 'react'
import { AppToolbar } from '@/patterns/AppToolbar'
import { cx } from '@/lib/cx'
import styles from './PageHeader.module.scss'

// Shared page header. Every page renders exactly one of these at the
// top of its content area. Layout:
//
//   [ title / subtitle ] ... [ page actions | app actions ]
//
// - Page actions come from `actions` (page-specific icon buttons like
//   Add, Lock, Capture). Should render <HeaderIconButton> children so
//   they visually align with the app toolbar.
// - App actions are always the same three shortcuts (Credentials,
//   Credit cards, Settings) and are owned by <AppToolbar> — pages
//   don't need to know about them.
// - A thin vertical divider separates the two clusters so it's clear
//   which icons belong to the page vs. the app.
//
// Back navigation lives in the FAB / app-nav on purpose — the header
// deliberately stays single-row to keep the popup dense.
export function PageHeader({ title, subtitle, actions, className }) {
  const hasPageActions =
    actions !== undefined && actions !== null && actions !== false
  return (
    <header className={cx(styles.header, className)}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      <div className={styles.toolbar}>
        {hasPageActions && (
          <div className={styles.pageActions}>{actions}</div>
        )}
        {hasPageActions && (
          <span className={styles.divider} aria-hidden="true" />
        )}
        <div className={styles.appActions}>
          <AppToolbar />
        </div>
      </div>
    </header>
  )
}

// Shared icon-only button used both by page-actions (rendered by the
// page inside <PageHeader actions={...}>) and by <AppToolbar>. Kept
// as a plain <button> rather than reusing molecules/Button because
// the toolbar wants a tighter 32×32 footprint and always-ghost look.
export const HeaderIconButton = forwardRef(function HeaderIconButton(
  { active = false, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.iconBtn, active && styles.iconBtnActive, className)}
      data-active={active ? 'true' : undefined}
      {...rest}
    >
      {children}
    </button>
  )
})
