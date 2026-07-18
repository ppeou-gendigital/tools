// Deprecated public surface — use `@/lib/supabaseSync` instead.
// Thin wrappers kept so any stray imports keep working during the cutover.

import {
  applySyncOp,
  deleteSyncAll,
  deleteSyncDomain,
  pullSync,
} from '@/lib/supabaseSync'

export async function fetchUserFavorites(userId) {
  return pullSync({ stream: 'favorites', userId, local: {} })
}

export async function applyDomainOp(userId, domain, applyFn) {
  return applySyncOp({
    stream: 'favorites',
    userId,
    key: domain,
    op: applyFn,
  })
}

export async function deleteDomainFavorites(userId, domain) {
  return deleteSyncDomain({ stream: 'favorites', userId, key: domain })
}

export async function deleteAllUserFavorites(userId) {
  return deleteSyncAll({ stream: 'favorites', userId })
}
