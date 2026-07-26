import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AiPlannerOverlay } from '@/blocks/AiPlannerOverlay'
import {
  openAiPlannerChat as bridgeOpenChat,
  openAiPlannerCreate as bridgeOpenCreate,
  registerAiPlannerHandler,
} from '@/lib/ai/aiPlannerBridge'
import { useNavigation } from '@/providers/NavigationProvider'

const AiPlannerContext = createContext(null)

export function AiPlannerProvider({ children }) {
  const nav = useNavigation()
  const [state, setState] = useState({
    open: false,
    mode: 'chat',
    journeyId: null,
  })

  const openCreate = useCallback(() => {
    setState({ open: true, mode: 'create', journeyId: null })
  }, [])

  const openChat = useCallback((journeyId) => {
    if (!journeyId) return
    setState({ open: true, mode: 'chat', journeyId })
  }, [])

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }))
  }, [])

  useEffect(() => {
    return registerAiPlannerHandler(({ mode, journeyId }) => {
      if (mode === 'create') openCreate()
      else if (mode === 'chat') openChat(journeyId)
    })
  }, [openCreate, openChat])

  // Deep links / old routes → open overlay and bounce to a sensible page.
  useEffect(() => {
    if (nav.route === 'ai-generate') {
      openCreate()
      nav.replace('home')
      return
    }
    if (nav.route === 'ai-planner') {
      const id = nav.params?.journeyId
      if (id) {
        openChat(id)
        nav.replace('journey', { journeyId: id })
      } else {
        openCreate()
        nav.replace('home')
      }
      return
    }
    if (nav.route === 'ai-enrich') {
      const id = nav.params?.journeyId
      if (id) {
        openChat(id)
        nav.replace('journey', { journeyId: id })
      }
    }
  }, [nav.route, nav.params?.journeyId, nav, openCreate, openChat])

  const value = useMemo(
    () => ({
      open: state.open,
      mode: state.mode,
      journeyId: state.journeyId,
      openCreate,
      openChat,
      close,
    }),
    [state, openCreate, openChat, close],
  )

  return (
    <AiPlannerContext.Provider value={value}>
      {children}
      <AiPlannerOverlay
        open={state.open}
        mode={state.mode}
        journeyId={state.journeyId}
        onClose={close}
      />
    </AiPlannerContext.Provider>
  )
}

export function useAiPlanner() {
  const ctx = useContext(AiPlannerContext)
  if (!ctx) {
    throw new Error('useAiPlanner must be used inside <AiPlannerProvider>')
  }
  return ctx
}

/** Optional: for code that may run outside the provider (shouldn’t). */
export function tryOpenAiPlannerCreate() {
  bridgeOpenCreate()
}

export function tryOpenAiPlannerChat(journeyId) {
  bridgeOpenChat(journeyId)
}
