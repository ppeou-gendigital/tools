#!/usr/bin/env node
//
// Rasterize icons/loopy.svg into the Chrome extension PNG sizes using
// @resvg/resvg-js. This replaces an earlier `qlmanage`-based script that
// silently produced garbage icons in two different ways:
//   1. If the SVG had any XML issue, qlmanage rasterized the parser's
//      error page instead.
//   2. Even with a valid SVG, qlmanage renders SVGs as "document
//      thumbnails" — small content on a white paper background — so the
//      violet circle ended up in a tiny corner of a mostly-white canvas.
//
// resvg reads `width`/`height`/`viewBox` faithfully and produces true
// transparent PNGs at any target size, which is exactly what Chrome
// extension icons need.
//
// Usage:
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
const SRC = resolve(ROOT, 'icons/loopy.svg')

const SIZES = [16, 32, 48, 128]

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
