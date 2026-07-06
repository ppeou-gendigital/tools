import { LayoutTemplate } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function DeckDemoItem({ onClose }) {
  const { goDeckDemo } = useNavigation()
  return (
    <MenuRow
      icon={LayoutTemplate}
      label="Deck demo"
      onClose={onClose}
      onClick={goDeckDemo}
    />
  )
}
