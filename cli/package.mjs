// Packages the CLI artefacts into one zip for the Confluence page: the bundle,
// the skill, and both installers, inside a versioned folder so extracting does
// not scatter files across the download directory.
//
//   npm run cli:zip  ->  release/jira-capacity-cli-<version>.zip

import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { VERSION } from './src/version.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const releaseDir = path.join(root, 'release')
const folder = `jira-capacity-cli-${VERSION}`
const stageDir = path.join(releaseDir, folder)
const zipPath = path.join(releaseDir, `${folder}.zip`)

console.log(`Packaging jira-capacity CLI v${VERSION}`)
execFileSync(process.execPath, [path.join(here, 'build.mjs')], { stdio: 'inherit' })

// The bundle is built into release/; the rest comes from the repo so the zip
// can never contain a skill file that disagrees with the source tree.
const artefacts = [
  [path.join(releaseDir, 'jira-capacity.mjs'), 'jira-capacity.mjs'],
  [path.join(root, 'skill', 'SKILL.md'), 'SKILL.md'],
  [path.join(root, 'install.sh'), 'install.sh'],
  [path.join(root, 'install.ps1'), 'install.ps1'],
]

for (const [source] of artefacts) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing artefact: ${path.relative(root, source)}`)
  }
}

fs.rmSync(stageDir, { recursive: true, force: true })
fs.rmSync(zipPath, { force: true })
fs.mkdirSync(stageDir, { recursive: true })

// A fixed timestamp makes the archive byte-identical across builds, so the
// SHA-256 published on the page stays valid when someone rebuilds the same
// version. Without it, zip records each file's mtime and the hash drifts.
const STAMP = new Date('2026-01-01T00:00:00.000Z')

for (const [source, name] of artefacts) {
  const target = path.join(stageDir, name)
  fs.copyFileSync(source, target)
  // Keep the installer runnable straight out of the archive; the page also
  // tells people to chmod it, which costs nothing if the bit survived.
  if (name.endsWith('.sh') || name === 'jira-capacity.mjs') {
    fs.chmodSync(target, 0o755)
  }
  fs.utimesSync(target, STAMP, STAMP)
}
fs.utimesSync(stageDir, STAMP, STAMP)

execFileSync('zip', ['-r', '-q', '-X', zipPath, folder], { cwd: releaseDir })

const bytes = fs.statSync(zipPath).size
const digest = crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex')
console.log(`Packaged ${path.relative(root, zipPath)} (${(bytes / 1024).toFixed(1)} KB)`)
console.log(`SHA-256 ${digest}`)
