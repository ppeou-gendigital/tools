import { AccountRow as ToolsAccountRow } from '@tools/behavioral'
import { useNavigation } from '@/providers/NavigationProvider'

export function AccountRow({ onClose }) {
  const { goSettings } = useNavigation()
  return <ToolsAccountRow onClose={onClose} onSettings={goSettings} />
}
