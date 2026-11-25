// Per-run context: resolved paths, lazy clients, and output that keeps JSON
// mode machine-readable.
//
// In `--json` mode every human sentence goes to stderr, so stdout is exactly
// one JSON document. Commands never write progress to stdout themselves.

import { confluenceBase, configDir, jiraBase } from './config.mjs'
import { createClient } from './http.mjs'
import { createConfluence } from './confluence.mjs'
import { createJira } from './jira.mjs'
import { patEnvHint, patLabel, resolvePat } from './credentials.mjs'

export function createContext({ env = process.env, json = false, verbose = false, stdout = process.stdout, stderr = process.stderr } = {}) {
  let jiraClient = null
  let confluenceClient = null

  const out = {
    json,
    verbose,
    line(text = '') {
      stdout.write(`${text}\n`)
    },
    info(text = '') {
      if (json) stderr.write(`${text}\n`)
      else stdout.write(`${text}\n`)
    },
    warn(text = '') {
      stderr.write(`${text}\n`)
    },
    debug(text = '') {
      if (verbose) stderr.write(`${text}\n`)
    },
    // `--json` prints the object; otherwise the command's own renderer runs.
    result(value, render) {
      if (json) {
        stdout.write(`${JSON.stringify(value, null, 2)}\n`)
        return
      }
      if (typeof render === 'function') {
        const text = render(value)
        if (text !== undefined && text !== null && text !== '') {
          stdout.write(`${text}\n`)
        }
        return
      }
      stdout.write(`${JSON.stringify(value, null, 2)}\n`)
    },
  }

  function tokenFor(kind) {
    const resolved = resolvePat(kind, env)
    if (!resolved.token) {
      const error = new Error(
        `${patLabel(kind)} PAT is not configured. ${patEnvHint(kind)}`,
      )
      error.code = 'no-token'
      error.kind = kind
      throw error
    }
    return resolved
  }

  const context = {
    env,
    json,
    out,
    configDir: configDir(env),

    jiraBase: jiraBase(env),
    confluenceBase: confluenceBase(env),

    // Constructed on first use; `profiles list` works with no PAT at all.
    jira() {
      if (!jiraClient) {
        const { token } = tokenFor('jira')
        jiraClient = createJira(
          createClient({
            baseUrl: context.jiraBase,
            token,
            label: 'Jira',
            tokenHint: patEnvHint('jira'),
          }),
        )
      }
      return jiraClient
    },

    confluence() {
      if (!confluenceClient) {
        const { token } = tokenFor('confluence')
        confluenceClient = createConfluence(
          createClient({
            baseUrl: context.confluenceBase,
            token,
            label: 'Confluence',
            tokenHint: patEnvHint('confluence'),
          }),
        )
      }
      return confluenceClient
    },
  }

  return context
}
