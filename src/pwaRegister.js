// Web/PWA only. Registers the service worker and aggressively checks
// for updates — critical for iOS home-screen apps where there is no
// hard-reload affordance and the standalone webview can stay alive
// for days without navigating (including restore from bfcache).
//
// Loaded from main.jsx only when MODE !== 'extension' so the Chrome
// extension build never resolves `virtual:pwa-register`.
//
// `registerType: 'autoUpdate'` (vite.config) already skipWaiting +
// clientsClaim and reloads on controllerchange. This file only makes
// sure update checks actually run on iOS lifecycle events.

import { registerSW } from 'virtual:pwa-register'

const UPDATE_CHECK_MS = 15 * 60 * 1000

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Activate waiting worker promptly (belt-and-suspenders with autoUpdate).
    updateSW?.(true)
  },
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return

    const checkForUpdate = () => {
      registration.update().catch(() => {
        // Offline / flaky network — ignore; next focus will retry.
      })
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate()
    })
    window.addEventListener('focus', checkForUpdate)
    window.addEventListener('online', checkForUpdate)

    // iOS often restores the standalone webview from bfcache without a
    // fresh navigation — pageshow(persisted) is the signal to re-check.
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) checkForUpdate()
    })

    setInterval(checkForUpdate, UPDATE_CHECK_MS)

    // New worker installed while backgrounded → activate immediately.
    registration.addEventListener('updatefound', () => {
      const installing = registration.installing
      if (!installing) return
      installing.addEventListener('statechange', () => {
        if (
          installing.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          updateSW?.(true)
        }
      })
    })
  },
})
