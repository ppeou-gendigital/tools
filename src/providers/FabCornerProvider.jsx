import { useCallback } from 'react'
import {
  FabCornerProvider as ToolsFabCornerProvider,
  useFabCorner,
} from '@tools/service'
import {
  applySyncOp,
  enqueueSyncOp,
} from '@/lib/supabaseSync'
import { opSetAiFabCorner, opSetFabCorner } from '@/lib/userDataOps'

export function FabCornerProvider({ children }) {
  const pushRemote = useCallback(async (userId, patch = {}) => {
    const tasks = []
    if (patch.fabCorner != null) {
      tasks.push(
        enqueueSyncOp({
          stream: 'prefs',
          key: 'fabCorner',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opSetFabCorner(patch.fabCorner),
            }),
        }),
      )
    }
    if (patch.aiFabCorner != null) {
      tasks.push(
        enqueueSyncOp({
          stream: 'prefs',
          key: 'aiFabCorner',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opSetAiFabCorner(patch.aiFabCorner),
            }),
        }),
      )
    }
    if (tasks.length) await Promise.all(tasks)
  }, [])

  return (
    <ToolsFabCornerProvider appId="toolname" pushRemote={pushRemote}>
      {children}
    </ToolsFabCornerProvider>
  )
}

export { useFabCorner }
