// Thin authenticated HTTP layer. Both Jira and Confluence Data Center accept a
// Personal Access Token as `Authorization: Bearer <token>`, so one client class
// covers both; only the error wording differs.

export class CliError extends Error {
  constructor(message, { code = 'error', status = 0 } = {}) {
    super(message)
    this.name = 'CliError'
    this.code = code
    this.status = status
  }
}

// Jira answers a dead session with the login page rather than a 401.
const LOGIN_PAGE =
  /(?:id|name|class)="[^"]*login-form|Log in to Jira|You are not authenticated/i

function stripTags(value) {
  return String(value ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function errorSnippet(text) {
  const raw = String(text ?? '').trim()
  if (!raw) return ''
  if (raw.startsWith('<')) return stripTags(raw).slice(0, 200)
  try {
    const data = JSON.parse(raw)
    const messages = [
      ...(Array.isArray(data?.errorMessages) ? data.errorMessages : []),
      ...Object.values(data?.errors ?? {}),
    ].filter(Boolean)
    if (messages.length > 0) return messages.join('; ').slice(0, 300)
    if (data?.message) return String(data.message).slice(0, 300)
  } catch {
    // not JSON — fall through to the raw snippet
  }
  return raw.slice(0, 200)
}

export function createClient({ baseUrl, token, label = 'Jira', tokenHint = '' }) {
  const base = String(baseUrl ?? '').replace(/\/+$/, '')
  if (!base) throw new CliError(`${label} base URL is not configured.`, { code: 'no-base' })

  if (!token) {
    throw new CliError(
      `${label} PAT is not configured.${tokenHint ? ` ${tokenHint}` : ''}`,
      { code: 'no-token' },
    )
  }

  async function request(pathOrUrl, options = {}) {
    const {
      method = 'GET',
      query,
      json,
      body,
      headers = {},
      expect = 'json',
      timeoutMs = 60_000,
    } = options

    const url = /^https?:\/\//i.test(pathOrUrl)
      ? new URL(pathOrUrl)
      : new URL(pathOrUrl, base)

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }

    const init = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json, text/plain, */*',
        ...headers,
      },
      signal: AbortSignal.timeout(timeoutMs),
    }

    if (json !== undefined) {
      init.headers['Content-Type'] = 'application/json'
      init.body = JSON.stringify(json)
    } else if (body !== undefined) {
      init.body = body
    }

    let response
    try {
      response = await fetch(url, init)
    } catch (error) {
      const reason =
        error?.name === 'TimeoutError'
          ? `timed out after ${Math.round(timeoutMs / 1000)}s`
          : (error?.cause?.code ?? error?.message ?? 'network error')
      throw new CliError(`Could not reach ${label} (${reason}).`, {
        code: 'network',
      })
    }

    if (response.status === 401) {
      throw new CliError(
        `${label} rejected the PAT (401). Check the token has not expired, then re-run \`jira-capacity setup\` (scripted: \`jira-capacity auth set --${label.toLowerCase()} -\`).`,
        { code: 'unauthorized', status: 401 },
      )
    }
    if (response.status === 403) {
      throw new CliError(
        `${label} refused the request (403). The PAT's user may lack permission for this resource.`,
        { code: 'forbidden', status: 403 },
      )
    }
    if (response.status === 404) {
      throw new CliError(`${label} did not find ${url.pathname} (404).`, {
        code: 'not-found',
        status: 404,
      })
    }

    if (expect === 'none') {
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new CliError(
          `${label} returned ${response.status}${errorSnippet(text) ? `: ${errorSnippet(text)}` : ''}.`,
          { code: 'http', status: response.status },
        )
      }
      return null
    }

    if (expect === 'buffer') {
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new CliError(
          `${label} returned ${response.status}${errorSnippet(text) ? `: ${errorSnippet(text)}` : ''}.`,
          { code: 'http', status: response.status },
        )
      }
      return Buffer.from(await response.arrayBuffer())
    }

    const text = await response.text()

    if (!response.ok) {
      throw new CliError(
        `${label} returned ${response.status}${errorSnippet(text) ? `: ${errorSnippet(text)}` : ''}.`,
        { code: 'http', status: response.status },
      )
    }

    if (expect === 'text') {
      if (LOGIN_PAGE.test(text)) {
        throw new CliError(
          `${label} returned the login page instead of data. Check the PAT.`,
          { code: 'signed-out' },
        )
      }
      return text
    }

    if (!text) return null
    if (LOGIN_PAGE.test(text)) {
      throw new CliError(
        `${label} returned the login page instead of data. Check the base URL and the PAT.`,
        { code: 'signed-out' },
      )
    }
    try {
      return JSON.parse(text)
    } catch {
      throw new CliError(
        `${label} returned something that is not JSON (${text.slice(0, 80)}…).`,
        { code: 'bad-json' },
      )
    }
  }

  return { base, token, label, request }
}
