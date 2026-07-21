import { cx } from '@/lib/cx'
import styles from './PageHeader.module.scss'

/**
 * Shared page chrome: title row + optional actions + optional trailing
 * shortcuts (typically <PageShortcuts />).
 *
 * Layout contract for the header row:
 *   [ title (flex:1) ] [ page actions ] [ shortcuts → right via separator ]
 *
 * Pass `leading` for a back button (sub-pages). Pass `actions` for
 * page-specific toolbar buttons (info, filters, …). Pass `shortcuts` for
 * the right-hand nav cluster.
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
    <header className={cx(styles.header, className)}>
      <div className={styles.headerRow}>
        {leading}
        {title != null && title !== '' && (
          <h1 className={styles.title}>{title}</h1>
        )}
        {actions}
        {shortcuts}
      </div>
      {subtitle != null && subtitle !== '' && (
        <p className={styles.subtitle}>{subtitle}</p>
      )}
      {children}
    </header>
  )
}
