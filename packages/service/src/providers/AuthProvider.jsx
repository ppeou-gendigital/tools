import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const AuthContext = createContext(null)

/**
 * @param {object} props
 * @param {import('@supabase/supabase-js').SupabaseClient} props.supabase
 * @param {string} [props.appId]
 * @param {() => void} [props.onSignedOut]
 * @param {(session: any, displayName: string) => Promise<void> | void} [props.finalizeSignup]
 * @param {() => { email: string, token: string } | null} [props.getDevAutoLogin]
 */
export function AuthProvider({
  children,
  supabase,
  appId = 'app',
  onSignedOut,
  finalizeSignup,
  getDevAutoLogin,
}) {
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
      if (event === 'SIGNED_OUT') onSignedOut?.()
    })
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [supabase, onSignedOut])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (loading || session || devTriedRef.current) return
    const cfg = getDevAutoLogin?.()
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
        console.info(`[${appId}] dev auto-login succeeded`)
      } catch (err) {
        console.warn(`[${appId}] dev auto-login failed:`, err?.message ?? err)
      }
    })()
  }, [loading, session, supabase, getDevAutoLogin, appId])

  const requestOtp = useCallback(
    async (email, { shouldCreateUser = true, displayName } = {}) => {
      const options = { shouldCreateUser }
      if (displayName) options.data = { display_name: displayName }
      const { error } = await supabase.auth.signInWithOtp({ email, options })
      if (error) throw error
    },
    [supabase],
  )

  const verifyOtp = useCallback(
    async (email, token) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })
      if (error) throw error
      return data?.session ?? data
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [supabase])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      requestOtp,
      verifyOtp,
      signOut,
      finalizeSignup,
    }),
    [session, loading, requestOtp, verifyOtp, signOut, finalizeSignup],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
