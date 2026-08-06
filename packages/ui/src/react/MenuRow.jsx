import { cx } from './cx.js'

export function MenuRow({
  icon: Icon,
  label,
  onClick,
  right,
  keepOpen = false,
  onClose,
  className,
  active = false,
}) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-current={active ? 'page' : undefined}
      className={cx('ui-menu-row', active && 'ui-menu-row--active', className)}
      onClick={() => {
        onClick?.()
        if (!keepOpen) onClose?.()
      }}
    >
      {Icon && <Icon size={14} className="ui-menu-row__icon" aria-hidden="true" />}
      <span className="ui-menu-row__label">{label}</span>
      {right}
    </button>
  )
}
