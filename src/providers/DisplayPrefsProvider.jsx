import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import {
  applySyncOp,
  enqueueSyncOp,
} from '@/lib/supabaseSync'
import {
  guessDeviceCurrency,
  guessDeviceLocale,
} from '@/lib/catalog'
import {
  normalizeDefaultCurrency,
  normalizeDisplayLocale,
  normalizeMapsProvider,
  normalizePrefsConfirmed,
} from '@/lib/prefs'
import {
  opConfirmDisplayPrefs,
  opSetDefaultCurrency,
  opSetDisplayLocale,
  opSetMapsProvider,
  opSetPrefsConfirmed,
} from '@/lib/userDataOps'
import { useAuth } from '@/providers/AuthProvider'

const DisplayPrefsContext = createContext(null)

const STORAGE_KEY = 'viaggio.displayPrefs'

function readLocalSync() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function localBlob({
  displayLocale,
  defaultCurrency,
  mapsProvider,
  prefsConfirmed,
}) {
  return {
    displayLocale,
    defaultCurrency,
    mapsProvider,
    prefsConfirmed,
  }
}

export function DisplayPrefsProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [displayLocale, setDisplayLocaleState] = useState(
    () => readLocalSync()?.displayLocale ?? null,
  )
  const [defaultCurrency, setDefaultCurrencyState] = useState(
    () => readLocalSync()?.defaultCurrency ?? null,
  )
  const [mapsProvider, setMapsProviderState] = useState(
    () => normalizeMapsProvider(readLocalSync()?.mapsProvider),
  )
  const [prefsConfirmed, setPrefsConfirmedState] = useState(
    () => readLocalSync()?.prefsConfirmed === true,
  )
  const [ready, setReady] = useState(false)

  // Live blob for sequential PrefsSync applies — setters must not clobber
  // sibling fields via a stale React closure mid-batch.
  const stateRef = useRef(
    localBlob({
      displayLocale,
      defaultCurrency,
      mapsProvider,
      prefsConfirmed,
    }),
  )
  stateRef.current = localBlob({
    displayLocale,
    defaultCurrency,
    mapsProvider,
    prefsConfirmed,
  })

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return
      try {
        const parsed = raw ? JSON.parse(raw) : null
        if (parsed) {
          const blob = localBlob({
            displayLocale: normalizeDisplayLocale(parsed.displayLocale),
            defaultCurrency: normalizeDefaultCurrency(parsed.defaultCurrency),
            mapsProvider: normalizeMapsProvider(parsed.mapsProvider),
            prefsConfirmed: normalizePrefsConfirmed(parsed.prefsConfirmed),
          })
          stateRef.current = blob
          setDisplayLocaleState(blob.displayLocale)
          setDefaultCurrencyState(blob.defaultCurrency)
          setMapsProviderState(blob.mapsProvider)
          setPrefsConfirmedState(blob.prefsConfirmed)
        }
      } catch {
        // ignore
      }
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  const persistLocal = useCallback(async (next) => {
    stateRef.current = next
    await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const patchLocal = useCallback(
    async (patch) => {
      const blob = localBlob({ ...stateRef.current, ...patch })
      if (patch.displayLocale !== undefined) {
        setDisplayLocaleState(blob.displayLocale)
      }
      if (patch.defaultCurrency !== undefined) {
        setDefaultCurrencyState(blob.defaultCurrency)
      }
      if (patch.mapsProvider !== undefined) {
        setMapsProviderState(blob.mapsProvider)
      }
      if (patch.prefsConfirmed !== undefined) {
        setPrefsConfirmedState(blob.prefsConfirmed)
      }
      await persistLocal(blob)
      return blob
    },
    [persistLocal],
  )

  const setDisplayLocale = useCallback(
    async (next, { fromRemote = false } = {}) => {
      const value = normalizeDisplayLocale(next)
      await patchLocal({ displayLocale: value })
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'displayLocale',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              key: 'displayLocale',
              op: opSetDisplayLocale(value),
            }),
        })
      } catch (err) {
        console.warn('[viaggio] displayLocale sync failed:', err?.message ?? err)
      }
    },
    [patchLocal, userId],
  )

  const setDefaultCurrency = useCallback(
    async (next, { fromRemote = false } = {}) => {
      const value = normalizeDefaultCurrency(next)
      await patchLocal({ defaultCurrency: value })
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'defaultCurrency',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              key: 'defaultCurrency',
              op: opSetDefaultCurrency(value),
            }),
        })
      } catch (err) {
        console.warn(
          '[viaggio] defaultCurrency sync failed:',
          err?.message ?? err,
        )
      }
    },
    [patchLocal, userId],
  )

  const setMapsProvider = useCallback(
    async (next, { fromRemote = false } = {}) => {
      const value = normalizeMapsProvider(next)
      await patchLocal({ mapsProvider: value })
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'mapsProvider',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              key: 'mapsProvider',
              op: opSetMapsProvider(value),
            }),
        })
      } catch (err) {
        console.warn('[viaggio] mapsProvider sync failed:', err?.message ?? err)
      }
    },
    [patchLocal, userId],
  )

  const setPrefsConfirmed = useCallback(
    async (next, { fromRemote = false } = {}) => {
      const value = normalizePrefsConfirmed(next)
      await patchLocal({ prefsConfirmed: value })
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'prefsConfirmed',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              key: 'prefsConfirmed',
              op: opSetPrefsConfirmed(value),
            }),
        })
      } catch (err) {
        console.warn(
          '[viaggio] prefsConfirmed sync failed:',
          err?.message ?? err,
        )
      }
    },
    [patchLocal, userId],
  )

  const confirmPrefs = useCallback(
    async ({ locale, currency }) => {
      const nextLocale = normalizeDisplayLocale(locale) || guessDeviceLocale()
      const nextCurrency =
        normalizeDefaultCurrency(currency) || guessDeviceCurrency()
      await patchLocal({
        displayLocale: nextLocale,
        defaultCurrency: nextCurrency,
        prefsConfirmed: true,
      })
      if (!userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'displayPrefs',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              key: 'displayPrefs',
              op: opConfirmDisplayPrefs({
                locale: nextLocale,
                currency: nextCurrency,
              }),
            }),
        })
      } catch (err) {
        console.warn('[viaggio] confirmPrefs sync failed:', err?.message ?? err)
      }
    },
    [patchLocal, userId],
  )

  const applyRemote = useCallback(
    (remote) => {
      if (!remote) return
      const patch = {}
      if (remote.displayLocale !== undefined) {
        patch.displayLocale = normalizeDisplayLocale(remote.displayLocale)
      }
      if (remote.defaultCurrency !== undefined) {
        patch.defaultCurrency = normalizeDefaultCurrency(remote.defaultCurrency)
      }
      if (remote.mapsProvider !== undefined) {
        patch.mapsProvider = normalizeMapsProvider(remote.mapsProvider)
      }
      if (remote.prefsConfirmed !== undefined) {
        patch.prefsConfirmed = normalizePrefsConfirmed(remote.prefsConfirmed)
      }
      if (Object.keys(patch).length === 0) return
      void patchLocal(patch)
    },
    [patchLocal],
  )

  const value = useMemo(
    () => ({
      ready,
      displayLocale: displayLocale || guessDeviceLocale(),
      defaultCurrency: defaultCurrency || guessDeviceCurrency(),
      // Nullable stored values for PrefsSync equality (not device guesses).
      storedDisplayLocale: displayLocale,
      storedDefaultCurrency: defaultCurrency,
      mapsProvider,
      prefsConfirmed,
      setDisplayLocale,
      setDefaultCurrency,
      setMapsProvider,
      setPrefsConfirmed,
      confirmPrefs,
      applyRemote,
    }),
    [
      ready,
      displayLocale,
      defaultCurrency,
      mapsProvider,
      prefsConfirmed,
      setDisplayLocale,
      setDefaultCurrency,
      setMapsProvider,
      setPrefsConfirmed,
      confirmPrefs,
      applyRemote,
    ],
  )

  return (
    <DisplayPrefsContext.Provider value={value}>
      {children}
    </DisplayPrefsContext.Provider>
  )
}

export function useDisplayPrefs() {
  const ctx = useContext(DisplayPrefsContext)
  if (!ctx) {
    throw new Error('useDisplayPrefs must be used inside <DisplayPrefsProvider>')
  }
  return ctx
}
