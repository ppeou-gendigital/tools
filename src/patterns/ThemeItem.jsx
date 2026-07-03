import { Monitor, Moon, Sun } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useTheme } from '@/providers/ThemeProvider'

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

export function ThemeItem({ onClose }) {
  const { theme, setTheme } = useTheme()
  const Icon = themeIcon(theme)
  return (
    <MenuRow
      icon={Icon}
      label={`Theme: ${themeLabel(theme)}`}
      keepOpen
      onClose={onClose}
      onClick={() => setTheme(nextTheme(theme))}
    />
  )
}
