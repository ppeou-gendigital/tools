import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import {
  AEM_ENVS,
  AEM_KINDS,
  AEM_ROLES,
  kindHasLocalSdk,
  kindHasOrigin,
  kindHasRepo,
} from '@/lib/prefs'
import { cx } from '@/lib/cx'
import styles from './DomainEditor.module.scss'

// Public helpers colocated with the form so the page (table + modal) and
// any future editor consumer share one source of truth.

export function genLocalId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

// Fresh row shape for "Add environment". The normalizer will drop it
// (missing origin) until the user fills something in, so it lives purely
// in local draft state until saved.
export function blankEntry() {
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
    siteName: '',
    imsOrg: '',
  }
}

// Coerce a stored entry into the full editable draft shape so switching
// `kind` in the UI preserves any values the user previously typed.
export function toDraft(entry) {
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

// Strip fields that don't apply to a given kind before persisting, so a
// row that started as traditional and was flipped to eds-ue doesn't leave
// a stale `origin` behind.
export function toPersisted(draft) {
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

export function isValidUrl(v) {
  if (!v) return false
  try {
    new URL(v)
    return true
  } catch {
    return false
  }
}

// Per-kind draft validation. Mirrors normalizeAemDomains + isDomainRenderable
// so the modal can gate its Save button on the same rules the AEM Jump
// page will use to decide whether the row is renderable at all.
export function isDraftValid(draft) {
  if (!draft) return false
  if (kindHasOrigin(draft.kind)) return isValidUrl(draft.origin)
  if (kindHasLocalSdk(draft.kind)) {
    if (!isValidUrl(draft.origin)) return false
    if (!isValidUrl(draft.authorOrigin)) return false
    if (!draft.siteName?.trim() || !draft.imsOrg?.trim()) return false
    return true
  }
  if (kindHasRepo(draft.kind)) {
    if (!draft.owner?.trim() || !draft.repo?.trim()) return false
    if (draft.kind === 'eds-ue') {
      if (!isValidUrl(draft.authorOrigin)) return false
      if (!draft.siteName?.trim() || !draft.imsOrg?.trim()) return false
    }
    return true
  }
  return false
}

// Controlled kind-aware form. Renders the correct field set for the
// current `draft.kind` and fires a shallow-merged patch through `onChange`
// on every edit. No auto-save; the container decides when to persist.
//
// Props:
//   - draft:    the full editable shape returned by `toDraft` / `blankEntry`
//   - onChange: (patch) => void  where `patch` is a subset of draft fields
//   - labelAutoFocus: focus the Label input on mount (used by the modal)
export function DomainEditor({ draft, onChange, labelAutoFocus = false }) {
  const patch = (next) => onChange?.(next)
  const id = draft.id

  return (
    <div className={styles.editor}>
      <div className={cx(styles.field, styles.fieldFull)}>
        <Label htmlFor={`label-${id}`}>Label</Label>
        <Input
          id={`label-${id}`}
          value={draft.label}
          onChange={(e) => patch({ label: e.target.value })}
          placeholder="e.g. QA Author"
          autoFocus={labelAutoFocus}
        />
      </div>

      <div className={styles.selects}>
        <div className={styles.field}>
          <Label htmlFor={`kind-${id}`}>Kind</Label>
          <select
            id={`kind-${id}`}
            className={styles.select}
            value={draft.kind}
            onChange={(e) => patch({ kind: e.target.value })}
          >
            {AEM_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <Label htmlFor={`role-${id}`}>Role</Label>
          <select
            id={`role-${id}`}
            className={styles.select}
            value={draft.role}
            onChange={(e) => patch({ role: e.target.value })}
          >
            {AEM_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <Label htmlFor={`env-${id}`}>Env</Label>
          <select
            id={`env-${id}`}
            className={styles.select}
            value={draft.env}
            onChange={(e) => patch({ env: e.target.value })}
          >
            {AEM_ENVS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      {kindHasOrigin(draft.kind) && (
        <div className={cx(styles.field, styles.fieldFull)}>
          <Label htmlFor={`origin-${id}`}>Origin</Label>
          <Input
            id={`origin-${id}`}
            type="url"
            value={draft.origin}
            onChange={(e) => patch({ origin: e.target.value })}
            placeholder="https://qa-webauthor.example.com"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      )}

      {kindHasLocalSdk(draft.kind) && (
        <div className={styles.grid}>
          <div className={cx(styles.field, styles.fieldFull)}>
            <Label htmlFor={`origin-${id}`}>Origin</Label>
            <Input
              id={`origin-${id}`}
              type="url"
              value={draft.origin}
              onChange={(e) => patch({ origin: e.target.value })}
              placeholder="http://localhost:4502"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className={cx(styles.field, styles.fieldFull)}>
            <Label htmlFor={`author-origin-${id}`}>Author origin</Label>
            <Input
              id={`author-origin-${id}`}
              type="url"
              value={draft.authorOrigin}
              onChange={(e) => patch({ authorOrigin: e.target.value })}
              placeholder="https://author-p12345-e67890.adobeaemcloud.com"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor={`site-name-${id}`}>Site name</Label>
            <Input
              id={`site-name-${id}`}
              value={draft.siteName}
              onChange={(e) => patch({ siteName: e.target.value })}
              placeholder="lifelock-eds-ue"
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor={`ims-org-${id}`}>IMS org</Label>
            <Input
              id={`ims-org-${id}`}
              value={draft.imsOrg}
              onChange={(e) => patch({ imsOrg: e.target.value })}
              placeholder="symantec"
              autoComplete="off"
            />
          </div>
        </div>
      )}

      {kindHasRepo(draft.kind) && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <Label htmlFor={`owner-${id}`}>Owner</Label>
            <Input
              id={`owner-${id}`}
              value={draft.owner}
              onChange={(e) => patch({ owner: e.target.value })}
              placeholder="adobe"
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor={`repo-${id}`}>Repo</Label>
            <Input
              id={`repo-${id}`}
              value={draft.repo}
              onChange={(e) => patch({ repo: e.target.value })}
              placeholder="norton-web"
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor={`ref-${id}`}>Ref</Label>
            <Input
              id={`ref-${id}`}
              value={draft.ref}
              onChange={(e) => patch({ ref: e.target.value })}
              placeholder="main"
              autoComplete="off"
            />
          </div>
          {draft.kind === 'eds-ue' && (
            <>
              <div className={cx(styles.field, styles.fieldFull)}>
                <Label htmlFor={`author-origin-${id}`}>Author origin</Label>
                <Input
                  id={`author-origin-${id}`}
                  type="url"
                  value={draft.authorOrigin}
                  onChange={(e) => patch({ authorOrigin: e.target.value })}
                  placeholder="https://author-p12345-e67890.adobeaemcloud.com"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor={`site-name-${id}`}>Site name</Label>
                <Input
                  id={`site-name-${id}`}
                  value={draft.siteName}
                  onChange={(e) => patch({ siteName: e.target.value })}
                  placeholder="lifelock-eds-ue"
                  autoComplete="off"
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor={`ims-org-${id}`}>IMS org</Label>
                <Input
                  id={`ims-org-${id}`}
                  value={draft.imsOrg}
                  onChange={(e) => patch({ imsOrg: e.target.value })}
                  placeholder="symantec"
                  autoComplete="off"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
