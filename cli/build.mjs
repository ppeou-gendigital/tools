// Bundles the CLI into one runnable file. The shared report engine in
// src/lib/jira is pulled in here, so the published artifact cannot drift from
// the extension's math.

import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const outfile = path.join(root, 'release', 'jira-capacity.mjs')
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
)

fs.mkdirSync(path.dirname(outfile), { recursive: true })

const result = await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['cli/src/index.mjs'],
  outfile,
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  legalComments: 'none',
  banner: { js: '#!/usr/bin/env node' },
  // The bundle is a single file, so package.json cannot be read at runtime.
  // Bake the version in; cli/src/version.mjs falls back to fs when unbundled.
  define: { __CLI_VERSION__: JSON.stringify(pkg.version) },
  logLevel: 'warning',
  metafile: true,
})

fs.chmodSync(outfile, 0o755)

const bytes = fs.statSync(outfile).size
const inputs = Object.keys(result.metafile.inputs).length
console.log(`Built ${path.relative(root, outfile)} (${(bytes / 1024).toFixed(1)} KB, ${inputs} modules)`)
