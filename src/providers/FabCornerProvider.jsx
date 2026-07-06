import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'

const FabCornerContext = createContext(null)

const STORAGE_KEY = 'toolname.fabCorner'
const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const DEFAULT_CORNER = 'bottom-right'

function isValidCorner(v) {
  return typeof v === 'string' && CORNERS.includes(v)
}

// Lifts the FAB's corner state out of useCornerDrag so it can be read and
// written by anything on the page (PrefsSync, tests, dev tools). The hook
// keeps ownership of the gesture; this provider owns the persisted value.
export function FabCornerProvider({ children }) {
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

  const setCorner = useCallback(async (next) => {
    if (!isValidCorner(next)) return
    setCornerState(next)
    await asyncStorage.setItem(STORAGE_KEY, next)
  }, [])

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
