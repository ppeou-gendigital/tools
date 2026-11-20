import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { parseIssueView, ReportParseError } from './parse-issueview.js'

const html = readFileSync(new URL('./fixtures/issueview.html', import.meta.url), 'utf8')

function parse(markup = html) {
  return parseIssueView(parseHTML(markup).document)
}

test('keeps parent rows in page order', () => {
  const { rows } = parse()
  assert.deepEqual(
    rows.map((row) => row.id),
    ['WEBEXP-95471', 'WEBEXP-95523'],
  )
})

test('reads values by column id', () => {
  const { rows } = parse()
  const parent = rows[0].values

  assert.equal(parent.issuekey, 'WEBEXP-95471')
  assert.equal(parent.issuetype, 'User Story')
  assert.equal(parent.status, 'In Progress')
  assert.equal(parent.assignee, 'Michael Kaplan')
  assert.equal(parent.timeestimate, null)
})

test('rolls subtask estimates into per-assignee hours', () => {
  const { rows } = parse()
  assert.deepEqual(rows[0].subtaskHours, { 'Michael Kaplan': 7200 })

  const totals = rows[1].subtaskHours
  assert.equal(totals['Rajashekar Bommadi'], 28800)
  assert.equal(totals['Michael Kaplan'], 32400)
  // A zero/blank estimate must not create an empty assignee bucket.
  assert.equal(Object.hasOwn(totals, ''), false)
})

test('subtask rows are not emitted as top-level rows', () => {
  const { rows } = parse()
  assert.equal(rows.some((row) => row.id === 'WEBEXP-95583'), false)
})

test('cell text is decoded and whitespace collapsed', () => {
  const { rows } = parse()
  assert.equal(
    rows[0].values.summary,
    'LL.N.com | Enhance Product tile component to say /mo. instead of /month',
  )
  assert.equal(rows[1].values.summary, 'Misc S11/2025')
})

test('missing table throws a parse error', () => {
  assert.throws(
    () => parse('<html><body><p>Nothing here</p></body></html>'),
    (error) => error instanceof ReportParseError && error.code === 'parse',
  )
})

test('login page throws a signed-out error', () => {
  assert.throws(
    () => parse('<html><body><form id="login-form">Log in to Jira</form></body></html>'),
    (error) => error instanceof ReportParseError && error.code === 'signed-out',
  )
})
