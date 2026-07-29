// Thin compatibility wrappers around supabaseSync for the prefs stream.
// Prefer applySyncOp / pullSync directly from new code.
//
// The user_data row has one JSONB column in the template:
//   data — the prefs blob: { theme, fontSize, fabCorner, aiFabCorner, updatedAt, …siblings }
//
// Sibling-tool keys on `data` must be preserved (see extractForeignPrefs).
// Crypto salt/verifier belongs in public.vault_meta — never in this blob.

import { applySyncOp, pullSync } from '@/lib/supabaseSync'
import { extractForeignPrefs } from '@/lib/prefs'

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
        ...extractForeignPrefs(row?.data),
        theme: data.theme,
        fontSize: data.fontSize,
        fabCorner: data.fabCorner,
        aiFabCorner: data.aiFabCorner,
      },
    }),
  })
}
