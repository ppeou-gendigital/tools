import { FilePenLine, House, LayoutGrid } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

/**
 * Shared destinations for the page-header icon toolbar and the FAB “App”
 * section. Replace / extend this list as your tool grows past the demos.
 */
export const APP_NAV = [
  { id: 'home', label: 'Home', icon: House, go: 'goHome' },
  { id: 'deck-demo', label: 'Deck demo', icon: LayoutGrid, go: 'goDeckDemo' },
  {
    id: 'rich-text-demo',
    label: 'Rich text demo',
    icon: FilePenLine,
    go: 'goRichTextDemo',
  },
]

export function AppNavItems({ onClose }) {
  const nav = useNavigation()
  return (
    <>
      {APP_NAV.map(({ id, label, icon, go }) => (
        <MenuRow
          key={id}
          icon={icon}
          label={label}
          onClose={onClose}
          onClick={nav[go]}
        />
      ))}
    </>
  )
}
