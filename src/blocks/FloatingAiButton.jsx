import { Sparkles } from 'lucide-react'
import { useCornerDrag } from '@tools/behavioral'
import { isAiCareEnabled } from '@/lib/ai/enabled'
import { useAiCare } from '@/providers/AiCareProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'

/**
 * Draggable floating AI FAB — defaults to the opposite corner from the menu
 * FAB so the two never stack.
 */
export function FloatingAiButton() {
  const enabled = isAiCareEnabled()
  const { openChat } = useAiCare()
  const vault = usePatientVault()
  const { corner: menuCorner } = useFabCorner()
  const { corner, dragOffset, isDragging, wasDragged, bind } = useCornerDrag({
    fabId: 'ai',
  })
  const { onPointerDown: dragPointerDown, ...restBind } = bind

  if (!enabled) return null
  if (!vault.isUnlocked || !vault.patientId) return null

  const handleClick = () => {
    if (wasDragged()) return
    openChat(vault.patientId)
  }

  const fabStyle = dragOffset
    ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }
    : undefined

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
        aria-label="AI care chat"
        title="AI care chat"
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
