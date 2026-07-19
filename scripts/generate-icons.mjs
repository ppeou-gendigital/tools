#!/usr/bin/env node
//
// Rasterize icons/tool.svg into Chrome extension + PWA PNG sizes using
// @resvg/resvg-js. resvg reads `width`/`height`/`viewBox` faithfully and
// produces true transparent PNGs at any target size.
//
// Extension: 16, 32, 48, 128 — transparent background (toolbar).
// PWA / Apple: 180 (apple-touch-icon), 192, 512 — opaque brand fill.
//
// iOS does not honor transparency on apple-touch-icon / home-screen
// icons; empty corners paint black. PWA maskable icons also need a
// full-bleed opaque square. We fill those sizes with the same rose as
// the SVG circle / --fab-bg (#f43f5e).
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

// Matches icons/tool.svg circle fill and src/tokens --fab-bg.
const BRAND_BG = '#f43f5e'

const EXTENSION_SIZES = [16, 32, 48, 128]
const PWA_SIZES = [180, 192, 512]

const svg = readFileSync(SRC, 'utf8')

function writeIcon(size, background) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background,
  })
  const png = resvg.render().asPng()
  const out = resolve(ROOT, `icons/icon-${size}.png`)
  writeFileSync(out, png)
  console.log(`wrote icons/icon-${size}.png (${size}x${size}, bg=${background})`)
}

for (const size of EXTENSION_SIZES) {
  writeIcon(size, 'rgba(0, 0, 0, 0)')
}

for (const size of PWA_SIZES) {
  writeIcon(size, BRAND_BG)
}
