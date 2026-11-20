import test from 'node:test'
import assert from 'node:assert/strict'
import { idsOf, moveItem, removeItem } from './order.js'

const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

test('moveItem moves within bounds', () => {
  assert.deepEqual(idsOf(moveItem(items, 0, 2)), ['b', 'c', 'a'])
  assert.deepEqual(idsOf(moveItem(items, 2, 0)), ['c', 'a', 'b'])
})

test('moveItem ignores no-op and out-of-range moves', () => {
  assert.equal(moveItem(items, 1, 1), items)
  assert.equal(moveItem(items, -1, 0), items)
  assert.equal(moveItem(items, 0, 9), items)
})

test('removeItem drops by id', () => {
  assert.deepEqual(idsOf(removeItem(items, 'b')), ['a', 'c'])
})
