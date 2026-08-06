import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  broadcastBridge,
  ensureJiraBridge,
  onBridgeMessage,
} from '@/lib/jira/bridge'
import { isExtension } from '@/env'

const JiraBridgeContext = createContext(null)

export function JiraBridgeProvider({ children }) {
  const [status, setStatus] = useState(() =>
    isExtension() ? 'connecting' : 'web',
  )

  useEffect(() => {
    if (!isExtension()) return
    let cancelled = false
    ensureJiraBridge()
      .then((result) => {
        if (cancelled) return
        setStatus(result.ok ? 'ready' : result.reason || 'error')
      })
      .catch((err) => {
        console.error('[jira-bridge]', err)
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      status,
      broadcast: broadcastBridge,
      on: onBridgeMessage,
    }),
    [status],
  )

  return (
    <JiraBridgeContext.Provider value={value}>
      {children}
    </JiraBridgeContext.Provider>
  )
}

export function useJiraBridge() {
  const ctx = useContext(JiraBridgeContext)
  if (!ctx) {
    throw new Error('useJiraBridge must be used inside <JiraBridgeProvider>')
  }
  return ctx
}
