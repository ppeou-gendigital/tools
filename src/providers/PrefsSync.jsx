import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { useFontSize } from '@/providers/FontSizeProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { fetchUserData, saveUserData } from '@/lib/userDataApi'
import { normalizeRemotePrefs } from '@/lib/prefs'

// Wait this long after the last local change before firing an auto-push.
// Coalesces bursts (e.g. multiple font-size clicks) into a single request.
const PUSH_DEBOUNCE_MS = 500

function prefsEqual(a, b) {
  if (!a || !b) return false
  return (
    a.theme === b.theme &&
    a.fontSize === b.fontSize &&
    a.fabCorner === b.fabCorner
  )
}

// Two-way sync between the local providers (Theme / FontSize / FabCorner)
// and the Supabase user_data row. Renders nothing; mount as a sibling once
// inside AuthProvider.
//
//   Sign-in            -> pull remote and apply via setters (remote-wins).
//   Local change       -> debounced push (local-wins during session).
//   No cloud row yet   -> adopt current local as the baseline; the first
//                          local change creates the row.
//
// Two guards prevent ping-pong:
//   applyingRemoteRef: set while we're calling setters with pulled values,
//                      so the "changed" effect won't push them right back.
//   lastSyncedRef:     the last {theme, fontSize, fabCorner} we know matches
//                      the cloud. Auto-push short-circuits if current === last.
export function PrefsSync() {
  const { user, loading: authLoading } = useAuth()
  const { theme, setTheme, ready: themeReady } = useTheme()
  const { size: fontSize, setSize: setFontSize, ready: fontReady } = useFontSize()
  const { corner: fabCorner, setCorner: setFabCorner, ready: fabReady } =
    useFabCorner()
  const queryClient = useQueryClient()

  const lastSyncedRef = useRef(null)
  const pushTimerRef = useRef(null)
  const applyingRemoteRef = useRef(false)
  const initialPulledForUserRef = useRef(null)

  const userId = user?.id ?? null
  const providersReady = themeReady && fontReady && fabReady

  const applyRemote = useCallback(
    (remote) => {
      const safe = normalizeRemotePrefs(remote)
      applyingRemoteRef.current = true
      if (safe.theme !== theme) setTheme(safe.theme)
      if (safe.fontSize !== fontSize) setFontSize(safe.fontSize)
      if (safe.fabCorner !== fabCorner) setFabCorner(safe.fabCorner)
      lastSyncedRef.current = safe
      // Release the flag after the render commit finishes so the change
      // effect can observe the applied state without firing a push.
      queueMicrotask(() => {
        applyingRemoteRef.current = false
      })
    },
    [theme, setTheme, fontSize, setFontSize, fabCorner, setFabCorner],
  )

  useEffect(() => {
    if (!userId) {
      lastSyncedRef.current = null
      initialPulledForUserRef.current = null
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current)
        pushTimerRef.current = null
      }
    }
  }, [userId])

  // Initial pull on sign-in. Runs once per user id; retried on next render
  // if the fetch fails.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (initialPulledForUserRef.current === userId) return
    initialPulledForUserRef.current = userId

    let cancelled = false
    ;(async () => {
      try {
        const row = await queryClient.fetchQuery({
          queryKey: ['user_data', userId],
          queryFn: () => fetchUserData(userId),
        })
        if (cancelled) return
        if (row?.data) {
          applyRemote(row.data)
        } else {
          // No cloud row yet: adopt current local as the baseline so the
          // next local change is what creates the row.
          lastSyncedRef.current = { theme, fontSize, fabCorner }
        }
      } catch (err) {
        if (cancelled) return
        initialPulledForUserRef.current = null
        console.warn('[loopy] prefs auto-pull failed:', err?.message ?? err)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userId, providersReady])

  // Auto-push on local change (debounced).
  //
  // The `lastSyncedRef === null` gate is load-bearing: the initial pull is
  // async, so this effect can (and does) run before the pull settles. If we
  // scheduled a push while the ref is null, we'd upload the pre-pull local
  // values and clobber the remote row 500ms later. lastSyncedRef only
  // becomes non-null after the pull's apply/baseline step, so gating on it
  // guarantees "no push before we've seen the cloud".
  useEffect(() => {
    if (!userId) return
    if (!providersReady) return
    if (lastSyncedRef.current === null) return
    if (applyingRemoteRef.current) return

    const current = { theme, fontSize, fabCorner }
    if (prefsEqual(current, lastSyncedRef.current)) return

    if (pushTimerRef.current) clearTimeout(pushTimerRef.current)
    pushTimerRef.current = setTimeout(async () => {
      pushTimerRef.current = null
      try {
        const payload = { ...current, updatedAt: new Date().toISOString() }
        const row = await saveUserData(userId, payload)
        lastSyncedRef.current = current
        queryClient.setQueryData(['user_data', userId], row)
      } catch (err) {
        console.warn('[loopy] prefs auto-push failed:', err?.message ?? err)
      }
    }, PUSH_DEBOUNCE_MS)

    return () => {
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current)
        pushTimerRef.current = null
      }
    }
  }, [theme, fontSize, fabCorner, userId, providersReady, queryClient])

  return null
}
