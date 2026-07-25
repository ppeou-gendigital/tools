import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return
      try {
        const parsed = raw ? JSON.parse(raw) : null
        if (parsed) {
          setDisplayLocaleState(normalizeDisplayLocale(parsed.displayLocale))
          setDefaultCurrencyState(
            normalizeDefaultCurrency(parsed.defaultCurrency),
          )
          setMapsProviderState(normalizeMapsProvider(parsed.mapsProvider))
          setPrefsConfirmedState(normalizePrefsConfirmed(parsed.prefsConfirmed))
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
    await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const setDisplayLocale = useCallback(
    async (next, { fromRemote = false } = {}) => {
      const value = normalizeDisplayLocale(next)
      setDisplayLocaleState(value)
      const blob = localBlob({
        displayLocale: value,
        defaultCurrency,
        mapsProvider,
        prefsConfirmed,
      })
      await persistLocal(blob)
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
              op: (cur) => ({ ...cur, displayLocale: value }),
            }),
        })
      } catch (err) {
        console.warn('[viaggio] displayLocale sync failed:', err?.message ?? err)
      }
    },
    [defaultCurrency, mapsProvider, prefsConfirmed, persistLocal, userId],
  )

  const setDefaultCurrency = useCallback(
    async (next, { fromRemote = false } = {}) => {
      const value = normalizeDefaultCurrency(next)
      setDefaultCurrencyState(value)
      const blob = localBlob({
        displayLocale,
        defaultCurrency: value,
        mapsProvider,
        prefsConfirmed,
      })
      await persistLocal(blob)
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
              op: (cur) => ({ ...cur, defaultCurrency: value }),
            }),
        })
      } catch (err) {
        console.warn(
          '[viaggio] defaultCurrency sync failed:',
          err?.message ?? err,
        )
      }
    },
    [displayLocale, mapsProvider, prefsConfirmed, persistLocal, userId],
  )

  const setMapsProvider = useCallback(
    async (next, { fromRemote = false } = {}) => {
      const value = normalizeMapsProvider(next)
      setMapsProviderState(value)
      const blob = localBlob({
        displayLocale,
        defaultCurrency,
        mapsProvider: value,
        prefsConfirmed,
      })
      await persistLocal(blob)
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
              op: (cur) => ({ ...cur, mapsProvider: value }),
            }),
        })
      } catch (err) {
        console.warn('[viaggio] mapsProvider sync failed:', err?.message ?? err)
      }
    },
    [displayLocale, defaultCurrency, prefsConfirmed, persistLocal, userId],
  )

  const setPrefsConfirmed = useCallback(
    async (next, { fromRemote = false } = {}) => {
      const value = normalizePrefsConfirmed(next)
      setPrefsConfirmedState(value)
      const blob = localBlob({
        displayLocale,
        defaultCurrency,
        mapsProvider,
        prefsConfirmed: value,
      })
      await persistLocal(blob)
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
              op: (cur) => ({ ...cur, prefsConfirmed: value }),
            }),
        })
      } catch (err) {
        console.warn(
          '[viaggio] prefsConfirmed sync failed:',
          err?.message ?? err,
        )
      }
    },
    [displayLocale, defaultCurrency, mapsProvider, persistLocal, userId],
  )

  const confirmPrefs = useCallback(
    async ({ locale, currency }) => {
      const nextLocale = normalizeDisplayLocale(locale) || guessDeviceLocale()
      const nextCurrency =
        normalizeDefaultCurrency(currency) || guessDeviceCurrency()
      setDisplayLocaleState(nextLocale)
      setDefaultCurrencyState(nextCurrency)
      setPrefsConfirmedState(true)
      const blob = localBlob({
        displayLocale: nextLocale,
        defaultCurrency: nextCurrency,
        mapsProvider,
        prefsConfirmed: true,
      })
      await persistLocal(blob)
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
              op: (cur) => ({
                ...cur,
                displayLocale: nextLocale,
                defaultCurrency: nextCurrency,
                prefsConfirmed: true,
              }),
            }),
        })
      } catch (err) {
        console.warn('[viaggio] confirmPrefs sync failed:', err?.message ?? err)
      }
    },
    [mapsProvider, persistLocal, userId],
  )

  const value = useMemo(
    () => ({
      ready,
      displayLocale: displayLocale || guessDeviceLocale(),
      defaultCurrency: defaultCurrency || guessDeviceCurrency(),
      mapsProvider,
      prefsConfirmed,
      setDisplayLocale,
      setDefaultCurrency,
      setMapsProvider,
      setPrefsConfirmed,
      confirmPrefs,
      applyRemote: (remote) => {
        if (!remote) return
        if (remote.displayLocale !== undefined) {
          setDisplayLocaleState(normalizeDisplayLocale(remote.displayLocale))
        }
        if (remote.defaultCurrency !== undefined) {
          setDefaultCurrencyState(
            normalizeDefaultCurrency(remote.defaultCurrency),
          )
        }
        if (remote.mapsProvider !== undefined) {
          setMapsProviderState(normalizeMapsProvider(remote.mapsProvider))
        }
        if (remote.prefsConfirmed !== undefined) {
          setPrefsConfirmedState(
            normalizePrefsConfirmed(remote.prefsConfirmed),
          )
        }
        persistLocal(
          localBlob({
            displayLocale: normalizeDisplayLocale(remote.displayLocale),
            defaultCurrency: normalizeDefaultCurrency(remote.defaultCurrency),
            mapsProvider: normalizeMapsProvider(remote.mapsProvider),
            prefsConfirmed: normalizePrefsConfirmed(remote.prefsConfirmed),
          }),
        )
      },
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
      persistLocal,
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
