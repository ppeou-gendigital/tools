// Deprecated public surface — use `@/lib/supabaseSync` instead.
// Thin wrappers kept so any stray imports keep working during the cutover.

import { applySyncOp, pullSync } from '@/lib/supabaseSync'

export async function fetchUserData(userId) {
  return pullSync({ stream: 'prefs', userId })
}

// Full-row replace via a pure op. Prefer field operators from
// supabaseSync (opSetTheme, opTogglePinned, …) for new code.
export async function saveUserData(
  userId,
  { data, aemDomains, trackedHostnames, pinnedSites, favoritesOrder },
) {
  return applySyncOp({
    stream: 'prefs',
    userId,
    op: () => ({
      data: data ?? {},
      aemDomains: aemDomains ?? [],
      trackedHostnames: trackedHostnames ?? {},
      pinnedSites: pinnedSites ?? [],
      favoritesOrder: favoritesOrder ?? [],
    }),
  })
}
