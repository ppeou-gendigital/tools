import { LineStyle } from 'lucide-react'
import { FloatingMenu as ToolsFloatingMenu } from '@tools/behavioral'
import { MenuPanel } from '@/patterns/MenuPanel'

export function FloatingMenu() {
  return (
    <ToolsFloatingMenu
      icon={LineStyle}
      label="Notas menu"
      renderPanel={({ corner, onClose }) => (
        <MenuPanel corner={corner} onClose={onClose} />
      )}
    />
  )
}
