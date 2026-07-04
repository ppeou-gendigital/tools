// Loopy service worker (Manifest V3).
//
// Service workers are event-driven and can be terminated any time Chrome
// isn't running an event handler. Do NOT rely on globals surviving between
// invocations — persist state via chrome.storage instead. The hostname
// index below is a *cache*: it's rebuilt from chrome.storage on the first
// use after a cold start.

import { mergeVisit, normalizeVisitedByDomain } from '@/lib/visitedUrls'
import {
  compileRules,
  matchTabToTrackedHost,
  normalizeTrackedHostnames,
} from '@/lib/trackedHostnames'
import { supabase } from '@/lib/supabase'
import { syncVisits } from '@/lib/visitsSync'

const TRACKED_HOSTS_KEY = 'loopy.trackedHostnames'
const VISITED_KEY = 'loopy.visitedByDomain'

// chrome.alarms names.
// - PUSH:     one-shot, ~1s after the last capture. Coalesces bursts.
// - PERIODIC: ~5min heartbeat. Picks up remote changes from other
//             devices even if this device is idle, and retries pushes
//             that lost their PUSH alarm (SW died mid-schedule).
const ALARM_PUSH = 'loopy:visits-sync-push'
const ALARM_PERIODIC = 'loopy:visits-sync-periodic'
const PUSH_DEBOUNCE_MINUTES = 1 / 60 // ~1 second (chrome.alarms min = 1s)
const PERIODIC_MINUTES = 5

// Per-tab last-recorded snapshot, used to squash duplicate onUpdated
// bursts. A single page load can fire multiple `status:'complete'` events
// (title updates, cross-frame loads) and SPAs fire a fresh event on every
// `history.pushState`. This map lives only in worker memory — losing it
// on a cold start just means the next visit re-registers.
const RECENT_TAB_URL = new Map()
const DEDUP_WINDOW_MS = 1500

// Cached compiled tracked-hostname rules ({ includes, excludes, byId }).
// `null` means "not loaded yet"; a concurrent load is deduped via
// `trackedRulesLoading`.
let trackedRules = null
let trackedRulesLoading = null

// Top-level marker so you can verify a fresh build is loaded whenever
// the SW wakes. Bump when the safety-net logic changes.
console.log('[loopy] service worker booted (build: sw-tracked-hosts-v4)')

// One-shot local wipe keyed by schema version. Runs the first time this
// SW build wakes on a device that still has the legacy array-shaped
// visits payload in chrome.storage.local. The remote side is truncated
// separately (see README section 5); after the wipe, capture + sync
// rebuild the data in the new object-keyed shape.
const SCHEMA_KEY = 'loopy.visitsSchemaVersion'
const CURRENT_SCHEMA = 2
chrome.storage.local
  .get(SCHEMA_KEY)
  .then(async (r) => {
    if (r?.[SCHEMA_KEY] !== CURRENT_SCHEMA) {
      await chrome.storage.local.remove(VISITED_KEY)
      await chrome.storage.local.set({ [SCHEMA_KEY]: CURRENT_SCHEMA })
      console.log('[loopy] wiped legacy array-shape visits; schema now v2')
    }
  })
  .catch((err) => {
    console.warn('[loopy] schema-wipe check failed:', err?.message ?? err)
  })

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[loopy] installed:', details.reason)
  ensurePeriodicAlarm()
})

// Also on cold-start of the SW (not just install). If the periodic alarm
// exists it's a no-op; otherwise creates it. This makes sync resilient to
// SW resets and to users updating from a version without alarms.
chrome.runtime.onStartup?.addListener(() => {
  ensurePeriodicAlarm()
})
ensurePeriodicAlarm()

async function ensurePeriodicAlarm() {
  if (!chrome.alarms?.create) {
    console.warn(
      '[loopy] chrome.alarms unavailable (missing "alarms" permission?) — SW-driven sync disabled',
    )
    return
  }
  try {
    const existing = await chrome.alarms.get(ALARM_PERIODIC)
    if (existing) return
    await chrome.alarms.create(ALARM_PERIODIC, {
      periodInMinutes: PERIODIC_MINUTES,
    })
    console.log('[loopy] periodic sync alarm created', {
      minutes: PERIODIC_MINUTES,
    })
  } catch (err) {
    console.warn('[loopy] failed to create periodic alarm:', err?.message ?? err)
  }
}

// Popup <-> SW message dispatcher. Handles:
//   'loopy:open-in-tab'   -> open popup.html as a full tab
//   'loopy:sync-visits'   -> trigger an immediate visits sync
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'loopy:open-in-tab') {
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') })
    sendResponse({ ok: true })
    return true
  }
  if (msg?.type === 'loopy:sync-visits') {
    runSync('popup-request')
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) =>
        sendResponse({ ok: false, error: err?.message ?? String(err) }),
      )
    return true
  }
  return undefined
})

// Load (or reload) the compiled tracked-hostname rules from
// chrome.storage. Cached under `trackedRules`; concurrent callers await
// the same in-flight promise.
async function ensureTrackedRules() {
  if (trackedRules) return trackedRules
  if (trackedRulesLoading) return trackedRulesLoading
  trackedRulesLoading = (async () => {
    try {
      const result = await chrome.storage.local.get(TRACKED_HOSTS_KEY)
      const raw = result?.[TRACKED_HOSTS_KEY]
      let parsed = null
      if (typeof raw === 'string') {
        try {
          parsed = JSON.parse(raw)
        } catch {
          parsed = null
        }
      } else if (Array.isArray(raw)) {
        parsed = raw
      }
      const entries = normalizeTrackedHostnames(parsed)
      trackedRules = compileRules(entries)
      return trackedRules
    } finally {
      trackedRulesLoading = null
    }
  })()
  return trackedRulesLoading
}

// Invalidate the cached rules whenever the tracked-hostnames list
// changes. Next event rebuilds them lazily.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return
  if (changes[TRACKED_HOSTS_KEY]) {
    trackedRules = null
  }
})

// Record a visit into loopy.visitedByDomain. Reads-modifies-writes only
// the one domain's bucket so concurrent writes on different domains
// don't stomp each other. (Chrome storage doesn't offer atomic partial
// updates, but our concurrency is low — one worker, one active tab at a
// time.)
async function recordVisit({ hostname, path, title, matchedDomainId }) {
  const at = new Date().toISOString()
  const result = await chrome.storage.local.get(VISITED_KEY)
  const current = normalizeVisitedByDomain(readJson(result?.[VISITED_KEY]))
  const nextBucket = mergeVisit(current[hostname], {
    path,
    title,
    matchedDomainId,
    at,
  })
  const next = { ...current, [hostname]: nextBucket }
  await chrome.storage.local.set({ [VISITED_KEY]: JSON.stringify(next) })
}

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

// Fire once per tab per URL per DEDUP_WINDOW_MS. Returns true when we
// should record this (tab, url) pair, false when it's a duplicate.
function shouldRecord(tabId, url) {
  const now = Date.now()
  const prev = RECENT_TAB_URL.get(tabId)
  if (prev && prev.url === url && now - prev.at < DEDUP_WINDOW_MS) {
    return false
  }
  RECENT_TAB_URL.set(tabId, { url, at: now })
  // Garbage-collect stale tab entries so long-lived workers don't leak.
  if (RECENT_TAB_URL.size > 200) {
    for (const [k, v] of RECENT_TAB_URL) {
      if (now - v.at > DEDUP_WINDOW_MS * 10) RECENT_TAB_URL.delete(k)
    }
  }
  return true
}

// Core recorder. `url` is the real navigation URL (from webNavigation,
// or the tab's own url as a fallback). `tab` is optional and only used
// for the title.
async function handleNavigation({ tabId, url, tab, source }) {
  // Use console.log (not debug) for the info-level lines so they stay
  // visible under the default DevTools filter. Skip reasons are
  // frequent enough that verbose-only makes sense; happy-path visits
  // are rare enough to always surface.
  if (typeof url !== 'string' || !url) {
    console.debug('[loopy] skip: no url', { tabId, source })
    return
  }
  const rules = await ensureTrackedRules()
  if (!rules.includes || rules.includes.length === 0) {
    console.log('[loopy] skip: no tracked-host include rules configured', {
      tabId,
      url,
      source,
    })
    return
  }
  const match = matchTabToTrackedHost(url, rules)
  if (!match) {
    console.debug('[loopy] skip: hostname not matched by tracked rules', {
      tabId,
      url,
      source,
      includes: rules.includes.map((r) => r.pattern),
      excludes: rules.excludes.map((r) => r.pattern),
    })
    return
  }
  if (!shouldRecord(tabId, url)) {
    console.debug('[loopy] skip: deduped', { tabId, url, source })
    return
  }
  const title = typeof tab?.title === 'string' ? tab.title : ''
  try {
    await recordVisit({
      hostname: match.hostname,
      path: match.path,
      title,
      matchedDomainId: match.matchedDomainId,
    })
    console.log('[loopy] recorded visit', {
      source,
      hostname: match.hostname,
      path: match.path,
      title,
    })
    schedulePushSync()
  } catch (err) {
    console.warn('[loopy] failed to record visit:', err?.message ?? err)
  }
}

// Fire (or reschedule) the debounced push alarm. Called after every
// successful capture. chrome.alarms enforces a 1s minimum delay, so a
// burst of captures during a page load collapses into one sync attempt
// once the burst settles.
async function schedulePushSync() {
  if (!chrome.alarms?.create) {
    // Alarms unavailable — fall back to a plain setTimeout. Fragile
    // (SW may die before it fires), but at least attempts a sync.
    setTimeout(() => {
      runSync('setTimeout-fallback').catch(() => {})
    }, 1000)
    return
  }
  try {
    await chrome.alarms.create(ALARM_PUSH, {
      delayInMinutes: PUSH_DEBOUNCE_MINUTES,
    })
  } catch (err) {
    console.warn('[loopy] failed to schedule push alarm:', err?.message ?? err)
  }
}

// Alarm dispatcher. Both alarms funnel into runSync — the periodic one
// picks up remote drift and retries failed pushes, and the debounced one
// pushes fresh captures promptly.
if (chrome.alarms?.onAlarm) {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== ALARM_PUSH && alarm.name !== ALARM_PERIODIC) return
    runSync(alarm.name).catch((err) => {
      console.warn('[loopy] sync alarm failed:', err?.message ?? err)
    })
  })
}

// Guards against overlapping syncs when the periodic alarm fires while a
// push-triggered sync is still in flight. Second caller silently waits
// on the first result.
let inflightSync = null

async function runSync(reason) {
  if (inflightSync) {
    console.log('[loopy] sync: awaiting in-flight run', { reason })
    return inflightSync
  }
  inflightSync = (async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.warn('[loopy] sync: auth error', error.message)
        return { status: 'failed', error: error.message }
      }
      const userId = data?.session?.user?.id ?? null
      if (!userId) {
        console.log('[loopy] sync: skipped (not signed in)', { reason })
        return { status: 'skipped', reason: 'no-user' }
      }
      const result = await syncVisits(userId)
      console.log('[loopy] sync:', reason, result)
      return result
    } finally {
      inflightSync = null
    }
  })()
  return inflightSync
}


// chrome.webNavigation fires with the actual navigated URL — including
// pushState / replaceState updates that never touch chrome.tabs.url —
// and requires no scripting permission on the target tab. This is the
// reliable channel for tracking; onUpdated below is kept as a safety
// net for the rare event where webNavigation misses (e.g. tabs opened
// from a restored session before the worker booted).
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId !== 0) return
  const tab = await safeGetTab(details.tabId)
  handleNavigation({
    tabId: details.tabId,
    url: details.url,
    tab,
    source: 'onCompleted',
  })
})

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  if (details.frameId !== 0) return
  const tab = await safeGetTab(details.tabId)
  handleNavigation({
    tabId: details.tabId,
    url: details.url,
    tab,
    source: 'onHistoryStateUpdated',
  })
})

// Fallback path via chrome.tabs.onUpdated. Deduplicates against the
// webNavigation events above (same 1500ms window per tab+url) so we
// don't double-record. Handles cases where webNavigation missed —
// e.g. tabs already open when the worker cold-started.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const isComplete = changeInfo.status === 'complete'
  const isUrlChange = typeof changeInfo.url === 'string'
  if (!isComplete && !isUrlChange) return
  const url = changeInfo.url || tab?.url || tab?.pendingUrl
  handleNavigation({ tabId, url, tab, source: 'tabs.onUpdated' })
})

async function safeGetTab(tabId) {
  try {
    return await chrome.tabs.get(tabId)
  } catch {
    return null
  }
}

// Cleanup dedup entries for closed tabs so the map doesn't grow forever.
chrome.tabs.onRemoved.addListener((tabId) => {
  RECENT_TAB_URL.delete(tabId)
})
