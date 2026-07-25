import { useCallback } from 'react'
import {
  FabCornerProvider as ToolsFabCornerProvider,
  useFabCorner,
} from '@tools/service'
import {
  applySyncOp,
  enqueueSyncOp,
} from '@/lib/supabaseSync'
import { opSetFabCorner } from '@/lib/userDataOps'

export function FabCornerProvider({ children }) {
  const pushRemote = useCallback(async (userId, corner) => {
    await enqueueSyncOp({
      stream: 'prefs',
      key: 'fabCorner',
      fn: () =>
        applySyncOp({
          stream: 'prefs',
          userId,
          op: opSetFabCorner(corner),
        }),
    })
  }, [])

  return (
    <ToolsFabCornerProvider appId="toolname" pushRemote={pushRemote}>
      {children}
    </ToolsFabCornerProvider>
  )
}

export { useFabCorner }
