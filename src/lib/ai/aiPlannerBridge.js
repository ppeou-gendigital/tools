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

export function openAiPlannerChat(journeyId) {
  if (!journeyId) return
  handler?.({ mode: 'chat', journeyId })
}
