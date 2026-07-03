import { Settings } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function SettingsItem({ onClose }) {
  const { goSettings } = useNavigation()
  return (
    <MenuRow
      icon={Settings}
      label="Settings"
      onClose={onClose}
      onClick={goSettings}
    />
  )
}
