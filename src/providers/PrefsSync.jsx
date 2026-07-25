import { useCallback } from 'react'
import { PrefsSync as ToolsPrefsSync } from '@tools/service'
import { pullSync } from '@/lib/supabaseSync'
import { normalizeRemotePrefs } from '@/lib/prefs'

export function PrefsSync() {
  const pullPrefs = useCallback(async (userId) => {
    const remote = await pullSync({ stream: 'prefs', userId })
    if (!remote) return null
    return { data: normalizeRemotePrefs(remote.data) }
  }, [])

  return <ToolsPrefsSync appId="accesso" pullPrefs={pullPrefs} />
}
