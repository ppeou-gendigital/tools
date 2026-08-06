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
  'profiles',
  'report',
  'sprints',
  'columns',
  'users',
  'issue-type',
  'issue-status',
  'resolutions',
  'projects',
  'settings',
]
const DEFAULT_ROUTE = 'profiles'
const LAST_ROUTE_KEY = 'jira-capacity:lastRoute'

const ROUTE_LABELS = {
  profiles: 'Profiles',
  report: 'Report',
  sprints: 'Sprints',
  columns: 'Columns',
  users: 'Users',
  'issue-type': 'Type',
  'issue-status': 'Status',
  resolutions: 'Resolutions',
  projects: 'Projects',
  settings: 'Settings',
}

const PARENT_ROUTE = {
  profiles: null,
  report: 'profiles',
  sprints: 'profiles',
  columns: 'profiles',
  users: 'profiles',
  'issue-type': 'profiles',
  'issue-status': 'profiles',
  resolutions: 'profiles',
  projects: 'profiles',
  settings: 'profiles',
}

const HISTORY_LIMIT = 10

/** Routes that require a selected profile. */
export const PROFILE_GATED_ROUTES = new Set([
  'report',
  'sprints',
  'columns',
  'users',
  'issue-type',
  'issue-status',
  'resolutions',
  'projects',
])

function normalizeFrame(raw) {
  if (typeof raw === 'string') {
    return ROUTES.includes(raw)
      ? { route: raw, params: {} }
      : { route: DEFAULT_ROUTE, params: {} }
  }
  if (raw && typeof raw === 'object' && typeof raw.route === 'string') {
    const route = ROUTES.includes(raw.route) ? raw.route : DEFAULT_ROUTE
    const params =
      raw.params && typeof raw.params === 'object' && !Array.isArray(raw.params)
        ? raw.params
        : {}
    return { route, params }
  }
  return { route: DEFAULT_ROUTE, params: {} }
}

function framesEqual(a, b) {
  return (
    a?.route === b?.route &&
    JSON.stringify(a?.params ?? {}) === JSON.stringify(b?.params ?? {})
  )
}

function readLastRouteSync() {
  try {
    const raw = globalThis.localStorage?.getItem(LAST_ROUTE_KEY)
    if (!raw) return { route: DEFAULT_ROUTE, params: {} }
    try {
      return normalizeFrame(JSON.parse(raw))
    } catch {
      return normalizeFrame(raw)
    }
  } catch {
    return { route: DEFAULT_ROUTE, params: {} }
  }
}

export function NavigationProvider({ children, initial }) {
  const hasExplicitInitial =
    typeof initial === 'string' && ROUTES.includes(initial)

  const [stack, setStack] = useState(() => {
    if (hasExplicitInitial) return [{ route: initial, params: {} }]
    return [readLastRouteSync()]
  })

  useEffect(() => {
    if (hasExplicitInitial) return
    let cancelled = false
    ;(async () => {
      const stored = await asyncStorage.getItem(LAST_ROUTE_KEY)
      if (cancelled || stored == null) return
      try {
        const frame = normalizeFrame(JSON.parse(stored))
        setStack((prev) => {
          if (prev.length !== 1 || framesEqual(prev[0], frame)) return prev
          return [frame]
        })
      } catch {
        const frame = normalizeFrame(stored)
        setStack((prev) => {
          if (prev.length !== 1 || framesEqual(prev[0], frame)) return prev
          return [frame]
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [hasExplicitInitial])

  useEffect(() => {
    const frame = stack[stack.length - 1]
    if (!frame?.route || !ROUTES.includes(frame.route)) return
    asyncStorage.setItem(LAST_ROUTE_KEY, JSON.stringify(frame))
  }, [stack])

  const navigate = useCallback((next, params = {}) => {
    const frame = normalizeFrame(
      typeof next === 'string' ? { route: next, params } : next,
    )
    if (!ROUTES.includes(frame.route)) return
    setStack((prev) => {
      if (framesEqual(prev[prev.length - 1], frame)) return prev
      const pushed = [...prev, frame]
      return pushed.length > HISTORY_LIMIT
        ? pushed.slice(pushed.length - HISTORY_LIMIT)
        : pushed
    })
  }, [])

  const replace = useCallback((next, params = {}) => {
    const frame = normalizeFrame(
      typeof next === 'string' ? { route: next, params } : next,
    )
    if (!ROUTES.includes(frame.route)) return
    setStack((prev) => {
      if (prev.length === 0) return [frame]
      const copy = [...prev]
      copy[copy.length - 1] = frame
      return copy
    })
  }, [])

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length > 1) return prev.slice(0, -1)
      const current = prev[0]
      const parent = PARENT_ROUTE[current?.route]
      return parent ? [{ route: parent, params: {} }] : prev
    })
  }, [])

  const value = useMemo(() => {
    const frame = stack[stack.length - 1] ?? {
      route: DEFAULT_ROUTE,
      params: {},
    }
    const previousFrame =
      stack.length > 1
        ? stack[stack.length - 2]
        : PARENT_ROUTE[frame.route]
          ? { route: PARENT_ROUTE[frame.route], params: {} }
          : null

    return {
      route: frame.route,
      params: frame.params ?? {},
      previousRoute: previousFrame?.route ?? null,
      previousRouteLabel: previousFrame
        ? ROUTE_LABELS[previousFrame.route]
        : null,
      history: stack,
      navigate,
      replace,
      goBack,
      goProfiles: () => navigate('profiles'),
      goReport: () => navigate('report'),
      goSprints: () => navigate('sprints'),
      goColumns: () => navigate('columns'),
      goUsers: () => navigate('users'),
      goIssueType: () => navigate('issue-type'),
      goIssueStatus: () => navigate('issue-status'),
      goResolutions: () => navigate('resolutions'),
      goProjects: () => navigate('projects'),
      goSettings: () => navigate('settings'),
    }
  }, [stack, navigate, replace, goBack])

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
