import test from 'node:test'
import assert from 'node:assert/strict'
import { THEME_MODES, isDaytime, resolveColorScheme } from './theme.js'

test('light and dark ignore the system setting', () => {
  assert.equal(resolveColorScheme('light', true), 'light')
  assert.equal(resolveColorScheme('dark', false), 'dark')
})

test('system follows the OS preference', () => {
  assert.equal(resolveColorScheme('system', true), 'dark')
  assert.equal(resolveColorScheme('system', false), 'light')
})

test('unknown or missing modes fall back to system', () => {
  assert.equal(resolveColorScheme(undefined, true), 'dark')
  assert.equal(resolveColorScheme('nope', false), 'light')
})

test('sunrise is light from 06:00 until 18:00', () => {
  const at = (hour, minute = 0) => new Date(2026, 0, 1, hour, minute)

  assert.equal(isDaytime(at(5, 59)), false)
  assert.equal(isDaytime(at(6)), true)
  assert.equal(isDaytime(at(17, 59)), true)
  assert.equal(isDaytime(at(18)), false)
  assert.equal(resolveColorScheme('sunrise', true, at(12)), 'light')
  assert.equal(resolveColorScheme('sunrise', false, at(22)), 'dark')
})

test('lists the four modes in menu order', () => {
  assert.deepEqual(THEME_MODES, ['light', 'dark', 'sunrise', 'system'])
})
