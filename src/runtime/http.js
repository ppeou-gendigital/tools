// Same-origin fetch helpers used by the content script. Running on the Jira
// tab is what makes the corporate session cookie available, so every request
// in this extension goes through here.

export class HttpError extends Error {
  constructor(message, { status, code = 'http' } = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

const LOGIN_REDIRECT = /(?:login|auth|dashboard)/i

function signedOut(message) {
  return new HttpError(
    message ?? 'Jira is not signed in for this tab. Sign in and try again.',
    { status: 401, code: 'signed-out' },
  )
}

async function perform(path, init = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...init,
  })

  if (response.status === 401 || response.status === 403) throw signedOut()

  // Jira redirects expired sessions to a login page; fetch follows it, so the
  // final URL is the only signal.
  if (response.redirected && LOGIN_REDIRECT.test(new URL(response.url).pathname)) {
    throw signedOut()
  }

  return response
}

export async function requestText(path, init) {
  const response = await perform(path, init)
  if (!response.ok) {
    throw new HttpError(`Jira returned ${response.status} ${response.statusText}.`, {
      status: response.status,
    })
  }
  return response.text()
}

export async function requestJson(path, init) {
  const text = await requestText(path, init)
  if (text.trim() === '') return null

  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError(
      'Jira returned a page instead of JSON. Reload the Jira tab and try again.',
      { code: 'not-json' },
    )
  }
}

export async function requestOk(path, init) {
  const response = await perform(path, init)
  if (!response.ok) {
    throw new HttpError(`Jira returned ${response.status} ${response.statusText}.`, {
      status: response.status,
    })
  }
  return response
}
