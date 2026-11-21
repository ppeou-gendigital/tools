#!/usr/bin/env node
// Regenerate the toolbar PNGs from public/icons/icon.svg.
//
// Chrome renders whatever raster it is given, so each size is drawn at 4x in
// headless Chrome (transparent background) and downsampled with `sips`. That
// supersampling is what keeps the 2 px Tabler stroke smooth instead of jagged.
//
// The 16 px slot is an optical variant, not a straight scale: at that size the
// table grid merges into a blob, so the glyph is enlarged and its stroke
// thickened slightly. 32/48/128 keep the geometry from icon.svg.
//
// macOS only (uses Chrome and sips). Override the browser with CHROME_BIN.

import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const ICON_SVG = join(ROOT, 'public/icons/icon.svg')
const CHROME = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const BASE = { translate: 'translate(3.1 2.75)', scale: 'scale(0.733)', strokeWidth: 2 }
const SMALL = { translate: 'translate(1.8 1.5)', scale: 'scale(0.85)', strokeWidth: 2.4 }

// size -> geometry. Only 16 px gets the optical variant.
const TARGETS = [
  { size: 16, geometry: SMALL },
  { size: 32, geometry: BASE },
  { size: 48, geometry: BASE },
  { size: 128, geometry: BASE },
]

function renderSvg(source, geometry) {
  return source
    .replace(/transform="translate\([^)]*\) scale\([^)]*\)"/, `transform="${geometry.translate} ${geometry.scale}"`)
    .replace(/stroke-width="[^"]*"/, `stroke-width="${geometry.strokeWidth}"`)
}

const source = readFileSync(ICON_SVG, 'utf8')
const dir = mkdtempSync(join(tmpdir(), 'icon-build-'))

try {
  for (const { size, geometry } of TARGETS) {
    const render = size * 4
    const svgPath = join(dir, `icon-${size}.svg`)
    const htmlPath = join(dir, `icon-${size}.html`)
    const shotPath = join(dir, `icon-${size}-${render}.png`)
    const outPath = join(ROOT, `public/icons/icon-${size}.png`)

    writeFileSync(svgPath, renderSvg(source, geometry))
    writeFileSync(
      htmlPath,
      `<!doctype html><style>
         html,body{margin:0;background:transparent;overflow:hidden}
         img{display:block;width:${render}px;height:${render}px}
       </style><img src="file://${svgPath}" alt="">`,
    )

    execFileSync(
      CHROME,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--hide-scrollbars',
        `--user-data-dir=${join(dir, 'profile')}`,
        '--default-background-color=00000000',
        `--window-size=${render},${render}`,
        `--screenshot=${shotPath}`,
        `file://${htmlPath}`,
      ],
      { stdio: 'ignore' },
    )

    execFileSync('sips', ['-z', String(size), String(size), shotPath, '--out', outPath], { stdio: 'ignore' })
    console.log(`icon-${size}.png  (${render}px render -> ${size}px)`)
  }
} finally {
  rmSync(dir, { recursive: true, force: true })
}
