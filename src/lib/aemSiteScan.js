// AEM Author Query Builder scanners (button-triggered only).
//
// Primary path: inject same-origin fetch into an open Author tab.
// Fallback: service-worker fetch when host permission is already granted.

import { hasUrlOriginPermission } from '@/lib/hostPermission'
import { isExtension } from '@/env'
import {
  classifyDeliveryKind,
  hostFromOrigin,
  isEdsUePageSignal,
  siteSegment,
} from '@/lib/aemAuthorSites'

const PAGE_LIMIT = 100
const MAX_PAGES = 50

const EXCLUDED_CONTENT_SEGMENTS = new Set([
  'dam',
  'experience-fragments',
  'cq:tags',
  'campaigns',
  'projects',
  'screens',
  'forms',
  'launches',
  'communities',
  'catalogs',
  'commerce',
  'entities',
])

function firstString(...candidates) {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim()
    if (Array.isArray(c) && typeof c[0] === 'string' && c[0].trim()) {
      return c[0].trim()
    }
  }
  return ''
}

function pickVanity(hit) {
  const content =
    hit?.['jcr:content'] && typeof hit['jcr:content'] === 'object'
      ? hit['jcr:content']
      : null
  return firstString(
    hit?.['jcr:content/sling:vanityPath'],
    hit?.['jcr:content/cq:vanityPath'],
    content?.['sling:vanityPath'],
    content?.['cq:vanityPath'],
    hit?.vanityPath,
  )
}

function pickTitle(hit, resourcePath) {
  const content =
    hit?.['jcr:content'] && typeof hit['jcr:content'] === 'object'
      ? hit['jcr:content']
      : null
  const title = firstString(
    hit?.['jcr:content/jcr:title'],
    content?.['jcr:title'],
    hit?.title,
  )
  if (title) return title
  const seg = resourcePath.split('/').filter(Boolean).pop()
  return seg || resourcePath
}

function pickPath(hit) {
  if (typeof hit?.path === 'string' && hit.path.startsWith('/')) return hit.path
  if (typeof hit?.['jcr:path'] === 'string' && hit['jcr:path'].startsWith('/')) {
    return hit['jcr:path']
  }
  return null
}

function pickResourceType(hit) {
  const content =
    hit?.['jcr:content'] && typeof hit['jcr:content'] === 'object'
      ? hit['jcr:content']
      : null
  return firstString(
    hit?.['jcr:content/sling:resourceType'],
    content?.['sling:resourceType'],
    hit?.resourceType,
  )
}

function pickResourceSuperType(hit) {
  const content =
    hit?.['jcr:content'] && typeof hit['jcr:content'] === 'object'
      ? hit['jcr:content']
      : null
  return firstString(
    hit?.['jcr:content/sling:resourceSuperType'],
    content?.['sling:resourceSuperType'],
    hit?.resourceSuperType,
  )
}

function pickTemplate(hit) {
  const content =
    hit?.['jcr:content'] && typeof hit['jcr:content'] === 'object'
      ? hit['jcr:content']
      : null
  return firstString(
    hit?.['jcr:content/cq:template'],
    content?.['cq:template'],
    hit?.template,
  )
}

function normalizeHits(hits, pageKind) {
  const out = []
  if (!Array.isArray(hits)) return out
  for (const hit of hits) {
    const resourcePath = pickPath(hit)
    if (!resourcePath) continue
    const node = {
      resourcePath,
      title: pickTitle(hit, resourcePath),
      pageKind,
    }
    const vanity = pickVanity(hit)
    if (vanity) node.vanityPath = vanity
    const resourceType = pickResourceType(hit)
    if (resourceType) node.resourceType = resourceType
    const resourceSuperType = pickResourceSuperType(hit)
    if (resourceSuperType) node.resourceSuperType = resourceSuperType
    const template = pickTemplate(hit)
    if (template) node.template = template
    out.push(node)
  }
  return out
}

const PAGE_QB_PROPERTIES = [
  'jcr:path',
  'jcr:content/jcr:title',
  'jcr:content/sling:vanityPath',
  'jcr:content/cq:vanityPath',
  'jcr:content/sling:resourceType',
  'jcr:content/sling:resourceSuperType',
  'jcr:content/cq:template',
].join(' ')

function buildQueryUrl(authorOrigin, root, offset) {
  const u = new URL(`${authorOrigin}/bin/querybuilder.json`)
  u.searchParams.set('path', root)
  u.searchParams.set('type', 'cq:Page')
  u.searchParams.set('p.hits', 'selective')
  u.searchParams.set('p.limit', String(PAGE_LIMIT))
  u.searchParams.set('p.offset', String(offset))
  u.searchParams.set('p.properties', PAGE_QB_PROPERTIES)
  return u.toString()
}

async function sendSw(message) {
  if (!isExtension() || !chrome?.runtime?.sendMessage) {
    return {
      ok: false,
      error: 'Author scan runs inside the Chrome extension only.',
    }
  }
  try {
    return await chrome.runtime.sendMessage(message)
  } catch (err) {
    return { ok: false, error: err?.message ?? String(err) }
  }
}

async function fetchQueryRootInTab(authorOrigin, root) {
  const response = await sendSw({
    type: 'loopy:aem-querybuilder-tab',
    authorOrigin,
    root,
    pageLimit: PAGE_LIMIT,
    maxPages: MAX_PAGES,
  })
  if (!response?.ok) {
    return {
      ok: false,
      status: response?.status,
      code: response?.code,
      error: response?.error || 'Tab Query Builder request failed',
    }
  }
  return {
    ok: true,
    status: response.status,
    hits: response.hits,
    total: response.total,
  }
}

async function fetchQueryPageViaSw(url) {
  const response = await sendSw({ type: 'loopy:aem-querybuilder', url })
  if (!response?.ok) {
    return {
      ok: false,
      status: response?.status,
      error: response?.error || 'Query Builder request failed',
    }
  }
  return {
    ok: true,
    status: response.status,
    hits: response.hits,
    total: response.total,
  }
}

async function scanRootViaSw(authorOrigin, root, pageKind) {
  const nodes = []
  let offset = 0
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = buildQueryUrl(authorOrigin, root, offset)
    const result = await fetchQueryPageViaSw(url)
    if (!result.ok) {
      if (result.status === 404 && pageKind === 'fragment') {
        return { ok: true, nodes: [] }
      }
      return { ok: false, error: result.error, status: result.status }
    }
    const batch = normalizeHits(result.hits, pageKind)
    nodes.push(...batch)
    const total =
      typeof result.total === 'number' ? result.total : nodes.length
    offset += PAGE_LIMIT
    if (batch.length < PAGE_LIMIT || offset >= total) break
  }
  return { ok: true, nodes }
}

async function scanRootViaTab(authorOrigin, root, pageKind) {
  const result = await fetchQueryRootInTab(authorOrigin, root)
  if (!result.ok) {
    if (result.status === 404 && pageKind === 'fragment') {
      return { ok: true, nodes: [] }
    }
    return result
  }
  return { ok: true, nodes: normalizeHits(result.hits, pageKind) }
}

/**
 * Fetch /content site roots for an Author origin (button-triggered).
 * @returns {{ ok: true, sites: {path,title}[], fetchedAt } | { ok: false, error, code? }}
 */
async function listSitesViaSw(authorOrigin) {
  // Domain refresh: path + title only. Kind is set on site Refresh.
  const u = new URL(`${authorOrigin}/bin/querybuilder.json`)
  u.searchParams.set('path', '/content')
  u.searchParams.set('type', 'cq:Page')
  u.searchParams.set('path.flat', 'true')
  u.searchParams.set('p.nodedepth', '1')
  u.searchParams.set('p.hits', 'selective')
  u.searchParams.set('p.limit', '200')
  u.searchParams.set(
    'p.properties',
    ['jcr:path', 'jcr:content/jcr:title'].join(' '),
  )
  const sw = await fetchQueryPageViaSw(u.toString())
  if (!sw.ok) {
    return {
      ok: false,
      status: sw.status,
      error: sw.error || 'Failed to list sites',
    }
  }
  const sites = []
  for (const hit of sw.hits ?? []) {
    const path = pickPath(hit)
    if (!path) continue
    const seg = siteSegment(path)
    if (!seg || EXCLUDED_CONTENT_SEGMENTS.has(seg.toLowerCase())) continue
    sites.push({ path, title: pickTitle(hit, path) })
  }
  return { ok: true, sites, fetchedAt: new Date().toISOString() }
}

async function qbFoundViaSw(authorOrigin, params) {
  const u = new URL(`${authorOrigin}/bin/querybuilder.json`)
  for (const [k, v] of Object.entries(params)) {
    if (v != null) u.searchParams.set(k, String(v))
  }
  u.searchParams.set('p.limit', '1')
  u.searchParams.set('p.hits', 'selective')
  u.searchParams.set('p.properties', 'jcr:path')
  const result = await fetchQueryPageViaSw(u.toString())
  if (!result.ok) return false
  const total =
    typeof result.total === 'number'
      ? result.total
      : (result.hits?.length ?? 0)
  return total > 0 || (result.hits?.length ?? 0) > 0
}

async function probeFranklinUnderSite(authorOrigin, sitePath, mode) {
  // Prefer Author-tab probe (same-origin session + richer checks).
  const tabResult = await sendSw({
    type: 'loopy:aem-probe-franklin-tab',
    authorOrigin,
    sitePath,
  })
  if (tabResult?.ok) return !!tabResult.found
  if (mode === 'tab') return false

  // SW fallback: path-scoped queries only (never repo-wide).
  if (
    await qbFoundViaSw(authorOrigin, {
      path: sitePath,
      type: 'cq:Page',
      '1_property': 'jcr:content/sling:resourceType',
      '1_property.value': 'core/franklin/components/page/v1/page',
    })
  ) {
    return true
  }
  if (
    await qbFoundViaSw(authorOrigin, {
      path: sitePath,
      type: 'cq:Page',
      '1_property': 'jcr:content/sling:resourceType',
      '1_property.value': 'core/franklin/%',
      '1_property.operation': 'like',
    })
  ) {
    return true
  }
  if (
    await qbFoundViaSw(authorOrigin, {
      path: sitePath,
      '1_property': 'sling:resourceType',
      '1_property.value': 'core/franklin/%',
      '1_property.operation': 'like',
    })
  ) {
    return true
  }
  return false
}

export async function fetchSitesForAuthor(authorOrigin) {
  if (!authorOrigin) {
    return { ok: false, error: 'Author origin is required.' }
  }

  // Prefer inject into an open Author tab (uses page session / activeTab).
  const tabResult = await sendSw({
    type: 'loopy:aem-list-sites-tab',
    authorOrigin,
  })

  if (tabResult?.ok) {
    return {
      ok: true,
      sites: Array.isArray(tabResult.sites) ? tabResult.sites : [],
      fetchedAt: new Date().toISOString(),
    }
  }

  // SW fallback when host permission is already granted (caller should
  // request it from the click handler before calling this).
  if (await hasUrlOriginPermission(authorOrigin)) {
    const viaSw = await listSitesViaSw(authorOrigin)
    if (viaSw.ok) return viaSw
    return {
      ok: false,
      status: viaSw.status,
      code: tabResult?.code,
      error:
        viaSw.error ||
        tabResult?.error ||
        'Failed to list sites from Author.',
    }
  }

  return {
    ok: false,
    code: tabResult?.code || 'permission-denied',
    status: tabResult?.status,
    error:
      tabResult?.error ||
      `Allow site access for ${authorOrigin}, keep Author open in a tab, then Fetch sites again.`,
  }
}

/**
 * Scan pages + experience fragments under one site path.
 * @param {string} authorOrigin
 * @param {string} sitePath e.g. /content/lifelock-eds-ue
 */
export async function scanSitePages(authorOrigin, sitePath) {
  if (!authorOrigin) {
    return { ok: false, error: 'Author origin is required.' }
  }
  const seg = siteSegment(sitePath)
  if (!seg) {
    return { ok: false, error: 'Invalid site path.' }
  }

  const roots = [
    { root: `/content/${seg}`, pageKind: 'page' },
    { root: `/content/experience-fragments/${seg}`, pageKind: 'fragment' },
  ]

  const canSw = await hasUrlOriginPermission(authorOrigin)
  let mode = 'tab'

  // Probe tab injection on the content root.
  const probe = await fetchQueryRootInTab(authorOrigin, roots[0].root)
  if (!probe.ok && probe.status !== 404) {
    if (canSw) {
      mode = 'sw'
    } else if (probe.status === 401 || probe.status === 403) {
      return {
        ok: false,
        status: probe.status,
        error: 'Not logged into Author (or session expired). Log in and retry.',
      }
    } else {
      return {
        ok: false,
        code: probe.code,
        status: probe.status,
        error:
          probe.error ||
          `Open Author (${authorOrigin}) in a tab, click the Loopy toolbar icon, then Scan.`,
      }
    }
  }

  const byPath = new Map()
  const scanRoot = mode === 'tab' ? scanRootViaTab : scanRootViaSw
  let sawFranklin = false

  for (let i = 0; i < roots.length; i += 1) {
    const { root, pageKind } = roots[i]
    let result
    if (i === 0 && mode === 'tab' && (probe.ok || probe.status === 404)) {
      result = {
        ok: true,
        nodes: probe.ok ? normalizeHits(probe.hits, pageKind) : [],
      }
    } else {
      result = await scanRoot(authorOrigin, root, pageKind)
    }

    if (!result.ok) {
      if (result.status === 401 || result.status === 403) {
        return {
          ok: false,
          status: result.status,
          error: 'Not logged into Author (or session expired). Log in and retry.',
        }
      }
      if (result.status === 404 || pageKind === 'fragment') continue
      return result
    }

    for (const node of result.nodes) {
      if (
        isEdsUePageSignal({
          resourceType: node.resourceType,
          resourceSuperType: node.resourceSuperType,
          template: node.template,
        })
      ) {
        sawFranklin = true
      }
      // Drop classify-only fields from persisted nodes.
      const {
        resourceType: _rt,
        resourceSuperType: _rst,
        template: _tpl,
        ...stored
      } = node
      const prev = byPath.get(stored.resourcePath)
      if (
        !prev ||
        (prev.pageKind === 'fragment' && stored.pageKind === 'page')
      ) {
        byPath.set(stored.resourcePath, stored)
      }
    }
  }

  // Always run site-scoped EDS probe on Refresh (cheap; path + p.limit=1).
  if (!sawFranklin) {
    sawFranklin = await probeFranklinUnderSite(
      authorOrigin,
      `/content/${seg}`,
      mode,
    )
  }

  const authorHost = hostFromOrigin(authorOrigin)
  // Site Refresh owns Cloud vs EDS-UE classification.
  const deliveryKind = sawFranklin
    ? 'eds-ue'
    : classifyDeliveryKind('', authorHost)

  return {
    ok: true,
    scannedAt: new Date().toISOString(),
    deliveryKind,
    nodes: [...byPath.values()].sort((a, b) =>
      a.resourcePath.localeCompare(b.resourcePath),
    ),
  }
}

/** @deprecated use fetchSitesForAuthor / scanSitePages */
export async function scanAemDomain() {
  return {
    ok: false,
    error: 'scanAemDomain was replaced by fetchSitesForAuthor / scanSitePages',
  }
}

export async function ensureAuthorScanPermission() {
  return {
    ok: false,
    error: 'Host permission grant is optional; prefer Author-tab injection.',
  }
}

export function authorOriginForScan() {
  return null
}
