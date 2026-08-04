import { useCallback } from 'react'
import {
  FabCornerProvider as ToolsFabCornerProvider,
  useFabCorner,
} from '@tools/service'
import { applySyncOp, enqueueSyncOp } from '@/lib/supabaseSync'
import { opSetFabCorner } from '@/lib/userDataOps'

export function FabCornerProvider({ children }) {
  const pushRemote = useCallback(async (userId, patch = {}) => {
    // Lattice provider may also pass aiFabCorner; this app has no AI FAB — ignore.
    if (patch.fabCorner == null) return
    await enqueueSyncOp({
      stream: 'prefs',
      key: 'fabCorner',
      fn: () =>
        applySyncOp({
          stream: 'prefs',
          userId,
          op: opSetFabCorner(patch.fabCorner),
        }),
    })
  }, [])

  return (
    <ToolsFabCornerProvider appId="loopy" pushRemote={pushRemote}>
      {children}
    </ToolsFabCornerProvider>
  )
}

export { useFabCorner }
