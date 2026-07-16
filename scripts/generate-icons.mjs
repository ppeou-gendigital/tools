#!/usr/bin/env node
//
// Rasterize icons/loopy.svg into PNG sizes using @resvg/resvg-js.
//
// Outputs:
//   - Extension icons (16/32/48/128) → icons/icon-{size}.png
//   - PWA / iOS icons (180/192/512)  → public/icons/icon-{size}.png
//
// Usage:
//   npm run icons
//   node scripts/generate-icons.mjs
//
// The rasterized PNGs are committed to the repo (dist is gitignored).

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SRC = resolve(ROOT, 'icons/loopy.svg')

const TARGETS = [
  { dir: 'icons', sizes: [16, 32, 48, 128] },
  { dir: 'public/icons', sizes: [180, 192, 512] },
]

const svg = readFileSync(SRC, 'utf8')

for (const { dir, sizes } of TARGETS) {
  const outDir = resolve(ROOT, dir)
  mkdirSync(outDir, { recursive: true })

  for (const size of sizes) {
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: size },
      background: 'rgba(0, 0, 0, 0)',
    })
    const png = resvg.render().asPng()
    const out = resolve(outDir, `icon-${size}.png`)
    writeFileSync(out, png)
    console.log(`wrote ${dir}/icon-${size}.png (${size}x${size})`)
  }
}
