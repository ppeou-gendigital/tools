import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import '@tools/ui/css'
import '@tools/behavioral/css'
import './brand.scss'

// Web/PWA only — MODE is statically replaced per Vite build, so the
// extension bundle never pulls in virtual:pwa-register.
if (import.meta.env.MODE !== 'extension') {
  void import('./pwaRegister.js')
}

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found. Did you forget <div id="root"></div>?')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.DEV) {
  void import('./dev/seedScenarios.js').then((mod) => {
    globalThis.__viaggioSeed = {
      seedSpainWorldCup: mod.seedSpainWorldCup,
      seedEuApacRoadTrip: mod.seedEuApacRoadTrip,
      enrichSpainWorldCup: mod.enrichSpainWorldCup,
      seedScandiReunion: mod.seedScandiReunion,
      enrichScandiReunion: mod.enrichScandiReunion,
      asBenjaminEnrichScandi: mod.asBenjaminEnrichScandi,
      asCharlieEnrichScandi: mod.asCharlieEnrichScandi,
      asBenjaminEastAsia: mod.asBenjaminEastAsia,
      asCharlieEastAsia: mod.asCharlieEastAsia,
      seedEuropeCruiseParents: mod.seedEuropeCruiseParents,
      repairScandiPartySplits: mod.repairScandiPartySplits,
      seedPlaylistDemo: mod.seedPlaylistDemo,
      DEMO_PLAYLIST_ITEMS: mod.DEMO_PLAYLIST_ITEMS,
      seedTodoDemo: mod.seedTodoDemo,
      DEMO_TODO_ITEMS: mod.DEMO_TODO_ITEMS,
      seedEastAsiaTodos: mod.seedEastAsiaTodos,
      patchEastAsiaFlightNumbers: mod.patchEastAsiaFlightNumbers,
    }
    void import('./lib/viaggioApi.js').then((api) => {
      globalThis.__viaggioSeed.acceptInvite = api.acceptInvite
    })

    // Firefox DevTools has no evaluate_script — allow ?devRun=<fn> in DEV.
    const run = new URLSearchParams(location.search).get('devRun')
    const fn = run && globalThis.__viaggioSeed?.[run]
    if (typeof fn === 'function') {
      void fn()
        .then((result) => {
          console.info(`[viaggio] devRun=${run}`, result)
          const url = new URL(location.href)
          url.searchParams.delete('devRun')
          history.replaceState({}, '', url.pathname + url.search + url.hash)
        })
        .catch((err) => console.error(`[viaggio] devRun=${run} failed`, err))
    }
  })
}
