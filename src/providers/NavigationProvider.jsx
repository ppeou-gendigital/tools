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
  'deck-demo',
  'settings',
  'vault-settings',
  'credentials',
  'credential-new',
  'credential-edit',
  'credit-cards',
  'credit-card-new',
  'credit-card-edit',
]
const DEFAULT_ROUTE = 'home'

// Human labels used by page headers to render dynamic "back" text.
const ROUTE_LABELS = {
  home: 'Home',
  profile: 'Profile',
  'deck-demo': 'Deck demo',
  settings: 'Settings',
  'vault-settings': 'Vault',
  credentials: 'Credentials',
  'credential-new': 'New credential',
  'credential-edit': 'Edit credential',
  'credit-cards': 'Credit cards',
  'credit-card-new': 'New card',
  'credit-card-edit': 'Edit card',
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
  'vault-settings': 'settings',
  credentials: 'home',
  'credential-new': 'credentials',
  'credential-edit': 'credentials',
  'credit-cards': 'home',
  'credit-card-new': 'credit-cards',
  'credit-card-edit': 'credit-cards',
}

// Cap on stored history depth. This is a menu-driven single-window app; a
// small cap keeps memory bounded and prevents "back a hundred times" edge
// cases from menu-jumping loops.
const HISTORY_LIMIT = 10

// Each stack entry is `{ route, params }`. Params carry route-scoped
// state that lives *inside* the nav stack rather than in a page-level
// useState — that way `goBack` and forward-nav both restore the right
// context (e.g. which credential is being edited) without the page
// component having to hydrate itself from an external store.
function makeEntry(route, params = {}) {
  return { route, params: params ?? {} }
}

export function NavigationProvider({ children, initial = DEFAULT_ROUTE }) {
  const [stack, setStack] = useState(() => [
    makeEntry(ROUTES.includes(initial) ? initial : DEFAULT_ROUTE),
  ])

  const navigate = useCallback((next, params) => {
    if (!ROUTES.includes(next)) return
    setStack((prev) => {
      const top = prev[prev.length - 1]
      const nextEntry = makeEntry(next, params)
      if (top?.route === next && shallowEqual(top.params, nextEntry.params)) {
        return prev
      }
      const pushed = [...prev, nextEntry]
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
      const parent = PARENT_ROUTE[current.route]
      return parent ? [makeEntry(parent)] : prev
    })
  }, [])

  const value = useMemo(() => {
    const current = stack[stack.length - 1]
    const previous =
      stack.length > 1
        ? stack[stack.length - 2]
        : PARENT_ROUTE[current.route]
          ? makeEntry(PARENT_ROUTE[current.route])
          : null

    return {
      route: current.route,
      params: current.params,
      previousRoute: previous?.route ?? null,
      previousRouteLabel: previous ? ROUTE_LABELS[previous.route] : null,
      history: stack,
      navigate,
      goBack,
      goHome: () => navigate('home'),
      goProfile: () => navigate('profile'),
      goDeckDemo: () => navigate('deck-demo'),
      goSettings: () => navigate('settings'),
      goVaultSettings: () => navigate('vault-settings'),
      goCredentials: () => navigate('credentials'),
      goCredentialNew: (extra) => navigate('credential-new', extra ?? undefined),
      goCredentialEdit: (id, extra) =>
        navigate('credential-edit', { id, ...(extra ?? {}) }),
      goCreditCards: () => navigate('credit-cards'),
      goCreditCardNew: (extra) => navigate('credit-card-new', extra ?? undefined),
      goCreditCardEdit: (id, extra) =>
        navigate('credit-card-edit', { id, ...(extra ?? {}) }),
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

function shallowEqual(a, b) {
  if (a === b) return true
  if (!a || !b) return !a && !b
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  for (const k of aKeys) {
    if (a[k] !== b[k]) return false
  }
  return true
}
