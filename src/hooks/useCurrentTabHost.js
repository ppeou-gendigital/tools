import { useEffect, useState } from 'react'
import { isJumpableUrl, readActiveTabUrl } from '@/lib/activeTab'
import { isExtension } from '@/env'

// Look up the hostname of the active browser tab. Extension-only: on
// the web build there's no chrome.tabs, so we return null and callers
// simply don't render the "current tab" affordance. Runs once on mount
// — the popup is short-lived enough that we don't need to poll.
//
// isJumpableUrl (from activeTab.js) rejects chrome://, about:, file://,
// etc. so we don't end up trying to treat an internal Chrome surface as
// if it were a real host.
export function useCurrentTabHost() {
  const [host, setHost] = useState(null)
  useEffect(() => {
    if (!isExtension()) return
    let mounted = true
    readActiveTabUrl().then((url) => {
      if (!mounted) return
      if (!isJumpableUrl(url)) return
      try {
        const parsed = new URL(url)
        const hostname = parsed.hostname?.toLowerCase()
        if (hostname) setHost(hostname)
      } catch {
        // Malformed URL — leave host null.
      }
    })
    return () => {
      mounted = false
    }
  }, [])
  return host
}
