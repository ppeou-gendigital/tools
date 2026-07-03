import { GalleryHorizontal } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function DeckTestItem({ onClose }) {
  const { goDeckTest } = useNavigation()
  return (
    <MenuRow
      icon={GalleryHorizontal}
      label="Deck test"
      onClose={onClose}
      onClick={goDeckTest}
    />
  )
}
