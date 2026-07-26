import { FIREBASE_AI_ENABLED, isExtension } from '@/env'
import { hasFirebaseConfig } from '@/lib/firebaseApp'

/** True when AI planner UI + Gemini calls are allowed. */
export function isAiPlanningEnabled() {
  if (!FIREBASE_AI_ENABLED) return false
  if (isExtension()) return false
  if (!hasFirebaseConfig()) return false
  return true
}
