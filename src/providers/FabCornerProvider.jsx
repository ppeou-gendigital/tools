import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import {
  applySyncOp,
  enqueueSyncOp,
  opSetFabCorner,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'

const FabCornerContext = createContext(null)

const STORAGE_KEY = 'accesso.fabCorner'
const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const DEFAULT_CORNER = 'bottom-right'

function isValidCorner(v) {
  return typeof v === 'string' && CORNERS.includes(v)
}

export function FabCornerProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [corner, setCornerState] = useState(DEFAULT_CORNER)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!mounted) return
      if (isValidCorner(stored)) setCornerState(stored)
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  const setCorner = useCallback(
    async (next, { fromRemote = false } = {}) => {
      if (!isValidCorner(next)) return
      setCornerState(next)
      await asyncStorage.setItem(STORAGE_KEY, next)
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'fabCorner',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opSetFabCorner(next),
            }),
        })
      } catch (err) {
        console.warn('[accesso] fabCorner sync failed:', err?.message ?? err)
      }
    },
    [userId],
  )

  const value = useMemo(
    () => ({ corner, setCorner, ready }),
    [corner, setCorner, ready],
  )

  return (
    <FabCornerContext.Provider value={value}>
      {children}
    </FabCornerContext.Provider>
  )
}

export function useFabCorner() {
  const ctx = useContext(FabCornerContext)
  if (!ctx) {
    throw new Error('useFabCorner must be used inside <FabCornerProvider>')
  }
  return ctx
}
