import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const NavigationContext = createContext(null)

const ROUTES = [
  'home',
  'profile',
  'landing',
  'deck-test',
  'aem-jump',
  'aem-eds-ue',
  'visited-urls',
  'site-tree',
  'fav-links',
  'settings',
  'settings-aem-environments',
  'settings-tracked-hosts',
]
const DEFAULT_ROUTE = 'landing'

// Human labels used by page headers to render dynamic "back" text.
const ROUTE_LABELS = {
  home: 'Home',
  profile: 'Profile',
  landing: 'Landing',
  'deck-test': 'Deck test',
  'aem-jump': 'AEM Jump',
  'aem-eds-ue': 'AEM EDS-UE',
  'visited-urls': 'Visited URLs',
  'site-tree': 'Site tree',
  'fav-links': 'Fav links',
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
  landing: null,
  'deck-test': 'home',
  'aem-jump': 'home',
  'aem-eds-ue': 'home',
  'visited-urls': 'home',
  'site-tree': 'home',
  'fav-links': 'home',
  settings: 'home',
  'settings-aem-environments': 'settings',
  'settings-tracked-hosts': 'settings',
}

// Cap on stored history depth. This is a menu-driven single-window app; a
// small cap keeps memory bounded and prevents "back a hundred times" edge
// cases from menu-jumping loops.
const HISTORY_LIMIT = 10

// localStorage key for the "resume where I left off" behavior. Only the
// current (top-of-stack) route is persisted — the history stack itself is
// intentionally ephemeral so a new popup session starts with a clean back
// button. localStorage (rather than chrome.storage.local) keeps the read
// synchronous so the initial paint lands on the right page without a
// visible flash of the default route.
const LAST_ROUTE_KEY = 'loopy.lastRoute'

function readPersistedRoute() {
  try {
    const stored = globalThis.localStorage?.getItem(LAST_ROUTE_KEY)
    if (typeof stored === 'string' && ROUTES.includes(stored)) return stored
  } catch {
    // localStorage can throw in private mode / sandboxed contexts.
  }
  return null
}

function writePersistedRoute(route) {
  try {
    globalThis.localStorage?.setItem(LAST_ROUTE_KEY, route)
  } catch {
    // ignore quota / private-mode errors
  }
}

export function NavigationProvider({ children, initial }) {
  // The top of the stack is the current route. `navigate` pushes, `goBack`
  // pops. Rendering derives everything from this single source of truth so
  // dev-tools can inspect the whole nav history in one place.
  //
  // Seed order:
  //   1. `initial` prop, if provided and valid (test / deep-link overrides)
  //   2. Persisted last-route from localStorage (resume-on-open)
  //   3. DEFAULT_ROUTE
  const [stack, setStack] = useState(() => {
    if (initial && ROUTES.includes(initial)) return [initial]
    return [readPersistedRoute() ?? DEFAULT_ROUTE]
  })

  // Persist the current route on every change so the next popup session
  // reopens on the same page. Fires on the initial mount too, which is
  // fine — it just re-writes whatever we seeded from and keeps the store
  // self-healing if it ever contained an unknown value.
  useEffect(() => {
    const route = stack[stack.length - 1]
    if (route) writePersistedRoute(route)
  }, [stack])

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
      goLanding: () => navigate('landing'),
      goDeckTest: () => navigate('deck-test'),
      goAemJump: () => navigate('aem-jump'),
      goAemEdsUe: () => navigate('aem-eds-ue'),
      goVisitedUrls: () => navigate('visited-urls'),
      goSiteTree: () => navigate('site-tree'),
      goFavLinks: () => navigate('fav-links'),
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
