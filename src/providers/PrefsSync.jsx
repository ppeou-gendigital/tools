import { useCallback } from 'react'
import { PrefsSync as ToolsPrefsSync } from '@tools/service'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { pullSync } from '@/lib/supabaseSync'

export function PrefsSync() {
  const {
    ready: displayReady,
    displayLocale,
    defaultCurrency,
    prefsConfirmed,
    setDisplayLocale,
    setDefaultCurrency,
    setPrefsConfirmed,
  } = useDisplayPrefs()

  const pullPrefs = useCallback(
    (userId) => pullSync({ stream: 'prefs', userId }),
    [],
  )

  const extra = [
    {
      key: 'displayLocale',
      get: () => displayLocale,
      set: (v, opts) => setDisplayLocale(v, opts),
      ready: displayReady,
    },
    {
      key: 'defaultCurrency',
      get: () => defaultCurrency,
      set: (v, opts) => setDefaultCurrency(v, opts),
      ready: displayReady,
    },
    {
      key: 'prefsConfirmed',
      get: () => prefsConfirmed,
      set: async (v, opts) => {
        // Remote only confirms (true); never un-confirm from pull.
        if (v === true) await setPrefsConfirmed(true, opts)
      },
      ready: displayReady,
    },
  ]

  return (
    <ToolsPrefsSync appId="viaggio" pullPrefs={pullPrefs} extra={extra} />
  )
}
