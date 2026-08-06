import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { emptyJiraConfig, normalizeProfileConfig } from '@/lib/jira/initialState'
import {
  loadProfileConfig,
  saveProfileConfig,
} from '@/lib/jira/profileStorage'
import { useProfiles } from '@/providers/ProfileProvider'

const JiraConfigContext = createContext(null)

export function JiraConfigProvider({ children }) {
  const { selectedId, ready: profilesReady } = useProfiles()
  const [jira, setJiraState] = useState(emptyJiraConfig)
  const [loadedFor, setLoadedFor] = useState(null)
  const saveTimer = useRef(null)
  const selectedRef = useRef(selectedId)

  useEffect(() => {
    selectedRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    if (!profilesReady) return
    let cancelled = false
    const id = selectedId || ''

    if (!id) {
      queueMicrotask(() => {
        if (cancelled) return
        setJiraState(emptyJiraConfig())
        setLoadedFor('')
      })
      return () => {
        cancelled = true
      }
    }

    loadProfileConfig(id).then((config) => {
      if (cancelled) return
      setJiraState(config.jira)
      setLoadedFor(id)
    })
    return () => {
      cancelled = true
    }
  }, [selectedId, profilesReady])

  const ready = profilesReady && loadedFor === (selectedId || '')

  const persist = useCallback((nextJira) => {
    const id = selectedRef.current
    if (!id) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveProfileConfig(id, { jira: nextJira })
    }, 150)
  }, [])

  const setJira = useCallback(
    (patch) => {
      setJiraState((prev) => {
        const next = { ...prev, ...patch }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const setLookupList = useCallback(
    (patch) => {
      setJiraState((prev) => {
        const next = {
          ...prev,
          lookupList: { ...prev.lookupList, ...patch },
        }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const replaceConfig = useCallback(
    (raw) => {
      const { jira: next } = normalizeProfileConfig(raw)
      setJiraState(next)
      persist(next)
    },
    [persist],
  )

  const value = useMemo(
    () => ({
      jira,
      ready,
      selectedId,
      setJira,
      setLookupList,
      replaceConfig,
    }),
    [jira, ready, selectedId, setJira, setLookupList, replaceConfig],
  )

  return (
    <JiraConfigContext.Provider value={value}>
      {children}
    </JiraConfigContext.Provider>
  )
}

export function useJiraConfig() {
  const ctx = useContext(JiraConfigContext)
  if (!ctx) {
    throw new Error('useJiraConfig must be used inside <JiraConfigProvider>')
  }
  return ctx
}
