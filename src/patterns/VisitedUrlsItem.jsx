import { History } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function VisitedUrlsItem({ onClose }) {
  const { goVisitedUrls } = useNavigation()
  return (
    <MenuRow
      icon={History}
      label="Visited URLs"
      onClose={onClose}
      onClick={goVisitedUrls}
    />
  )
}
