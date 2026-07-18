import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import { normalizeTrackedHostnames } from '@/lib/trackedHostnames'
import {
  applySyncOp,
  enqueueSyncOp,
  opSetTrackedHostnames,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'

const TrackedHostnamesContext = createContext(null)

const STORAGE_KEY = 'loopy.trackedHostnames'

export function TrackedHostnamesProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [hosts, setHostsState] = useState({})
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
      } else if (raw && typeof raw === 'object') {
        parsed = raw
      }
      setHostsState(normalizeTrackedHostnames(parsed))
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  const setHosts = useCallback(
    async (next, { fromRemote = false } = {}) => {
      let resolved
      setHostsState((prev) => {
        const raw = typeof next === 'function' ? next(prev) : next
        resolved = normalizeTrackedHostnames(raw)
        return resolved
      })
      await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? {}))
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'trackedHostnames',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opSetTrackedHostnames(resolved),
            }),
        })
      } catch (err) {
        console.warn(
          '[loopy] trackedHostnames sync failed:',
          err?.message ?? err,
        )
      }
    },
    [userId],
  )

  const value = useMemo(
    () => ({ hosts, setHosts, ready }),
    [hosts, setHosts, ready],
  )

  return (
    <TrackedHostnamesContext.Provider value={value}>
      {children}
    </TrackedHostnamesContext.Provider>
  )
}

export function useTrackedHostnames() {
  const ctx = useContext(TrackedHostnamesContext)
  if (!ctx) {
    throw new Error(
      'useTrackedHostnames must be used inside <TrackedHostnamesProvider>',
    )
  }
  return ctx
}
