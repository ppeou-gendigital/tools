#!/usr/bin/env node
//
// Rename the template placeholders to your tool's name.
//
// Usage:
//   node scripts/init-tool.mjs --name foo
//   npm run init -- --name foo
//
// What it does:
//   - Sweeps `TOOLNAME` (visible strings) -> "Foo" (PascalCase)
//   - Sweeps `TOOLNAME` in path-like contexts (workflow branch, base URL,
//     tag prefix, storageKey placeholder in configs) -> "foo" (lowercase)
//   - Sweeps `toolname` (storage keys, console prefixes, package.json name)
//     -> "foo" (lowercase)
//   - Renames workflow files:
//       .github/workflows/release-TOOLNAME-extension.yml -> release-foo-extension.yml
//
// The script is idempotent: rerunning it with the same --name after edits is
// safe. If you pick a different --name, run against a clean checkout of
// `template/base` instead.

import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--name' || arg === '-n') {
      args.name = argv[++i]
    } else if (arg.startsWith('--name=')) {
      args.name = arg.slice('--name='.length)
    }
  }
  return args
}

const { name: rawName } = parseArgs(process.argv.slice(2))

if (!rawName) {
  console.error('usage: node scripts/init-tool.mjs --name <tool-name>')
  process.exit(1)
}

const kebab = rawName.trim().toLowerCase()
if (!/^[a-z][a-z0-9-]*$/.test(kebab)) {
  console.error(
    `Invalid --name "${rawName}". Use lowercase letters, digits, and hyphens.`,
  )
  process.exit(1)
}

// PascalCase for user-facing strings ("Foo", "My-Tool" -> "MyTool").
const pascal = kebab
  .split('-')
  .filter(Boolean)
  .map((s) => s[0].toUpperCase() + s.slice(1))
  .join('')

// Files to sweep. Each entry is a repo-relative path. Missing files are
// silently skipped so the script tolerates users deleting bits they don't
// want (e.g. dropping the release workflow if they only ship a web app).
const TEXT_FILES = [
  'package.json',
  'manifest.json',
  'vite.config.js',
  'index.html',
  'popup.html',
  'background.js',
  'README.md',
  'TEMPLATE.md',
  'src/App.jsx',
  'src/env.js',
  'src/lib/queryPersister.js',
  'src/lib/richBody.js',
  'src/pages/RichTextDemo.jsx',
  'src/providers/ThemeProvider.jsx',
  'src/providers/FontSizeProvider.jsx',
  'src/providers/FabCornerProvider.jsx',
  'src/blocks/FloatingMenu.jsx',
  'src/patterns/MenuPanel.jsx',
  'src/pages/Home.jsx',
  'src/providers/NavigationProvider.jsx',
  '.gitignore',
]

// Workflow files are handled separately because they may need to be
// renamed as well as have their contents rewritten.
const WORKFLOW_RENAMES = [
  {
    from: '.github/workflows/release-TOOLNAME-extension.yml',
    to: `.github/workflows/release-${kebab}-extension.yml`,
  },
]

function rewriteFile(relPath, transform) {
  const abs = resolve(ROOT, relPath)
  if (!existsSync(abs)) return false
  const before = readFileSync(abs, 'utf8')
  const after = transform(before)
  if (before === after) return false
  writeFileSync(abs, after)
  console.log(`  ${relative(ROOT, abs)}`)
  return true
}

// The order matters: replace TOOLNAME (mixed-case placeholder) first, then
// the lowercase `toolname` used for storage keys / package name. Since
// TOOLNAME is uppercase and toolname is lowercase, there's no overlap, but
// we're explicit about it.
function applyReplacements(src) {
  return src.replaceAll('TOOLNAME', kebab).replaceAll('toolname', kebab)
}

// The About row, manifest name and HTML <title> should use the display
// name, not the kebab identifier. We do a second pass over user-visible
// strings that were left as the kebab value after the primary sweep.
// `package.json` is intentionally NOT touched here — npm package names
// must be lowercase, so its `"name"` field stays as `kebab`.
function applyDisplayNamePolish(src, relPath) {
  let out = src
    .replaceAll(`${kebab} menu`, `${pascal} menu`)
    .replaceAll(`<title>${kebab}</title>`, `<title>${pascal}</title>`)
    .replaceAll(`const TOOL_NAME = '${kebab}'`, `const TOOL_NAME = '${pascal}'`)

  // manifest.json-only polishes (identified by path — package.json has an
  // identical `"name": "..."` shape that must NOT be Pascal-cased).
  if (relPath === 'manifest.json') {
    out = out
      .replaceAll(`"name": "${kebab}",`, `"name": "${pascal}",`)
      .replaceAll(`"default_title": "${kebab}",`, `"default_title": "${pascal}",`)
      .replaceAll(`"description": "${kebab} `, `"description": "${pascal} `)
  }

  return out
}

console.log(`Renaming template placeholders -> "${kebab}" (display: "${pascal}")`)
console.log('Rewrote:')

let changed = 0
for (const rel of TEXT_FILES) {
  const did = rewriteFile(rel, (s) => applyDisplayNamePolish(applyReplacements(s), rel))
  if (did) changed++
}

// Now the workflow files. Rewrite the current file (either the
// placeholder or the already-renamed one) and rename if needed.
for (const { from, to } of WORKFLOW_RENAMES) {
  const fromAbs = resolve(ROOT, from)
  const toAbs = resolve(ROOT, to)
  const src = existsSync(fromAbs) ? fromAbs : existsSync(toAbs) ? toAbs : null
  if (!src) continue
  const before = readFileSync(src, 'utf8')
  const after = applyDisplayNamePolish(applyReplacements(before), relative(ROOT, src))
  if (before !== after) {
    writeFileSync(src, after)
    changed++
    console.log(`  ${relative(ROOT, src)}`)
  }
  if (src !== toAbs) {
    renameSync(src, toAbs)
    console.log(`  renamed -> ${relative(ROOT, toAbs)}`)
  }
}

console.log('')
console.log(`Done. ${changed} file(s) rewritten.`)
console.log('')
console.log('Next steps:')
console.log('  1. Replace icons/tool.svg with your own SVG, then run `npm run icons` (writes transparent icons/ + opaque public/icons/).')
console.log('  2. `npm install` and `npm run dev` (or `npm run dev:ext`).')
console.log('  3. Commit the rename and push `tool/' + kebab + '` to deploy.')
