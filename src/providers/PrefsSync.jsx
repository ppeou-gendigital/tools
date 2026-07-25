import { useCallback } from 'react'
import { PrefsSync as ToolsPrefsSync } from '@tools/service'
import { pullSync } from '@/lib/supabaseSync'

export function PrefsSync() {
  const pullPrefs = useCallback(
    (userId) => pullSync({ stream: 'prefs', userId }),
    [],
  )
  return <ToolsPrefsSync appId="toolname" pullPrefs={pullPrefs} />
}
