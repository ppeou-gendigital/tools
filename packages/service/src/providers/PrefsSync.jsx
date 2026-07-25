import { useEffect, useRef } from 'react'
import { useAuth } from './AuthProvider.jsx'
import { useFabCorner } from './FabCornerProvider.jsx'
import { useFontSize } from './FontSizeProvider.jsx'
import { useTheme } from './ThemeProvider.jsx'

/**
 * Shared prefs pull loop. Apps inject pullPrefs + optional extra handlers.
 *
 * @param {object} props
 * @param {string} props.appId
 * @param {(userId: string) => Promise<{ data: Record<string, any> } | null>} props.pullPrefs
 * @param {Array<{ key: string, get: () => any, set: (v: any, opts: { fromRemote: boolean }) => any, ready: boolean }>} [props.extra]
 */
export function PrefsSync({ appId, pullPrefs, extra = [] }) {
  const { user, loading: authLoading } = useAuth()
  const { theme, setTheme, ready: themeReady } = useTheme()
  const { size: fontSize, setSize: setFontSize, ready: fontReady } = useFontSize()
  const { corner: fabCorner, setCorner: setFabCorner, ready: fabReady } =
    useFabCorner()

  const initialPulledForUserRef = useRef(null)
  const prefsRef = useRef(null)

  const fields = [
    { key: 'theme', get: () => theme, set: setTheme, ready: themeReady },
    { key: 'fontSize', get: () => fontSize, set: setFontSize, ready: fontReady },
    { key: 'fabCorner', get: () => fabCorner, set: setFabCorner, ready: fabReady },
    ...extra,
  ]

  useEffect(() => {
    const live = {}
    for (const f of fields) live[f.key] = f.get()
    prefsRef.current = live
  })

  const userId = user?.id ?? null
  const providersReady = fields.every((f) => f.ready)

  useEffect(() => {
    if (!userId) initialPulledForUserRef.current = null
  }, [userId])

  useEffect(() => {
    if (authLoading || !userId || !providersReady || !pullPrefs) return
    if (initialPulledForUserRef.current === userId) return
    initialPulledForUserRef.current = userId

    const snapshot = { ...prefsRef.current }
    let cancelled = false
    ;(async () => {
      try {
        const remote = await pullPrefs(userId)
        if (cancelled || !remote) return
        const dirtyKeys = new Set()
        const live = prefsRef.current
        for (const f of fields) {
          if (live[f.key] !== snapshot[f.key]) dirtyKeys.add(f.key)
        }
        for (const f of fields) {
          if (dirtyKeys.has(f.key)) continue
          const remoteVal = remote.data?.[f.key]
          if (remoteVal !== undefined && remoteVal !== live[f.key]) {
            await f.set(remoteVal, { fromRemote: true })
          }
        }
      } catch (err) {
        if (cancelled) return
        initialPulledForUserRef.current = null
        console.warn(`[${appId}] prefs auto-pull failed:`, err?.message ?? err)
      }
    })()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userId, providersReady])

  return null
}
