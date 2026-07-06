import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LockKeyhole,
  Plus,
  Trash2,
  TriangleAlert,
  Wand2,
  X,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { Textarea } from '@/molecules/Textarea'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVault } from '@/providers/VaultProvider'
import {
  createCredential,
  deleteCredential,
  fetchCredential,
  updateCredential,
} from '@/lib/credentialsApi'
import { cx } from '@/lib/cx'
import styles from './CredentialEdit.module.scss'

function newAccount() {
  return { username: '', password: '' }
}

// Single form for both add and edit. The route in NavigationProvider
// tells us which mode we're in (`credential-edit` carries an `id`
// param, `credential-new` doesn't). In edit mode we fetch + decrypt
// the row before hydrating the form; in add mode we start empty.
export function CredentialEdit() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const vault = useVault()
  const { params, goBack, goCredentials, route } = useNavigation()
  const queryClient = useQueryClient()

  const editingId = route === 'credential-edit' ? params?.id ?? null : null
  const seed = params?.seed ?? null

  const credentialQuery = useQuery({
    queryKey: ['credential', userId, editingId],
    queryFn: () => fetchCredential(userId, editingId),
    enabled: !!userId && !!editingId && vault.isUnlocked,
  })

  const [displayName, setDisplayName] = useState('')
  const [urlOrApp, setUrlOrApp] = useState('')
  const [accounts, setAccounts] = useState([newAccount()])
  const [notes, setNotes] = useState('')
  const [hydratedFor, setHydratedFor] = useState(null)
  const [reveal, setReveal] = useState({})
  const [error, setError] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  // The banner is a pure UI hint tied to a specific seed instance;
  // when the seed object reference changes (new capture) we want it
  // back. Keep it in state so the user can dismiss it manually.
  const [seedBannerOpen, setSeedBannerOpen] = useState(Boolean(seed))
  useEffect(() => {
    setSeedBannerOpen(Boolean(seed))
  }, [seed])
  // Track which seed reference we've already applied. Applying the
  // same seed twice would clobber a user's edits (e.g. if they typed
  // into the form and something re-renders). Ref keeps this out of
  // the render cycle entirely.
  const seedAppliedRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function hydrate() {
      if (!editingId) {
        if (hydratedFor !== 'new') {
          // Seed empty defaults, then apply a `new`-mode seed on top
          // if one was passed via the router (auto-capture flow).
          let nextName = ''
          let nextUrl = ''
          let nextAccounts = [newAccount()]
          if (
            seed &&
            seed.mode === 'new' &&
            seedAppliedRef.current !== seed
          ) {
            nextName = seed.title || seed.hostname || ''
            nextUrl = seed.url || ''
            nextAccounts = [
              {
                username: seed.username ?? '',
                password: seed.password ?? '',
              },
            ]
            seedAppliedRef.current = seed
          }
          setDisplayName(nextName)
          setUrlOrApp(nextUrl)
          setAccounts(nextAccounts)
          setNotes('')
          setHydratedFor('new')
        }
        return
      }
      const row = credentialQuery.data
      if (!row) return
      if (hydratedFor === row.id) return
      try {
        const plain = await vault.decryptRecord({
          ciphertext: row.ciphertext,
          iv: row.iv,
        })
        if (cancelled) return
        let nextAccounts =
          Array.isArray(plain?.accounts) && plain.accounts.length > 0
            ? plain.accounts.map((a) => ({
                username: a?.username ?? '',
                password: a?.password ?? '',
              }))
            : [newAccount()]
        // Apply an edit-mode seed as part of the initial hydration so
        // the pre-filled password is visible from the first paint.
        // Guard with seedAppliedRef so any subsequent re-hydrate (e.g.
        // query refetch) does not clobber the user's edits.
        if (seed && seedAppliedRef.current !== seed) {
          if (
            seed.mode === 'update-account' &&
            typeof seed.accountIdx === 'number' &&
            nextAccounts[seed.accountIdx]
          ) {
            nextAccounts = nextAccounts.map((a, i) =>
              i === seed.accountIdx
                ? { ...a, password: seed.password ?? a.password }
                : a,
            )
            seedAppliedRef.current = seed
          } else if (seed.mode === 'add-account') {
            nextAccounts = [
              ...nextAccounts,
              {
                username: seed.username ?? '',
                password: seed.password ?? '',
              },
            ]
            seedAppliedRef.current = seed
          }
        }
        setDisplayName(row.display_name ?? '')
        setUrlOrApp(plain?.urlOrApp ?? '')
        setAccounts(nextAccounts)
        setNotes(plain?.notes ?? '')
        setHydratedFor(row.id)
      } catch (err) {
        if (cancelled) return
        setError('Could not decrypt this credential.')
        console.warn(err)
      }
    }
    hydrate()
    return () => {
      cancelled = true
    }
  }, [credentialQuery.data, editingId, hydratedFor, seed, vault])

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!editingId) throw new Error('nothing to delete')
      await deleteCredential(editingId)
      return editingId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', userId] })
      queryClient.removeQueries({ queryKey: ['credential', userId, editingId] })
      goCredentials()
    },
    onError: (err) => {
      setError(err?.message ?? String(err))
      setConfirmingDelete(false)
    },
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        urlOrApp: urlOrApp.trim(),
        accounts: accounts
          .map((a) => ({
            username: a.username ?? '',
            password: a.password ?? '',
          }))
          // Trim entirely-empty rows so we don't persist junk. Keep
          // any row where at least one field is set.
          .filter((a) => a.username.length > 0 || a.password.length > 0),
        notes: notes ?? '',
      }
      if (payload.accounts.length === 0) {
        payload.accounts = [{ username: '', password: '' }]
      }
      const { ciphertext, iv } = await vault.encryptRecord(payload)
      if (editingId) {
        return updateCredential(editingId, {
          displayName,
          ciphertext,
          iv,
        })
      }
      return createCredential(userId, {
        displayName,
        ciphertext,
        iv,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', userId] })
      if (editingId) {
        queryClient.invalidateQueries({ queryKey: ['credential', userId, editingId] })
      }
      goCredentials()
    },
    onError: (err) => {
      setError(err?.message ?? String(err))
    },
  })

  function handleAccountChange(idx, patch) {
    setAccounts((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
    )
  }

  function handleAddAccount() {
    setAccounts((prev) => [...prev, newAccount()])
  }

  function handleRemoveAccount(idx) {
    setAccounts((prev) => {
      if (prev.length === 1) return [newAccount()]
      return prev.filter((_, i) => i !== idx)
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!displayName.trim()) {
      setError('Credential name is required.')
      return
    }
    if (saveMutation.isPending) return
    setError(null)
    saveMutation.mutate()
  }

  // Same pattern as the Credentials list: while locked we raise the
  // non-dismissible overlay and render a placeholder underneath. The
  // effect re-fires if the vault re-locks (auto-lock, manual lock)
  // while the user is still on this page.
  const { isLocked, requestUnlock } = vault
  useEffect(() => {
    if (isLocked) {
      requestUnlock({ dismissible: false })
    }
  }, [isLocked, requestUnlock])

  if (vault.isLocked) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Button variant="ghost" size="sm" onClick={goBack} className={styles.back}>
            <ArrowLeft size={14} aria-hidden="true" />
            Back
          </Button>
          <h1 className={styles.title}>
            {editingId ? 'Edit credential' : 'New credential'}
          </h1>
        </div>
        <div className={styles.lockedPanel}>
          <div className={styles.lockedIcon} aria-hidden="true">
            <LockKeyhole size={20} />
          </div>
          <p className={styles.lockedTitle}>Vault locked</p>
          <p className={styles.lockedBody}>
            Enter your master passphrase to continue editing.
          </p>
          <Button
            size="sm"
            onClick={() => vault.requestUnlock({ dismissible: false })}
          >
            <Lock size={14} aria-hidden="true" />
            Unlock
          </Button>
        </div>
      </div>
    )
  }

  const loading = editingId && credentialQuery.isLoading
  const isBusy = saveMutation.isPending || deleteMutation.isPending || loading

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button variant="ghost" size="sm" onClick={goBack} className={styles.back}>
          <ArrowLeft size={14} aria-hidden="true" />
          Back
        </Button>
        <h1 className={styles.title}>
          {editingId ? 'Edit credential' : 'New credential'}
        </h1>
      </div>

      {seed && seedBannerOpen && (
        <div className={styles.seedBanner} role="status">
          <Wand2 size={12} aria-hidden="true" />
          <span>
            Captured from {seed.hostname || 'this page'} — review and save.
          </span>
          <button
            type="button"
            className={styles.seedBannerClose}
            onClick={() => setSeedBannerOpen(false)}
            aria-label="Dismiss capture notice"
            title="Dismiss"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onInput={() => {
          if (seedBannerOpen) setSeedBannerOpen(false)
        }}
      >
        <div className={styles.field}>
          <Label htmlFor="displayName">Credential name</Label>
          <Input
            id="displayName"
            placeholder="e.g. Gmail — personal"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isBusy}
            autoFocus={!editingId}
            required
            maxLength={120}
          />
          <span className={styles.hint}>Visible in the DB (not encrypted).</span>
        </div>

        <div className={styles.field}>
          <Label htmlFor="urlOrApp">URL or app name</Label>
          <Input
            id="urlOrApp"
            placeholder="https://gmail.com"
            value={urlOrApp}
            onChange={(e) => setUrlOrApp(e.target.value)}
            disabled={isBusy}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.sectionHeader}>
            <Label>Accounts</Label>
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAddAccount}
              disabled={isBusy}
            >
              <Plus size={12} aria-hidden="true" />
              Add another
            </button>
          </div>
          <div className={styles.accounts}>
            {accounts.map((account, idx) => (
              <AccountEditor
                key={idx}
                index={idx}
                account={account}
                reveal={!!reveal[idx]}
                onToggleReveal={() =>
                  setReveal((r) => ({ ...r, [idx]: !r[idx] }))
                }
                onChange={(patch) => handleAccountChange(idx, patch)}
                onRemove={() => handleRemoveAccount(idx)}
                canRemove={accounts.length > 1}
                disabled={isBusy}
              />
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={4}
            placeholder="Anything else worth remembering. Encrypted."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isBusy}
          />
        </div>

        {error && (
          <div className={cx(styles.status, styles.statusError)}>
            <TriangleAlert size={12} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {confirmingDelete ? (
          <div className={styles.confirm} role="alertdialog" aria-label="Confirm delete">
            <span>Delete this credential? This cannot be undone.</span>
            <div className={styles.confirmActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" />
                    Deleting
                  </>
                ) : (
                  <>
                    <Trash2 size={14} aria-hidden="true" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.actions}>
            {editingId && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmingDelete(true)}
                disabled={isBusy}
                className={styles.deleteBtn}
              >
                <Trash2 size={14} aria-hidden="true" />
                Delete
              </Button>
            )}
            <div className={styles.actionsRight}>
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isBusy || !displayName.trim()}>
                {saveMutation.isPending ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" />
                    Saving
                  </>
                ) : editingId ? (
                  'Save changes'
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

function AccountEditor({
  index,
  account,
  reveal,
  onToggleReveal,
  onChange,
  onRemove,
  canRemove,
  disabled,
}) {
  return (
    <div className={styles.accountRow}>
      <div className={styles.accountHeader}>
        <span className={styles.accountIndex}>Account {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove account ${index + 1}`}
            title="Remove account"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      <Input
        placeholder="Username or email"
        value={account.username}
        onChange={(e) => onChange({ username: e.target.value })}
        autoComplete="off"
        disabled={disabled}
      />
      <div className={styles.passwordWrap}>
        <Input
          placeholder="Password"
          type={reveal ? 'text' : 'password'}
          value={account.password}
          onChange={(e) => onChange({ password: e.target.value })}
          autoComplete="off"
          disabled={disabled}
        />
        <button
          type="button"
          className={styles.revealBtn}
          onClick={onToggleReveal}
          aria-label={reveal ? 'Hide password' : 'Show password'}
          title={reveal ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {reveal ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}
