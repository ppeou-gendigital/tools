// Supabase I/O for loopy_aem_author_sites (Fav Links CAS recipe).

import { supabase } from '@/lib/supabase'
import {
  AEM_AUTHOR_SITES_TABLE,
  mergeAemAuthorSites,
  normalizeAemAuthorSites,
} from '@/lib/aemAuthorSites'
import { enqueueSyncOp } from '@/lib/supabaseSync'

const CAS_MAX_ATTEMPTS = 5
const PG_UNIQUE_VIOLATION = '23505'

function rowToBucket(row) {
  if (!row) return null
  return normalizeAemAuthorSites({
    [row.author_host]: {
      authorOrigin: row.author_origin,
      sitesFetchedAt: row.sites_fetched_at,
      updatedAt: row.updated_at,
      sites: row.sites,
    },
  })[String(row.author_host || '').toLowerCase()]
}

function bucketToRow(userId, authorHost, bucket) {
  const normalized = normalizeAemAuthorSites({ [authorHost]: bucket })[authorHost]
  return {
    user_id: userId,
    author_host: authorHost,
    author_origin: normalized?.authorOrigin || '',
    sites: normalized?.sites || [],
    sites_fetched_at: normalized?.sitesFetchedAt || null,
    updated_at: normalized?.updatedAt || new Date().toISOString(),
  }
}

/**
 * Pure op against one author-host bucket, CAS on updated_at.
 * @returns {{ host, bucket, attempts, noop? }}
 */
export async function applyAemAuthorSiteOp(userId, authorHost, op) {
  if (!userId) throw new Error('applyAemAuthorSiteOp: userId is required')
  const host = String(authorHost || '')
    .trim()
    .toLowerCase()
  if (!host) throw new Error('applyAemAuthorSiteOp: authorHost is required')
  if (typeof op !== 'function') {
    throw new Error('applyAemAuthorSiteOp: op must be a function')
  }

  let lastError = null
  for (let attempt = 1; attempt <= CAS_MAX_ATTEMPTS; attempt++) {
    const { data: current, error: readErr } = await supabase
      .from(AEM_AUTHOR_SITES_TABLE)
      .select('author_host, author_origin, sites, sites_fetched_at, updated_at')
      .eq('user_id', userId)
      .eq('author_host', host)
      .maybeSingle()
    if (readErr) throw readErr

    const currentBucket = rowToBucket(current) || {
      authorOrigin: '',
      sitesFetchedAt: null,
      updatedAt: null,
      sites: [],
    }
    const observedUpdatedAt = current?.updated_at ?? null

    const nextBucket = normalizeAemAuthorSites({
      [host]: op(currentBucket),
    })[host] || {
      authorOrigin: '',
      sitesFetchedAt: null,
      updatedAt: null,
      sites: [],
    }

    const same =
      JSON.stringify({
        o: currentBucket.authorOrigin,
        f: currentBucket.sitesFetchedAt,
        s: currentBucket.sites,
      }) ===
      JSON.stringify({
        o: nextBucket.authorOrigin,
        f: nextBucket.sitesFetchedAt,
        s: nextBucket.sites,
      })

    if (same) {
      return {
        host,
        bucket: currentBucket,
        attempts: attempt,
        noop: true,
      }
    }

    const nextUpdatedAt = new Date().toISOString()
    nextBucket.updatedAt = nextUpdatedAt
    const row = bucketToRow(userId, host, nextBucket)

    if (!current) {
      const { data: inserted, error: insertErr } = await supabase
        .from(AEM_AUTHOR_SITES_TABLE)
        .insert(row)
        .select('author_host, author_origin, sites, sites_fetched_at, updated_at')
        .maybeSingle()
      if (!insertErr && inserted) {
        return {
          host,
          bucket: rowToBucket(inserted),
          attempts: attempt,
        }
      }
      if (insertErr && insertErr.code !== PG_UNIQUE_VIOLATION) throw insertErr
      lastError =
        insertErr ??
        new Error(`applyAemAuthorSiteOp: INSERT miss (${host}) attempt ${attempt}`)
      continue
    }

    const { data: updated, error: updateErr } = await supabase
      .from(AEM_AUTHOR_SITES_TABLE)
      .update({
        author_origin: row.author_origin,
        sites: row.sites,
        sites_fetched_at: row.sites_fetched_at,
        updated_at: nextUpdatedAt,
      })
      .eq('user_id', userId)
      .eq('author_host', host)
      .eq('updated_at', observedUpdatedAt)
      .select('author_host, author_origin, sites, sites_fetched_at, updated_at')
      .maybeSingle()
    if (updateErr) throw updateErr
    if (updated) {
      return { host, bucket: rowToBucket(updated), attempts: attempt }
    }
    lastError = new Error(
      `applyAemAuthorSiteOp: CAS miss on UPDATE (${host}) attempt ${attempt}`,
    )
  }
  throw lastError || new Error('applyAemAuthorSiteOp: CAS exhausted')
}

export async function pullAemAuthorSites(userId, local = {}) {
  if (!userId) throw new Error('pullAemAuthorSites: userId is required')
  const { data, error } = await supabase
    .from(AEM_AUTHOR_SITES_TABLE)
    .select('author_host, author_origin, sites, sites_fetched_at, updated_at')
    .eq('user_id', userId)
  if (error) throw error

  const remote = {}
  for (const row of data ?? []) {
    const host = String(row.author_host || '')
      .trim()
      .toLowerCase()
    if (!host) continue
    const bucket = rowToBucket(row)
    if (bucket) remote[host] = bucket
  }
  return mergeAemAuthorSites(local, remote)
}

export function enqueueAemAuthorSiteOp({ userId, authorHost, op }) {
  return enqueueSyncOp({
    stream: 'aemAuthorSites',
    key: authorHost,
    fn: () => applyAemAuthorSiteOp(userId, authorHost, op),
  })
}
