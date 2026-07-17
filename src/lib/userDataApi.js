// Thin wrappers over supabaseSync for vault / legacy callers.
// New code should import applySyncOp / pullSync from @/lib/supabaseSync.

import {
  applySyncOp,
  opPatchVaultMeta,
  pullSync,
} from '@/lib/supabaseSync'

export async function fetchUserData(userId) {
  return pullSync({ stream: 'prefs', userId })
}

// Full-blob replace via a pure op. Prefer field operators
// (opSetTheme, opPatchVaultMeta, …) for new code.
export async function saveUserData(userId, { data }) {
  return applySyncOp({
    stream: 'prefs',
    userId,
    op: (row) => ({
      data: {
        ...(row?.data ?? {}),
        ...(data ?? {}),
      },
    }),
  })
}

// Persist a patch into data.vault via CAS so prefs keys survive.
export async function saveVaultMeta(userId, patch) {
  if (!userId) throw new Error('saveVaultMeta: userId is required')
  return applySyncOp({
    stream: 'prefs',
    userId,
    op: opPatchVaultMeta(patch),
  })
}
