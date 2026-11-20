import test from 'node:test'
import assert from 'node:assert/strict'
import { buildJql, hasFilters, quoteJql } from './jql.js'

const item = (id, name = id) => ({ id, name })

test('quotes and escapes JQL strings', () => {
  assert.equal(quoteJql('User Story'), '"User Story"')
  assert.equal(quoteJql('say "hi"'), '"say \\"hi\\""')
  assert.equal(quoteJql('back\\slash'), '"back\\\\slash"')
})

test('builds clauses in the historical order', () => {
  const jql = buildJql({
    filters: {
      projects: [item('WEBEXP')],
      resolutions: [item('Unresolved')],
      sprints: [item(264165)],
      types: [item('Bug')],
      statuses: [item('In Progress')],
    },
  })

  assert.equal(
    jql,
    'project in ("WEBEXP") AND resolution in ("Unresolved") AND Sprint in (264165) AND issuetype in ("Bug") AND status in ("In Progress")',
  )
})

test('skips empty filter groups', () => {
  assert.equal(buildJql({ filters: { projects: [], statuses: [item('Open')] } }), 'status in ("Open")')
  assert.equal(buildJql({}), '')
})

test('accepts bare ids as well as items', () => {
  assert.equal(buildJql({ filters: { projects: ['WEBEXP'] } }), 'project in ("WEBEXP")')
})

test('appends a quoted ORDER BY', () => {
  const jql = buildJql({
    filters: { projects: [item('WEBEXP')] },
    orderBy: [
      { id: 'customfield_20600', direction: 'asc' },
      { id: 'priority', direction: 'DESC' },
    ],
  })

  assert.equal(
    jql,
    'project in ("WEBEXP") ORDER BY "customfield_20600" ASC, "priority" DESC',
  )
})

test('ORDER BY alone is valid and defaults to ASC', () => {
  assert.equal(buildJql({ orderBy: [{ id: 'summary' }] }), 'ORDER BY "summary" ASC')
})

test('hasFilters tracks every filter group', () => {
  assert.equal(hasFilters({}), false)
  assert.equal(hasFilters({ statuses: [item('Open')] }), true)
})
