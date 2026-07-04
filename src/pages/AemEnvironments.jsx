import { useCallback, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Copy,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { blankEntry, genLocalId, toDraft } from '@/blocks/DomainEditor'
import { DomainEditorModal } from '@/blocks/DomainEditorModal'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { AEM_ENVS, AEM_KINDS, AEM_ROLES } from '@/lib/prefs'
import { cx } from '@/lib/cx'
import styles from './AemEnvironments.module.scss'

const ALL = 'all'

// One-line "target" summary for the collapsed table row. Different kinds
// store their destination under different keys, so this hides that
// bookkeeping from the table markup.
function summarizeTarget(entry) {
  if (!entry) return ''
  if (entry.kind === 'traditional' || entry.kind === 'cloud') {
    return entry.origin ?? ''
  }
  if (entry.kind === 'local-sdk') {
    return entry.origin ?? ''
  }
  if (entry.kind === 'eds-ue' || entry.kind === 'eds-da') {
    const { owner = '', repo = '', ref = '' } = entry
    if (!owner && !repo) return ''
    return `${owner}/${repo}${ref ? `@${ref}` : ''}`
  }
  return ''
}

// Case-insensitive substring search across every user-typeable field on
// the entry. Keeps search behaviour predictable: whatever the user sees
// in the target column or would see inside the editor is searchable.
function matchesQuery(entry, needle) {
  if (!needle) return true
  const hay = [
    entry.label,
    entry.origin,
    entry.authorOrigin,
    entry.owner,
    entry.repo,
    entry.ref,
    entry.siteName,
    entry.imsOrg,
    entry.kind,
    entry.role,
    entry.env,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(needle.toLowerCase())
}

// "Foo" -> "Foo (copy)". "Foo (copy)" -> "Foo (copy 2)". Keeps serial
// clones distinguishable without any global uniqueness scan.
function labelWithCopySuffix(label) {
  const base = (label ?? '').trim()
  if (!base) return '(copy)'
  const m = base.match(/^(.*)\(copy(?:\s+(\d+))?\)\s*$/)
  if (!m) return `${base} (copy)`
  const stem = m[1].trimEnd()
  const n = m[2] ? Number.parseInt(m[2], 10) + 1 : 2
  return `${stem} (copy ${n})`
}

export function AemEnvironments() {
  const { goBack, previousRouteLabel } = useNavigation()
  const { domains, setDomains, ready } = useAemDomains()

  // Filter + search state. Local only; nothing here is persisted since
  // filter preferences aren't worth burning a storage slot on and they'd
  // just confuse users who reopen the popup later.
  const [query, setQuery] = useState('')
  const [kindFilter, setKindFilter] = useState(ALL)
  const [roleFilter, setRoleFilter] = useState(ALL)
  const [envFilter, setEnvFilter] = useState(ALL)

  // Modal state. `null` = closed. When open, `mode` says what Save should
  // do and `initial` seeds the DomainEditor's local draft.
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => {
    return domains.filter((d) => {
      if (kindFilter !== ALL && d.kind !== kindFilter) return false
      if (roleFilter !== ALL && d.role !== roleFilter) return false
      if (envFilter !== ALL && d.env !== envFilter) return false
      return matchesQuery(d, query.trim())
    })
  }, [domains, query, kindFilter, roleFilter, envFilter])

  const handleAdd = useCallback(() => {
    setModal({ mode: 'add', initial: blankEntry() })
  }, [])

  const handleEdit = useCallback((row) => {
    setModal({ mode: 'edit', initial: toDraft(row) })
  }, [])

  const handleClone = useCallback((row) => {
    setModal({
      mode: 'clone',
      initial: {
        ...toDraft(row),
        id: genLocalId(),
        label: labelWithCopySuffix(row.label),
      },
    })
  }, [])

  const handleDelete = useCallback(
    (row) => {
      const name = row.label?.trim() || row.origin || row.repo || 'this environment'
      const ok = window.confirm(`Delete "${name}"?`)
      if (!ok) return
      setDomains((prev) => prev.filter((d) => d.id !== row.id))
    },
    [setDomains],
  )

  const handleSave = useCallback(
    (persisted) => {
      const mode = modal?.mode
      setDomains((prev) => {
        if (mode === 'edit') {
          const idx = prev.findIndex((d) => d.id === persisted.id)
          if (idx < 0) return [...prev, persisted]
          const next = prev.slice()
          next[idx] = persisted
          return next
        }
        // add | clone: append.
        return [...prev, persisted]
      })
    },
    [modal, setDomains],
  )

  const clearFilters = useCallback(() => {
    setQuery('')
    setKindFilter(ALL)
    setRoleFilter(ALL)
    setEnvFilter(ALL)
  }, [])

  const hasAnyFilter =
    query.trim() !== '' ||
    kindFilter !== ALL ||
    roleFilter !== ALL ||
    envFilter !== ALL

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
          <h1 className={styles.title}>AEM Environments</h1>
          <p className={styles.subtitle}>
            Configure AEM domains used by the AEM Jump page.
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleAdd}
          className={styles.addBtn}
        >
          <Plus size={14} aria-hidden="true" />
          Add environment
        </Button>
      </div>

      <div className={styles.filters} role="search">
        <div className={styles.searchField}>
          <Search size={14} aria-hidden="true" className={styles.searchIcon} />
          <Input
            id="env-search"
            name="env-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search label, origin, repo…"
            aria-label="Search environments"
            className={styles.searchInput}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className={styles.filterField}>
          <Label htmlFor="filter-kind" className={styles.filterLabel}>
            Kind
          </Label>
          <select
            id="filter-kind"
            className={styles.select}
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
          >
            <option value={ALL}>all</option>
            {AEM_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterField}>
          <Label htmlFor="filter-role" className={styles.filterLabel}>
            Role
          </Label>
          <select
            id="filter-role"
            className={styles.select}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value={ALL}>all</option>
            {AEM_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterField}>
          <Label htmlFor="filter-env" className={styles.filterLabel}>
            Env
          </Label>
          <select
            id="filter-env"
            className={styles.select}
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
          >
            <option value={ALL}>all</option>
            {AEM_ENVS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.count} aria-live="polite">
          {filtered.length}/{domains.length}
        </div>
      </div>

      {!ready ? (
        <p className={styles.muted}>Loading…</p>
      ) : domains.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.muted}>
            No environments yet. Add one to see it appear on the AEM Jump page.
          </p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus size={14} aria-hidden="true" />
            Add environment
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.muted}>No environments match your filters.</p>
          {hasAnyFilter && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.colLabel}>
                  Label
                </th>
                <th scope="col" className={styles.colKind}>
                  Kind
                </th>
                <th scope="col" className={styles.colRole}>
                  Role
                </th>
                <th scope="col" className={styles.colEnv}>
                  Env
                </th>
                <th scope="col" className={styles.colTarget}>
                  Target
                </th>
                <th scope="col" className={styles.colActions}>
                  <span className={styles.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className={styles.tr}>
                  <td className={styles.tdLabel}>
                    <span className={styles.labelText}>
                      {row.label?.trim() || (
                        <span className={styles.mutedInline}>(untitled)</span>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={cx(styles.chip, styles[`kind_${row.kind.replace(/-/g, '_')}`])}>
                      {row.kind}
                    </span>
                  </td>
                  <td className={styles.mono}>{row.role}</td>
                  <td className={styles.mono}>{row.env}</td>
                  <td className={styles.tdTarget}>
                    <span className={styles.targetText} title={summarizeTarget(row)}>
                      {summarizeTarget(row) || (
                        <span className={styles.mutedInline}>—</span>
                      )}
                    </span>
                  </td>
                  <td className={styles.tdActions}>
                    <div className={styles.actionGroup}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(row)}
                        className={styles.actionBtn}
                        aria-label={`Edit ${row.label || 'environment'}`}
                        title="Edit"
                      >
                        <Pencil size={14} aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleClone(row)}
                        className={styles.actionBtn}
                        aria-label={`Duplicate ${row.label || 'environment'}`}
                        title="Duplicate"
                      >
                        <Copy size={14} aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row)}
                        className={cx(styles.actionBtn, styles.actionDelete)}
                        aria-label={`Delete ${row.label || 'environment'}`}
                        title="Delete"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <DomainEditorModal
          mode={modal.mode}
          initial={modal.initial}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
