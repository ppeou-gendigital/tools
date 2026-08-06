import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '../lib/storage.js'
import {
  DEFAULT_AI_CELL,
  DEFAULT_MENU_CELL,
  normalizeAiFabCell,
  normalizeFabCell,
  oppositeFabCell,
  parseFabCell,
} from '../lib/fabCell.js'

const FabCornerContext = createContext(null)

function isValidCellToken(v) {
  return parseFabCell(v) != null
}

/**
 * @param {object} props
 * @param {string} props.appId
 */
export function FabCornerProvider({ children, appId }) {
  const menuKey = `${appId}.fabCorner`
  const aiKey = `${appId}.aiFabCorner`
  const [corner, setCornerState] = useState(DEFAULT_MENU_CELL)
  const [aiCorner, setAiCornerState] = useState(DEFAULT_AI_CELL)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    Promise.all([
      asyncStorage.getItem(menuKey),
      asyncStorage.getItem(aiKey),
    ]).then(async ([menuStored, aiStored]) => {
      if (!mounted) return
      const menu = isValidCellToken(menuStored)
        ? normalizeFabCell(menuStored)
        : DEFAULT_MENU_CELL
      let ai = isValidCellToken(aiStored)
        ? normalizeAiFabCell(aiStored, menu)
        : oppositeFabCell(menu)
      if (ai === menu) ai = oppositeFabCell(menu)
      setCornerState(menu)
      setAiCornerState(ai)
      // Persist defaults / collision fixes / legacy corner → cell migrations.
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
    async (next) => {
      if (!isValidCellToken(next)) return
      const resolved = normalizeFabCell(next)
      let nextAi = null
      setCornerState(resolved)
      setAiCornerState((prev) => {
        if (prev !== resolved) return prev
        nextAi = oppositeFabCell(resolved)
        return nextAi
      })
      await asyncStorage.setItem(menuKey, resolved)
      if (nextAi) await asyncStorage.setItem(aiKey, nextAi)
    },
    [menuKey, aiKey],
  )

  const setAiCorner = useCallback(
    async (next) => {
      if (!isValidCellToken(next)) return
      const resolved = normalizeAiFabCell(next, corner)
      setAiCornerState(resolved)
      await asyncStorage.setItem(aiKey, resolved)
    },
    [corner, aiKey],
  )

  const swapFabCorners = useCallback(async () => {
    const nextMenu = aiCorner
    const nextAi = corner
    if (nextMenu === nextAi) return
    setCornerState(nextMenu)
    setAiCornerState(nextAi)
    await asyncStorage.setItem(menuKey, nextMenu)
    await asyncStorage.setItem(aiKey, nextAi)
  }, [corner, aiCorner, menuKey, aiKey])

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
