import { Sparkles } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { isAiPlanningEnabled } from '@/lib/ai/enabled'
import { useAiPlanner } from '@/providers/AiPlannerProvider'
import { cx } from '@/lib/cx'

/**
 * Header Sparkles control. Pass journeyId for chat mode; omit for create-trip.
 * Optional mapFocus ({ lat, lng }) anchors place suggestions to the map view.
 */
export function AiPlannerButton({
  journeyId,
  className,
  label,
  title,
  mapFocus = null,
}) {
  const enabled = isAiPlanningEnabled()
  const { openCreate, openChat } = useAiPlanner()

  if (!enabled) return null

  const isCreate = !journeyId
  const hasMap =
    mapFocus &&
    Number.isFinite(Number(mapFocus.lat)) &&
    Number.isFinite(Number(mapFocus.lng))
  const aria =
    label ||
    (isCreate
      ? 'Plan with AI'
      : hasMap
        ? 'AI planner — suggest places near map'
        : 'AI planner')
  const tip = title || aria

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cx(className)}
      onClick={() =>
        isCreate
          ? openCreate()
          : openChat(journeyId, hasMap ? { mapFocus } : undefined)
      }
      aria-label={aria}
      title={tip}
    >
      <Sparkles size={14} aria-hidden="true" />
    </Button>
  )
}
