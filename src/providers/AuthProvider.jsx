import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'
import { devAutoLoginConfig } from '@/env'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const devTriedRef = useRef(false)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (!mounted) return
      setSession(next ?? null)
      // Drop all server-state cache when the user signs out so a re-login
      // (as the same or a different user) never sees stale data. Covers the
      // manual signOut() path and any provider-triggered sign-outs.
      if (event === 'SIGNED_OUT') queryClient.clear()
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  // Dev-only auto-login. Runs once, after the initial getSession() resolves,
  // if no session exists AND the dev env vars are present.
  //
  // The `import.meta.env.DEV` check is hoisted to the very top so Vite can
  // statically evaluate it to `false` in production builds and tree-shake
  // the entire effect body out of `dist/` and `dist-web/`.
  // StrictMode-safe via the ref.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (loading || session || devTriedRef.current) return
    const cfg = devAutoLoginConfig()
    if (!cfg) return
    devTriedRef.current = true

    ;(async () => {
      try {
        const { error: reqErr } = await supabase.auth.signInWithOtp({
          email: cfg.email,
          options: { shouldCreateUser: true },
        })
        if (reqErr) throw reqErr

        const { error: verErr } = await supabase.auth.verifyOtp({
          email: cfg.email,
          token: cfg.token,
          type: 'email',
        })
        if (verErr) throw verErr

        console.info('[acceso] dev auto-login succeeded')
      } catch (err) {
        console.warn('[acceso] dev auto-login failed:', err?.message ?? err)
      }
    })()
  }, [loading, session])

  // Step 1 of the OTP flow: ask Supabase to email a 6-digit code.
  //
  // `shouldCreateUser` decides whether an unknown email is created on the fly
  // (sign-up) or rejected (log-in). `displayName` is forwarded as auth
  // user_metadata so it's captured atomically at signup; the persistent copy
  // in public.profiles is written by finalizeSignup() after verifyOtp().
  const requestOtp = useCallback(
    async (email, { shouldCreateUser = false, displayName } = {}) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser,
          data: displayName ? { display_name: displayName } : undefined,
        },
      })
      if (error) throw error
    },
    [],
  )

  // Step 2: verify the code the user typed in.
  const verifyOtp = useCallback(async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    if (error) throw error
    return data
  }, [])

  // Post-signup: write display_name into public.profiles. The
  // handle_new_user() trigger already created the row on user insert; this
  // upsert only fills in the display name. Best-effort — callers should
  // swallow errors so a profiles-write failure doesn't block sign-in.
  const finalizeSignup = useCallback(async (userSession, displayName) => {
    if (!userSession?.user?.id || !displayName) return
    const { error } = await supabase.from('profiles').upsert(
      {
        id: userSession.user.id,
        display_name: displayName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      requestOtp,
      verifyOtp,
      finalizeSignup,
      signOut,
    }),
    [session, loading, requestOtp, verifyOtp, finalizeSignup, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
