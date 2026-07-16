import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { useFontSize } from '@/providers/FontSizeProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { fetchUserData, saveUserData } from '@/lib/userDataApi'
import { mergePrefsIntoData, normalizeRemotePrefs } from '@/lib/prefs'

// Wait this long after the last local change before firing a push.
// Coalesces bursts (e.g. multiple font-size clicks) into one request.
const PUSH_DEBOUNCE_MS = 500

function prefsEqual(a, b) {
  if (!a || !b) return false
  return (
    a.theme === b.theme &&
    a.fontSize === b.fontSize &&
    a.fabCorner === b.fabCorner
  )
}

// Two-way sync between local prefs providers and the `user_data.data`
// column on Supabase.
//
// - Pull on sign-in via fetchUserData, apply via setters (remote wins).
// - Push debounced on any local change (this component owns writes).
//
// Guards:
//   applyingRemoteRef: set while applying pulled prefs so the push
//                      effect doesn't echo them right back.
//   lastSyncedRef:     the last prefs blob we know matches the cloud.
//
// Extend this for your own synced state (e.g. a list, a rules object) by
// adding another column to the user_data table and mirroring the same
// pull-apply-push pattern here. Keep each column's normalizer and
// comparison isolated so you can grow the shape without one field
// clobbering another.
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

  const applyRemotePrefs = useCallback(
    (row) => {
      const safe = normalizeRemotePrefs(row?.data)
      applyingRemoteRef.current = true
      if (safe.theme !== theme) setTheme(safe.theme)
      if (safe.fontSize !== fontSize) setFontSize(safe.fontSize)
      if (safe.fabCorner !== fabCorner) setFabCorner(safe.fabCorner)
      lastSyncedRef.current = safe
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

  // Initial pull on sign-in. Runs once per user id; retried on next
  // render if the fetch fails.
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
        if (row) {
          applyRemotePrefs(row)
        } else {
          // No cloud row yet: adopt current local as the baseline so the
          // next local change is what creates the row.
          lastSyncedRef.current = { theme, fontSize, fabCorner }
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

  // Auto-push (debounced).
  //
  // The `lastSyncedRef === null` gate is load-bearing: the initial pull
  // is async, so this effect can run before the pull settles. If we
  // scheduled a push while the ref is null, we'd upload the pre-pull
  // local values and clobber the remote row 500ms later.
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
        // Merge into the cached remote blob so a prefs write doesn't
        // clobber sibling keys we don't own (e.g. `vault` set by
        // VaultProvider). Falls back to just the prefs shape if we
        // don't have a cached row yet.
        const cached = queryClient.getQueryData(['user_data', userId])
        const nextData = mergePrefsIntoData(cached?.data, {
          theme: current.theme,
          fontSize: current.fontSize,
          fabCorner: current.fabCorner,
        })
        const row = await saveUserData(userId, { data: nextData })
        lastSyncedRef.current = current
        queryClient.setQueryData(['user_data', userId], row)
      } catch (err) {
        console.warn('[accesso] prefs auto-push failed:', err?.message ?? err)
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
