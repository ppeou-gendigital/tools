import { Wrench } from 'lucide-react'
import { FloatingMenu as ToolsFloatingMenu } from '@tools/behavioral'
import { MenuPanel } from '@/patterns/MenuPanel'

export function FloatingMenu() {
  return (
    <ToolsFloatingMenu
      icon={Wrench}
      label="TOOLNAME menu"
      renderPanel={({ corner, edgeX, edgeY, fabLeft, fabTop, onClose }) => (
        <MenuPanel
          corner={corner}
          edgeX={edgeX}
          edgeY={edgeY}
          fabLeft={fabLeft}
          fabTop={fabTop}
          onClose={onClose}
        />
      )}
    />
  )
}
