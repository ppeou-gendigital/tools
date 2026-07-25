import { House, Settings } from 'lucide-react'
import { AppNavItems as ToolsAppNavItems } from '@tools/behavioral'
import { useNavigation } from '@/providers/NavigationProvider'

/**
 * Shared destinations for the page-header icon toolbar and the FAB “App”
 * section.
 */
export const APP_NAV = [
  { id: 'home', label: 'Home', icon: House, go: 'goHome' },
  { id: 'settings', label: 'Settings', icon: Settings, go: 'goSettings' },
]

export function AppNavItems({ onClose }) {
  const nav = useNavigation()
  const items = APP_NAV.map(({ id, label, icon, go }) => ({
    id,
    label,
    icon,
    onClick: nav[go],
  }))
  return <ToolsAppNavItems items={items} onClose={onClose} />
}
