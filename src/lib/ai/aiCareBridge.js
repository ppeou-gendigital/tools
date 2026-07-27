/** Tiny bridge so callers can open the care overlay without a React cycle. */

let handler = null

export function registerAiCareHandler(fn) {
  handler = fn
  return () => {
    if (handler === fn) handler = null
  }
}

/** @param {string} patientId */
export function openAiCareChat(patientId) {
  if (!patientId) return
  handler?.({ patientId })
}
