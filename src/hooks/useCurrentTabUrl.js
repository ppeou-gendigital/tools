import { useEffect, useState } from 'react'
import { isJumpableUrl, readActiveTab } from '@/lib/activeTab'
import { isExtension } from '@/env'

// Return the current tab's URL + title as `{ url, title }`, or null
// when we can't read the tab (no chrome.tabs / web build / non-jumpable
// URL like chrome:// or about:).
//
// Read once on mount; extension popups are short-lived enough that we
// don't poll. Both fields come from the underlying `readActiveTab`
// call so the star toggle and the URL params menu see a consistent
// view — no risk of picking up the title from a stale re-render.
export function useCurrentTab() {
  const [tab, setTab] = useState(null)
  useEffect(() => {
    if (!isExtension()) return
    let mounted = true
    readActiveTab().then((next) => {
      if (!mounted) return
      if (!next || !isJumpableUrl(next.url)) return
      setTab({ url: next.url, title: next.title ?? '' })
    })
    return () => {
      mounted = false
    }
  }, [])
  return tab
}

// Backwards-compatible URL-only view of the current tab. Existing
// callers that only need the URL keep working; new callers that want
// the title should use `useCurrentTab()` instead so they don't fire a
// second `chrome.tabs.query`.
export function useCurrentTabUrl() {
  const tab = useCurrentTab()
  return tab?.url ?? null
}
