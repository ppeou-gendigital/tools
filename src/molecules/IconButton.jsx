import styles from './IconButton.module.scss'

/**
 * Ghost square icon-only button used in compact menu rows. The `label` prop
 * powers both `aria-label` and `title`, so screen readers and hover tooltips
 * see the same text without any visible glyph.
 *
 * By default clicking dismisses the parent menu via `onClose`. Set
 * `keepOpen` for controls that mutate state in place (theme cycle, font
 * size stepper) and don't want the panel to close after each tap.
 */
export function IconButton({
  icon: Icon,
  label,
  onClick,
  keepOpen = false,
  onClose,
  disabled = false,
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={styles.btn}
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
