#!/usr/bin/env node
//
// Rasterize icons/tool.svg into PNG sizes using @resvg/resvg-js.
//
// Outputs:
//   - Extension icons (16/32/48/128) → icons/icon-{size}.png
//     Transparent background for the Chrome toolbar.
//   - PWA / iOS icons (180/192/512)  → public/icons/icon-{size}.png
//     Opaque brand fill. iOS does not honor transparency on
//     apple-touch-icon / home-screen icons (empty corners paint black);
//     PWA maskable icons also need a full-bleed opaque square.
//   - Favicons (16/32) → public/favicon-{size}.png
//     Transparent canvas so the SVG rounded-rect corners show in tabs.
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
const SRC = resolve(ROOT, 'icons/tool.svg')

// Matches icons/tool.svg fill and src/tokens --fab-bg.
const BRAND_BG = '#0F766E'

const TARGETS = [
  {
    dir: 'icons',
    prefix: 'icon',
    sizes: [16, 32, 48, 128],
    background: 'rgba(0, 0, 0, 0)',
  },
  {
    dir: 'public/icons',
    prefix: 'icon',
    sizes: [180, 192, 512],
    background: BRAND_BG,
  },
  {
    dir: 'public',
    prefix: 'favicon',
    sizes: [16, 32],
    background: 'rgba(0, 0, 0, 0)',
  },
]

const svg = readFileSync(SRC, 'utf8')

for (const { dir, prefix, sizes, background } of TARGETS) {
  const outDir = resolve(ROOT, dir)
  mkdirSync(outDir, { recursive: true })

  for (const size of sizes) {
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: size },
      background,
    })
    const png = resvg.render().asPng()
    const out = resolve(outDir, `${prefix}-${size}.png`)
    writeFileSync(out, png)
    console.log(`wrote ${dir}/${prefix}-${size}.png (${size}x${size}, bg=${background})`)
  }
}
