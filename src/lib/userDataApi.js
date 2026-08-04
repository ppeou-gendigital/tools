// Thin wrappers over supabaseSync for the prefs stream / legacy callers.
// Prefer applySyncOp / pullSync directly from new code.
//
// Primary store: public.loopy_user_prefs
//   data    — owned shell prefs: { theme, fontSize, fabCorner, updatedAt }
//   payload — Loopy lists (snake_case):
//             { aem_domains, tracked_hostnames, pinned_sites, favorites_order }
//
// In-memory row shape stays camelCase for providers/ops:
//   { data, aemDomains, trackedHostnames, pinnedSites, favoritesOrder, … }
//
// Legacy public.user_data is dual-read / best-effort dual-write only
// (handled inside supabaseSync).

import { applySyncOp, pullSync } from '@/lib/supabaseSync'

export async function fetchUserData(userId) {
  if (!userId) return null
  return pullSync({ stream: 'prefs', userId })
}

// Full-row replace via a pure op. Prefer field operators from
// supabaseSync (opSetTheme, opTogglePinned, …) for new code.
export async function saveUserData(
  userId,
  { data, aemDomains, trackedHostnames, pinnedSites, favoritesOrder },
) {
  if (!userId) throw new Error('saveUserData: userId is required')
  return applySyncOp({
    stream: 'prefs',
    userId,
    op: (row) => ({
      ...(row ?? {
        data: {},
        aemDomains: [],
        trackedHostnames: {},
        pinnedSites: [],
        favoritesOrder: [],
      }),
      data: data ?? row?.data ?? {},
      aemDomains: aemDomains ?? row?.aemDomains ?? [],
      trackedHostnames: trackedHostnames ?? row?.trackedHostnames ?? {},
      pinnedSites: pinnedSites ?? row?.pinnedSites ?? [],
      favoritesOrder: favoritesOrder ?? row?.favoritesOrder ?? [],
    }),
  })
}
