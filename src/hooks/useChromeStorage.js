import { useCallback, useEffect, useRef, useState } from 'react'

// Reads/writes a single chrome.storage.local key. Falls back to plain React
// state when the Chrome APIs are unavailable (popup preview in a normal tab).
export function useChromeStorage(key, fallback) {
  const fallbackRef = useRef(fallback)
  const [value, setValueState] = useState(fallback)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true

    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      setReady(true)
      return () => {
        alive = false
      }
    }

    chrome.storage.local.get({ [key]: fallbackRef.current }, (stored) => {
      if (!alive) return
      if (stored?.[key] !== undefined) setValueState(stored[key])
      setReady(true)
    })

    return () => {
      alive = false
    }
  }, [key])

  const setValue = useCallback(
    (next) => {
      setValueState((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({ [key]: resolved })
        }
        return resolved
      })
    },
    [key],
  )

  return [value, setValue, ready]
}
