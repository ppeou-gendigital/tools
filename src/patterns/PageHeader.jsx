import { cx } from '@/lib/cx'
import styles from './PageHeader.module.scss'

/**
 * Shared page chrome: title row + optional actions + optional trailing
 * shortcuts (typically <PageShortcuts />).
 *
 * Mobile: back + actions/shortcuts on first row; title full-width below.
 * md+: single row [leading][title][actions][shortcuts].
 *
 * Width comes from the global `.is-fluid-width` layout utility.
 */
export function PageHeader({
  title,
  subtitle,
  leading,
  actions,
  shortcuts,
  className,
  children,
}) {
  return (
    <header className={cx('is-fluid-width', styles.header, className)}>
      <div className={styles.headerRow}>
        {leading && <div className={styles.leading}>{leading}</div>}
        {title != null && title !== '' && (
          <h1 className={styles.title}>{title}</h1>
        )}
        {(actions || shortcuts) && (
          <div className={styles.trailing}>
            {actions}
            {shortcuts}
          </div>
        )}
      </div>
      {subtitle != null && subtitle !== '' && (
        <p className={styles.subtitle}>{subtitle}</p>
      )}
      {children}
    </header>
  )
}
