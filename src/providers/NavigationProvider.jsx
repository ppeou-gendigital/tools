import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const NavigationContext = createContext(null)

const ROUTES = [
  'home',
  'profile',
  'deck-test',
  'aem-jump',
  'visited-urls',
  'settings',
  'settings-aem-environments',
  'settings-tracked-hosts',
]
const DEFAULT_ROUTE = 'aem-jump'

// Human labels used by page headers to render dynamic "back" text.
const ROUTE_LABELS = {
  home: 'Home',
  profile: 'Profile',
  'deck-test': 'Deck test',
  'aem-jump': 'AEM Jump',
  'visited-urls': 'Visited URLs',
  settings: 'Settings',
  'settings-aem-environments': 'AEM Environments',
  'settings-tracked-hosts': 'Tracked hosts',
}

// Logical parent for each route. Used when the history stack is empty
// (e.g. the app opened directly onto a sub-page): goBack still needs
// somewhere sensible to land, so we fall back to the parent instead of
// stranding the user.
const PARENT_ROUTE = {
  home: null,
  profile: 'home',
  'deck-test': 'home',
  'aem-jump': 'home',
  'visited-urls': 'home',
  settings: 'home',
  'settings-aem-environments': 'settings',
  'settings-tracked-hosts': 'settings',
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
      // No-op if we're already on that route (prevents the same page from
      // being stacked twice when a menu item is clicked from itself).
      if (prev[prev.length - 1] === next) return prev
      const pushed = [...prev, next]
      // Trim from the bottom once we exceed HISTORY_LIMIT so the newest
      // entries always survive.
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
      // History is empty (deep-link entry). Substitute the current route
      // with its logical parent so the back button still does something
      // meaningful. If the current route has no parent (e.g. Home), stay
      // put — the caller is expected to hide the back button there.
      const current = prev[0]
      const parent = PARENT_ROUTE[current]
      return parent ? [parent] : prev
    })
  }, [])

  const value = useMemo(() => {
    const route = stack[stack.length - 1]
    // Prefer the actual previous entry; fall back to the route's parent so
    // deep-linked pages still render a "back" affordance to their parent.
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
      goDeckTest: () => navigate('deck-test'),
      goAemJump: () => navigate('aem-jump'),
      goVisitedUrls: () => navigate('visited-urls'),
      goSettings: () => navigate('settings'),
      goSettingsAemEnvironments: () => navigate('settings-aem-environments'),
      goSettingsTrackedHosts: () => navigate('settings-tracked-hosts'),
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
