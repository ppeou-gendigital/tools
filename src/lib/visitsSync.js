// Per-domain read-modify-write sync for the visited-URLs stream.
//
// Shared by:
//   - background.js (SW): scheduled via chrome.alarms + fires after each
//                         capture. Owns writes to Supabase.
//   - PrefsSync (popup): calls syncVisits on popup mount (or via
//                        chrome.runtime.sendMessage to the SW in the
//                        extension build) so the user sees fresh data
//                        right after opening Loopy.
//
// Design (updated to fix cross-device conflicts):
//   - Per-domain compare-and-swap (CAS). For each local domain that
//     has visits, we call upsertDomainWithMerge which reads the current
//     remote row, merges local paths in, and writes back conditionally
//     on updated_at. If two devices try to update the same domain at
//     once, one retries and both additions land in the row.
//   - Also pulls remote-only domains at the end so this device catches
//     up on visits made from other devices.
//   - Never deletes. Local removals stay local; remote is only appended
//     to or updated. Aligns with the safety-net we added after the mass
//     wipe.
//   - Idempotent. Running it twice back-to-back is safe — the second
//     call is essentially "read remote, note it matches local, done".
//   - No throws for expected states (no session, no local visits).
//     Returns a status object so callers can log/report.

import { asyncStorage } from '@/lib/storage'
import { normalizeVisitedByDomain } from '@/lib/visitedUrls'
import {
  fetchUserVisits,
  upsertDomainWithMerge,
} from '@/lib/visitedUrlsApi'

const VISITED_KEY = 'loopy.visitedByDomain'

function readJson(raw) {
  if (raw == null) return {}
  if (typeof raw === 'object') return raw
  if (typeof raw !== 'string') return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function readLocalVisits() {
  const raw = await asyncStorage.getItem(VISITED_KEY)
  return normalizeVisitedByDomain(readJson(raw))
}

async function writeLocalVisits(next) {
  await asyncStorage.setItem(VISITED_KEY, JSON.stringify(next ?? {}))
}

// Result shape:
//   { status: 'ok',       pushed, pulled, retries, mergedIntoLocal }
//   { status: 'skipped',  reason: 'no-user' | 'nothing-local-nor-remote' }
//   { status: 'partial',  pushed, pulled, retries, errors: [...] }
//   { status: 'failed',   error }
export async function syncVisits(userId) {
  if (!userId) return { status: 'skipped', reason: 'no-user' }

  const local = await readLocalVisits()
  const localDomains = Object.keys(local)

  // Per-domain CAS push. For each domain we have locally, atomically
  // merge our paths into the remote row. The returned server view
  // becomes the new local truth for that domain.
  const nextLocal = { ...local }
  const errors = []
  let pushed = 0
  let retries = 0
  for (const domain of localDomains) {
    const bucket = local[domain]
    const paths =
      bucket?.paths && typeof bucket.paths === 'object' && !Array.isArray(bucket.paths)
        ? bucket.paths
        : null
    if (!paths || Object.keys(paths).length === 0) continue
    try {
      const result = await upsertDomainWithMerge(userId, domain, paths)
      const resultPaths =
        result.paths &&
        typeof result.paths === 'object' &&
        !Array.isArray(result.paths)
          ? result.paths
          : paths
      nextLocal[domain] = {
        paths: resultPaths,
        updatedAt: result.updatedAt,
      }
      if (result.attempts > 1) retries += result.attempts - 1
      pushed += 1
    } catch (err) {
      errors.push(`push ${domain}: ${err?.message ?? err}`)
    }
  }

  // Pull remote-only domains. Fetched after the pushes so we also see
  // anything another device wrote during our push cycle.
  let remoteMap
  try {
    remoteMap = normalizeVisitedByDomain(await fetchUserVisits(userId))
  } catch (err) {
    return {
      status: errors.length ? 'partial' : 'failed',
      error: `pull: ${err?.message ?? err}`,
      pushed,
      pulled: 0,
      retries,
      errors: errors.length ? errors : undefined,
    }
  }

  let mergedIntoLocal = false
  for (const [domain, remoteBucket] of Object.entries(remoteMap)) {
    if (!(domain in nextLocal)) {
      nextLocal[domain] = remoteBucket
      mergedIntoLocal = true
    }
  }

  // Persist any changes to local (either new server view of our pushed
  // domains, or newly-pulled remote-only domains).
  const normalizedNext = normalizeVisitedByDomain(nextLocal)
  const localChanged =
    JSON.stringify(normalizedNext) !== JSON.stringify(local)
  if (localChanged) {
    await writeLocalVisits(normalizedNext)
  }

  if (localDomains.length === 0 && Object.keys(remoteMap).length === 0) {
    return { status: 'skipped', reason: 'nothing-local-nor-remote' }
  }

  if (errors.length > 0) {
    return {
      status: 'partial',
      pushed,
      pulled: Object.keys(remoteMap).length,
      retries,
      errors,
      mergedIntoLocal: localChanged,
    }
  }

  return {
    status: 'ok',
    pushed,
    pulled: Object.keys(remoteMap).length,
    retries,
    mergedIntoLocal: localChanged,
  }
}
