import { useCallback } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import {
  AEM_ENVS,
  AEM_KINDS,
  AEM_ROLES,
  kindHasLocalSdk,
  kindHasOrigin,
  kindHasRepo,
} from '@/lib/prefs'
import { cx } from '@/lib/cx'
import styles from './AemEnvironments.module.scss'

function genLocalId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

// Blank row used by "Add domain". The normalizer will drop it (missing
// origin) until the user fills something in, so it lives purely in local
// draft state until first edit.
function blankEntry() {
  return {
    id: genLocalId(),
    kind: 'traditional',
    role: 'author',
    env: 'qa',
    label: '',
    origin: '',
    owner: '',
    repo: '',
    ref: 'main',
    authorOrigin: '',
  }
}

// Coerce a stored entry into the full editable draft shape so switching
// `kind` in the UI preserves any values the user previously typed.
function toDraft(entry) {
  return {
    id: entry.id,
    kind: entry.kind,
    role: entry.role,
    env: entry.env,
    label: entry.label ?? '',
    origin: entry.origin ?? '',
    owner: entry.owner ?? '',
    repo: entry.repo ?? '',
    ref: entry.ref ?? 'main',
    authorOrigin: entry.authorOrigin ?? '',
    siteName: entry.siteName ?? '',
    imsOrg: entry.imsOrg ?? '',
  }
}

// `local-sdk` reuses the same draft field names as `eds-ue` (origin +
// siteName + imsOrg + authorOrigin) so switching kinds preserves values.

// Strip fields that don't apply to a given kind before persisting, so a
// row that started as traditional and was flipped to eds-ue doesn't leave
// a stale `origin` behind.
function toPersisted(draft) {
  const { id, kind, role, env, label } = draft
  const common = { id, kind, role, env, label }
  if (kindHasOrigin(kind)) {
    return { ...common, origin: draft.origin }
  }
  if (kindHasLocalSdk(kind)) {
    return {
      ...common,
      origin: draft.origin,
      siteName: draft.siteName,
      imsOrg: draft.imsOrg,
      authorOrigin: draft.authorOrigin,
    }
  }
  if (kindHasRepo(kind)) {
    if (kind === 'eds-ue') {
      return {
        ...common,
        owner: draft.owner,
        repo: draft.repo,
        ref: draft.ref,
        authorOrigin: draft.authorOrigin,
        siteName: draft.siteName,
        imsOrg: draft.imsOrg,
      }
    }
    return {
      ...common,
      owner: draft.owner,
      repo: draft.repo,
      ref: draft.ref,
    }
  }
  return common
}

function isValidUrl(v) {
  if (!v) return false
  try {
    new URL(v)
    return true
  } catch {
    return false
  }
}

// Per-kind draft validation. Mirrors normalizeAemDomains so the UI can
// hint at bad rows before they get filtered out at render time.
function isDraftValid(draft) {
  if (kindHasOrigin(draft.kind)) return isValidUrl(draft.origin)
  if (kindHasLocalSdk(draft.kind)) {
    if (!isValidUrl(draft.origin)) return false
    if (!isValidUrl(draft.authorOrigin)) return false
    if (!draft.siteName.trim() || !draft.imsOrg.trim()) return false
    return true
  }
  if (kindHasRepo(draft.kind)) {
    if (!draft.owner.trim() || !draft.repo.trim()) return false
    if (draft.kind === 'eds-ue') {
      if (!isValidUrl(draft.authorOrigin)) return false
      if (!draft.siteName.trim() || !draft.imsOrg.trim()) return false
    }
    return true
  }
  return false
}

export function AemEnvironments() {
  const { goBack, previousRouteLabel } = useNavigation()
  const { domains, setDomains, ready } = useAemDomains()

  // Drafts live inside the provider array; edits go through setDomains
  // which normalizes + persists. We render the raw draft so partial input
  // (empty origin, etc.) doesn't get wiped out mid-typing.
  const drafts = domains.map(toDraft)

  const updateRow = useCallback(
    (id, patch) => {
      setDomains((prev) => {
        const next = prev.map((row) => {
          if (row.id !== id) return row
          const draft = { ...toDraft(row), ...patch }
          return toPersisted(draft)
        })
        return next
      })
    },
    [setDomains],
  )

  const addRow = useCallback(() => {
    setDomains((prev) => [...prev, toPersisted(blankEntry())])
  }, [setDomains])

  const removeRow = useCallback(
    (id) => {
      setDomains((prev) => prev.filter((row) => row.id !== id))
    },
    [setDomains],
  )

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
      </div>

      {!ready ? (
        <p className={styles.muted}>Loading…</p>
      ) : drafts.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.muted}>
            No environments yet. Add one to see it appear on the AEM Jump page.
          </p>
        </div>
      ) : (
        <ul className={styles.list}>
          {drafts.map((row) => (
            <DomainRow
              key={row.id}
              row={row}
              onChange={(patch) => updateRow(row.id, patch)}
              onRemove={() => removeRow(row.id)}
            />
          ))}
        </ul>
      )}

      <div className={styles.actions}>
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus size={14} aria-hidden="true" />
          Add environment
        </Button>
      </div>
    </div>
  )
}

function DomainRow({ row, onChange, onRemove }) {
  const invalid = !isDraftValid(row)

  return (
    <li className={cx(styles.row, invalid && styles.rowInvalid)}>
      <div className={styles.rowHead}>
        <div className={cx(styles.field, styles.fieldLabel)}>
          <Label htmlFor={`label-${row.id}`}>Label</Label>
          <Input
            id={`label-${row.id}`}
            value={row.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="e.g. QA Author"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className={styles.removeBtn}
          aria-label="Remove environment"
          title="Remove"
        >
          <Trash2 size={14} aria-hidden="true" />
        </Button>
      </div>

      <div className={styles.selects}>
        <div className={styles.field}>
          <Label htmlFor={`kind-${row.id}`}>Kind</Label>
          <select
            id={`kind-${row.id}`}
            className={styles.select}
            value={row.kind}
            onChange={(e) => onChange({ kind: e.target.value })}
          >
            {AEM_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <Label htmlFor={`role-${row.id}`}>Role</Label>
          <select
            id={`role-${row.id}`}
            className={styles.select}
            value={row.role}
            onChange={(e) => onChange({ role: e.target.value })}
          >
            {AEM_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <Label htmlFor={`env-${row.id}`}>Env</Label>
          <select
            id={`env-${row.id}`}
            className={styles.select}
            value={row.env}
            onChange={(e) => onChange({ env: e.target.value })}
          >
            {AEM_ENVS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      {kindHasOrigin(row.kind) && (
        <div className={styles.field}>
          <Label htmlFor={`origin-${row.id}`}>Origin</Label>
          <Input
            id={`origin-${row.id}`}
            type="url"
            value={row.origin}
            onChange={(e) => onChange({ origin: e.target.value })}
            placeholder="https://qa-webauthor.example.com"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      )}

      {kindHasLocalSdk(row.kind) && (
        <div className={styles.edsGrid}>
          <div className={cx(styles.field, styles.fieldFull)}>
            <Label htmlFor={`origin-${row.id}`}>Origin</Label>
            <Input
              id={`origin-${row.id}`}
              type="url"
              value={row.origin}
              onChange={(e) => onChange({ origin: e.target.value })}
              placeholder="http://localhost:4502"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className={cx(styles.field, styles.fieldFull)}>
            <Label htmlFor={`author-origin-${row.id}`}>Author origin</Label>
            <Input
              id={`author-origin-${row.id}`}
              type="url"
              value={row.authorOrigin}
              onChange={(e) => onChange({ authorOrigin: e.target.value })}
              placeholder="https://author-p12345-e67890.adobeaemcloud.com"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor={`site-name-${row.id}`}>Site name</Label>
            <Input
              id={`site-name-${row.id}`}
              value={row.siteName}
              onChange={(e) => onChange({ siteName: e.target.value })}
              placeholder="lifelock-eds-ue"
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor={`ims-org-${row.id}`}>IMS org</Label>
            <Input
              id={`ims-org-${row.id}`}
              value={row.imsOrg}
              onChange={(e) => onChange({ imsOrg: e.target.value })}
              placeholder="symantec"
              autoComplete="off"
            />
          </div>
        </div>
      )}

      {kindHasRepo(row.kind) && (
        <div className={styles.edsGrid}>
          <div className={styles.field}>
            <Label htmlFor={`owner-${row.id}`}>Owner</Label>
            <Input
              id={`owner-${row.id}`}
              value={row.owner}
              onChange={(e) => onChange({ owner: e.target.value })}
              placeholder="adobe"
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor={`repo-${row.id}`}>Repo</Label>
            <Input
              id={`repo-${row.id}`}
              value={row.repo}
              onChange={(e) => onChange({ repo: e.target.value })}
              placeholder="norton-web"
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor={`ref-${row.id}`}>Ref</Label>
            <Input
              id={`ref-${row.id}`}
              value={row.ref}
              onChange={(e) => onChange({ ref: e.target.value })}
              placeholder="main"
              autoComplete="off"
            />
          </div>
          {row.kind === 'eds-ue' && (
            <>
              <div className={cx(styles.field, styles.fieldFull)}>
                <Label htmlFor={`author-origin-${row.id}`}>Author origin</Label>
                <Input
                  id={`author-origin-${row.id}`}
                  type="url"
                  value={row.authorOrigin}
                  onChange={(e) => onChange({ authorOrigin: e.target.value })}
                  placeholder="https://author-p12345-e67890.adobeaemcloud.com"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor={`site-name-${row.id}`}>Site name</Label>
                <Input
                  id={`site-name-${row.id}`}
                  value={row.siteName}
                  onChange={(e) => onChange({ siteName: e.target.value })}
                  placeholder="lifelock-eds-ue"
                  autoComplete="off"
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor={`ims-org-${row.id}`}>IMS org</Label>
                <Input
                  id={`ims-org-${row.id}`}
                  value={row.imsOrg}
                  onChange={(e) => onChange({ imsOrg: e.target.value })}
                  placeholder="symantec"
                  autoComplete="off"
                />
              </div>
            </>
          )}
        </div>
      )}
    </li>
  )
}
