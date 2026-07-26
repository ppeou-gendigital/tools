import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  openAiPlannerChat,
  openAiPlannerCreate,
} from '@/lib/ai/aiPlannerBridge'
import { asyncStorage } from '@/lib/storage'
import { useAuth } from '@/providers/AuthProvider'

const NavigationContext = createContext(null)

const ROUTES = [
  'home',
  'onboarding-prefs',
  'journey-create',
  'ai-generate',
  'ai-enrich',
  'ai-planner',
  'journey',
  'entry-edit',
  'expense-edit',
  'members',
  'accept-invite',
  'spending',
  'playlist',
  'todos',
  'map',
  'journey-settings',
  'profile',
  'settings',
  'people',
  'archives',
  // demos kept but off primary nav
  'deck-demo',
  'rich-text-demo',
]

const DEFAULT_ROUTE = 'home'
const LAST_ROUTE_KEY = 'viaggio:lastRoute'

const ROUTE_LABELS = {
  home: 'Home',
  'onboarding-prefs': 'Preferences',
  'journey-create': 'New journey',
  'ai-generate': 'Plan with AI',
  'ai-enrich': 'Improve plan',
  'ai-planner': 'AI planner',
  journey: 'Journey',
  'entry-edit': 'Activity',
  'expense-edit': 'Expense',
  members: 'Travelers',
  'accept-invite': 'Join',
  spending: 'Spending',
  playlist: 'Playlist',
  todos: 'To-dos',
  map: 'Map',
  'journey-settings': 'Journey settings',
  profile: 'Profile',
  settings: 'Settings',
  people: 'People',
  archives: 'Archives',
  'deck-demo': 'Deck demo',
  'rich-text-demo': 'Rich text demo',
}

const PARENT_ROUTE = {
  home: null,
  'onboarding-prefs': 'home',
  'journey-create': 'home',
  'ai-generate': 'journey-create',
  'ai-enrich': 'journey',
  'ai-planner': 'journey',
  journey: 'home',
  'entry-edit': 'journey',
  'expense-edit': 'entry-edit',
  members: 'journey',
  'accept-invite': 'home',
  spending: 'journey',
  playlist: 'journey',
  todos: 'journey',
  map: 'journey',
  'journey-settings': 'journey',
  profile: 'home',
  settings: 'home',
  people: 'settings',
  archives: 'settings',
  'deck-demo': 'home',
  'rich-text-demo': 'home',
}

const HISTORY_LIMIT = 16

function normalizeFrame(raw) {
  if (typeof raw === 'string') {
    if (!ROUTES.includes(raw)) return { route: DEFAULT_ROUTE, params: {} }
    return { route: raw, params: {} }
  }
  if (raw && typeof raw === 'object' && ROUTES.includes(raw.route)) {
    return {
      route: raw.route,
      params: raw.params && typeof raw.params === 'object' ? raw.params : {},
    }
  }
  return { route: DEFAULT_ROUTE, params: {} }
}

function readLastRouteSync() {
  try {
    const raw = globalThis.localStorage?.getItem(LAST_ROUTE_KEY)
    if (!raw) return { route: DEFAULT_ROUTE, params: {} }
    return normalizeFrame(JSON.parse(raw))
  } catch {
    return { route: DEFAULT_ROUTE, params: {} }
  }
}

function framesEqual(a, b) {
  return (
    a?.route === b?.route && JSON.stringify(a?.params ?? {}) === JSON.stringify(b?.params ?? {})
  )
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
    if (stack[0]?.route === 'accept-invite') return
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
        // ignore
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once
  }, [hasExplicitInitial])

  // Drop another account's last route when the signed-in user changes.
  // Skip the first resolved session so a refresh still restores lastRoute.
  useEffect(() => {
    if (authLoading) return
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = userId
      return
    }
    if (prevUserIdRef.current === userId) return

    const prev = prevUserIdRef.current
    prevUserIdRef.current = userId

    if (!userId || (prev && prev !== userId)) {
      setStack((prevStack) => {
        if (prevStack[0]?.route === 'accept-invite') return prevStack
        return [{ route: DEFAULT_ROUTE, params: {} }]
      })
      asyncStorage.removeItem(LAST_ROUTE_KEY)
    }
  }, [authLoading, userId])

  useEffect(() => {
    const frame = stack[stack.length - 1]
    if (!frame || !ROUTES.includes(frame.route)) return
    // Don't persist invite tokens
    const toStore =
      frame.route === 'accept-invite'
        ? { route: 'home', params: {} }
        : frame
    asyncStorage.setItem(LAST_ROUTE_KEY, JSON.stringify(toStore))
  }, [stack])

  const navigate = useCallback((next, params = {}) => {
    if (!ROUTES.includes(next)) return
    const frame = { route: next, params: params ?? {} }
    setStack((prev) => {
      if (framesEqual(prev[prev.length - 1], frame)) return prev
      const pushed = [...prev, frame]
      return pushed.length > HISTORY_LIMIT
        ? pushed.slice(pushed.length - HISTORY_LIMIT)
        : pushed
    })
  }, [])

  const replace = useCallback((next, params = {}) => {
    if (!ROUTES.includes(next)) return
    const frame = { route: next, params: params ?? {} }
    setStack((prev) => {
      if (prev.length === 0) return [frame]
      // Drop consecutive duplicates (e.g. entry-edit → entry-edit after save)
      const base = prev.slice(0, -1)
      while (
        base.length > 0 &&
        framesEqual(base[base.length - 1], frame)
      ) {
        base.pop()
      }
      return [...base, frame]
    })
  }, [])

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length > 1) return prev.slice(0, -1)
      const current = prev[0]
      const parent = PARENT_ROUTE[current?.route]
      if (!parent) return prev
      // Carry journeyId when popping into journey-scoped parents
      const params = {}
      if (
        (parent === 'journey' ||
          parent === 'entry-edit' ||
          parent === 'expense-edit') &&
        current?.params?.journeyId
      ) {
        params.journeyId = current.params.journeyId
      }
      if (parent === 'entry-edit' && current?.params?.entryId) {
        params.entryId = current.params.entryId
      }
      return [{ route: parent, params }]
    })
  }, [])

  const value = useMemo(() => {
    const frame = stack[stack.length - 1] ?? {
      route: DEFAULT_ROUTE,
      params: {},
    }
    const previous =
      stack.length > 1
        ? stack[stack.length - 2]
        : PARENT_ROUTE[frame.route]
          ? { route: PARENT_ROUTE[frame.route], params: {} }
          : null

    return {
      route: frame.route,
      params: frame.params,
      previousRoute: previous?.route ?? null,
      previousRouteLabel: previous ? ROUTE_LABELS[previous.route] : null,
      history: stack,
      navigate,
      replace,
      goBack,
      goHome: () => navigate('home'),
      goProfile: () => navigate('profile'),
      goSettings: () => navigate('settings'),
      goPeople: () => navigate('people'),
      goArchives: () => navigate('archives'),
      goOnboardingPrefs: () => navigate('onboarding-prefs'),
      goJourneyCreate: () => navigate('journey-create'),
      goAiGenerate: () => openAiPlannerCreate(),
      goAiEnrich: (journeyId) => openAiPlannerChat(journeyId),
      goAiPlanner: (journeyId) => openAiPlannerChat(journeyId),
      goJourney: (journeyId) => navigate('journey', { journeyId }),
      goEntryEdit: (params) => navigate('entry-edit', params),
      goExpenseEdit: (params) => navigate('expense-edit', params),
      goMembers: (journeyId) => navigate('members', { journeyId }),
      goSpending: (journeyId) => navigate('spending', { journeyId }),
      goPlaylist: (journeyId) => navigate('playlist', { journeyId }),
      goTodos: (journeyId) => navigate('todos', { journeyId }),
      goMap: (journeyId) => navigate('map', { journeyId }),
      goJourneySettings: (journeyId) =>
        navigate('journey-settings', { journeyId }),
      goAcceptInvite: (inviteToken) =>
        navigate('accept-invite', { inviteToken }),
      goDeckDemo: () => navigate('deck-demo'),
      goRichTextDemo: () => navigate('rich-text-demo'),
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
