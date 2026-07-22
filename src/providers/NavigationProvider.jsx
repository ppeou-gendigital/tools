import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'

const NavigationContext = createContext(null)

const ROUTES = ['home', 'profile', 'deck-demo', 'rich-text-demo', 'settings']
const DEFAULT_ROUTE = 'home'
// init-tool renames `toolname` → your kebab id (e.g. docto:lastRoute).
const LAST_ROUTE_KEY = 'toolname:lastRoute'

// Human labels used by page headers to render dynamic "back" text.
const ROUTE_LABELS = {
  home: 'Home',
  profile: 'Profile',
  'deck-demo': 'Deck demo',
  'rich-text-demo': 'Rich text demo',
  settings: 'Settings',
}

// Logical parent for each route. Used when the history stack is empty
// (e.g. the app opened directly onto a sub-page): goBack still needs
// somewhere sensible to land, so we fall back to the parent instead of
// stranding the user.
const PARENT_ROUTE = {
  home: null,
  profile: 'home',
  'deck-demo': 'home',
  'rich-text-demo': 'home',
  settings: 'home',
}

// Cap on stored history depth. This is a menu-driven single-window app; a
// small cap keeps memory bounded and prevents "back a hundred times" edge
// cases from menu-jumping loops.
const HISTORY_LIMIT = 10

function resolveStoredRoute(raw) {
  if (!ROUTES.includes(raw)) return DEFAULT_ROUTE
  return raw
}

function readLastRouteSync() {
  try {
    return resolveStoredRoute(globalThis.localStorage?.getItem(LAST_ROUTE_KEY))
  } catch {
    return DEFAULT_ROUTE
  }
}

export function NavigationProvider({ children, initial }) {
  const hasExplicitInitial =
    typeof initial === 'string' && ROUTES.includes(initial)

  // The top of the stack is the current route. `navigate` pushes, `goBack`
  // pops. Rendering derives everything from this single source of truth so
  // dev-tools can inspect the whole nav history in one place.
  const [stack, setStack] = useState(() => [
    hasExplicitInitial ? initial : readLastRouteSync(),
  ])

  // Extension builds use chrome.storage (async). Reconcile once on mount
  // when the caller did not force an initial route.
  useEffect(() => {
    if (hasExplicitInitial) return
    let cancelled = false
    ;(async () => {
      const stored = await asyncStorage.getItem(LAST_ROUTE_KEY)
      if (cancelled || stored == null) return
      const route = resolveStoredRoute(stored)
      setStack((prev) => {
        if (prev.length !== 1 || prev[0] === route) return prev
        return [route]
      })
    })()
    return () => {
      cancelled = true
    }
  }, [hasExplicitInitial])

  useEffect(() => {
    const route = stack[stack.length - 1]
    if (!route || !ROUTES.includes(route)) return
    asyncStorage.setItem(LAST_ROUTE_KEY, route)
  }, [stack])

  const navigate = useCallback((next) => {
    if (!ROUTES.includes(next)) return
    setStack((prev) => {
      if (prev[prev.length - 1] === next) return prev
      const pushed = [...prev, next]
      return pushed.length > HISTORY_LIMIT
        ? pushed.slice(pushed.length - HISTORY_LIMIT)
        : pushed
    })
  }, [])

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1)
      }
      const current = prev[0]
      const parent = PARENT_ROUTE[current]
      return parent ? [parent] : prev
    })
  }, [])

  const value = useMemo(() => {
    const route = stack[stack.length - 1]
    const previousRoute =
      stack.length > 1 ? stack[stack.length - 2] : PARENT_ROUTE[route] ?? null

    return {
      route,
      previousRoute,
      previousRouteLabel: previousRoute ? ROUTE_LABELS[previousRoute] : null,
      history: stack,
      navigate,
      goBack,
      goHome: () => navigate('home'),
      goProfile: () => navigate('profile'),
      goDeckDemo: () => navigate('deck-demo'),
      goRichTextDemo: () => navigate('rich-text-demo'),
      goSettings: () => navigate('settings'),
    }
  }, [stack, navigate, goBack])

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation must be used inside <NavigationProvider>')
  }
  return ctx
}
