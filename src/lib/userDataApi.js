// Thin compatibility wrappers around supabaseSync for the prefs stream.
// Prefer applySyncOp / pullSync directly from new code.
//
// The user_data row has one JSONB column in the template:
//   data — the prefs blob: { theme, fontSize, fabCorner, updatedAt }
//
// Add more JSONB columns as your tool grows, then extend normalizePrefsRow
// + op factories in userDataOps.js / supabaseSync.js. Keep columns
// independent so any single one can be promoted to a real table later.

import { applySyncOp, pullSync } from '@/lib/supabaseSync'

export async function fetchUserData(userId) {
  if (!userId) return null
  return pullSync({ stream: 'prefs', userId })
}

export async function saveUserData(userId, { data }) {
  if (!userId) throw new Error('saveUserData: userId is required')
  return applySyncOp({
    stream: 'prefs',
    userId,
    op: (row) => ({
      ...(row ?? { data: {} }),
      data: {
        theme: data.theme,
        fontSize: data.fontSize,
        fabCorner: data.fabCorner,
      },
    }),
  })
}
