// Local model for AEM Author domain → sites → pinned page catalogs.
//
// Shape (keyed by author hostname, lowercased):
//   {
//     [authorHost]: {
//       authorOrigin: 'https://…',
//       sitesFetchedAt: ISO|null,
//       updatedAt: ISO|null,
//       sites: [
//         {
//           path: '/content/my-site',
//           title: '…',
//           pinned: boolean,
//           deliveryKind: 'cloud' | 'eds-ue' | 'eds-da' | null,
//           deliveryKindManual: boolean, // user override; scan won't overwrite
//           edsDomains: [ { origin, kind: 'eds'|'vanity', label?, isDefault } ],
//           pagesScannedAt: ISO|null,
//           nodes: [ { resourcePath, title, pageKind, vanityPath? } ],
//         },
//       ],
//     },
//   }

export const AEM_AUTHOR_SITES_KEY = 'loopy.aemAuthorSites'
export const AEM_AUTHOR_SITES_TABLE = 'loopy_aem_author_sites'

/** Selectable / persisted delivery kinds for EDS-UE slides. */
export const DELIVERY_KINDS = ['cloud', 'eds-ue', 'eds-da']

/** Manual publish / EDS origins on a pinned site. */
export const EDS_DOMAIN_KINDS = ['eds', 'vanity']

function safeString(v) {
  return typeof v === 'string' ? v : ''
}

/** True when an RT looks like Franklin / xwalk (EDS + Universal Editor). */
export function isFranklinResourceType(resourceType) {
  const rt = safeString(resourceType).trim().toLowerCase()
  if (!rt) return false
  return (
    rt.startsWith('core/franklin/') ||
    rt.includes('/franklin/') ||
    rt.includes('franklin/components')
  )
}

/** True when cq:template path looks like Franklin / xwalk. */
export function isFranklinTemplate(template) {
  const t = safeString(template).trim().toLowerCase()
  if (!t) return false
  return (
    t.includes('/franklin/') ||
    t.includes('xwalk') ||
    t.includes('edge-delivery') ||
    t.includes('eds-ue')
  )
}

/** Page-level signal that the site is EDS + Universal Editor. */
export function isEdsUePageSignal({
  resourceType,
  resourceSuperType,
  template,
} = {}) {
  return (
    isFranklinResourceType(resourceType) ||
    isFranklinResourceType(resourceSuperType) ||
    isFranklinTemplate(template)
  )
}

/**
 * Classify a site from Author jcr:content/sling:resourceType + host.
 * Franklin page RT → eds-ue; else cloud (incl. non-Cloud Author hosts).
 */
export function classifyDeliveryKind(
  resourceType,
  authorHost,
  template,
  resourceSuperType,
) {
  if (
    isEdsUePageSignal({ resourceType, resourceSuperType, template })
  ) {
    return 'eds-ue'
  }
  // Non-Franklin sites are treated as Cloud for the slide kind radios.
  void authorHost
  return 'cloud'
}

export function normalizeDeliveryKind(raw) {
  const kind = safeString(raw).trim().toLowerCase()
  // Migrate legacy "traditional" catalogs → cloud.
  if (kind === 'traditional') return 'cloud'
  return DELIVERY_KINDS.includes(kind) ? kind : null
}

/** Prefer eds-ue when either side detected it (page scan can upgrade). */
export function mergeDeliveryKind(prev, next) {
  const a = normalizeDeliveryKind(prev)
  const b = normalizeDeliveryKind(next)
  if (a === 'eds-ue' || b === 'eds-ue') return 'eds-ue'
  if (a === 'eds-da' || b === 'eds-da') return b || a
  return b || a || null
}

/** Short type label for title line / menu (Cloud / UE / DA). */
export function formatDeliveryKindBadge(kind) {
  const k = normalizeDeliveryKind(kind)
  if (k === 'eds-ue') return 'UE'
  if (k === 'eds-da') return 'DA'
  if (k === 'cloud') return 'Cloud'
  return null
}

/**
 * Normalize a pasted host or URL to an https origin.
 * @returns {string|null}
 */
export function normalizeEdsDomainOrigin(raw) {
  let s = safeString(raw).trim()
  if (!s) return null
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`
  try {
    const u = new URL(s)
    if (!u.hostname) return null
    return u.origin
  } catch {
    return null
  }
}

/**
 * Parse `{ref}--{repo}--{owner}.aem.live|page` hostnames.
 * @returns {{ ref: string, repo: string, owner: string }|null}
 */
export function parseEdsLiveHost(hostname) {
  const host = safeString(hostname).trim().toLowerCase()
  const m = host.match(
    /^([a-z0-9._-]+)--([a-z0-9._-]+)--([a-z0-9._-]+)\.aem\.(live|page)$/i,
  )
  if (!m) return null
  return { ref: m[1], repo: m[2], owner: m[3] }
}

/** `*.aem.live` / `*.aem.page` → eds; everything else → vanity. */
export function classifyEdsDomainOrigin(origin) {
  try {
    const host = new URL(origin).hostname.toLowerCase()
    if (host.endsWith('.aem.live') || host.endsWith('.aem.page')) return 'eds'
  } catch {
    /* fall through */
  }
  return 'vanity'
}

/**
 * Normalize a list of manual EDS/publish domains for a site.
 * Dedupes by origin; ensures exactly one isDefault when non-empty.
 */
export function normalizeEdsDomains(raw) {
  if (!Array.isArray(raw)) return []
  const byOrigin = new Map()
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const origin = normalizeEdsDomainOrigin(item.origin)
    if (!origin) continue
    const kind =
      item.kind === 'eds' || item.kind === 'vanity'
        ? item.kind
        : classifyEdsDomainOrigin(origin)
    let label = safeString(item.label).trim()
    if (!label) {
      try {
        label = new URL(origin).hostname
      } catch {
        label = origin
      }
    }
    byOrigin.set(origin, {
      origin,
      kind,
      label,
      isDefault: item.isDefault === true,
    })
  }
  const list = [...byOrigin.values()]
  if (list.length === 0) return []
  const defaultIdx = list.findIndex((d) => d.isDefault)
  return list.map((d, i) => ({
    ...d,
    isDefault: defaultIdx === -1 ? i === 0 : i === defaultIdx,
  }))
}

/** Default domain entry, or null. */
export function defaultEdsDomain(edsDomains) {
  const list = normalizeEdsDomains(edsDomains)
  return list.find((d) => d.isDefault) || list[0] || null
}

/** Swap `.aem.live` ↔ `.aem.page` on an origin when applicable. */
export function edsOriginWithTld(origin, tld) {
  try {
    const u = new URL(origin)
    const host = u.hostname.toLowerCase()
    if (host.endsWith('.aem.live')) {
      u.hostname = `${host.slice(0, -'.aem.live'.length)}.${tld}`
      return u.origin
    }
    if (host.endsWith('.aem.page')) {
      u.hostname = `${host.slice(0, -'.aem.page'.length)}.${tld}`
      return u.origin
    }
  } catch {
    /* fall through */
  }
  return origin
}

function normalizeNode(raw) {
  if (!raw || typeof raw !== 'object') return null
  const resourcePath = safeString(raw.resourcePath).trim()
  if (!resourcePath.startsWith('/')) return null
  const pageKind = raw.pageKind === 'fragment' ? 'fragment' : 'page'
  const title = safeString(raw.title).trim()
  const vanityPath = safeString(raw.vanityPath).trim()
  const node = { resourcePath, title, pageKind }
  if (vanityPath) node.vanityPath = vanityPath
  return node
}

function normalizeSite(raw) {
  if (!raw || typeof raw !== 'object') return null
  const path = safeString(raw.path).trim()
  if (!path.startsWith('/content/')) return null
  // Only top-level /content/{site} roots.
  const parts = path.split('/').filter(Boolean)
  if (parts.length !== 2 || parts[0] !== 'content') return null

  const pinned = raw.pinned === true
  const nodes = Array.isArray(raw.nodes)
    ? raw.nodes.map(normalizeNode).filter(Boolean)
    : []
  // Domains survive unpin (manual config); nodes still clear when unpinned.
  const edsDomains = normalizeEdsDomains(raw.edsDomains)
  return {
    path,
    title: safeString(raw.title).trim() || parts[1],
    pinned,
    // null until site Refresh classifies, or user sets manually.
    deliveryKind: normalizeDeliveryKind(raw.deliveryKind),
    deliveryKindManual: raw.deliveryKindManual === true,
    edsDomains,
    pagesScannedAt: safeString(raw.pagesScannedAt).trim() || null,
    // Unpin clears page catalogs to keep sync payloads small.
    nodes: pinned ? nodes : [],
  }
}

function normalizeBucket(raw) {
  if (!raw || typeof raw !== 'object') return null
  let authorOrigin = safeString(raw.authorOrigin).trim()
  try {
    if (authorOrigin) authorOrigin = new URL(authorOrigin).origin
  } catch {
    authorOrigin = ''
  }
  const sites = Array.isArray(raw.sites)
    ? raw.sites.map(normalizeSite).filter(Boolean)
    : []
  // De-dupe by path, prefer pinned / newer pagesScannedAt.
  const byPath = new Map()
  for (const site of sites) {
    const prev = byPath.get(site.path)
    if (!prev) {
      byPath.set(site.path, site)
      continue
    }
    const prefer =
      (site.pinned && !prev.pinned) ||
      (site.pinned === prev.pinned &&
        (site.pagesScannedAt || '') > (prev.pagesScannedAt || ''))
    byPath.set(site.path, prefer ? { ...prev, ...site } : prev)
  }
  return {
    authorOrigin,
    sitesFetchedAt: safeString(raw.sitesFetchedAt).trim() || null,
    updatedAt: safeString(raw.updatedAt).trim() || null,
    sites: [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path)),
  }
}

export function normalizeAemAuthorSites(raw) {
  let parsed = raw
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw)
    } catch {
      return {}
    }
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}

  const out = {}
  for (const [key, value] of Object.entries(parsed)) {
    const host = safeString(key).trim().toLowerCase()
    if (!host) continue
    const bucket = normalizeBucket(value)
    if (bucket) out[host] = bucket
  }
  return out
}

export function emptyAemAuthorSites() {
  return {}
}

export function siteSegment(sitePath) {
  const parts = safeString(sitePath).split('/').filter(Boolean)
  return parts[0] === 'content' && parts[1] ? parts[1] : null
}

/** Convert site page nodes into the paths object shape `buildTree` expects. */
export function siteNodesToPaths(nodes) {
  const paths = {}
  for (const node of nodes ?? []) {
    if (!node?.resourcePath) continue
    paths[node.resourcePath] = {
      title: node.title || node.resourcePath,
      pageKind: node.pageKind === 'fragment' ? 'fragment' : 'page',
      vanityPath: node.vanityPath || '',
      resourcePath: node.resourcePath,
      lastVisitedAt: '',
    }
  }
  return paths
}

export function mergeAemAuthorSites(local, remote) {
  const a = normalizeAemAuthorSites(local)
  const b = normalizeAemAuthorSites(remote)
  const hosts = new Set([...Object.keys(a), ...Object.keys(b)])
  const out = {}
  for (const host of hosts) {
    const left = a[host]
    const right = b[host]
    if (!left) {
      out[host] = right
      continue
    }
    if (!right) {
      out[host] = left
      continue
    }
    // Newer bucket wins for sitesFetchedAt / origin; merge sites by path.
    const leftAt = left.updatedAt || left.sitesFetchedAt || ''
    const rightAt = right.updatedAt || right.sitesFetchedAt || ''
    const newer = rightAt > leftAt ? right : left
    const older = newer === right ? left : right
    const byPath = new Map()
    for (const site of older.sites) byPath.set(site.path, site)
    for (const site of newer.sites) {
      const prev = byPath.get(site.path)
      if (!prev) {
        byPath.set(site.path, site)
        continue
      }
      const manual = site.deliveryKindManual || prev.deliveryKindManual
      const deliveryKind = manual
        ? normalizeDeliveryKind(site.deliveryKind) ||
          normalizeDeliveryKind(prev.deliveryKind)
        : mergeDeliveryKind(prev.deliveryKind, site.deliveryKind)
      const edsDomains =
        site.edsDomains?.length > 0
          ? site.edsDomains
          : prev.edsDomains?.length > 0
            ? prev.edsDomains
            : []
      byPath.set(site.path, {
        ...prev,
        ...site,
        pinned: site.pinned || prev.pinned,
        deliveryKind,
        deliveryKindManual: manual,
        edsDomains,
        nodes:
          site.nodes?.length > 0
            ? site.nodes
            : prev.nodes?.length > 0
              ? prev.nodes
              : [],
        pagesScannedAt:
          (site.pagesScannedAt || '') > (prev.pagesScannedAt || '')
            ? site.pagesScannedAt
            : prev.pagesScannedAt,
      })
    }
    out[host] = {
      authorOrigin: newer.authorOrigin || older.authorOrigin,
      sitesFetchedAt:
        (newer.sitesFetchedAt || '') > (older.sitesFetchedAt || '')
          ? newer.sitesFetchedAt
          : older.sitesFetchedAt,
      updatedAt: newer.updatedAt || older.updatedAt,
      sites: [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path)),
    }
  }
  return normalizeAemAuthorSites(out)
}

export function hostFromOrigin(origin) {
  try {
    return new URL(origin).hostname.toLowerCase()
  } catch {
    return null
  }
}
