import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Check,
  Download,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useTrackedHostnames } from '@/providers/TrackedHostnamesProvider'
import { getRebaseOrigin } from '@/lib/prefs'
import {
  canonicalizePattern,
  compileRules,
  entriesToHosts,
  explainMatch,
  hostsToEntries,
  isValidPattern,
  stableHostsKey,
  TRACKED_MODES,
} from '@/lib/trackedHostnames'
import { cx } from '@/lib/cx'
import styles from './TrackedHosts.module.scss'

function genDraftId() {
  return `dr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function genRowId() {
  return `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

// Pull a bare hostname out of whatever the user pasted into the Test
// input: `https://foo.com:8080/bar` -> `foo.com`. If the string isn't a
// valid URL, we treat it as an already-bare hostname.
function extractHostname(raw) {
  const s = (raw ?? '').trim()
  if (!s) return ''
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`
  try {
    return new URL(withScheme).hostname.toLowerCase()
  } catch {
    return s.toLowerCase()
  }
}

// Turn the persisted object into a list of draft rows. Each row gets a
// stable `draftId` (used as the React key across pattern edits) plus
// the original persisted `id` (used as the rule's cross-device
// identifier, referenced from user_visits.paths[*].matchedDomainId).
function hostsToDraftRows(hosts) {
  return hostsToEntries(hosts).map((entry) => ({
    draftId: entry.id,
    id: entry.id,
    pattern: entry.pattern,
    mode: entry.mode,
  }))
}

// Case-insensitive substring search over pattern text so users can jump
// to a rule in a long list.
function matchesQuery(row, needle) {
  if (!needle) return true
  return row.pattern.toLowerCase().includes(needle.toLowerCase())
}

export function TrackedHosts() {
  const { goBack, previousRouteLabel } = useNavigation()
  const { hosts, setHosts, ready } = useTrackedHostnames()
  const { domains: aemDomains } = useAemDomains()

  // The editor's own draft rows. This is the source of truth while the
  // page is mounted — it may include blank/invalid rows that aren't yet
  // committed to the persisted `hosts` object. The two are reconciled
  // via a pair of effects (see below).
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [testInput, setTestInput] = useState('')

  // Remember the last hosts-key we pushed to the store. Lets us tell
  // "our own push echoing back through the provider" apart from a real
  // external change (remote pull, other tab), so we don't stomp the
  // user's in-progress drafts every keystroke.
  const lastPushedKeyRef = useRef(null)
  const initializedRef = useRef(false)

  // Initialize / reconcile drafts against the persisted store. On
  // mount (once `ready`) we seed rows from hosts. On subsequent
  // `hosts` changes, we only reset rows when the change came from
  // outside the editor.
  useEffect(() => {
    if (!ready) return
    const hostsKey = stableHostsKey(hosts)
    if (!initializedRef.current) {
      initializedRef.current = true
      lastPushedKeyRef.current = hostsKey
      setRows(hostsToDraftRows(hosts))
      return
    }
    if (hostsKey !== lastPushedKeyRef.current) {
      // External change (remote sync, another surface). Blow away
      // local drafts and reflect the new truth. This drops any
      // uncommitted blank rows; acceptable since remote conflicts
      // during an active edit session are the rare case.
      lastPushedKeyRef.current = hostsKey
      setRows(hostsToDraftRows(hosts))
    }
  }, [ready, hosts])

  // Push valid rows back to the persisted object. Blank / invalid
  // pattern rows stay local-only until the user finishes typing.
  useEffect(() => {
    if (!initializedRef.current) return
    const nextHosts = entriesToHosts(rows)
    const nextKey = stableHostsKey(nextHosts)
    if (nextKey === lastPushedKeyRef.current) return
    lastPushedKeyRef.current = nextKey
    setHosts(nextHosts)
  }, [rows, setHosts])

  const filtered = useMemo(() => {
    const needle = query.trim()
    return rows.filter((r) => matchesQuery(r, needle))
  }, [rows, query])

  // Compile rules from the current draft rows so the Test box reflects
  // in-progress edits, not just committed rules. Blank/invalid rows are
  // filtered out by `entriesToHosts`.
  const compiled = useMemo(
    () => compileRules(entriesToHosts(rows)),
    [rows],
  )

  const testHostname = useMemo(() => extractHostname(testInput), [testInput])
  const testResult = useMemo(
    () => (testHostname ? explainMatch(testHostname, compiled) : null),
    [testHostname, compiled],
  )

  const handleAdd = useCallback(() => {
    setRows((prev) => [
      ...prev,
      {
        draftId: genDraftId(),
        id: genRowId(),
        pattern: '',
        mode: 'include',
      },
    ])
  }, [])

  const handleUpdate = useCallback((draftId, patch) => {
    setRows((prev) =>
      prev.map((r) => (r.draftId === draftId ? { ...r, ...patch } : r)),
    )
  }, [])

  const handleDelete = useCallback((row) => {
    const label = row.pattern || '(empty)'
    const ok = window.confirm(`Delete rule "${label}"?`)
    if (!ok) return
    setRows((prev) => prev.filter((r) => r.draftId !== row.draftId))
  }, [])

  const handleImportFromAem = useCallback(() => {
    // Collect the set of canonical patterns already present (from any
    // row that has a non-empty pattern, committed or draft) so we
    // don't re-add duplicates.
    const existing = new Set(
      rows
        .map((r) => canonicalizePattern(r.pattern))
        .filter((p) => isValidPattern(p)),
    )
    const seen = new Set()
    const additions = []
    for (const d of aemDomains) {
      const origin = getRebaseOrigin(d)
      if (!origin) continue
      let hostname
      try {
        hostname = new URL(origin).hostname.toLowerCase()
      } catch {
        continue
      }
      if (!hostname || seen.has(hostname)) continue
      seen.add(hostname)
      if (existing.has(hostname)) continue
      additions.push({
        draftId: genDraftId(),
        id: genRowId(),
        pattern: hostname,
        mode: 'include',
      })
    }
    if (additions.length === 0) {
      window.alert(
        'No new hostnames to import — every AEM hostname is already covered by an existing rule.',
      )
      return
    }
    setRows((prev) => [...prev, ...additions])
  }, [aemDomains, rows])

  const isEmpty = rows.length === 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className={styles.back}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {previousRouteLabel ?? 'Back'}
        </Button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Tracked hosts</h1>
          <p className={styles.subtitle}>
            Rules that decide which tabs get recorded to your visited-URLs
            history. Use <code>*</code> as a wildcard for one DNS label.
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleAdd}
          className={styles.addBtn}
        >
          <Plus size={14} aria-hidden="true" />
          Add rule
        </Button>
      </div>

      {/* Test box — always visible so users can validate patterns as they
          edit them. Shows a green/red badge plus which rules matched. */}
      <div className={styles.testBox}>
        <Label htmlFor="th-test" className={styles.testLabel}>
          Test a hostname
        </Label>
        <Input
          id="th-test"
          name="th-test"
          type="text"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder="e.g. lifelock.norton.com or https://ping.norton.com/foo"
          className={styles.testInput}
          spellCheck={false}
          autoComplete="off"
        />
        {testHostname && testResult && (
          <div
            className={cx(
              styles.testResult,
              testResult.captured ? styles.testResultOk : styles.testResultSkip,
            )}
          >
            <span className={styles.testBadge}>
              {testResult.captured ? (
                <Check size={12} aria-hidden="true" />
              ) : (
                <X size={12} aria-hidden="true" />
              )}
              {testResult.captured ? 'Captured' : 'Skipped'}
            </span>
            <span className={styles.testHost}>{testHostname}</span>
            <span className={styles.testDetail}>
              {testResult.reason === 'no-include-match'
                ? 'no include rule matched'
                : testResult.reason === 'excluded'
                  ? `excluded by ${testResult.excludes
                      .map((r) => r.pattern)
                      .join(', ')}`
                  : `matched: ${testResult.includes
                      .map((r) => r.pattern)
                      .join(', ')}`}
            </span>
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className={styles.filters} role="search">
          <div className={styles.searchField}>
            <Search
              size={14}
              aria-hidden="true"
              className={styles.searchIcon}
            />
            <Input
              id="th-search"
              name="th-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pattern…"
              aria-label="Search tracked hosts"
              className={styles.searchInput}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className={styles.count} aria-live="polite">
            {filtered.length}/{rows.length}
          </div>
        </div>
      )}

      {!ready ? (
        <p className={styles.muted}>Loading…</p>
      ) : isEmpty ? (
        <EmptyState
          onAdd={handleAdd}
          onImport={handleImportFromAem}
          hasAem={aemDomains.length > 0}
        />
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.muted}>No rules match your search.</p>
          <Button variant="ghost" size="sm" onClick={() => setQuery('')}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.colMode}>
                  Mode
                </th>
                <th scope="col" className={styles.colPattern}>
                  Pattern
                </th>
                <th scope="col" className={styles.colActions}>
                  <span className={styles.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <TrackedRow
                  key={row.draftId}
                  row={row}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isEmpty && aemDomains.length > 0 && (
        <div className={styles.footerActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportFromAem}
            title="Add one include rule per unique AEM hostname"
          >
            <Download size={14} aria-hidden="true" />
            Import from AEM domains
          </Button>
        </div>
      )}
    </div>
  )
}

function TrackedRow({ row, onUpdate, onDelete }) {
  return (
    <tr className={styles.tr}>
      <td className={styles.tdMode}>
        <select
          className={cx(
            styles.modeSelect,
            row.mode === 'exclude' ? styles.modeExclude : styles.modeInclude,
          )}
          value={row.mode}
          onChange={(e) => onUpdate(row.draftId, { mode: e.target.value })}
          aria-label={`Mode for ${row.pattern || 'this rule'}`}
        >
          {TRACKED_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.tdPattern}>
        <Input
          type="text"
          value={row.pattern}
          onChange={(e) => onUpdate(row.draftId, { pattern: e.target.value })}
          placeholder="e.g. *.norton.*"
          className={styles.patternInput}
          spellCheck={false}
          autoComplete="off"
        />
      </td>
      <td className={styles.tdActions}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row)}
          className={cx(styles.actionBtn, styles.actionDelete)}
          aria-label={`Delete ${row.pattern || 'rule'}`}
          title="Delete rule"
        >
          <Trash2 size={14} aria-hidden="true" />
        </Button>
      </td>
    </tr>
  )
}

function EmptyState({ onAdd, onImport, hasAem }) {
  return (
    <div className={styles.empty}>
      <p className={styles.muted}>
        No tracked hosts yet. Visit capture is disabled until you add at
        least one <strong>include</strong> rule.
      </p>
      <div className={styles.emptyActions}>
        {hasAem && (
          <Button variant="default" size="sm" onClick={onImport}>
            <Download size={14} aria-hidden="true" />
            Import from AEM domains
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus size={14} aria-hidden="true" />
          Add rule
        </Button>
      </div>
    </div>
  )
}
