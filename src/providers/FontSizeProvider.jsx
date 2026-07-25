import { useCallback } from 'react'
import {
  FontSizeProvider as ToolsFontSizeProvider,
  useFontSize,
} from '@tools/service'
import {
  applySyncOp,
  enqueueSyncOp,
} from '@/lib/supabaseSync'
import { opSetFontSize } from '@/lib/userDataOps'

export function FontSizeProvider({ children }) {
  const pushRemote = useCallback(async (userId, size) => {
    await enqueueSyncOp({
      stream: 'prefs',
      key: 'fontSize',
      fn: () =>
        applySyncOp({
          stream: 'prefs',
          userId,
          op: opSetFontSize(size),
        }),
    })
  }, [])

  return (
    <ToolsFontSizeProvider appId="toolname" pushRemote={pushRemote}>
      {children}
    </ToolsFontSizeProvider>
  )
}

export { useFontSize }
