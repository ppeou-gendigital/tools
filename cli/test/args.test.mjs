import test from 'node:test'
import assert from 'node:assert/strict'

import { parseArgs } from '../src/args.mjs'

test('parses string, boolean, and repeated flags', () => {
  const { positional, options } = parseArgs(
    ['Web', '--sprint', 'Sprint 21', '--save', '--add-field', 'summary', '--add-field=parent'],
    { sprint: 'string', save: 'boolean', 'add-field': 'repeat' },
  )

  assert.deepEqual(positional, ['Web'])
  assert.equal(options.sprint, 'Sprint 21')
  assert.equal(options.save, true)
  assert.deepEqual(options.addField, ['summary', 'parent'])
})

test('camels repeated flags consistently', () => {
  const { options } = parseArgs(['--remove-person', 'Alice'], {
    'remove-person': 'repeat',
  })

  assert.deepEqual(options.removePerson, ['Alice'])
})

test('-- stops flag parsing', () => {
  const { positional } = parseArgs(['--', '--save'], { save: 'boolean' })

  assert.deepEqual(positional, ['--save'])
})

test('unknown flags and missing values fail as usage errors', () => {
  assert.throws(() => parseArgs(['--nope'], {}), (error) => error.code === 'usage')
  assert.throws(
    () => parseArgs(['--sprint'], { sprint: 'string' }),
    /needs a value/,
  )
  assert.throws(
    () => parseArgs(['--save=yes'], { save: 'boolean' }),
    /does not take a value/,
  )
})

test('a negative positional is not treated as a flag', () => {
  const { positional } = parseArgs(['-'], {})
  assert.deepEqual(positional, ['-'])
})
