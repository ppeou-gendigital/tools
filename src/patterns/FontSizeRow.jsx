import { AArrowDown, AArrowUp } from 'lucide-react'
import { useFontSize } from '@/providers/FontSizeProvider'
import styles from './FontSizeRow.module.scss'

export function FontSizeRow() {
  const { size, canDecrease, canIncrease, decrease, increase } = useFontSize()
  return (
    <div className={styles.fontSizeRow}>
      <button
        type="button"
        aria-label="Decrease text size"
        className={styles.fontSizeBtn}
        disabled={!canDecrease}
        onClick={decrease}
      >
        <AArrowDown size={14} aria-hidden="true" />
      </button>
      <span className={styles.fontSizeValue} aria-live="polite">
        {size}px
      </span>
      <button
        type="button"
        aria-label="Increase text size"
        className={styles.fontSizeBtn}
        disabled={!canIncrease}
        onClick={increase}
      >
        <AArrowUp size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
