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
import { useAuth } from '@/providers/AuthProvider'

const NavigationContext = createContext(null)

const ROUTES = [
  'home',
  'profile',
  'deck-demo',
  'rich-text-demo',
  'settings',
  'workspace',
  'accept-invite',
]
const DEFAULT_ROUTE = 'home'
// init-tool renames `toolname` → your kebab id (e.g. docto:lastRoute).
const LAST_ROUTE_KEY = 'toolname:lastRoute'

const ROUTE_LABELS = {
  home: 'Home',
  profile: 'Profile',
  'deck-demo': 'Deck demo',
  'rich-text-demo': 'Rich text demo',
  settings: 'Settings',
  workspace: 'Workspace',
  'accept-invite': 'Join',
}

const PARENT_ROUTE = {
  home: null,
  profile: 'home',
  'deck-demo': 'home',
  'rich-text-demo': 'home',
  settings: 'home',
  workspace: 'home',
  'accept-invite': 'home',
}

const HISTORY_LIMIT = 10

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

function readInviteFromUrl() {
  try {
    const url = new URL(window.location.href)
    const token = url.searchParams.get('invite')
    if (!token) return null
    url.searchParams.delete('invite')
    window.history.replaceState({}, '', url.pathname + url.search + url.hash)
    return { route: 'accept-invite', params: { inviteToken: token } }
  } catch {
    return null
  }
}

export function NavigationProvider({ children, initial }) {
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? null
  const prevUserIdRef = useRef(undefined)
  const hasExplicitInitial =
    typeof initial === 'string' && ROUTES.includes(initial)

  const [stack, setStack] = useState(() => {
    const inviteFrame = readInviteFromUrl()
    if (inviteFrame) return [inviteFrame]
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
          if (prev[0]?.route === 'accept-invite') return prev
          return [frame]
        })
      } catch {
        const frame = normalizeFrame(stored)
        setStack((prev) => {
          if (prev.length !== 1 || framesEqual(prev[0], frame)) return prev
          if (prev[0]?.route === 'accept-invite') return prev
          return [frame]
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [hasExplicitInitial])

  // Skip the first resolved session so a refresh still restores lastRoute.
  useEffect(() => {
    if (authLoading) return
    const prev = prevUserIdRef.current
    prevUserIdRef.current = userId
    if (prev === undefined) return
    if (prev === userId) return
    setStack((prevStack) => {
      if (prevStack[0]?.route === 'accept-invite') return prevStack
      return [{ route: DEFAULT_ROUTE, params: {} }]
    })
  }, [authLoading, userId])

  useEffect(() => {
    const frame = stack[stack.length - 1]
    if (!frame?.route || !ROUTES.includes(frame.route)) return
    // Don't persist invite tokens
    const toStore =
      frame.route === 'accept-invite'
        ? { route: 'home', params: {} }
        : frame
    asyncStorage.setItem(LAST_ROUTE_KEY, JSON.stringify(toStore))
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
      goHome: () => navigate('home'),
      goProfile: () => navigate('profile'),
      goDeckDemo: () => navigate('deck-demo'),
      goRichTextDemo: () => navigate('rich-text-demo'),
      goSettings: () => navigate('settings'),
      goWorkspace: (workspaceId) => navigate('workspace', { workspaceId }),
      goAcceptInvite: (inviteToken) =>
        navigate('accept-invite', { inviteToken }),
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
