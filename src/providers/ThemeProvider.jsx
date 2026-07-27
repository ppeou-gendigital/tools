import { useCallback, useMemo, useRef, useState } from 'react'
import { ThemeProvider as ToolsThemeProvider, useTheme } from '@tools/service'
import { isClockDaylight } from '@/lib/solar'
import { applySyncOp, enqueueSyncOp } from '@/lib/supabaseSync'
import { opSetTheme } from '@/lib/userDataOps'
import { ViaggioDaynightBridge } from '@/hooks/useViaggioDaynight'

function clockResolve() {
  return isClockDaylight() ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const resolverRef = useRef(clockResolve)
  // Epoch rebuilds the thin wrapper so Tools ThemeProvider re-applies theme
  // at solar/clock boundaries without syncResolve setState storms.
  const [epoch, setEpoch] = useState(0)

  // epoch is intentional: new wrapper identity makes Tools ThemeProvider re-apply.
  const resolveDaynight = useMemo(
    () => () => resolverRef.current(),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bump via epoch
    [epoch],
  )

  const syncResolve = useCallback((fn) => {
    if (typeof fn === 'function') resolverRef.current = fn
  }, [])

  const bumpDaynight = useCallback(() => {
    setEpoch((n) => n + 1)
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
      <ViaggioDaynightBridge
        syncResolve={syncResolve}
        bumpDaynight={bumpDaynight}
      />
      {children}
    </ToolsThemeProvider>
  )
}

export { useTheme }
