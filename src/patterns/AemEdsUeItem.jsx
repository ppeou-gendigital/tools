import { ListTree } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function AemEdsUeItem({ onClose }) {
  const { goAemEdsUe } = useNavigation()
  return (
    <MenuRow
      icon={ListTree}
      label="AEM EDS-UE"
      onClose={onClose}
      onClick={goAemEdsUe}
    />
  )
}
