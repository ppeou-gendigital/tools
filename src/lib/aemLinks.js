// Traditional (non-Cloud) AEM URL analyzer + link builder.
//
// Two public exports:
//   parseAemUrl(urlString)  -> { origin, resourcePath, siteName, urlParams, hash }
//   buildAemLinks(urlString) -> { parsed, links: { ... } }
//
// Every link is either a URL string or `null` when it lacks the data it
// needs. The UI just filters nulls out — no quality score bookkeeping.

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

function decode(s) {
  if (!s) return s
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

// Walk WRAPPERS, `?item=/content/...`, and `#/content/...` (CRXDE style)
// looking for something that smells like a JCR path.
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

  // Last chance: vanity-ish path that isn't obviously a system path.
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

export function parseAemUrl(urlString) {
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
  }
}

export function buildAemLinks(urlString) {
  const parsed = parseAemUrl(urlString)
  const { origin, resourcePath, siteName, urlParams, hash } = parsed

  const isDam = !!resourcePath && resourcePath.startsWith('/content/dam/')
  const q = urlParams ? `?${urlParams}` : ''
  const h = hash ? `#${hash}` : ''

  const disableParams = new URLSearchParams(urlParams || '')
  disableParams.set('wcmmode', 'disabled')
  const disableQ = `?${disableParams.toString()}`

  const links = {
    // Page authoring
    editor:
      origin && resourcePath && !isDam
        ? `${origin}/editor.html${resourcePath}.html${q}${h}`
        : null,
    preview:
      origin && resourcePath
        ? `${origin}${resourcePath}${isDam ? '' : '.html'}${q}${h}`
        : null,
    disable:
      origin && resourcePath && !isDam
        ? `${origin}${resourcePath}.html${disableQ}${h}`
        : null,
    properties:
      origin && resourcePath && !isDam
        ? `${origin}/mnt/overlay/wcm/core/content/sites/properties.html?item=${resourcePath}`
        : null,

    // Sites console
    sites:
      origin && resourcePath && !isDam
        ? `${origin}/sites.html${resourcePath}`
        : null,
    sitesRoot: origin
      ? siteName
        ? `${origin}/sites.html/content/${siteName}`
        : `${origin}/sites.html/content`
      : null,

    // DAM / Assets
    dam: origin && isDam ? `${origin}/assets.html${resourcePath}` : null,
    damRoot: origin
      ? siteName
        ? `${origin}/assets.html/content/dam/${siteName}`
        : `${origin}/assets.html/content/dam`
      : null,
    assetDetails:
      origin && isDam ? `${origin}/assetdetails.html${resourcePath}` : null,

    // CRX / admin consoles — work with just an origin.
    crx: origin ? `${origin}/crx/de/index.jsp#${resourcePath || '/'}` : null,
    packmgr: origin ? `${origin}/crx/packmgr/index.jsp` : null,
    systemConsole: origin ? `${origin}/system/console` : null,
    osgiConsole: origin ? `${origin}/system/console/configMgr` : null,
  }

  return { parsed, links }
}
