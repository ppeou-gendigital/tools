import { cx } from './cx.js'

export function IconButton({
  icon: Icon,
  label,
  onClick,
  keepOpen = false,
  onClose,
  disabled = false,
  className,
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cx('ui-icon-btn', className)}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => {
        onClick?.()
        if (!keepOpen) onClose?.()
      }}
    >
      {Icon && <Icon size={14} aria-hidden="true" />}
    </button>
  )
}
