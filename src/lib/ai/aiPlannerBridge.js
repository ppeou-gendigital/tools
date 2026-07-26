/** Tiny bridge so NavigationProvider can open the overlay without a React cycle. */

let handler = null

export function registerAiPlannerHandler(fn) {
  handler = fn
  return () => {
    if (handler === fn) handler = null
  }
}

export function openAiPlannerCreate() {
  handler?.({ mode: 'create' })
}

/**
 * @param {string} journeyId
 * @param {{ mapFocus?: { lat: number, lng: number, source?: string } | null }} [opts]
 */
export function openAiPlannerChat(journeyId, opts = {}) {
  if (!journeyId) return
  handler?.({
    mode: 'chat',
    journeyId,
    mapFocus: opts.mapFocus || null,
  })
}
