import test from 'node:test'
import assert from 'node:assert/strict'
import {
  emptyFilters,
  idsOf,
  itemsForIds,
  normalizeItems,
  setFilterValues,
  toggleFilterValue,
} from './filters.js'

test('normalizeItems dedupes and coerces strings', () => {
  assert.deepEqual(normalizeItems(['WEBEXP', { id: 'WEBEXP', name: 'Web' }, null]), [
    { id: 'WEBEXP', name: 'WEBEXP' },
  ])
})

test('normalizeItems prefers name, then displayName', () => {
  assert.deepEqual(normalizeItems([{ id: 'jdoe', displayName: 'Jane Doe' }]), [
    { id: 'jdoe', name: 'Jane Doe' },
  ])
})

test('emptyFilters has every group', () => {
  assert.deepEqual(Object.keys(emptyFilters()).sort(), [
    'projects',
    'resolutions',
    'sprints',
    'statuses',
    'types',
  ])
})

test('setFilterValues keeps the picked order and existing names', () => {
  const filters = emptyFilters()
  filters.projects = [{ id: 'A', name: 'Project A' }]

  const next = setFilterValues(filters, 'projects', ['B', 'A'], [
    { id: 'B', name: 'Project B' },
  ])

  assert.deepEqual(next.projects, [
    { id: 'B', name: 'Project B' },
    { id: 'A', name: 'Project A' },
  ])
})

test('itemsForIds falls back to the id when unknown', () => {
  assert.deepEqual(itemsForIds(['264165']), [{ id: '264165', name: '264165' }])
})

test('toggleFilterValue adds then removes', () => {
  const item = { id: 'B', name: 'Project B' }
  const added = toggleFilterValue(emptyFilters(), 'projects', item)
  assert.deepEqual(idsOf(added.projects), ['B'])

  const removed = toggleFilterValue(added, 'projects', item)
  assert.deepEqual(removed.projects, [])
})
