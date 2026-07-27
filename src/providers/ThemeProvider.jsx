import { useCallback, useRef } from 'react'
import { ThemeProvider as ToolsThemeProvider, useTheme } from '@tools/service'
import { isClockDaylight } from '@/lib/solar'
import { applySyncOp, enqueueSyncOp } from '@/lib/supabaseSync'
import { opSetTheme } from '@/lib/userDataOps'
import { ViaggioDaynightBridge } from '@/hooks/useViaggioDaynight'

function clockResolve() {
  return isClockDaylight() ? 'light' : 'dark'
}

function applyResolvedTheme(resolved) {
  if (typeof document === 'undefined') return
  if (resolved !== 'light' && resolved !== 'dark') return
  document.documentElement.dataset.theme = resolved
  document.documentElement.style.colorScheme = resolved
}

export function ThemeProvider({ children }) {
  const resolverRef = useRef(clockResolve)
  // Forever-stable callback — must NOT change identity (avoids ThemeContext
  // update storms / React #185 max update depth).
  const resolveDaynight = useCallback(() => resolverRef.current(), [])

  const syncResolve = useCallback((fn) => {
    if (typeof fn === 'function') resolverRef.current = fn
  }, [])

  /** Re-paint daynight without setState / context invalidation. */
  const applyDaynight = useCallback(() => {
    applyResolvedTheme(resolverRef.current())
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
        applyDaynight={applyDaynight}
      />
      {children}
    </ToolsThemeProvider>
  )
}

export { useTheme }
