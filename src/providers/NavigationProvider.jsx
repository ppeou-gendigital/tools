import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const NavigationContext = createContext(null)

const ROUTES = ['home', 'profile', 'deck-demo', 'settings']
const DEFAULT_ROUTE = 'home'

// Human labels used by page headers to render dynamic "back" text.
const ROUTE_LABELS = {
  home: 'Home',
  profile: 'Profile',
  'deck-demo': 'Deck demo',
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
  settings: 'home',
}

// Cap on stored history depth. This is a menu-driven single-window app; a
// small cap keeps memory bounded and prevents "back a hundred times" edge
// cases from menu-jumping loops.
const HISTORY_LIMIT = 10

export function NavigationProvider({ children, initial = DEFAULT_ROUTE }) {
  // The top of the stack is the current route. `navigate` pushes, `goBack`
  // pops. Rendering derives everything from this single source of truth so
  // dev-tools can inspect the whole nav history in one place.
  const [stack, setStack] = useState(() => [
    ROUTES.includes(initial) ? initial : DEFAULT_ROUTE,
  ])

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
