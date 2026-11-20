import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '../public/icons')

const BG = [17, 24, 39]
const FG = [249, 115, 22]
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

// Sample function in 0..1 space; returns [r, g, b, a].
function sample(x, y) {
  const radius = 0.2
  const inRounded =
    x >= radius && x <= 1 - radius
      ? y >= 0 && y <= 1
      : y >= radius && y <= 1 - radius
        ? x >= 0 && x <= 1
        : Math.hypot(
            Math.max(radius - x, 0, x - (1 - radius)),
            Math.max(radius - y, 0, y - (1 - radius)),
          ) <= radius

  if (!inRounded) return [0, 0, 0, 0]

  const stroke = 0.085
  const apex = [0.5, 0.25]
  const left = [0.29, 0.76]
  const right = [0.71, 0.76]
  const barY = 0.585
  const dx = (right[0] - apex[0]) * ((barY - apex[1]) / (right[1] - apex[1]))
  const leftX = apex[0] - dx
  const rightX = apex[0] + dx

  const onShape =
    distanceToSegment(x, y, apex[0], apex[1], left[0], left[1]) <= stroke / 2 ||
    distanceToSegment(x, y, apex[0], apex[1], right[0], right[1]) <= stroke / 2 ||
    distanceToSegment(x, y, leftX, barY, rightX, barY) <= stroke / 2

  return onShape ? [...FG, 255] : [...BG, 255]
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
