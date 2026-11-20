import assert from 'node:assert/strict'
import test from 'node:test'
import { applyGroupOrder, moveItem } from './order.js'

const GROUPS = [
  { id: 'page' },
  { id: 'manage' },
  { id: 'developer' },
  { id: 'consoles' },
  { id: 'components' },
]

test('applyGroupOrder returns the registry order without a stored order', () => {
  assert.deepEqual(applyGroupOrder(GROUPS, null), GROUPS)
  assert.deepEqual(applyGroupOrder(GROUPS, []), GROUPS)
})

test('applyGroupOrder applies a stored id order', () => {
  const order = ['page', 'manage', 'consoles', 'developer', 'components']
  assert.deepEqual(
    applyGroupOrder(GROUPS, order).map((group) => group.id),
    order,
  )
})

test('applyGroupOrder keeps unknown ids and new groups in registry order', () => {
  const order = ['consoles', 'missing', 'page']
  assert.deepEqual(
    applyGroupOrder(GROUPS, order).map((group) => group.id),
    ['consoles', 'page', 'manage', 'developer', 'components'],
  )
})

test('moveItem moves an entry and keeps the rest in order', () => {
  assert.deepEqual(moveItem(['a', 'b', 'c', 'd'], 3, 1), ['a', 'd', 'b', 'c'])
  assert.deepEqual(moveItem(['a', 'b', 'c', 'd'], 0, 3), ['b', 'c', 'd', 'a'])
})

test('moveItem ignores no-op and out-of-range moves', () => {
  const items = ['a', 'b', 'c']
  assert.deepEqual(moveItem(items, 1, 1), items)
  assert.deepEqual(moveItem(items, -1, 2), items)
  assert.deepEqual(moveItem(items, 0, 5), items)
})

test('a drag round-trip restores the original order', () => {
  const ids = GROUPS.map((group) => group.id)
  const moved = moveItem(ids, 2, 4)
  const restored = moveItem(moved, 4, 2)
  assert.deepEqual(restored, ids)
})
