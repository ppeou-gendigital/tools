import { useEffect, useRef } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { useFontSize } from '@/providers/FontSizeProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { pullSync } from '@/lib/supabaseSync'
import { normalizeRemotePrefs } from '@/lib/prefs'

// PrefsSync is pull-only. Mutations go through supabaseSync from each
// provider (theme / font / fab) and from VaultProvider (vault meta).
// On sign-in we pull the remote row and apply fields that were not
// dirtied while the fetch was in flight.
export function PrefsSync() {
  const { user, loading: authLoading } = useAuth()
  const { theme, setTheme, ready: themeReady } = useTheme()
  const { size: fontSize, setSize: setFontSize, ready: fontReady } =
    useFontSize()
  const { corner: fabCorner, setCorner: setFabCorner, ready: fabReady } =
    useFabCorner()

  const initialPulledForUserRef = useRef(null)
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

        const dirtyKeys = new Set()
        const live = prefsRef.current
        if (live.theme !== snapshot.theme) dirtyKeys.add('theme')
        if (live.fontSize !== snapshot.fontSize) dirtyKeys.add('fontSize')
        if (live.fabCorner !== snapshot.fabCorner) dirtyKeys.add('fabCorner')

        const safe = normalizeRemotePrefs(remote.data)
        if (!dirtyKeys.has('theme') && safe.theme !== live.theme) {
          await setTheme(safe.theme, { fromRemote: true })
        }
        if (!dirtyKeys.has('fontSize') && safe.fontSize !== live.fontSize) {
          setFontSize(safe.fontSize, { fromRemote: true })
        }
        if (!dirtyKeys.has('fabCorner') && safe.fabCorner !== live.fabCorner) {
          await setFabCorner(safe.fabCorner, { fromRemote: true })
        }
      } catch (err) {
        if (cancelled) return
        initialPulledForUserRef.current = null
        console.warn('[accesso] prefs auto-pull failed:', err?.message ?? err)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userId, providersReady])

  return null
}
