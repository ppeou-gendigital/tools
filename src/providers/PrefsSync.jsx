import { useEffect, useRef } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { useFontSize } from '@/providers/FontSizeProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { pullSync } from '@/lib/supabaseSync'

// PrefsSync is pull-only. Mutations go through supabaseSync from each
// provider (optimistic local → CAS push). This component:
//   1. pullSync prefs on sign-in
//   2. skips fields the user dirtied while the fetch was in flight
export function PrefsSync() {
  const { user, loading: authLoading } = useAuth()
  const { theme, setTheme, ready: themeReady } = useTheme()
  const { size: fontSize, setSize: setFontSize, ready: fontReady } =
    useFontSize()
  const { corner: fabCorner, setCorner: setFabCorner, ready: fabReady } =
    useFabCorner()

  const initialPulledForUserRef = useRef(null)

  // Live refs so pull can detect dirty fields after the fetch starts.
  const prefsRef = useRef(null)
  useEffect(() => {
    prefsRef.current = { theme, fontSize, fabCorner }
  }, [theme, fontSize, fabCorner])

  const userId = user?.id ?? null
  const providersReady = themeReady && fontReady && fabReady

  useEffect(() => {
    if (!userId) {
      initialPulledForUserRef.current = null
    }
  }, [userId])

  // Initial prefs pull — force network, skip fields dirtied mid-fetch.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (initialPulledForUserRef.current === userId) return
    initialPulledForUserRef.current = userId

    const snapshot = { ...prefsRef.current }
    let cancelled = false
    ;(async () => {
      try {
        const remote = await pullSync({ stream: 'prefs', userId })
        if (cancelled) return
        if (!remote) return

        // Fields the user changed while the fetch was in flight stay local;
        // providers already CAS those via applySyncOp.
        const dirtyKeys = new Set()
        const live = prefsRef.current
        if (live.theme !== snapshot.theme) dirtyKeys.add('theme')
        if (live.fontSize !== snapshot.fontSize) dirtyKeys.add('fontSize')
        if (live.fabCorner !== snapshot.fabCorner) dirtyKeys.add('fabCorner')

        if (!dirtyKeys.has('theme') && remote.data.theme !== live.theme) {
          await setTheme(remote.data.theme, { fromRemote: true })
        }
        if (
          !dirtyKeys.has('fontSize') &&
          remote.data.fontSize !== live.fontSize
        ) {
          setFontSize(remote.data.fontSize, { fromRemote: true })
        }
        if (
          !dirtyKeys.has('fabCorner') &&
          remote.data.fabCorner !== live.fabCorner
        ) {
          await setFabCorner(remote.data.fabCorner, { fromRemote: true })
        }
      } catch (err) {
        if (cancelled) return
        initialPulledForUserRef.current = null
        console.warn('[toolname] prefs auto-pull failed:', err?.message ?? err)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userId, providersReady])

  return null
}
