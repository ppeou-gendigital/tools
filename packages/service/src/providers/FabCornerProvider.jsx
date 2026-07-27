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
const DEFAULT_MENU_CORNER = 'bottom-right'
const DEFAULT_AI_CORNER = 'bottom-left'

function isValidCorner(v) {
  return typeof v === 'string' && CORNERS.includes(v)
}

function oppositeCorner(corner) {
  if (corner === 'top-left') return 'top-right'
  if (corner === 'top-right') return 'top-left'
  if (corner === 'bottom-left') return 'bottom-right'
  return 'bottom-left'
}

/**
 * @param {object} props
 * @param {string} props.appId
 * @param {(userId: string, patch: { fabCorner?: string, aiFabCorner?: string }) => Promise<void>} [props.pushRemote]
 */
export function FabCornerProvider({ children, appId, pushRemote }) {
  const menuKey = `${appId}.fabCorner`
  const aiKey = `${appId}.aiFabCorner`
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [corner, setCornerState] = useState(DEFAULT_MENU_CORNER)
  const [aiCorner, setAiCornerState] = useState(DEFAULT_AI_CORNER)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    Promise.all([
      asyncStorage.getItem(menuKey),
      asyncStorage.getItem(aiKey),
    ]).then(async ([menuStored, aiStored]) => {
      if (!mounted) return
      const menu = isValidCorner(menuStored) ? menuStored : DEFAULT_MENU_CORNER
      let ai = isValidCorner(aiStored) ? aiStored : oppositeCorner(menu)
      if (ai === menu) ai = oppositeCorner(menu)
      setCornerState(menu)
      setAiCornerState(ai)
      // Persist defaults / collision fixes so a missing aiFabCorner doesn't
      // leave both FABs fighting for the same corner after reload.
      const writes = []
      if (menu !== menuStored) writes.push(asyncStorage.setItem(menuKey, menu))
      if (ai !== aiStored) writes.push(asyncStorage.setItem(aiKey, ai))
      if (writes.length) await Promise.all(writes)
      if (!mounted) return
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [menuKey, aiKey])

  const setCorner = useCallback(
    async (next, { fromRemote = false } = {}) => {
      if (!isValidCorner(next)) return
      let nextAi = null
      setCornerState(next)
      setAiCornerState((prev) => {
        if (prev !== next) return prev
        nextAi = oppositeCorner(next)
        return nextAi
      })
      await asyncStorage.setItem(menuKey, next)
      if (nextAi) await asyncStorage.setItem(aiKey, nextAi)
      if (fromRemote || !userId || !pushRemote) return
      try {
        const patch = { fabCorner: next }
        if (nextAi) patch.aiFabCorner = nextAi
        await pushRemote(userId, patch)
      } catch (err) {
        console.warn(`[${appId}] fabCorner sync failed:`, err?.message ?? err)
      }
    },
    [menuKey, aiKey, userId, pushRemote, appId],
  )

  const setAiCorner = useCallback(
    async (next, { fromRemote = false } = {}) => {
      if (!isValidCorner(next)) return
      const resolved = next === corner ? oppositeCorner(corner) : next
      setAiCornerState(resolved)
      await asyncStorage.setItem(aiKey, resolved)
      if (fromRemote || !userId || !pushRemote) return
      try {
        await pushRemote(userId, { aiFabCorner: resolved })
      } catch (err) {
        console.warn(`[${appId}] aiFabCorner sync failed:`, err?.message ?? err)
      }
    },
    [corner, aiKey, userId, pushRemote, appId],
  )

  const swapFabCorners = useCallback(
    async ({ fromRemote = false } = {}) => {
      const nextMenu = aiCorner
      const nextAi = corner
      if (nextMenu === nextAi) return
      setCornerState(nextMenu)
      setAiCornerState(nextAi)
      await asyncStorage.setItem(menuKey, nextMenu)
      await asyncStorage.setItem(aiKey, nextAi)
      if (fromRemote || !userId || !pushRemote) return
      try {
        await pushRemote(userId, {
          fabCorner: nextMenu,
          aiFabCorner: nextAi,
        })
      } catch (err) {
        console.warn(`[${appId}] fab swap sync failed:`, err?.message ?? err)
      }
    },
    [corner, aiCorner, menuKey, aiKey, userId, pushRemote, appId],
  )

  const value = useMemo(
    () => ({
      corner,
      setCorner,
      aiCorner,
      setAiCorner,
      swapFabCorners,
      ready,
    }),
    [corner, setCorner, aiCorner, setAiCorner, swapFabCorners, ready],
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
