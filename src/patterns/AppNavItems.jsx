import { FilePenLine, House, LayoutGrid } from 'lucide-react'
import { AppNavItems as ToolsAppNavItems } from '@tools/behavioral'
import { useNavigation } from '@/providers/NavigationProvider'

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
  const items = APP_NAV.map(({ id, label, icon, go }) => ({
    id,
    label,
    icon,
    onClick: nav[go],
  }))
  return <ToolsAppNavItems items={items} onClose={onClose} />
}
