import { FolderTree } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function SiteTreeItem({ onClose }) {
  const { goSiteTree } = useNavigation()
  return (
    <MenuRow
      icon={FolderTree}
      label="Site tree"
      onClose={onClose}
      onClick={goSiteTree}
    />
  )
}
