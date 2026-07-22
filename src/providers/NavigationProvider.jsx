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

const ROUTES = [
  'home',
  'visits',
  'appointments',
  'doctors',
  'medications',
  'readings',
  'files',
  'family',
  'profile',
  'settings',
  'vault-security',
  'datafeed-settings',
]
const DEFAULT_ROUTE = 'home'
const LAST_ROUTE_KEY = 'docto:lastRoute'

const ROUTE_LABELS = {
  home: 'Home',
  visits: 'Visits',
  appointments: 'Appointments',
  doctors: 'Doctors',
  medications: 'Medications',
  readings: 'Readings',
  files: 'Files',
  family: 'Family',
  profile: 'Profile',
  settings: 'Settings',
  'vault-security': 'Vault security',
  'datafeed-settings': 'Import / Export',
}

const PARENT_ROUTE = {
  home: null,
  visits: 'home',
  appointments: 'home',
  doctors: 'home',
  medications: 'home',
  readings: 'home',
  files: 'home',
  family: 'home',
  profile: 'home',
  settings: 'home',
  'vault-security': 'settings',
  'datafeed-settings': 'settings',
}

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
      goVisits: () => navigate('visits'),
      goAppointments: () => navigate('appointments'),
      goDoctors: () => navigate('doctors'),
      goMedications: () => navigate('medications'),
      goReadings: () => navigate('readings'),
      goFiles: () => navigate('files'),
      goFamily: () => navigate('family'),
      goProfile: () => navigate('profile'),
      goSettings: () => navigate('settings'),
      goVaultSecurity: () => navigate('vault-security'),
      goDatafeedSettings: () => navigate('datafeed-settings'),
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
