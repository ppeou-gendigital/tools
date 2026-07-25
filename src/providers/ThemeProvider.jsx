import { useCallback } from 'react'
import { ThemeProvider as ToolsThemeProvider, useTheme } from '@tools/service'
import { applySyncOp, enqueueSyncOp } from '@/lib/supabaseSync'
import { opSetTheme } from '@/lib/userDataOps'

export function ThemeProvider({ children }) {
  const pushRemote = useCallback(async (userId, theme) => {
    await enqueueSyncOp({
      stream: 'prefs',
      key: 'theme',
      fn: () =>
        applySyncOp({
          stream: 'prefs',
          userId,
          op: opSetTheme(theme),
        }),
    })
  }, [])

  return (
    <ToolsThemeProvider
      appId="loopy"
      defaultTheme="system"
      pushRemote={pushRemote}
    >
      {children}
    </ToolsThemeProvider>
  )
}

export { useTheme }
