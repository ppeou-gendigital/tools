import { parseAemUrl } from './parse.js'

// Derive the fields every rule template needs, so rules stay one-liners.
export function enrichContext(parsed, { now = Date.now() } = {}) {
  const params = new URLSearchParams(parsed.params)
  const disabled = new URLSearchParams(params)
  disabled.set('wcmmode', 'disabled')

  return {
    ...parsed,
    now,
    hasResource: Boolean(parsed.resourcePath),
    path: parsed.resourcePath ? encodeURI(parsed.resourcePath) : '',
    item: parsed.resourcePath ? encodeURIComponent(parsed.resourcePath) : '',
    q: params.toString() ? `?${params.toString()}` : '',
    h: parsed.hash ? `#${parsed.hash}` : '',
    disableQ: `?${disabled.toString()}`,
  }
}

export function buildContext(input, options) {
  return enrichContext(parseAemUrl(input), options)
}

// Set a query param on the URL while preserving its shape.
//
// Cloud and Universal Editor URLs put the real path and query string inside
// the hash (`.../ui#/aem/editor.html/...`), so the param has to be written
// inside the fragment rather than before it.
export function withParam(rawUrl, key, value) {
  const u = new URL(rawUrl)
  const isFragmentRoute = u.hash.startsWith('#/') || u.hash.startsWith('#/@')

  if (isFragmentRoute) {
    const fragment = u.hash.slice(1)
    const queryIdx = fragment.indexOf('?')
    const path = queryIdx >= 0 ? fragment.slice(0, queryIdx) : fragment
    const query = queryIdx >= 0 ? fragment.slice(queryIdx + 1) : ''
    const params = new URLSearchParams(query)
    params.set(key, value)
    u.hash = `#${path}?${params.toString()}`
  } else {
    u.searchParams.set(key, value)
  }

  return u.toString()
}
