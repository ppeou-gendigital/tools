import test from 'node:test'
import assert from 'node:assert/strict'

import { buildCfHtml } from '../src/clipboard.mjs'

const FRAGMENT = '<table><tr><td>é &amp; 漢</td></tr></table>'

function offsets(payload) {
  const text = payload.toString('utf8')
  const header = text.slice(0, text.indexOf('<!--StartFragment-->'))
  return Object.fromEntries(
    [...header.matchAll(/(StartHTML|EndHTML|StartFragment|EndFragment):(\d+)/g)].map(
      ([, name, value]) => [name, Number(value)],
    ),
  )
}

test('CF_HTML offsets are byte offsets that bracket the fragment', () => {
  const payload = buildCfHtml(FRAGMENT)
  const bytes = Buffer.from(payload, 'utf8')
  const at = offsets(bytes)

  assert.equal(
    bytes.subarray(at.StartFragment, at.EndFragment).toString('utf8'),
    FRAGMENT,
  )
  assert.equal(at.EndHTML, bytes.length)
  assert.equal(bytes.subarray(at.StartHTML, at.StartHTML + 6).toString(), '<html>')
  assert.ok(at.StartFragment > at.StartHTML)
})

test('CF_HTML header length stays fixed across fragment sizes', () => {
  const small = offsets(buildCfHtml('<b>x</b>'))
  const large = offsets(buildCfHtml('<table><tr><td>long</td></tr></table>'))

  assert.equal(small.StartHTML, large.StartHTML)
  assert.equal(small.StartFragment - small.StartHTML, large.StartFragment - large.StartHTML)
})

test('CF_HTML uses CRLF line endings in the header', () => {
  const payload = buildCfHtml('<b>x</b>')
  const header = payload.slice(0, payload.indexOf('\r\n\r\n') + 4)

  assert.match(header, /Version:0\.9\r\nStartHTML:\d{10}\r\n/)
  assert.ok(header.endsWith('\r\n\r\n'))
  assert.ok(payload.slice(header.length).startsWith('<html><body>'))
})

test('multi-byte characters do not shift the fragment end', () => {
  const payload = buildCfHtml('ééé')
  const bytes = Buffer.from(payload, 'utf8')
  const at = offsets(bytes)

  assert.equal(at.EndFragment - at.StartFragment, Buffer.byteLength('ééé'))
})
