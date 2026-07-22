// Thin wrappers over supabaseSync for prefs / legacy callers.
// Vault crypto meta lives in public.vault_meta — see vaultMetaApi.js.

import { applySyncOp, pullSync } from '@/lib/supabaseSync'
import {
  saveVaultMeta as saveVaultMetaRow,
  VAULT_APP_ACCESSO,
} from '@/lib/vaultMetaApi'

export async function fetchUserData(userId) {
  return pullSync({ stream: 'prefs', userId })
}

// Full-blob replace via a pure op. Prefer field operators
// (opSetTheme, …) for new code. Do not put vault salt/verifier here.
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

/** @deprecated Prefer importing saveVaultMeta from vaultMetaApi.js */
export async function saveVaultMeta(userId, patch) {
  return saveVaultMetaRow(userId, patch, VAULT_APP_ACCESSO)
}
