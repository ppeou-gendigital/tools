import { CircleUserRound } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function ProfileItem({ onClose }) {
  const { goProfile } = useNavigation()
  return (
    <MenuRow
      icon={CircleUserRound}
      label="Profile"
      onClose={onClose}
      onClick={goProfile}
    />
  )
}
