import { cx } from './cx.js'

export function MenuRow({
  icon: Icon,
  label,
  onClick,
  right,
  keepOpen = false,
  onClose,
  className,
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cx('ui-menu-row', className)}
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
