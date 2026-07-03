import { AArrowDown, AArrowUp, Monitor, Moon, Sun } from 'lucide-react'
import { IconButton } from '@/molecules/IconButton'
import { useTheme } from '@/providers/ThemeProvider'
import { useFontSize } from '@/providers/FontSizeProvider'
import styles from './AppearanceRow.module.scss'

const THEME_CYCLE = ['light', 'dark', 'system']

function nextTheme(current) {
  const i = THEME_CYCLE.indexOf(current)
  return THEME_CYCLE[(i + 1) % THEME_CYCLE.length] ?? 'system'
}

function themeIcon(theme) {
  if (theme === 'light') return Sun
  if (theme === 'dark') return Moon
  return Monitor
}

function themeLabel(theme) {
  if (theme === 'light') return 'Light'
  if (theme === 'dark') return 'Dark'
  return 'System'
}

// Combined "appearance" row: theme cycle on the left, font-size stepper on
// the right. All controls keep the menu open on click since they mutate
// preview state the user is likely to adjust multiple times in a row.
export function AppearanceRow({ onClose }) {
  const { theme, setTheme } = useTheme()
  const { size, canDecrease, canIncrease, decrease, increase } = useFontSize()
  const Icon = themeIcon(theme)
  return (
    <div className={styles.row}>
      <IconButton
        icon={Icon}
        label={`Theme: ${themeLabel(theme)}`}
        keepOpen
        onClose={onClose}
        onClick={() => setTheme(nextTheme(theme))}
      />
      <div className={styles.size}>
        <IconButton
          icon={AArrowDown}
          label="Decrease text size"
          keepOpen
          onClose={onClose}
          onClick={decrease}
          disabled={!canDecrease}
        />
        <span className={styles.value} aria-live="polite">
          {size}px
        </span>
        <IconButton
          icon={AArrowUp}
          label="Increase text size"
          keepOpen
          onClose={onClose}
          onClick={increase}
          disabled={!canIncrease}
        />
      </div>
    </div>
  )
}
