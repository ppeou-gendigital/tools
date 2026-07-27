import { Sparkles } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { isAiCareEnabled } from '@/lib/ai/enabled'
import { useAiCare } from '@/providers/AiCareProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { cx } from '@/lib/cx'

/** Header Sparkles control — opens care chat for the active patient. */
export function AiCareButton({ className, label, title }) {
  const enabled = isAiCareEnabled()
  const { openChat } = useAiCare()
  const vault = usePatientVault()

  if (!enabled || !vault.isUnlocked || !vault.patientId) return null

  const aria = label || 'AI care chat'
  const tip = title || aria

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cx(className)}
      onClick={() => openChat(vault.patientId)}
      aria-label={aria}
      title={tip}
    >
      <Sparkles size={14} aria-hidden="true" />
    </Button>
  )
}
