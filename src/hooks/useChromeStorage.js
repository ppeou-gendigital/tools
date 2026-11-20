import { useCallback, useEffect, useRef, useState } from 'react'
import { readKey, writeKey } from '../runtime/storage.js'

// Reads/writes one chrome.storage.local key. Value starts at the fallback,
// resets when the key changes (profile switch), and only reports ready once the
// stored value has been applied.
export function useChromeStorage(key, fallback) {
  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback

  const [value, setValueState] = useState(fallback)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    setReady(false)
    setValueState(fallbackRef.current)

    readKey(key, fallbackRef.current).then((stored) => {
      if (!alive) return
      setValueState(stored)
      setReady(true)
    })

    return () => {
      alive = false
    }
  }, [key])

  const setValue = useCallback(
    (next) => {
      setValueState((previous) => {
        const resolved = typeof next === 'function' ? next(previous) : next
        writeKey(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, setValue, ready]
}
