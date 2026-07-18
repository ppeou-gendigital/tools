import { House } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function LandingItem({ onClose }) {
  const { goLanding } = useNavigation()
  return (
    <MenuRow
      icon={House}
      label="Landing"
      onClose={onClose}
      onClick={goLanding}
    />
  )
}
