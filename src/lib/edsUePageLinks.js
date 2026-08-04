// Per-page Edit / Preview / Live link builders for the AEM EDS-UE tree.
//
// Delivery kind comes from Author (Franklin page RT → eds-ue), not from
// Settings → AEM Environments. Settings may only enrich owner/repo/ref/imsOrg
// when a row matches by siteName.

import { buildAemLinks } from '@/lib/aemLinks'
import { getRebaseOrigin } from '@/lib/prefs'
import {
  classifyDeliveryKind,
  defaultEdsDomain,
  edsOriginWithTld,
  normalizeDeliveryKind,
  normalizeEdsDomains,
  siteSegment,
} from '@/lib/aemAuthorSites'

/**
 * Build a synthetic domain for a discovered Author site.
 * `deliveryKind` is AEM-detected; Settings only supplies optional
 * owner / repo / ref / imsOrg when siteName matches (never Settings `kind`).
 */
export function resolveAemDomainForSite(
  authorHost,
  sitePath,
  allDomains,
  deliveryKind,
) {
  const host = String(authorHost || '')
    .trim()
    .toLowerCase()
  const seg = siteSegment(sitePath)?.toLowerCase() || null
  if (!host) return null

  const kind =
    normalizeDeliveryKind(deliveryKind) ||
    classifyDeliveryKind('', host)

  const list = Array.isArray(allDomains) ? allDomains : []
  const enrich =
    (seg &&
      list.find(
        (d) =>
          d &&
          typeof d.siteName === 'string' &&
          d.siteName.toLowerCase() === seg &&
          (d.owner || d.repo || d.imsOrg),
      )) ||
    null

  const authorOrigin = `https://${host}`
  const domain = {
    id: `__author__:${host}:${seg || 'site'}`,
    kind,
    role: 'author',
    env: enrich?.env || 'dev',
    label: seg || host,
    visible: true,
    siteName: seg || '',
    origin: authorOrigin,
    authorOrigin,
  }

  if (enrich) {
    if (enrich.owner) domain.owner = enrich.owner
    if (enrich.repo) domain.repo = enrich.repo
    if (enrich.ref) domain.ref = enrich.ref
    if (enrich.imsOrg) domain.imsOrg = enrich.imsOrg
    // local-sdk peer origin for UE canvas when Settings has it for this site.
    if (enrich.kind === 'local-sdk' && enrich.origin) {
      domain.origin = enrich.origin
      if (enrich.authorOrigin) domain.authorOrigin = enrich.authorOrigin
      domain.localSdk = true
    }
  }

  return domain
}

function isEdsDeliveryKind(kind) {
  return kind === 'eds-ue' || kind === 'eds-da'
}

function isFragment(pageKind) {
  return pageKind === 'fragment'
}

/** Strip `/content/{siteName}` (or `/content`) for EDS public URLs. */
export function toEdsPublicPath(resourcePath, siteName) {
  let path = String(resourcePath ?? '')
  if (!path.startsWith('/')) return '/'
  const site = typeof siteName === 'string' ? siteName.trim().toLowerCase() : ''
  if (site) {
    const prefix = `/content/${site}`
    const lower = path.toLowerCase()
    if (lower === prefix || lower.startsWith(`${prefix}/`)) {
      path = path.slice(prefix.length) || '/'
    }
  } else if (path.toLowerCase().startsWith('/content/')) {
    // /content/{firstSeg}/... → drop /content/{firstSeg}
    const rest = path.slice('/content/'.length)
    const slash = rest.indexOf('/')
    path = slash === -1 ? '/' : rest.slice(slash) || '/'
  }
  if (!path.startsWith('/')) path = `/${path}`
  return path === '/' ? '/' : path.replace(/\/+$/, '') || '/'
}

function edsHost(owner, repo, ref, tld) {
  const o = String(owner || '').trim()
  const r = String(repo || '').trim()
  const branch = String(ref || 'main').trim() || 'main'
  if (!o || !r) return null
  return `https://${branch}--${r}--${o}.${tld}`
}

function findVanityOrigin(domain, allDomains) {
  if (!domain || !Array.isArray(allDomains)) return null
  const site = domain.siteName || null
  const match = allDomains.find((d) => {
    if (!d || d.role !== 'vanity') return false
    if (d.env !== domain.env) return false
    if (site && d.siteName && d.siteName !== site) return false
    return !!getRebaseOrigin(d)
  })
  return match ? getRebaseOrigin(match) : null
}

function resolveLiveFromVanity(vanityPath, domain, allDomains, authorOrigin) {
  const raw = String(vanityPath || '').trim()
  if (!raw) return null
  if (/^https?:\/\//i.test(raw)) return raw
  const path = raw.startsWith('/') ? raw : `/${raw}`
  const vanityOrigin = findVanityOrigin(domain, allDomains)
  const base = vanityOrigin || authorOrigin
  if (!base) return null
  return `${base.replace(/\/$/, '')}${path}`
}

function buildEditOptions(domain, allDomains) {
  if (!domain) return { options: null, authorOrigin: null }

  const authorOrigin = domain.authorOrigin || domain.origin || null

  if (domain.kind === 'eds-ue' && domain.imsOrg && authorOrigin) {
    let ueHost = null
    try {
      // local-sdk: canvas host may differ from Cloud author origin.
      ueHost = new URL(domain.origin || authorOrigin).host
    } catch {
      ueHost = null
    }
    return {
      authorOrigin,
      options: {
        imsOrg: domain.imsOrg,
        authorOrigin,
        ueHost,
        ...(domain.localSdk ? { noShell: true } : {}),
      },
    }
  }

  if (domain.localSdk && domain.imsOrg) {
    const httpsPeer = (allDomains || []).find(
      (d) =>
        d.kind === 'local-sdk' &&
        d.siteName === domain.siteName &&
        d.imsOrg === domain.imsOrg &&
        d.authorOrigin === domain.authorOrigin &&
        typeof d.origin === 'string' &&
        d.origin.startsWith('https:'),
    )
    let ueHost = null
    try {
      ueHost = new URL((httpsPeer ?? domain).origin).host
    } catch {
      ueHost = null
    }
    return {
      authorOrigin: domain.origin || authorOrigin,
      options: {
        imsOrg: domain.imsOrg,
        authorOrigin: domain.authorOrigin,
        ueHost,
        noShell: true,
      },
    }
  }

  return { authorOrigin, options: null }
}

function joinOriginPath(origin, path) {
  const base = String(origin || '').replace(/\/$/, '')
  if (!base) return null
  const p = path === '/' ? '/' : path || '/'
  return p === '/' ? `${base}/` : `${base}${p}`
}

/**
 * Preview/Live from manually configured site edsDomains (preferred).
 * @returns {{ preview: string|null, live: string|null }|null} null = no domains
 */
function linksFromEdsDomains({
  edsDomains,
  resourcePath,
  siteName,
  vanityPath,
  authorOrigin,
}) {
  const list = normalizeEdsDomains(edsDomains)
  if (list.length === 0) return null

  const def = defaultEdsDomain(list)
  const publicPath = toEdsPublicPath(resourcePath, siteName)
  const vanityRaw = String(vanityPath || '').trim()
  const vanityAsPath =
    vanityRaw && !/^https?:\/\//i.test(vanityRaw)
      ? vanityRaw.startsWith('/')
        ? vanityRaw
        : `/${vanityRaw}`
      : null

  let preview = null
  let live = null

  const edsEntry = list.find((d) => d.kind === 'eds')
  const previewEdsOrigin = edsEntry
    ? edsOriginWithTld(edsEntry.origin, 'aem.page')
    : null

  if (def.kind === 'eds') {
    const liveOrigin = edsOriginWithTld(def.origin, 'aem.live')
    const pageOrigin = edsOriginWithTld(def.origin, 'aem.page')
    live = joinOriginPath(liveOrigin, publicPath)
    preview = joinOriginPath(pageOrigin, publicPath)
  } else {
    // Vanity default: Live uses vanity path when present, else public path.
    if (vanityRaw && /^https?:\/\//i.test(vanityRaw)) {
      live = vanityRaw
    } else {
      live = joinOriginPath(def.origin, vanityAsPath || publicPath)
    }
    preview = previewEdsOrigin
      ? joinOriginPath(previewEdsOrigin, publicPath)
      : null
  }

  if (!preview && authorOrigin) {
    preview = `${authorOrigin.replace(/\/$/, '')}${resourcePath}.html?wcmmode=disabled`
  }

  return { preview, live }
}

/**
 * Build Edit / Preview / Live hrefs for one scanned page node.
 *
 * @returns {{ edit: string|null, preview: string|null, live: string|null }}
 */
export function buildEdsUePageLinks({
  domain,
  resourcePath,
  pageKind,
  vanityPath,
  allDomains,
  edsDomains,
}) {
  const links = { edit: null, preview: null, live: null }
  if (!domain || !resourcePath) return links

  const fragment = isFragment(pageKind)
  const { authorOrigin, options } = buildEditOptions(domain, allDomains)

  // Edit — prefer UE for eds-ue when imsOrg is available; classic otherwise.
  if (authorOrigin && domain.kind !== 'eds-da') {
    try {
      const sourceUrl = `${authorOrigin.replace(/\/$/, '')}${resourcePath}.html`
      const built = buildAemLinks(sourceUrl, options ?? undefined)
      links.edit =
        built?.links?.universalEditor ||
        built?.links?.editor ||
        null
    } catch {
      links.edit = null
    }
  }

  if (fragment) return links

  // Manual site domains win over Settings owner/repo / vanity rows.
  const fromSite = linksFromEdsDomains({
    edsDomains,
    resourcePath,
    siteName: domain.siteName,
    vanityPath,
    authorOrigin,
  })
  if (fromSite) {
    links.preview = fromSite.preview
    links.live = fromSite.live
    return links
  }

  if (isEdsDeliveryKind(domain.kind)) {
    if (domain.owner && domain.repo) {
      const publicPath = toEdsPublicPath(resourcePath, domain.siteName)
      const pageHost = edsHost(domain.owner, domain.repo, domain.ref, 'aem.page')
      const liveHost = edsHost(domain.owner, domain.repo, domain.ref, 'aem.live')
      if (pageHost) {
        links.preview =
          publicPath === '/' ? `${pageHost}/` : `${pageHost}${publicPath}`
      }
      if (liveHost) {
        links.live =
          publicPath === '/' ? `${liveHost}/` : `${liveHost}${publicPath}`
      }
    }
    // No Settings repo → Author preview fallback.
    if (!links.preview && authorOrigin) {
      links.preview = `${authorOrigin.replace(/\/$/, '')}${resourcePath}.html?wcmmode=disabled`
    }
    if (!links.live) {
      links.live = resolveLiveFromVanity(
        vanityPath,
        domain,
        allDomains,
        authorOrigin,
      )
    }
    return links
  }

  // Cloud / traditional
  if (authorOrigin) {
    links.preview = `${authorOrigin.replace(/\/$/, '')}${resourcePath}.html?wcmmode=disabled`
  }
  links.live = resolveLiveFromVanity(
    vanityPath,
    domain,
    allDomains,
    authorOrigin,
  )
  return links
}
