import { ExternalLink } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function AemJumpItem({ onClose }) {
  const { goAemJump } = useNavigation()
  return (
    <MenuRow
      icon={ExternalLink}
      label="AEM Jump"
      onClose={onClose}
      onClick={goAemJump}
    />
  )
}
