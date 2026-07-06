import { KeyRound } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function CredentialsItem({ onClose }) {
  const { goCredentials } = useNavigation()
  return (
    <MenuRow
      icon={KeyRound}
      label="Credentials"
      onClose={onClose}
      onClick={goCredentials}
    />
  )
}
