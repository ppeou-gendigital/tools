import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '../public/icons')

const CIRCLE = [34, 197, 94]
const GLYPH = [255, 255, 255]
const SIZES = [16, 32, 48, 128]

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i]
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const name = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])), 0)
  return Buffer.concat([length, name, data, crc])
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const lengthSq = dx * dx + dy * dy
  const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq))
  const cx = ax + t * dx
  const cy = ay + t * dy
  return Math.hypot(px - cx, py - cy)
}

// Tabler Icons "link-code" (MIT) path data.
const LINK_CODE_PATHS = [
  'M9 15l6 -6',
  'M11 6l.463 -.536c1.953 -1.953 5.119 -1.952 7.072 .001c1.783 1.783 1.938 4.577 .465 6.535',
  'M9.126 19.998c-1.317 .022 -2.64 -.466 -3.65 -1.464c-.945 -.934 -1.476 -2.207 -1.476 -3.536c0 -1.328 .532 -2.602 1.476 -3.535l.524 -.463',
  'M20 21l2 -2l-2 -2',
  'M17 17l-2 2l2 2',
]

// Flatten the small subset of SVG path commands used by the icon into
// line segments in the icon's 24x24 coordinate space.
function flattenPath(d) {
  const tokens = d.match(/[MmLlHhVvCcZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []
  const segments = []
  let index = 0
  let command = 'M'
  let x = 0
  let y = 0
  let startX = 0
  let startY = 0

  const number = () => Number(tokens[index++])
  const pushLine = (nx, ny) => {
    segments.push([x, y, nx, ny])
    x = nx
    y = ny
  }
  const pushCurve = (x1, y1, x2, y2, x3, y3) => {
    const steps = 24
    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps
      const mt = 1 - t
      const nx =
        mt * mt * mt * x +
        3 * mt * mt * t * x1 +
        3 * mt * t * t * x2 +
        t * t * t * x3
      const ny =
        mt * mt * mt * y +
        3 * mt * mt * t * y1 +
        3 * mt * t * t * y2 +
        t * t * t * y3
      segments.push([x, y, nx, ny])
      x = nx
      y = ny
    }
  }

  while (index < tokens.length) {
    if (/[a-z]/i.test(tokens[index])) {
      command = tokens[index++]
    }

    if (command === 'M' || command === 'm') {
      const nx = number() + (command === 'm' ? x : 0)
      const ny = number() + (command === 'm' ? y : 0)
      x = nx
      y = ny
      startX = nx
      startY = ny
      command = command === 'm' ? 'l' : 'L'
    } else if (command === 'L' || command === 'l') {
      pushLine(number() + (command === 'l' ? x : 0), number() + (command === 'l' ? y : 0))
    } else if (command === 'H' || command === 'h') {
      pushLine(number() + (command === 'h' ? x : 0), y)
    } else if (command === 'V' || command === 'v') {
      pushLine(x, number() + (command === 'v' ? y : 0))
    } else if (command === 'C' || command === 'c') {
      const values = Array.from({ length: 6 }, number)
      const relative = command === 'c'
      pushCurve(
        values[0] + (relative ? x : 0),
        values[1] + (relative ? y : 0),
        values[2] + (relative ? x : 0),
        values[3] + (relative ? y : 0),
        values[4] + (relative ? x : 0),
        values[5] + (relative ? y : 0),
      )
    } else if (command === 'Z' || command === 'z') {
      pushLine(startX, startY)
      command = 'M'
    } else {
      index += 1
    }
  }

  return segments
}

const GLYPH_SEGMENTS = LINK_CODE_PATHS.flatMap(flattenPath)
const GLYPH_SPAN = 0.62
const GLYPH_STROKE = 1.8

const glyphBox = GLYPH_SEGMENTS.reduce(
  (box, [ax, ay, bx, by]) => ({
    minX: Math.min(box.minX, ax, bx),
    minY: Math.min(box.minY, ay, by),
    maxX: Math.max(box.maxX, ax, bx),
    maxY: Math.max(box.maxY, ay, by),
  }),
  { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
)

const glyphScale =
  GLYPH_SPAN / Math.max(glyphBox.maxX - glyphBox.minX, glyphBox.maxY - glyphBox.minY)
const glyphCenterX = (glyphBox.minX + glyphBox.maxX) / 2
const glyphCenterY = (glyphBox.minY + glyphBox.maxY) / 2
const strokeWidth = GLYPH_STROKE * glyphScale

const glyphLines = GLYPH_SEGMENTS.map(([ax, ay, bx, by]) => [
  0.5 + (ax - glyphCenterX) * glyphScale,
  0.5 + (ay - glyphCenterY) * glyphScale,
  0.5 + (bx - glyphCenterX) * glyphScale,
  0.5 + (by - glyphCenterY) * glyphScale,
])

// Circular green mark with a white link-code glyph.
function sample(x, y) {
  const inCircle = Math.hypot(x - 0.5, y - 0.5) <= 0.49

  if (!inCircle) return [0, 0, 0, 0]

  const onGlyph = glyphLines.some(
    ([ax, ay, bx, by]) => distanceToSegment(x, y, ax, ay, bx, by) <= strokeWidth / 2,
  )

  return onGlyph ? [...GLYPH, 255] : [...CIRCLE, 255]
}

function render(size) {
  const supersample = 4
  const raw = Buffer.alloc((size * 4 + 1) * size)

  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1)
    raw[rowStart] = 0
    for (let x = 0; x < size; x += 1) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      for (let sy = 0; sy < supersample; sy += 1) {
        for (let sx = 0; sx < supersample; sx += 1) {
          const px = (x + (sx + 0.5) / supersample) / size
          const py = (y + (sy + 0.5) / supersample) / size
          const [sr, sg, sb, sa] = sample(px, py)
          const alpha = sa / 255
          r += sr * alpha
          g += sg * alpha
          b += sb * alpha
          a += sa
        }
      }
      const count = supersample * supersample
      const alphaOut = a / count
      const offset = rowStart + 1 + x * 4
      raw[offset] = alphaOut ? Math.round(r / (a / 255)) : 0
      raw[offset + 1] = alphaOut ? Math.round(g / (a / 255)) : 0
      raw[offset + 2] = alphaOut ? Math.round(b / (a / 255)) : 0
      raw[offset + 3] = Math.round(alphaOut)
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync(outDir, { recursive: true })
for (const size of SIZES) {
  const file = resolve(outDir, `icon-${size}.png`)
  writeFileSync(file, render(size))
  console.log(`wrote ${file}`)
}
