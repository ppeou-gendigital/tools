import { House, Lock } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function AppNavItems({ onClose }) {
  const { goHome, goLockboxes } = useNavigation()
  return (
    <>
      <MenuRow
        icon={House}
        label="Notes"
        onClose={onClose}
        onClick={goHome}
      />
      <MenuRow
        icon={Lock}
        label="Lockboxes"
        onClose={onClose}
        onClick={goLockboxes}
      />
    </>
  )
}
