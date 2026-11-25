// One version for the whole product: the CLI and the extension both read
// package.json. The published bundle carries no package.json beside it, so
// build.mjs substitutes __CLI_VERSION__ at build time; the fs path below is
// what keeps `node cli/src/index.mjs` working straight from a checkout.

import fs from 'node:fs'

function fromPackageJson() {
  const url = new URL('../../package.json', import.meta.url)
  return JSON.parse(fs.readFileSync(url, 'utf8')).version
}

/* global __CLI_VERSION__ */
export const VERSION =
  typeof __CLI_VERSION__ === 'string' ? __CLI_VERSION__ : fromPackageJson()
