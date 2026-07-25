import { AArrowDown, AArrowUp, Monitor, Moon, Sun, Sunrise } from 'lucide-react'
import { IconButton } from '@tools/ui'
import { useTheme, useFontSize } from '@tools/service'

function nextTheme(current, cycle) {
  const list = cycle?.length ? cycle : ['light', 'dark', 'system']
  const i = list.indexOf(current)
  return list[(i + 1) % list.length] ?? list[0]
}

function themeIcon(theme) {
  if (theme === 'light') return Sun
  if (theme === 'dark') return Moon
  if (theme === 'daynight') return Sunrise
  return Monitor
}

function themeLabel(theme) {
  if (theme === 'light') return 'Light'
  if (theme === 'dark') return 'Dark'
  if (theme === 'daynight') return 'Day/night'
  return 'System'
}

export function AppearanceRow({ onClose, themeCycle }) {
  const { theme, setTheme, themes } = useTheme()
  const { size, canDecrease, canIncrease, decrease, increase } = useFontSize()
  const cycle = themeCycle ?? themes
  const Icon = themeIcon(theme)
  return (
    <div className="bh-appearance-row">
      <IconButton
        icon={Icon}
        label={`Theme: ${themeLabel(theme)}`}
        keepOpen
        onClose={onClose}
        onClick={() => setTheme(nextTheme(theme, cycle))}
      />
      <div className="bh-appearance-size">
        <IconButton
          icon={AArrowDown}
          label="Decrease text size"
          keepOpen
          onClose={onClose}
          onClick={decrease}
          disabled={!canDecrease}
        />
        <span className="bh-appearance-value" aria-live="polite">
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
