import { useState } from 'react'
import { ArrowLeft, Fingerprint, Plus, RotateCcwKey, Trash2, X } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LockSwitch } from '@/molecules/LockSwitch'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useNavigation } from '@/providers/NavigationProvider'
import { useNotes } from '@/providers/NotesProvider'
import { useLockbox } from '@/providers/LockboxProvider'
import { usePrompt } from '@/providers/PromptProvider'
import {
  LOCKBOX_IDLE_OPTIONS,
  labelForIdleTimeoutMs,
} from '@/lib/lockboxIdleOptions'
import { BIO_REAUTH_OPTIONS } from '@/lib/biometrics'
import styles from './LockboxSettings.module.scss'

export function LockboxSettings() {
  const { goBack, previousRouteLabel } = useNavigation()
  const { lockboxes, notebooks } = useNotes()
  const {
    createLockbox,
    unlock,
    lockOne,
    isUnlocked,
    requestUnlock,
    enrollDeviceBiometrics,
    disableBiometrics,
    setBiometricsReauthInterval,
    changeLockboxPassphrase,
    deleteLockbox,
    idleTimeoutMs,
    setIdleTimeout,
    biometrics,
    minPassphraseLength,
    attachLockboxToNotebook,
  } = useLockbox()
  const { prompt, confirm } = usePrompt()

  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [hint, setHint] = useState('')
  const [busy, setBusy] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  function resetCreateForm() {
    setName('')
    setPassphrase('')
    setHint('')
    setCreateError(null)
  }

  function openCreate() {
    resetCreateForm()
    setCreateOpen(true)
  }

  function closeCreate() {
    if (busy) return
    setCreateOpen(false)
    resetCreateForm()
  }

  async function handleCreate(e) {
    e.preventDefault()
    setBusy(true)
    setCreateError(null)
    setError(null)
    setMessage(null)
    try {
      await createLockbox(name, passphrase, { hint })
      setCreateOpen(false)
      resetCreateForm()
      setMessage('Lockbox created and unlocked.')
    } catch (err) {
      setCreateError(err?.message ?? String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Lockboxes"
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className={styles.back}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Notes'}
          </Button>
        }
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={openCreate}
            className={styles.iconBtn}
            aria-label="Create lockbox"
            title="Create lockbox"
          >
            <Plus size={16} aria-hidden="true" />
          </Button>
        }
        shortcuts={
          <PageShortcuts current="lockboxes" className={styles.iconBtn} />
        }
      />

      <Modal
        open={createOpen}
        onDismiss={closeCreate}
        title="Create lockbox"
        dismissible={!busy}
      >
        <form className={styles.form} onSubmit={handleCreate}>
          {createError && <p className={styles.error}>{createError}</p>}
          <div className={styles.field}>
            <Label htmlFor="lb-name">Name</Label>
            <Input
              id="lb-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Personal"
              required
              disabled={busy}
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="lb-pass">
              Passphrase (min {minPassphraseLength})
            </Label>
            <Input
              id="lb-pass"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              autoComplete="new-password"
              required
              minLength={minPassphraseLength}
              disabled={busy}
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="lb-hint">Hint (optional, stored in plaintext)</Label>
            <Input
              id="lb-hint"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Favorite book…"
              disabled={busy}
            />
          </div>
          <Button type="submit" disabled={busy} fullWidth>
            <Plus size={14} aria-hidden="true" />
            {busy ? 'Creating…' : 'Create lockbox'}
          </Button>
        </form>
      </Modal>

      <div className={styles.body}>
        <p className={styles.lead}>
          Each lockbox has its own passphrase. Protect a notebook or individual
          notes. Biometrics are a per-device convenience after one passphrase
          unlock.
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Idle lock</h2>
          <Label htmlFor="idle-timeout">Lock all after inactivity</Label>
          <select
            id="idle-timeout"
            className={styles.select}
            value={idleTimeoutMs}
            onChange={(e) => setIdleTimeout(Number(e.target.value))}
          >
            {LOCKBOX_IDLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className={styles.hint}>
            Current: {labelForIdleTimeoutMs(idleTimeoutMs)}. Session also clears
            when the browser quits.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your lockboxes</h2>
          {lockboxes.length === 0 ? (
            <p className={styles.hint}>
              No lockboxes yet. Tap + in the toolbar to create one.
            </p>
          ) : (
            <ul className={styles.list}>
              {lockboxes.map((lb) => (
                <LockboxCard
                  key={lb.id}
                  meta={lb}
                  unlocked={isUnlocked(lb.id)}
                  enrollment={biometrics.enrollments?.[lb.id]}
                  capability={biometrics.capability}
                  notebooks={notebooks}
                  onUnlock={async () => {
                    setError(null)
                    try {
                      // Use the shared unlock overlay so enrolled biometrics
                      // (Touch ID / Face ID) are offered after lock.
                      await requestUnlock(lb.id)
                      setMessage(`Unlocked “${lb.name}”.`)
                    } catch (err) {
                      if (/dismissed|cancel/i.test(err?.message ?? '')) return
                      setError(err?.message ?? String(err))
                    }
                  }}
                  onLock={() => lockOne(lb.id)}
                  onEnrollBio={async () => {
                    setError(null)
                    try {
                      await enrollDeviceBiometrics(lb.id)
                      setMessage(`Biometrics enabled for “${lb.name}”.`)
                    } catch (err) {
                      const msg = err?.message ?? String(err)
                      // Session may have the key but not the passphrase
                      // (restored unlock). Re-collect passphrase and retry.
                      if (/Re-unlock with your passphrase/i.test(msg)) {
                        const pass = await prompt({
                          title: `Enable biometrics for “${lb.name}”`,
                          message:
                            'Enter the lockbox passphrase once so Touch ID can store an unlock for this device.',
                          label: 'Passphrase',
                          type: 'password',
                          confirmLabel: 'Continue',
                        })
                        if (pass == null) throw err
                        await unlock(lb.id, pass)
                        await enrollDeviceBiometrics(lb.id, {
                          passphrase: pass,
                        })
                        setMessage(`Biometrics enabled for “${lb.name}”.`)
                        return
                      }
                      setError(msg)
                      throw err
                    }
                  }}
                  onDisableBio={async () => {
                    await disableBiometrics(lb.id)
                    setMessage(`Biometrics disabled for “${lb.name}”.`)
                  }}
                  onReauthChange={async (ms) => {
                    await setBiometricsReauthInterval(lb.id, ms)
                  }}
                  onChangePass={async () => {
                    const current = await prompt({
                      title: 'Change passphrase',
                      label: 'Current passphrase',
                      type: 'password',
                      confirmLabel: 'Continue',
                    })
                    if (current == null) return
                    const next = await prompt({
                      title: 'Change passphrase',
                      label: `New passphrase (min ${minPassphraseLength})`,
                      type: 'password',
                      autoComplete: 'new-password',
                      confirmLabel: 'Update',
                    })
                    if (next == null) return
                    setError(null)
                    try {
                      await changeLockboxPassphrase(lb.id, current, next)
                      setMessage('Passphrase changed. Re-enable biometrics.')
                    } catch (err) {
                      setError(err?.message ?? String(err))
                    }
                  }}
                  onDelete={async () => {
                    const pass = await prompt({
                      title: `Delete “${lb.name}”`,
                      message:
                        'Enter the passphrase to delete this lockbox and decrypt its notes.',
                      label: 'Passphrase',
                      type: 'password',
                      confirmLabel: 'Continue',
                    })
                    if (pass == null) return
                    const ok = await confirm({
                      title: 'Delete lockbox?',
                      message:
                        'Delete this lockbox? Protected notes will be decrypted locally.',
                      confirmLabel: 'Delete',
                      destructive: true,
                    })
                    if (!ok) return
                    setError(null)
                    try {
                      await deleteLockbox(lb.id, pass)
                      setMessage('Lockbox deleted.')
                    } catch (err) {
                      setError(err?.message ?? String(err))
                    }
                  }}
                  onAttachNotebook={async (notebookId, lockboxId) => {
                    setError(null)
                    try {
                      await attachLockboxToNotebook(notebookId, lockboxId)
                      setMessage('Notebook protection updated.')
                    } catch (err) {
                      setError(err?.message ?? String(err))
                    }
                  }}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function LockboxCard({
  meta,
  unlocked,
  enrollment,
  capability,
  notebooks,
  onUnlock,
  onLock,
  onEnrollBio,
  onDisableBio,
  onReauthChange,
  onChangePass,
  onDelete,
  onAttachNotebook,
}) {
  const bioOk = Boolean(capability?.available)
  const bioLabel = capability?.label || 'biometrics'
  const [bioBusy, setBioBusy] = useState(false)
  const [bioError, setBioError] = useState(null)
  const [lockBusy, setLockBusy] = useState(false)

  async function handleEnrollBio() {
    if (bioBusy) return
    setBioBusy(true)
    setBioError(null)
    try {
      await onEnrollBio()
    } catch (err) {
      setBioError(err?.message ?? String(err))
    } finally {
      setBioBusy(false)
    }
  }

  async function handleLockToggle(nextLocked) {
    if (lockBusy) return
    if (nextLocked) {
      onLock()
      return
    }
    setLockBusy(true)
    try {
      await onUnlock()
    } finally {
      setLockBusy(false)
    }
  }

  return (
    <li className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.cardHeadText}>
          <div className={styles.cardTitle}>{meta.name}</div>
          {meta.hint ? (
            <div className={styles.cardMeta}>Hint: {meta.hint}</div>
          ) : null}
        </div>
        <div className={styles.cardHeadActions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChangePass}
            className={styles.iconBtn}
            aria-label="Change passphrase"
            title="Change passphrase"
          >
            <RotateCcwKey size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className={styles.iconBtnDanger}
            aria-label="Delete lockbox"
            title="Delete"
          >
            <Trash2 size={16} aria-hidden="true" />
          </Button>
          <LockSwitch
            locked={!unlocked}
            disabled={lockBusy}
            label={
              unlocked
                ? `${meta.name} is unlocked`
                : `${meta.name} is locked`
            }
            onChange={handleLockToggle}
          />
        </div>
      </div>

      {unlocked && bioOk && (
        <div className={styles.bioBlock}>
          {enrollment ? (
            <>
              <p className={styles.hint}>
                <Fingerprint size={12} aria-hidden="true" /> {bioLabel} enabled
              </p>
              <Label htmlFor={`reauth-${meta.id}`}>Ask for {bioLabel}</Label>
              <select
                id={`reauth-${meta.id}`}
                className={styles.select}
                value={enrollment.reauthIntervalMs}
                onChange={(e) => onReauthChange(Number(e.target.value))}
              >
                {BIO_REAUTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={onDisableBio}>
                Disable biometrics
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={handleEnrollBio} disabled={bioBusy}>
                <Fingerprint size={14} aria-hidden="true" />
                {bioBusy ? `Waiting for ${bioLabel}…` : `Enable ${bioLabel}`}
              </Button>
              {bioError && <p className={styles.cardError}>{bioError}</p>}
            </>
          )}
        </div>
      )}

      <div className={styles.attachBlock}>
        <Label id={`nb-${meta.id}-label`}>
          Protect notebook with this lockbox
        </Label>
        <div
          className={styles.chipEditor}
          role="group"
          aria-labelledby={`nb-${meta.id}-label`}
          data-locked={unlocked ? 'false' : 'true'}
        >
          {notebooks
            .filter((nb) => nb.lockboxId === meta.id)
            .map((nb) => (
              <span key={nb.id} className={styles.tagChip}>
                {nb.name}
                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={() => onAttachNotebook(nb.id, null)}
                  disabled={!unlocked}
                  aria-label={`Remove protection from ${nb.name}`}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            ))}
          <select
            id={`nb-${meta.id}`}
            className={styles.chipAddSelect}
            value=""
            disabled={!unlocked}
            onChange={(e) => {
              const notebookId = e.target.value
              if (!notebookId) return
              onAttachNotebook(notebookId, meta.id)
            }}
            aria-label="Add notebook protection"
          >
            <option value="">
              {unlocked ? 'Add notebook…' : 'Unlock to add notebooks…'}
            </option>
            {unlocked &&
              notebooks
                .filter((nb) => nb.lockboxId !== meta.id)
                .map((nb) => (
                  <option key={nb.id} value={nb.id}>
                    {nb.name}
                    {nb.lockboxId ? ' (replace other lockbox)' : ''}
                  </option>
                ))}
          </select>
        </div>
        <p className={styles.hint}>
          {unlocked
            ? 'A notebook can use only one lockbox. Tap × to remove protection.'
            : 'Unlock this lockbox first — the key is required to encrypt or decrypt notebook notes.'}
        </p>
      </div>
    </li>
  )
}
