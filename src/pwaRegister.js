// Web/PWA only. Registers the service worker and aggressively checks
// for updates — critical for iOS home-screen apps where there is no
// hard-reload affordance and the standalone webview can stay alive
// for days without navigating.
//
// Loaded from main.jsx only when MODE !== 'extension' so the Chrome
// extension build never resolves `virtual:pwa-register`.

import { registerSW } from 'virtual:pwa-register'

const UPDATE_CHECK_MS = 30 * 60 * 1000

const updateSW = registerSW({
  immediate: true,
  // When a new worker is waiting, activate it and reload so users leave a
  // broken precache without a manual hard-refresh.
  onNeedRefresh() {
    updateSW(true)
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

    // Periodic check while the standalone app stays in foreground.
    setInterval(checkForUpdate, UPDATE_CHECK_MS)
  },
})
