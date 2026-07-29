import { cx } from '@tools/ui'

export function PageHeader({
  title,
  subtitle,
  subtitleInline = false,
  leading,
  actions,
  shortcuts,
  className,
  children,
}) {
  const showSubtitle = subtitle != null && subtitle !== ''
  const inlineSubtitle = subtitleInline && showSubtitle

  return (
    <header
      className={cx(
        'is-fluid-width',
        'bh-page-header',
        inlineSubtitle && 'bh-page-header--inline-subtitle',
        className,
      )}
    >
      <div className="bh-page-header__row">
        {leading && <div className="bh-page-header__leading">{leading}</div>}
        {title != null && title !== '' && (
          inlineSubtitle ? (
            <div className="bh-page-header__title-block">
              <h1 className="bh-page-header__title">{title}</h1>
              <p className="bh-page-header__subtitle">{subtitle}</p>
            </div>
          ) : (
            <h1 className="bh-page-header__title">{title}</h1>
          )
        )}
        {(actions || shortcuts) && (
          <div className="bh-page-header__trailing">
            {actions}
            {shortcuts}
          </div>
        )}
      </div>
      {!inlineSubtitle && showSubtitle && (
        <p className="bh-page-header__subtitle">{subtitle}</p>
      )}
      {children}
    </header>
  )
}
