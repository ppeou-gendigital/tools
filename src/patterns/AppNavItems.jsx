import { House, Lock, Settings } from 'lucide-react'
import { AppNavItems as ToolsAppNavItems } from '@tools/behavioral'
import { useNavigation } from '@/providers/NavigationProvider'

export const APP_NAV = [
  { id: 'home', label: 'Notes', icon: House, go: 'goHome' },
  { id: 'lockboxes', label: 'Lockboxes', icon: Lock, go: 'goLockboxes' },
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

export function useAppShortcutItems() {
  const nav = useNavigation()
  return APP_NAV.map(({ id, label, icon, go }) => ({
    id,
    label,
    icon,
    onClick: nav[go],
  }))
}
