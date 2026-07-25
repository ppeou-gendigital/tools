import { useCallback, useState } from 'react'
import { ThemeProvider as ToolsThemeProvider, useTheme } from '@tools/service'
import { isClockDaylight } from '@/lib/solar'
import { applySyncOp, enqueueSyncOp } from '@/lib/supabaseSync'
import { opSetTheme } from '@/lib/userDataOps'
import { ViaggioDaynightBridge } from '@/hooks/useViaggioDaynight'

function clockResolve() {
  return isClockDaylight() ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [resolveDaynight, setResolveDaynight] = useState(() => clockResolve)

  const syncResolve = useCallback((fn) => {
    // setState(fn) treats fn as an updater — wrap so the value is the resolve fn.
    setResolveDaynight(() => fn)
  }, [])

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
      appId="viaggio"
      defaultTheme="daynight"
      enableDaynight
      resolveDaynight={resolveDaynight}
      pushRemote={pushRemote}
    >
      <ViaggioDaynightBridge syncResolve={syncResolve} />
      {children}
    </ToolsThemeProvider>
  )
}

export { useTheme }
