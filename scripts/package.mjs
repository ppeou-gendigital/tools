// Builds the extension and packages dist/ into release/jira-capacity-<version>.zip,
// where <version> comes from package.json. The zip contains the contents of dist/
// (manifest.json at the root), so it can be extracted and loaded unpacked as-is.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const { version } = pkg

const releaseDir = path.join(root, 'release')
const distDir = path.join(root, 'dist')
const zipName = `jira-capacity-${version}.zip`
const zipPath = path.join(releaseDir, zipName)

console.log(`Packaging Jira Capacity v${version}`)

console.log('Building...')
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' })

const distManifestPath = path.join(distDir, 'manifest.json')
if (!existsSync(distManifestPath)) {
  throw new Error(`Build output is missing ${distManifestPath}`)
}

const distManifest = JSON.parse(readFileSync(distManifestPath, 'utf8'))
if (distManifest.version !== version) {
  throw new Error(
    `Version mismatch: package.json has ${version} but dist/manifest.json has ${distManifest.version}. ` +
      'Run the build again; the manifest version is injected from package.json.',
  )
}

mkdirSync(releaseDir, { recursive: true })
rmSync(zipPath, { force: true })

console.log(`Zipping into release/${zipName}...`)
execFileSync(
  'zip',
  ['-r', '-q', zipPath, '.', '-x', '*.DS_Store', '-x', '__MACOSX/*'],
  { cwd: distDir, stdio: 'inherit' },
)

console.log(`Done: release/${zipName}`)
