#!/usr/bin/env node
//
// Rasterize icons/tool.svg into Chrome extension + PWA PNG sizes using
// @resvg/resvg-js. resvg reads `width`/`height`/`viewBox` faithfully and
// produces true transparent PNGs at any target size.
//
// Extension: 16, 32, 48, 128
// PWA / Apple: 180 (apple-touch-icon), 192, 512
//
// Replace `icons/tool.svg` with your own SVG (keep the file name or
// update SRC below), then run:
//
//   npm run icons
//   node scripts/generate-icons.mjs        # same
//
// The rasterized PNGs are committed to the repo (dist is gitignored).

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SRC = resolve(ROOT, 'icons/tool.svg')

const SIZES = [16, 32, 48, 128, 180, 192, 512]

const svg = readFileSync(SRC, 'utf8')

for (const size of SIZES) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'rgba(0, 0, 0, 0)',
  })
  const png = resvg.render().asPng()
  const out = resolve(ROOT, `icons/icon-${size}.png`)
  writeFileSync(out, png)
  console.log(`wrote icons/icon-${size}.png (${size}x${size})`)
}
