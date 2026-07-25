import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '../lib/storage.js'
import { useAuth } from './AuthProvider.jsx'

const FabCornerContext = createContext(null)
const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const DEFAULT_CORNER = 'bottom-right'

function isValidCorner(v) {
  return typeof v === 'string' && CORNERS.includes(v)
}

export function FabCornerProvider({ children, appId, pushRemote }) {
  const storageKey = `${appId}.fabCorner`
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [corner, setCornerState] = useState(DEFAULT_CORNER)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(storageKey).then((stored) => {
      if (!mounted) return
      if (isValidCorner(stored)) setCornerState(stored)
      setReady(true)
    })
    return () => { mounted = false }
  }, [storageKey])

  const setCorner = useCallback(
    async (next, { fromRemote = false } = {}) => {
      if (!isValidCorner(next)) return
      setCornerState(next)
      await asyncStorage.setItem(storageKey, next)
      if (fromRemote || !userId || !pushRemote) return
      try {
        await pushRemote(userId, next)
      } catch (err) {
        console.warn(`[${appId}] fabCorner sync failed:`, err?.message ?? err)
      }
    },
    [storageKey, userId, pushRemote, appId],
  )

  const value = useMemo(
    () => ({ corner, setCorner, ready }),
    [corner, setCorner, ready],
  )

  return (
    <FabCornerContext.Provider value={value}>{children}</FabCornerContext.Provider>
  )
}

export function useFabCorner() {
  const ctx = useContext(FabCornerContext)
  if (!ctx) throw new Error('useFabCorner must be used inside <FabCornerProvider>')
  return ctx
}
