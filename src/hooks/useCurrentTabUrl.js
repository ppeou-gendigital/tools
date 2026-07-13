import { useEffect, useState } from 'react'
import { isJumpableUrl, readActiveTabUrl } from '@/lib/activeTab'
import { isExtension } from '@/env'

// Full-URL sibling of useCurrentTabHost. Read once on mount; extension
// popups are short-lived enough that we don't poll. Returns null on the
// web build (no chrome.tabs) and for URLs that isJumpableUrl rejects
// (chrome://, about:, file://, ...), so callers can render a disabled
// affordance or hide entirely when the tab isn't a real web page.
export function useCurrentTabUrl() {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    if (!isExtension()) return
    let mounted = true
    readActiveTabUrl().then((next) => {
      if (!mounted) return
      if (isJumpableUrl(next)) setUrl(next)
    })
    return () => {
      mounted = false
    }
  }, [])
  return url
}
