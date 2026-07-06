import { CreditCard } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useNavigation } from '@/providers/NavigationProvider'

export function CreditCardsItem({ onClose }) {
  const { goCreditCards } = useNavigation()
  return (
    <MenuRow
      icon={CreditCard}
      label="Credit cards"
      onClose={onClose}
      onClick={goCreditCards}
    />
  )
}
