// AEM URL analyzer + link builder for both traditional and AEM Cloud hosts.
//
// Public API:
//   parseAemUrl(urlString)          -> parsed context (auto-detects flavor)
//   parseAemUrlForTraditional(...)  -> same, forces traditional
//   parseAemUrlForCloud(...)        -> same, forces cloud
//   buildAemLinks(urlString)        -> { parsed, links } (auto-detects flavor)
//   buildAemLinksForTraditional     -> composed pipeline (forces traditional)
//   buildAemLinksForCloud           -> composed pipeline (forces cloud)
//
// Structure: a `compose(parse, ...builders)` helper stitches a parser to a
// list of tiny single-purpose builders. Each builder receives an enriched
// context and returns `{ [key]: string | null }`. Cloud-shell awareness
// lives on `ctx.shell`, so the same `buildEditor` / `buildSites` / etc.
// serve both flavors.

/* -------------------------------------------------------------------------
 * Shared constants
 * ---------------------------------------------------------------------- */

// AEM "wrapper" console paths whose remainder is a JCR resource path.
const WRAPPERS = [
  '/editor.html',
  '/sites.html',
  '/assets.html',
  '/assetdetails.html',
  '/cf.html',
  '/mnt/overlay',
]

// AEM-specific query params we drop when reconstructing a preview URL —
// they leak console state (edit mode, cache buster, granite debug flags).
const DROP_PARAM_KEYS = new Set([
  'wcmmode',
  'cq_ck',
  'cqdebug',
  'debugclientlibs',
  'wcmmodepreview',
  'forceignorefreshness',
])
const DROP_PARAM_PREFIXES = ['cq_', 'granite_', 'jcr_']

// Rendering extensions we strip off the tail of a resource path. Anything
// else (e.g. `.zip`, `.pdf`) is treated as part of the resource name.
const RENDER_EXTS = new Set(['html', 'json', 'xml'])

// Paths we do NOT treat as content when falling back to "raw pathname".
const SYSTEM_PATH_PREFIXES = [
  '/system/',
  '/crx/',
  '/libs/',
  '/apps/',
  '/etc/',
  '/bin/',
  '/var/',
  '/tmp/',
  '/mnt/',
]

/* -------------------------------------------------------------------------
 * URL parsing helpers (flavor-agnostic)
 * ---------------------------------------------------------------------- */

function decode(s) {
  if (!s) return s
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

function isCloudHost(hostname) {
  return /\.adobeaemcloud\.com$/i.test(hostname)
}

// Walk WRAPPERS, `?item=/content/...`, and `#/content/...` (CRXDE style)
// looking for something that smells like a JCR path. Takes a URL-like
// duck-typed object so it can accept both a real URL and a synthetic one
// built from a Cloud fragment.
function extractResourceCandidate(u) {
  if (u.hash && u.hash.startsWith('#/')) {
    const h = decode(u.hash.slice(1))
    if (h.startsWith('/content/') || h.startsWith('/conf/')) return h
  }

  const item = u.searchParams.get('item')
  if (item && (item.startsWith('/content/') || item.startsWith('/conf/'))) {
    return item
  }

  for (const w of WRAPPERS) {
    if (u.pathname === w || u.pathname.startsWith(w + '/')) {
      const rest = u.pathname.slice(w.length) || '/'
      return rest.startsWith('/') ? rest : '/' + rest
    }
  }

  if (u.pathname.startsWith('/content/') || u.pathname.startsWith('/conf/')) {
    return u.pathname
  }

  const isSystem = SYSTEM_PATH_PREFIXES.some((p) => u.pathname.startsWith(p))
  if (!isSystem && u.pathname !== '/' && u.pathname.length > 1) {
    return u.pathname
  }

  return null
}

// Strip .html and Sling selectors from the last segment. DAM assets keep
// their real extension.
function stripRenderingSuffixes(resourcePath) {
  if (!resourcePath) return null
  if (resourcePath.startsWith('/content/dam/')) return resourcePath

  const parts = resourcePath.split('/')
  const last = parts.pop() || ''
  if (!last) return parts.join('/') || '/'

  if (last.endsWith('.html')) {
    parts.push(last.slice(0, -5))
    return parts.join('/') || '/'
  }

  const segParts = last.split('.')
  if (segParts.length === 1) {
    parts.push(last)
    return parts.join('/') || '/'
  }

  const ext = segParts[segParts.length - 1].toLowerCase()
  if (!RENDER_EXTS.has(ext)) {
    parts.push(last)
    return parts.join('/') || '/'
  }

  parts.push(segParts[0])
  return parts.join('/') || '/'
}

function extractSiteName(resourcePath) {
  if (!resourcePath) return null
  const firstAfter = (prefix) => {
    if (!resourcePath.startsWith(prefix)) return null
    return resourcePath.slice(prefix.length).split('/').filter(Boolean)[0] || null
  }
  return (
    firstAfter('/content/dam/') ||
    firstAfter('/content/experience-fragments/') ||
    firstAfter('/content/') ||
    firstAfter('/conf/') ||
    null
  )
}

function stripAemParams(searchParams) {
  const out = new URLSearchParams()
  for (const [k, v] of searchParams.entries()) {
    const kl = k.toLowerCase()
    if (DROP_PARAM_KEYS.has(kl)) continue
    if (DROP_PARAM_PREFIXES.some((p) => kl.startsWith(p))) continue
    out.append(k, v)
  }
  return out.toString()
}

// Split a Cloud fragment like `/editor.html/content/x.html?wcmmode=disabled#foo`
// into logical { pathname, searchParams, hash } so the traditional
// extractors can be reused as-is.
function splitCloudFragmentBody(body) {
  let rest = body
  let innerHash = ''
  let search = ''

  const hashIdx = rest.indexOf('#')
  if (hashIdx >= 0) {
    innerHash = rest.slice(hashIdx + 1)
    rest = rest.slice(0, hashIdx)
  }
  const qIdx = rest.indexOf('?')
  if (qIdx >= 0) {
    search = rest.slice(qIdx + 1)
    rest = rest.slice(0, qIdx)
  }
  return {
    pathname: rest || '/',
    searchParams: new URLSearchParams(search),
    hash: innerHash ? `#${innerHash}` : '',
  }
}

/* -------------------------------------------------------------------------
 * Parsers
 * ---------------------------------------------------------------------- */

export function parseAemUrlForTraditional(urlString) {
  const u = urlString instanceof URL ? urlString : new URL(urlString)

  const candidate = extractResourceCandidate(u)
  const resourcePath = stripRenderingSuffixes(candidate)
  const siteName = extractSiteName(resourcePath)
  const urlParams = stripAemParams(u.searchParams)
  const hash = u.hash ? u.hash.slice(1) : ''

  return {
    origin: u.origin,
    resourcePath,
    siteName,
    urlParams,
    hash,
    flavor: 'traditional',
    shell: '',
  }
}

export function parseAemUrlForCloud(urlString) {
  const u = urlString instanceof URL ? urlString : new URL(urlString)

  // Cloud author lives inside a SPA shell at `/ui`, with the real AEM
  // console path in the fragment prefixed by `/aem/`. Everything else
  // (query params, inner hashes) is folded into that fragment string.
  let logical
  if (u.hash.startsWith('#/aem/')) {
    logical = splitCloudFragmentBody(u.hash.slice(5)) // drop "#/aem", keep leading "/"
  } else {
    // Non-shell Cloud URL (bare origin, or a raw /content/... render) —
    // fall back to traditional-style extraction on the real URL.
    logical = {
      pathname: u.pathname,
      searchParams: u.searchParams,
      hash: u.hash,
    }
  }

  const candidate = extractResourceCandidate(logical)
  const resourcePath = stripRenderingSuffixes(candidate)
  const siteName = extractSiteName(resourcePath)
  const urlParams = stripAemParams(logical.searchParams)
  const hash = logical.hash ? logical.hash.slice(1) : ''

  return {
    origin: u.origin,
    resourcePath,
    siteName,
    urlParams,
    hash,
    flavor: 'cloud',
    shell: '/ui#/aem',
  }
}

export function parseAemUrl(urlString) {
  const u = urlString instanceof URL ? urlString : new URL(urlString)
  return isCloudHost(u.hostname)
    ? parseAemUrlForCloud(u)
    : parseAemUrlForTraditional(u)
}

/* -------------------------------------------------------------------------
 * Context enrichment + compose helper
 * ---------------------------------------------------------------------- */

function enrichContext(parsed) {
  const isDam =
    !!parsed.resourcePath && parsed.resourcePath.startsWith('/content/dam/')
  const q = parsed.urlParams ? `?${parsed.urlParams}` : ''
  const h = parsed.hash ? `#${parsed.hash}` : ''
  const disableParams = new URLSearchParams(parsed.urlParams || '')
  disableParams.set('wcmmode', 'disabled')
  const disableQ = `?${disableParams.toString()}`
  return { ...parsed, isDam, q, h, disableQ }
}

function compose(parse, ...builders) {
  return (urlString) => {
    const parsed = parse(urlString)
    if (!parsed.origin) return { parsed, links: {} }
    const ctx = enrichContext(parsed)
    const links = builders.reduce(
      (acc, build) => Object.assign(acc, build(ctx)),
      {},
    )
    return { parsed, links }
  }
}

/* -------------------------------------------------------------------------
 * Shell-aware builders (used in both flavors; ctx.shell is '' or '/ui#/aem')
 * ---------------------------------------------------------------------- */

const buildEditor = ({ origin, resourcePath, isDam, shell, q, h }) => ({
  editor:
    resourcePath && !isDam
      ? `${origin}${shell}/editor.html${resourcePath}.html${q}${h}`
      : null,
})

const buildProperties = ({ origin, resourcePath, isDam, shell }) => ({
  properties:
    resourcePath && !isDam
      ? `${origin}${shell}/mnt/overlay/wcm/core/content/sites/properties.html?item=${resourcePath}`
      : null,
})

const buildSites = ({ origin, resourcePath, isDam, shell }) => ({
  sites:
    resourcePath && !isDam ? `${origin}${shell}/sites.html${resourcePath}` : null,
})

const buildSitesRoot = ({ origin, siteName, shell }) => ({
  sitesRoot: siteName
    ? `${origin}${shell}/sites.html/content/${siteName}`
    : `${origin}${shell}/sites.html/content`,
})

const buildDam = ({ origin, resourcePath, isDam, shell }) => ({
  dam: isDam ? `${origin}${shell}/assets.html${resourcePath}` : null,
})

const buildDamRoot = ({ origin, siteName, shell }) => ({
  damRoot: siteName
    ? `${origin}${shell}/assets.html/content/dam/${siteName}`
    : `${origin}${shell}/assets.html/content/dam`,
})

const buildAssetDetails = ({ origin, resourcePath, isDam, shell }) => ({
  assetDetails: isDam ? `${origin}${shell}/assetdetails.html${resourcePath}` : null,
})

const buildI18n = ({ origin, shell }) => ({
  i18n: `${origin}${shell}/libs/cq/i18n/translator.html`,
})

const buildQueryBuilder = ({ origin, shell }) => ({
  queryBuilder: `${origin}${shell}/libs/cq/search/content/querydebug.html`,
})

const buildUsers = ({ origin, shell }) => ({
  users: `${origin}${shell}/security/users.html`,
})

/* -------------------------------------------------------------------------
 * Raw builders (identical in both flavors — never shell-wrapped)
 * ---------------------------------------------------------------------- */

const buildPreview = ({ origin, resourcePath, isDam, q, h }) => ({
  preview: resourcePath
    ? `${origin}${resourcePath}${isDam ? '' : '.html'}${q}${h}`
    : null,
})

const buildDisable = ({ origin, resourcePath, isDam, disableQ, h }) => ({
  disable:
    resourcePath && !isDam ? `${origin}${resourcePath}.html${disableQ}${h}` : null,
})

const buildCrx = ({ origin, resourcePath }) => ({
  crx: `${origin}/crx/de/index.jsp#${resourcePath || '/'}`,
})

const buildPackmgr = ({ origin }) => ({
  packmgr: `${origin}/crx/packmgr/index.jsp`,
})

/* -------------------------------------------------------------------------
 * Traditional-only builders (never included in the Cloud pipeline)
 * ---------------------------------------------------------------------- */

const buildSystemConsole = ({ origin }) => ({
  systemConsole: `${origin}/system/console`,
})
const buildOsgiConsole = ({ origin }) => ({
  osgiConsole: `${origin}/system/console/configMgr`,
})
const buildBundles = ({ origin }) => ({
  bundles: `${origin}/system/console/bundles`,
})
const buildJmx = ({ origin }) => ({ jmx: `${origin}/system/console/jmx` })
const buildLogsStatus = ({ origin }) => ({
  logsStatus: `${origin}/system/console/status-slinglogs`,
})
const buildLogsConfig = ({ origin }) => ({
  logsConfig: `${origin}/system/console/slinglog`,
})
const buildSiteAdmin = ({ origin }) => ({ siteAdmin: `${origin}/siteadmin` })
const buildWelcome = ({ origin }) => ({ welcome: `${origin}/aem/start.html` })
const buildMiscadmin = ({ origin }) => ({ miscadmin: `${origin}/miscadmin` })
const buildUsersClassic = ({ origin }) => ({
  usersClassic: `${origin}/useradmin`,
})

/* -------------------------------------------------------------------------
 * Composed pipelines
 * ---------------------------------------------------------------------- */

export const buildAemLinksForCloud = compose(
  parseAemUrlForCloud,
  // shell-aware (wrapped with /ui#/aem)
  buildEditor,
  buildProperties,
  buildSites,
  buildSitesRoot,
  buildDam,
  buildDamRoot,
  buildAssetDetails,
  buildI18n,
  buildQueryBuilder,
  buildUsers,
  // raw (unchanged)
  buildPreview,
  buildDisable,
  buildCrx,
  buildPackmgr,
)

export const buildAemLinksForTraditional = compose(
  parseAemUrlForTraditional,
  // shell-aware (shell = '', so no wrapping)
  buildEditor,
  buildProperties,
  buildSites,
  buildSitesRoot,
  buildDam,
  buildDamRoot,
  buildAssetDetails,
  buildI18n,
  buildQueryBuilder,
  buildUsers,
  // raw
  buildPreview,
  buildDisable,
  buildCrx,
  buildPackmgr,
  // traditional-only (Felix + classic UI + welcome)
  buildSystemConsole,
  buildOsgiConsole,
  buildBundles,
  buildJmx,
  buildLogsStatus,
  buildLogsConfig,
  buildSiteAdmin,
  buildWelcome,
  buildMiscadmin,
  buildUsersClassic,
)

/* -------------------------------------------------------------------------
 * Dispatcher
 * ---------------------------------------------------------------------- */

export function buildAemLinks(urlString) {
  const u = urlString instanceof URL ? urlString : new URL(urlString)
  return isCloudHost(u.hostname)
    ? buildAemLinksForCloud(u)
    : buildAemLinksForTraditional(u)
}
