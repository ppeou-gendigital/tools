import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import { normalizeAemDomains } from '@/lib/prefs'
import {
  applySyncOp,
  enqueueSyncOp,
  opSetAemDomains,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'

const AemDomainsContext = createContext(null)

const STORAGE_KEY = 'loopy.aemDomains'

export function AemDomainsProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [domains, setDomainsState] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return
      let parsed = null
      if (typeof raw === 'string') {
        try {
          parsed = JSON.parse(raw)
        } catch {
          parsed = null
        }
      } else if (Array.isArray(raw)) {
        parsed = raw
      }
      setDomainsState(normalizeAemDomains(parsed))
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  const setDomains = useCallback(
    async (next, { fromRemote = false } = {}) => {
      let resolved
      setDomainsState((prev) => {
        const raw = typeof next === 'function' ? next(prev) : next
        resolved = normalizeAemDomains(raw)
        return resolved
      })
      await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? []))
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'aemDomains',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opSetAemDomains(resolved),
            }),
        })
      } catch (err) {
        console.warn('[loopy] aemDomains sync failed:', err?.message ?? err)
      }
    },
    [userId],
  )

  const value = useMemo(
    () => ({ domains, setDomains, ready }),
    [domains, setDomains, ready],
  )

  return (
    <AemDomainsContext.Provider value={value}>
      {children}
    </AemDomainsContext.Provider>
  )
}

export function useAemDomains() {
  const ctx = useContext(AemDomainsContext)
  if (!ctx) {
    throw new Error('useAemDomains must be used inside <AemDomainsProvider>')
  }
  return ctx
}
