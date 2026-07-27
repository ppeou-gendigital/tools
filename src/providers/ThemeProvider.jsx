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

  // Daynight uses the package clock resolver only (no geo bridge).
  // The geo bridge was causing React #185 max-update-depth blank screens.
  return (
    <ToolsThemeProvider
      appId="viaggio"
      defaultTheme="daynight"
      enableDaynight
      pushRemote={pushRemote}
    >
      {children}
    </ToolsThemeProvider>
  )
}

export { useTheme }
