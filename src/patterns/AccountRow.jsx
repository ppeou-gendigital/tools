import { AccountRow as ToolsAccountRow } from '@tools/behavioral'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'

export function AccountRow({ onClose }) {
  const { goProfile, goSettings } = useNavigation()
  const { signOut } = useAuth()
  return (
    <ToolsAccountRow
      onClose={onClose}
      onProfile={goProfile}
      onSettings={goSettings}
      onSignOut={signOut}
    />
  )
}
