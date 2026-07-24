import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNotes } from '@/providers/NotesProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { normalizeWorkspace } from '@/lib/workspaceModel'
import gateStyles from '@/blocks/AuthGate.module.scss'

/**
 * Load the pinned workspace pack into NotesProvider once offline mode starts.
 */
export function OfflineHydrate({ children }) {
  const { primaryPack } = useOffline()
  const { setWorkspaceFromRemote, ready } = useNotes()
  const packKey = primaryPack
    ? `${primaryPack.scopeId}:${primaryPack.syncedAt}`
    : null
  const [appliedKey, setAppliedKey] = useState(null)

  if (packKey && primaryPack?.workspace && appliedKey !== packKey) {
    setAppliedKey(packKey)
    setWorkspaceFromRemote(normalizeWorkspace(primaryPack.workspace))
  } else if (!packKey && appliedKey !== null) {
    setAppliedKey(null)
  }

  if (!ready || !packKey || appliedKey !== packKey) {
    return (
      <div className={gateStyles.loading}>
        <Loader2 size={16} className={gateStyles.spinner} aria-hidden="true" />
        <span>Loading offline notes</span>
      </div>
    )
  }

  return children
}
