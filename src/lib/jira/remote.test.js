import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildSnapshot,
  hasJiraSource,
  isJsonAttachment,
  isTicketKey,
  mergeRecentTickets,
  parseTicketKeys,
  pruneLocalProfiles,
  remoteState,
  safeFileName,
  uploadFileName,
} from './remote.js'
import { createProfile, normalizeSelection } from './profiles.js'

test('parses ticket keys from typed and pasted text', () => {
  assert.deepEqual(parseTicketKeys('webexp-1, ABC-2  WEBEXP-1\nOPS_3-42'), {
    keys: ['WEBEXP-1', 'ABC-2', 'OPS_3-42'],
    invalid: [],
  })
  assert.deepEqual(parseTicketKeys(['webexp-1, ABC-2', 'bad key']), {
    keys: ['WEBEXP-1', 'ABC-2'],
    invalid: ['BAD', 'KEY'],
  })
  assert.equal(isTicketKey('ABC-12'), true)
  assert.equal(isTicketKey('12-ABC'), false)
})

test('merges recent tickets without duplicates', () => {
  assert.deepEqual(mergeRecentTickets(['OLD-1', 'ABC-2'], ['abc-2', 'NEW-3']), [
    'ABC-2',
    'NEW-3',
    'OLD-1',
  ])
  assert.equal(mergeRecentTickets([], ['A-1', 'B-2'], 1).length, 1)
})

test('only JSON attachments are importable', () => {
  assert.equal(isJsonAttachment({ filename: 'profile.json' }), true)
  assert.equal(isJsonAttachment({ filename: 'profile', mimeType: 'application/json' }), true)
  assert.equal(isJsonAttachment({ filename: 'notes.txt', mimeType: 'text/plain' }), false)
})

test('detects whether the linked attachment is still current', () => {
  const source = {
    attachmentId: '10',
    filename: 'profile.json',
    remoteCreatedAt: '2026-01-01T00:00:00Z',
  }

  assert.equal(
    remoteState(source, [
      { id: '10', filename: 'profile.json', created: '2026-01-01T00:00:00Z' },
    ]),
    'current',
  )
  assert.equal(
    remoteState(source, [
      { id: '11', filename: 'profile.json', created: '2026-02-01T00:00:00Z' },
    ]),
    'changed',
  )
  assert.equal(remoteState(source, []), 'missing')
  assert.equal(
    remoteState(source, [
      { id: '10', filename: 'profile.json', created: '2026-02-01T00:00:00Z' },
    ]),
    'changed',
  )
  assert.equal(
    remoteState(source, [
      { id: '10', filename: 'profile.json', created: '2026-01-01T00:00:00Z' },
      { id: '12', filename: 'profile.json', created: '2026-02-01T00:00:00Z' },
    ]),
    'changed',
  )
})

test('a profile is Jira-backed only with a complete source', () => {
  assert.equal(hasJiraSource({ source: { type: 'jira', issueKey: 'A-1', attachmentId: '2' } }), true)
  assert.equal(hasJiraSource({ source: { type: 'jira', issueKey: 'A-1' } }), false)
  assert.equal(hasJiraSource({}), false)
})

test('prunes profiles that did not come from a Jira attachment', () => {
  const index = {
    activeId: 'local',
    items: [
      { id: 'local', name: 'Local' },
      {
        id: 'remote',
        name: 'Remote',
        source: { type: 'jira', issueKey: 'A-1', attachmentId: '2' },
      },
    ],
  }

  const pruned = pruneLocalProfiles(index)
  assert.deepEqual(pruned.removedIds, ['local'])
  assert.deepEqual(pruned.index.items.map((item) => item.id), ['remote'])
  assert.equal(pruned.index.activeId, 'remote')

  const unchanged = pruneLocalProfiles(pruned.index)
  assert.deepEqual(unchanged.removedIds, [])
  assert.equal(unchanged.index.activeId, 'remote')
})

test('keeps the attachment file name on sync and export', () => {
  assert.equal(safeFileName('Web Exp.json'), 'Web_Exp.json')
  assert.equal(safeFileName('profile'), 'profile.json')
  assert.equal(uploadFileName({ source: { filename: 'team-profile.json' } }), 'team-profile.json')
  assert.equal(uploadFileName({ name: 'Web Exp' }), 'Web_Exp.json')
})

test('snapshot uses the current selection instead of the imported one', () => {
  const profile = createProfile({ name: 'WebExp' })
  const entry = {
    id: '1',
    name: 'WebExp',
    profile,
    source: { type: 'jira', issueKey: 'A-1', attachmentId: '2' },
  }
  const selection = normalizeSelection({
    filters: { projects: [{ id: 'WEB', name: 'WEB' }] },
  })

  const snapshot = buildSnapshot(entry, selection)
  assert.deepEqual(snapshot.selection.filters.projects, [{ id: 'WEB', name: 'WEB' }])
  assert.equal(snapshot.name, 'WebExp')
})
