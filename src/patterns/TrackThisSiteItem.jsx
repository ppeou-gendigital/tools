import { ListPlus } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useTrackedHostnames } from '@/providers/TrackedHostnamesProvider'
import { readActiveTabUrl } from '@/lib/activeTab'
import {
  canonicalizePattern,
  isValidPattern,
} from '@/lib/trackedHostnames'
import { isExtension } from '@/env'

// Adds the currently active tab's hostname as an `include` rule on the
// shared tracked-hostnames list. Hidden on the web build (no chrome.tabs).
//
// Downstream: the setHosts write flows through the provider's normalizer
// (which assigns a fresh id) into chrome.storage.local; background.js
// picks the change up via storage.onChanged and rebuilds its rule cache
// on the next navigation. PrefsSync mirrors the row to Supabase.
export function TrackThisSiteItem({ onClose }) {
  const { hosts, setHosts } = useTrackedHostnames()

  if (!isExtension()) return null

  async function handleClick() {
    const url = await readActiveTabUrl()
    if (!url) {
      window.alert("Couldn't read the current tab's URL.")
      return
    }
    const pattern = canonicalizePattern(url)
    if (!isValidPattern(pattern)) {
      window.alert(
        `Can't track "${url}" — extract a valid hostname first (e.g. chrome:// and file:// URLs are not trackable).`,
      )
      return
    }
    if (hosts[pattern]) {
      window.alert(`${pattern} is already tracked.`)
      return
    }
    await setHosts((prev) => ({ ...prev, [pattern]: { mode: 'include' } }))
    window.alert(`Now tracking ${pattern}.`)
  }

  return (
    <MenuRow
      icon={ListPlus}
      label="Track this site"
      onClose={onClose}
      onClick={handleClick}
    />
  )
}
