import { House, Settings } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
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
  return (
    <>
      {APP_NAV.map(({ id, label, icon, go }) => (
        <MenuRow
          key={id}
          icon={icon}
          label={label}
          onClose={onClose}
          onClick={nav[go]}
        />
      ))}
    </>
  )
}
