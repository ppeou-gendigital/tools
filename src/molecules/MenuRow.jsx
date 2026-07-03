import styles from './MenuRow.module.scss'

/**
 * Generic menu row shaped like `[icon]  label  [right slot]`. Closes the
 * menu after the click unless `keepOpen` is true.
 */
export function MenuRow({ icon: Icon, label, onClick, right, keepOpen = false, onClose }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={styles.item}
      onClick={() => {
        onClick?.()
        if (!keepOpen) onClose?.()
      }}
    >
      {Icon && <Icon size={14} className={styles.itemIcon} aria-hidden="true" />}
      <span className={styles.itemLabel}>{label}</span>
      {right}
    </button>
  )
}
