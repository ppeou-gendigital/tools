import { Repeat } from 'lucide-react'
import { FloatingMenu as ToolsFloatingMenu } from '@tools/behavioral'
import { MenuPanel } from '@/patterns/MenuPanel'

export function FloatingMenu() {
  return (
    <ToolsFloatingMenu
      icon={Repeat}
      label="Loopy menu"
      renderPanel={({ corner, onClose }) => (
        <MenuPanel corner={corner} onClose={onClose} />
      )}
    />
  )
}
