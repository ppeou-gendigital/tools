import { Bookmark } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function FavLinksItem({ onClose }) {
  const { goFavLinks } = useNavigation()
  return (
    <MenuRow
      icon={Bookmark}
      label="Fav links"
      onClose={onClose}
      onClick={goFavLinks}
    />
  )
}
