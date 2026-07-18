// Per-domain sync for the visited-URLs stream.
//
// Shared by:
//   - background.js (SW): alarms + post-capture
//   - PrefsSync (popup): triggers sync on mount
//
// All Supabase I/O goes through supabaseSync (Fav Links CAS recipe).
// Capture merges are append/union; user-initiated clears use
// deleteSyncDomain / applySyncOp(opClearDomainPaths) from the provider.

import { asyncStorage } from '@/lib/storage'
import { normalizeVisitedByDomain } from '@/lib/visitedUrls'
import {
  applySyncOp,
  opUnionVisitPaths,
  pullSync,
} from '@/lib/supabaseSync'

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

  const nextLocal = { ...local }
  const errors = []
  let pushed = 0
  let retries = 0
  for (const domain of localDomains) {
    const bucket = local[domain]
    const paths =
      bucket?.paths &&
      typeof bucket.paths === 'object' &&
      !Array.isArray(bucket.paths)
        ? bucket.paths
        : null
    if (!paths || Object.keys(paths).length === 0) continue
    try {
      const result = await applySyncOp({
        stream: 'visits',
        userId,
        key: domain,
        op: opUnionVisitPaths(paths),
      })
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

  let remoteMerged
  try {
    remoteMerged = await pullSync({
      stream: 'visits',
      userId,
      local: nextLocal,
    })
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

  const normalizedNext = normalizeVisitedByDomain(remoteMerged)
  const localChanged =
    JSON.stringify(normalizedNext) !== JSON.stringify(local)
  if (localChanged) {
    await writeLocalVisits(normalizedNext)
  }

  if (localDomains.length === 0 && Object.keys(normalizedNext).length === 0) {
    return { status: 'skipped', reason: 'nothing-local-nor-remote' }
  }

  if (errors.length > 0) {
    return {
      status: 'partial',
      pushed,
      pulled: Object.keys(normalizedNext).length,
      retries,
      errors,
      mergedIntoLocal: localChanged,
    }
  }

  return {
    status: 'ok',
    pushed,
    pulled: Object.keys(normalizedNext).length,
    retries,
    mergedIntoLocal: localChanged,
  }
}
