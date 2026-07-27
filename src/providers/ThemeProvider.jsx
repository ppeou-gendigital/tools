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

  // Daynight uses the package clock resolver (6:00–18:00 local).
  // Matches Viaggio prod — geo/solar bridge stays opt-in later.
  return (
    <ToolsThemeProvider
      appId="accesso"
      defaultTheme="daynight"
      enableDaynight
      pushRemote={pushRemote}
    >
      {children}
    </ToolsThemeProvider>
  )
}

export { useTheme }
