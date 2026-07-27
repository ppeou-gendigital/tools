import { Sparkles } from 'lucide-react'
import { useCornerDrag } from '@tools/behavioral'
import { isAiPlanningEnabled } from '@/lib/ai/enabled'
import { useAiPlanner } from '@/providers/AiPlannerProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { useNavigation } from '@/providers/NavigationProvider'

/**
 * Draggable floating AI FAB — rose accent; defaults to the opposite corner
 * from the menu FAB so the two never stack.
 */
export function FloatingAiButton() {
  const enabled = isAiPlanningEnabled()
  const { openCreate, openChat } = useAiPlanner()
  const { params } = useNavigation()
  const { corner: menuCorner } = useFabCorner()
  const journeyId = params?.journeyId || null
  const { corner, dragOffset, isDragging, wasDragged, bind } = useCornerDrag({
    fabId: 'ai',
  })
  const { onPointerDown: dragPointerDown, ...restBind } = bind

  if (!enabled) return null

  const handleClick = () => {
    if (wasDragged()) return
    if (journeyId) openChat(journeyId)
    else openCreate()
  }

  const fabStyle = dragOffset
    ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }
    : undefined

  const label = journeyId ? 'AI planner' : 'Plan with AI'
  const stacked = corner === menuCorner

  return (
    <div className="bh-fab-wrap" aria-hidden={false}>
      <button
        type="button"
        className="bh-fab"
        data-corner={corner}
        data-fab="ai"
        data-stacked={stacked ? 'true' : undefined}
        data-dragging={isDragging ? 'true' : undefined}
        aria-label={label}
        title={label}
        style={fabStyle}
        {...restBind}
        onPointerDown={dragPointerDown}
        onClick={handleClick}
      >
        <Sparkles size={20} aria-hidden="true" />
      </button>
    </div>
  )
}
