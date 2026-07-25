import { cx } from '@tools/ui'

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
    <header className={cx('is-fluid-width', 'bh-page-header', className)}>
      <div className="bh-page-header__row">
        {leading && <div className="bh-page-header__leading">{leading}</div>}
        {title != null && title !== '' && (
          <h1 className="bh-page-header__title">{title}</h1>
        )}
        {(actions || shortcuts) && (
          <div className="bh-page-header__trailing">
            {actions}
            {shortcuts}
          </div>
        )}
      </div>
      {subtitle != null && subtitle !== '' && (
        <p className="bh-page-header__subtitle">{subtitle}</p>
      )}
      {children}
    </header>
  )
}
