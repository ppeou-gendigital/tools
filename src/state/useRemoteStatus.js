import { useCallback, useEffect, useState } from 'react'
import { remoteState } from '../lib/jira/remote.js'
import { MESSAGE } from '../runtime/protocol.js'

const IDLE = { status: 'idle', message: '', checkedAt: '' }

// Read-only freshness check for the active profile's Jira attachment. It runs
// when the profile changes or the popup opens — never on a timer — and never
// writes to Jira.
export function useRemoteStatus({ entry, call, enabled }) {
  const source = entry?.source ?? null
  const [state, setState] = useState(IDLE)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => {
    setNonce((value) => value + 1)
  }, [])

  useEffect(() => {
    if (!enabled || !source) {
      setState(IDLE)
      return
    }

    let alive = true
    setState((previous) => ({ ...previous, status: 'checking', message: '' }))

    call(
      MESSAGE.ATTACHMENT_LIST,
      { keys: [source.issueKey] },
      { timeout: 15_000 },
    )
      .then((list) => {
        if (!alive) return
        const ticket = Array.isArray(list) ? list[0] : null
        if (!ticket) throw new Error('Jira returned no ticket.')
        if (ticket.error) throw new Error(ticket.error)

        setState({
          status: remoteState(source, ticket.attachments),
          message: '',
          checkedAt: new Date().toISOString(),
        })
      })
      .catch((error) => {
        if (!alive) return
        setState({
          status: 'error',
          message: error?.message ?? 'Could not check the Jira attachment.',
          checkedAt: new Date().toISOString(),
        })
      })

    return () => {
      alive = false
    }
  }, [enabled, source, call, nonce])

  return { ...state, refresh }
}
