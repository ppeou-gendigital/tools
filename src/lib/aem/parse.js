// AEM URL parser. Pure: no Chrome APIs, no network, no clock.
//
// Turns any supported author URL into a flat context object. Link rules only
// ever read from this context, so the same rules work across AEM 6.5/AMS,
// AEM Cloud (/ui#/aem), and Universal Editor canvas URLs.

// AEM "wrapper" console paths whose remainder is a JCR resource path.
const WRAPPERS = [
  '/editor.html',
  '/sites.html',
  '/assets.html',
  '/assetdetails.html',
  '/cf.html',
  '/mnt/overlay',
]

// Paths we never treat as content when falling back.
const SYSTEM_PREFIXES = [
  '/system/',
  '/crx/',
  '/libs/',
  '/apps/',
  '/etc/',
  '/bin/',
  '/var/',
  '/tmp/',
  '/mnt/',
  '/security/',
  '/aem/',
]

// AEM params that leak console state and should not follow the resource path.
const DROP_PARAM_KEYS = new Set([
  'wcmmode',
  'cq_ck',
  'cqdebug',
  'debugclientlibs',
  'wcmmodepreview',
  'forceignorefreshness',
])
const DROP_PARAM_PREFIXES = ['cq_', 'granite_', 'jcr_']

// Rendering extensions we strip off the last path segment.
const RENDER_EXTS = new Set(['html', 'json', 'xml'])

// Universal Editor fragment:
// `#/@<imsOrg>/aem/universal-editor/canvas/<host>[/<resourcePath>]`
const UE_HASH_RE = /^#\/@([^/]+)\/aem\/universal-editor\/canvas\/([^/]+)(\/.+)?$/

function decode(value) {
  if (!value) return value
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function isCloudHost(hostname) {
  return /\.adobeaemcloud\.com$/i.test(hostname)
}

// Split a fragment body like `/editor.html/content/x.html?wcmmode=disabled#foo`
// into `{ pathname, searchParams, hash }` so the traditional extractors work.
function splitFragmentBody(body) {
  let rest = body
  let innerHash = ''
  let search = ''

  const hashIdx = rest.indexOf('#')
  if (hashIdx >= 0) {
    innerHash = rest.slice(hashIdx + 1)
    rest = rest.slice(0, hashIdx)
  }
  const queryIdx = rest.indexOf('?')
  if (queryIdx >= 0) {
    search = rest.slice(queryIdx + 1)
    rest = rest.slice(0, queryIdx)
  }

  return {
    pathname: rest || '/',
    searchParams: new URLSearchParams(search),
    hash: innerHash ? `#${innerHash}` : '',
  }
}

// Look for a JCR path in `#/content/...`, `?item=/content/...`, a wrapper
// path, or a bare `/content/...` pathname.
function extractResourceCandidate(u) {
  if (u.hash && (u.hash.startsWith('#/content/') || u.hash.startsWith('#/conf/'))) {
    return decode(u.hash.slice(1))
  }

  const item = u.searchParams.get('item')
  if (item && (item.startsWith('/content/') || item.startsWith('/conf/'))) {
    return item
  }

  for (const wrapper of WRAPPERS) {
    if (u.pathname === wrapper || u.pathname.startsWith(wrapper + '/')) {
      const rest = decode(u.pathname.slice(wrapper.length) || '/')
      return rest.startsWith('/') ? rest : '/' + rest
    }
  }

  if (u.pathname.startsWith('/content/') || u.pathname.startsWith('/conf/')) {
    return decode(u.pathname)
  }

  return null
}

// Strip `.html` and Sling selectors from the last segment. DAM assets keep
// their real extension.
function stripRenderingSuffixes(resourcePath) {
  if (!resourcePath) return null
  if (resourcePath.startsWith('/content/dam/')) return resourcePath

  const parts = resourcePath.split('/')
  const last = parts.pop()
  if (!last) return parts.join('/') || '/'

  if (last.endsWith('.html')) {
    parts.push(last.slice(0, -5))
    return parts.join('/') || '/'
  }

  const segments = last.split('.')
  if (segments.length === 1) {
    parts.push(last)
    return parts.join('/') || '/'
  }

  const ext = segments[segments.length - 1].toLowerCase()
  if (RENDER_EXTS.has(ext)) {
    parts.push(segments[0])
  } else {
    parts.push(last)
  }
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
  for (const [key, value] of searchParams.entries()) {
    const lower = key.toLowerCase()
    if (DROP_PARAM_KEYS.has(lower)) continue
    if (DROP_PARAM_PREFIXES.some((prefix) => lower.startsWith(prefix))) continue
    out.append(key, value)
  }
  return out.toString()
}

function detectMode({ pathname, searchParams, isUe }) {
  if (isUe) return 'edit'
  if (pathname === '/editor.html' || pathname.startsWith('/editor.html/')) {
    return 'edit'
  }
  if (searchParams.get('wcmmode') === 'disabled') return 'disabled'
  return 'preview'
}

export function parseAemUrl(input) {
  const u = input instanceof URL ? input : new URL(input)

  const cloudInput = isCloudHost(u.hostname)
  const ueMatch = u.hash.match(UE_HASH_RE)

  let logical = {
    pathname: u.pathname,
    searchParams: u.searchParams,
    hash: u.hash,
  }
  let imsOrg = null
  let ueHost = null

  if (ueMatch) {
    imsOrg = ueMatch[1]
    ueHost = ueMatch[2]
    logical = splitFragmentBody(ueMatch[3] || '/')
  } else if (cloudInput && u.hash.startsWith('#/aem/')) {
    logical = splitFragmentBody(u.hash.slice(5)) // '#/aem' -> keep leading '/'
  }

  // The author origin is the Cloud author itself when we are already on it;
  // for UE fragments served from experience.adobe.com, the canvas host is the
  // best available author candidate.
  let origin = u.origin
  if (ueMatch && !cloudInput && ueHost) {
    origin = `https://${ueHost}`
  }
  const originIsCloud = isCloudHost(new URL(origin).hostname)
  const shell = originIsCloud ? '/ui#/aem' : ''

  const candidate = extractResourceCandidate(logical)
  const resourcePath = candidate ? stripRenderingSuffixes(candidate) : null
  const isDam = Boolean(resourcePath && resourcePath.startsWith('/content/dam/'))
  const siteName = extractSiteName(resourcePath)
  const params = stripAemParams(logical.searchParams)
  const hash = logical.hash ? logical.hash.slice(1) : ''
  const mode = detectMode({
    pathname: logical.pathname,
    searchParams: logical.searchParams,
    isUe: Boolean(ueMatch),
  })

  const isAem =
    Boolean(candidate) || cloudInput || Boolean(ueMatch)

  return {
    url: u.toString(),
    origin,
    originIsCloud,
    shell,
    flavor: ueMatch ? 'ue' : cloudInput ? 'cloud' : 'traditional',
    resourcePath,
    siteName,
    isDam,
    isAem,
    mode,
    params,
    hash,
    imsOrg,
    ueHost,
  }
}
