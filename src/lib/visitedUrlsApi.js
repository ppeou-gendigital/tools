// Deprecated public surface — use `@/lib/supabaseSync` instead.
// Thin wrappers kept so any stray imports keep working during the cutover.

import {
  applySyncOp,
  deleteSyncAll,
  deleteSyncDomain,
  opUnionVisitPaths,
  pullSync,
} from '@/lib/supabaseSync'

export async function fetchUserVisits(userId) {
  return pullSync({ stream: 'visits', userId, local: {} })
}

export async function upsertDomainWithMerge(userId, domain, localPaths) {
  return applySyncOp({
    stream: 'visits',
    userId,
    key: domain,
    op: opUnionVisitPaths(localPaths),
  })
}

export async function saveDomainVisits(userId, domain, paths) {
  return applySyncOp({
    stream: 'visits',
    userId,
    key: domain,
    op: () => paths ?? {},
  })
}

export async function deleteDomainVisits(userId, domain) {
  return deleteSyncDomain({ stream: 'visits', userId, key: domain })
}

export async function deleteAllUserVisits(userId) {
  return deleteSyncAll({ stream: 'visits', userId })
}
