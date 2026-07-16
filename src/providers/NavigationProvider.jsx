import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'

const NavigationContext = createContext(null)

// Persisted per-device so the popup / tab reopens on whichever landing
// page you were last using — same pattern as FabCornerProvider (see
// src/lib/storage.js).
const LAST_ROUTE_STORAGE_KEY = 'accesso.lastRoute'

// Only landing / index pages get remembered across sessions. Edit
// routes (`credential-edit`, `credit-card-edit`, the `*-new` twins)
// depend on params that can go stale between sessions — a row id
// might be deleted, an in-flight seed is meaningless after popup
// close — so restoring into them is worse UX than dropping the user
// on the parent listing.
const RESTORABLE_ROUTES = new Set([
  'home',
  'profile',
  'deck-demo',
  'settings',
  'vault-settings',
  'credentials',
  'credit-cards',
])

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

export function NavigationProvider({ children, initial }) {
  const explicitInitial = ROUTES.includes(initial) ? initial : null
  const [stack, setStack] = useState(() => [
    makeEntry(explicitInitial ?? DEFAULT_ROUTE),
  ])
  // Persist must wait until cold-start restore finishes. Otherwise the
  // seeded default (`home`) is written to storage on mount and wipes
  // the remembered landing page before getItem resolves — refresh then
  // always lands on Welcome.
  const [restoreDone, setRestoreDone] = useState(Boolean(explicitInitial))

  // Cold-start restore. Fires exactly once per provider mount. If the
  // caller pinned an explicit initial route we honour that and skip
  // the storage read entirely — deep-link intent always wins over a
  // remembered value. Otherwise we async-read the last landing page
  // and swap it in *only if the user hasn't already navigated in the
  // meantime* (guarded by comparing the current stack to the seeded
  // default). That way a fast click before the storage read resolves
  // isn't clobbered by a stale restore.
  useEffect(() => {
    if (explicitInitial) return
    let cancelled = false
    ;(async () => {
      try {
        const stored = await asyncStorage.getItem(LAST_ROUTE_STORAGE_KEY)
        if (cancelled) return
        if (
          typeof stored === 'string' &&
          RESTORABLE_ROUTES.has(stored) &&
          stored !== DEFAULT_ROUTE
        ) {
          setStack((prev) => {
            // If anything moved us off the seeded default (`home` at
            // depth 1), the user already made a choice — don't override.
            if (
              prev.length !== 1 ||
              prev[0].route !== DEFAULT_ROUTE ||
              Object.keys(prev[0].params).length !== 0
            ) {
              return prev
            }
            return [makeEntry(stored)]
          })
        }
      } finally {
        if (!cancelled) setRestoreDone(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [explicitInitial])

  // Persist whenever the top route changes to a restorable landing
  // page. Edit / new routes intentionally leave the stored value
  // alone so that `credentials → credential-edit → close popup →
  // reopen` correctly lands you back on `credentials` (the previous
  // landing) rather than a stale row id.
  const lastPersistedRef = useRef(null)
  const currentTopRoute = stack[stack.length - 1]?.route
  useEffect(() => {
    if (!restoreDone) return
    if (!currentTopRoute) return
    if (!RESTORABLE_ROUTES.has(currentTopRoute)) return
    if (lastPersistedRef.current === currentTopRoute) return
    lastPersistedRef.current = currentTopRoute
    asyncStorage.setItem(LAST_ROUTE_STORAGE_KEY, currentTopRoute)
  }, [currentTopRoute, restoreDone])

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
