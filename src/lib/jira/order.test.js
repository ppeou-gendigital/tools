import test from 'node:test'
import assert from 'node:assert/strict'
import { dropIndex, idsOf, moveItem, removeItem } from './order.js'

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

test('dropIndex inserts at the pointer half and removes the row first', () => {
  // Dragging a downward: after b -> index 1, after c -> index 2.
  assert.equal(dropIndex(0, 1, 'after', 3), 1)
  assert.equal(dropIndex(0, 2, 'after', 3), 2)
  // Dragging a downward but on the top half of b is a no-op.
  assert.equal(dropIndex(0, 1, 'before', 3), 0)
  // Dragging c upward: before b -> 1, before a -> 0.
  assert.equal(dropIndex(2, 1, 'before', 3), 1)
  assert.equal(dropIndex(2, 0, 'before', 3), 0)
  // Dragging c onto the bottom half of b is a no-op.
  assert.equal(dropIndex(2, 1, 'after', 3), 2)
})

test('dropIndex ignores its own row and out-of-range targets', () => {
  assert.equal(dropIndex(1, 1, 'before', 3), 1)
  assert.equal(dropIndex(1, 1, 'after', 3), 1)
  assert.equal(dropIndex(-1, 1, 'after', 3), -1)
  assert.equal(dropIndex(0, 1, 'after', 0), 0)
})
