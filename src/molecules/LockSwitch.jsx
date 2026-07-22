import { Lock, LockOpen } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './LockSwitch.module.scss'

/**
 * iOS-style lock switch.
 * - Green (on / aria-checked) = locked
 * - Gray (off) = unlocked
 */
export function LockSwitch({
  locked,
  onChange,
  disabled = false,
  label,
  className,
}) {
  const ariaLabel =
    label || (locked ? 'Locked' : 'Unlocked')

  function handleClick() {
    if (disabled) return
    onChange?.(!locked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={locked}
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled}
      className={cx(styles.switch, className)}
      data-locked={locked ? 'true' : 'false'}
      onClick={handleClick}
    >
      <span className={styles.iconUnlock} aria-hidden="true">
        <LockOpen size={11} strokeWidth={2.5} />
      </span>
      <span className={styles.iconLock} aria-hidden="true">
        <Lock size={11} strokeWidth={2.5} />
      </span>
      <span className={styles.thumb} aria-hidden="true" />
    </button>
  )
}
