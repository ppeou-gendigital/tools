import { useEffect, useRef, useState } from 'react'
import {
  Check,
  Download,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  TriangleAlert,
  Upload,
} from 'lucide-react'
import { PageHeader } from '@/patterns/PageHeader'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { useVault } from '@/providers/VaultProvider'
import {
  PASSPHRASE_HINT_MAX_LENGTH,
  normalizePassphraseHint,
} from '@/lib/prefs'
import { VAULT_IDLE_OPTIONS } from '@/lib/vaultIdleOptions'
import { BIO_REAUTH_OPTIONS } from '@/lib/biometrics'
import { cx } from '@/lib/cx'
import styles from './VaultSettings.module.scss'

const MIN_PASSPHRASE_LENGTH = 8

// Vault preferences: idle timeout, biometrics, hint, and passphrase change.
// JSON import/export lives on the separate DatafeedSettings page.
export function VaultSettings() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Vault"
        subtitle="Auto-lock, biometrics, hint, and passphrase settings."
      />
      <div className={styles.layout}>
        <div className={styles.sideColumn}>
          <IdleTimeoutSection />
          <BiometricUnlockSection />
          <PassphraseHintSection />
        </div>
        <div className={styles.mainColumn}>
          <ChangePassphraseSection />
        </div>
      </div>
      <VaultMetaBackupSection />
      <ResetVaultSection />
    </div>
  )
}

function VaultMetaBackupSection() {
  const vault = useVault()
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [confirmRestore, setConfirmRestore] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)

  const canExport =
    !vault.needsSetup && vault.status !== 'loading' && vault.status !== 'error'

  async function handleExport() {
    if (busy) return
    setBusy('export')
    setError(null)
    setMessage(null)
    try {
      await vault.exportVaultMetaBackup()
      setMessage('Vault meta backup downloaded. Store it somewhere safe.')
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setBusy(null)
    }
  }

  function handlePickRestore() {
    if (busy) return
    setError(null)
    setMessage(null)
    fileRef.current?.click()
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPendingFile(file)
    setConfirmRestore(true)
  }

  async function handleConfirmRestore() {
    if (!pendingFile || busy) return
    setBusy('restore')
    setError(null)
    setMessage(null)
    try {
      const text = await pendingFile.text()
      await vault.restoreVaultMetaBackup(text)
      setConfirmRestore(false)
      setPendingFile(null)
      setMessage(
        'Vault metadata restored. Unlock with the passphrase that matches this backup.',
      )
      vault.requestUnlock({ dismissible: false })
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Vault meta backup</h2>
        <p className={styles.sectionBody}>
          Export salt and verifier so you can restore unlock if prefs sync ever
          wipes vault metadata. This file is not your passphrase and does not
          contain passwords — keep it with your passphrase recovery notes.
        </p>
      </div>
      <div className={styles.dangerActions}>
        <Button
          size="sm"
          variant="outline"
          onClick={handleExport}
          disabled={!canExport || !!busy || vault.isRekeying}
        >
          {busy === 'export' ? (
            <Loader2 size={14} className={styles.spin} aria-hidden="true" />
          ) : (
            <Download size={14} aria-hidden="true" />
          )}
          Export meta
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handlePickRestore}
          disabled={!!busy || vault.isRekeying}
        >
          <Upload size={14} aria-hidden="true" />
          Restore meta…
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={handleFileChange}
      />
      {confirmRestore && (
        <div className={styles.dangerConfirm}>
          <p className={cx(styles.status, styles.statusError)}>
            <TriangleAlert size={14} aria-hidden="true" />
            Replace current vault metadata with{' '}
            <strong>{pendingFile?.name ?? 'this file'}</strong>? You must unlock
            afterward with the passphrase that matches the backup.
          </p>
          <div className={styles.dangerActions}>
            <Button
              size="sm"
              variant="secondary"
              disabled={!!busy}
              onClick={() => {
                setConfirmRestore(false)
                setPendingFile(null)
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmRestore}
              disabled={!!busy}
            >
              {busy === 'restore' ? (
                <>
                  <Loader2 size={14} className={styles.spin} aria-hidden="true" />
                  Restoring…
                </>
              ) : (
                'Restore'
              )}
            </Button>
          </div>
        </div>
      )}
      {message && (
        <div className={cx(styles.status, styles.statusOk)} role="status">
          {message}
        </div>
      )}
      {error && (
        <div className={cx(styles.status, styles.statusError)} role="alert">
          {error}
        </div>
      )}
    </section>
  )
}

function ResetVaultSection() {
  const vault = useVault()
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  async function handleWipe() {
    if (pending) return
    setPending(true)
    setError(null)
    try {
      await vault.wipeVaultData()
      setConfirming(false)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <section className={cx(styles.section, styles.dangerSection)}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Reset vault data</h2>
        <p className={styles.sectionBody}>
          Permanently delete all credentials, credit cards, and Accesso vault
          crypto metadata for this account. Shared prefs and other apps (e.g.
          Notas) are not touched. You will set up a new passphrase afterward.
        </p>
      </div>
      {!confirming ? (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setConfirming(true)}
          disabled={pending || vault.isRekeying}
        >
          Delete all vault data…
        </Button>
      ) : (
        <div className={styles.dangerConfirm}>
          <p className={cx(styles.status, styles.statusError)}>
            <TriangleAlert size={14} aria-hidden="true" />
            This cannot be undone. Orphaned ciphertext will be removed so you
            can create a fresh vault.
          </p>
          <div className={styles.dangerActions}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setConfirming(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleWipe}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 size={14} className={styles.spin} aria-hidden="true" />
                  Deleting…
                </>
              ) : (
                'Yes, delete everything'
              )}
            </Button>
          </div>
        </div>
      )}
      {error && (
        <div className={cx(styles.status, styles.statusError)} role="alert">
          {error}
        </div>
      )}
    </section>
  )
}

function IdleTimeoutSection() {
  const vault = useVault()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (!showSaved) return
    const id = setTimeout(() => setShowSaved(false), 1500)
    return () => clearTimeout(id)
  }, [showSaved])

  async function handleSelect(value) {
    if (pending || vault.isRekeying) return
    if (value === vault.idleTimeoutMs) return
    setPending(true)
    setError(null)
    setShowSaved(false)
    try {
      await vault.setIdleTimeoutMs(value)
      setShowSaved(true)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Auto-lock after inactivity</h2>
        <p className={styles.sectionBody}>
          Activity in the app resets the timer. Closing the extension popup
          does not lock the vault. Quitting the browser always does. Default
          is 1 day.
        </p>
      </div>

      <div className={styles.selectWrap}>
        <select
          id="idle-timeout"
          className={styles.select}
          aria-label="Auto-lock timeout"
          value={vault.idleTimeoutMs}
          onChange={(e) => handleSelect(Number(e.target.value))}
          disabled={pending || vault.isRekeying}
        >
          {VAULT_IDLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {pending && (
          <Loader2
            size={14}
            className={cx(styles.selectSpinner, styles.spin)}
            aria-hidden="true"
          />
        )}
      </div>

      {error && (
        <div className={cx(styles.status, styles.statusError)}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {showSaved && !error && (
        <div className={cx(styles.status, styles.statusOk)}>
          <Check size={12} aria-hidden="true" />
          <span>Saved.</span>
        </div>
      )}
    </section>
  )
}

function BiometricUnlockSection() {
  const vault = useVault()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [showSaved, setShowSaved] = useState(false)

  const capability = vault.biometrics?.capability
  const enrollment = vault.biometrics?.enrollment
  const enabled = Boolean(enrollment)
  const label = capability?.label || 'biometrics'

  useEffect(() => {
    if (!showSaved) return
    const id = setTimeout(() => setShowSaved(false), 1500)
    return () => clearTimeout(id)
  }, [showSaved])

  async function handleToggle(nextEnabled) {
    if (pending || vault.isRekeying) return
    setPending(true)
    setError(null)
    setShowSaved(false)
    try {
      if (nextEnabled) {
        if (!vault.isUnlocked) {
          vault.requestUnlock({ dismissible: true })
          throw new Error('Unlock the vault, then enable biometrics.')
        }
        await vault.enrollBiometrics()
      } else if (
        typeof window !== 'undefined' &&
        window.confirm('Remove biometric unlock on this device?')
      ) {
        await vault.disableBiometrics()
      } else if (enabled) {
        return
      }
      setShowSaved(true)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  async function handleReauthChange(ms) {
    if (pending || !enabled) return
    setPending(true)
    setError(null)
    try {
      await vault.setBiometricsReauthInterval(ms)
      setShowSaved(true)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Biometric unlock</h2>
        <p className={styles.sectionBody}>
          Use {label} on this device after one passphrase unlock. Your master
          passphrase is still required on new devices.
        </p>
      </div>

      {!capability?.available ? (
        <p className={styles.fieldHint}>
          {capability?.reason ||
            'Biometrics aren’t available in this browser. Use your master passphrase.'}
        </p>
      ) : (
        <>
          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={enabled}
              disabled={pending || vault.isRekeying}
              onChange={(e) => handleToggle(e.target.checked)}
            />
            <span>Unlock with {label} on this device</span>
            {pending && (
              <Loader2 size={14} className={styles.spin} aria-hidden="true" />
            )}
          </label>

          {enabled && (
            <div className={styles.selectWrap}>
              <select
                id="bio-reauth"
                className={styles.select}
                aria-label="Ask for biometrics again"
                value={enrollment?.reauthIntervalMs ?? BIO_REAUTH_OPTIONS[1].value}
                onChange={(e) => handleReauthChange(Number(e.target.value))}
                disabled={pending || vault.isRekeying}
              >
                {BIO_REAUTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Ask again: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {error && (
        <div className={cx(styles.status, styles.statusError)}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {showSaved && !error && (
        <div className={cx(styles.status, styles.statusOk)}>
          <Check size={12} aria-hidden="true" />
          <span>Saved.</span>
        </div>
      )}
    </section>
  )
}

function PassphraseHintSection() {
  const vault = useVault()
  const [hint, setHint] = useState(vault.passphraseHint ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (!showSaved) return
    const id = setTimeout(() => setShowSaved(false), 1500)
    return () => clearTimeout(id)
  }, [showSaved])

  const saved = vault.passphraseHint ?? ''
  const dirty = hint.trim() !== saved

  async function handleSave(e) {
    e.preventDefault()
    if (pending || !dirty || vault.isRekeying) return
    setPending(true)
    setError(null)
    setShowSaved(false)
    try {
      await vault.setPassphraseHint(hint)
      setHint(normalizePassphraseHint(hint) ?? '')
      setShowSaved(true)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Passphrase hint</h2>
        <p className={styles.sectionBody}>
          Optional reminder shown when unlocking. Stored in plain text on
          your account — don&apos;t include the passphrase itself.
        </p>
      </div>

      <form className={styles.compactForm} onSubmit={handleSave}>
        <div className={styles.hintRow}>
          <Input
            id="vault-passphrase-hint"
            type="text"
            autoComplete="off"
            aria-label="Passphrase hint"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            disabled={pending || vault.isRekeying}
            maxLength={PASSPHRASE_HINT_MAX_LENGTH}
            placeholder="Optional reminder (not the passphrase)"
          />
          <Button
            type="submit"
            size="sm"
            disabled={pending || !dirty || vault.isRekeying}
          >
            {pending ? (
              <Loader2 size={14} aria-hidden="true" />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className={cx(styles.status, styles.statusError)}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {showSaved && !error && (
        <div className={cx(styles.status, styles.statusOk)}>
          <Check size={12} aria-hidden="true" />
          <span>Saved. It will show the next time you unlock.</span>
        </div>
      )}
    </section>
  )
}

function ChangePassphraseSection() {
  const vault = useVault()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [reveal, setReveal] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (!showSaved) return
    const id = setTimeout(() => setShowSaved(false), 2500)
    return () => clearTimeout(id)
  }, [showSaved])

  const tooShort = next.length > 0 && next.length < MIN_PASSPHRASE_LENGTH
  const mismatch = confirm.length > 0 && confirm !== next
  const sameAsCurrent =
    next.length > 0 && current.length > 0 && next === current
  const canSubmit =
    !pending &&
    !vault.isRekeying &&
    vault.isUnlocked &&
    current.length > 0 &&
    next.length >= MIN_PASSPHRASE_LENGTH &&
    confirm === next &&
    next !== current

  const fieldHint = tooShort
    ? `At least ${MIN_PASSPHRASE_LENGTH} characters.`
    : sameAsCurrent
      ? 'Must differ from the current passphrase.'
      : mismatch
        ? "Passphrases don't match."
        : null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setPending(true)
    setError(null)
    setShowSaved(false)
    try {
      await vault.changePassphrase(current, next)
      setCurrent('')
      setNext('')
      setConfirm('')
      setReveal(false)
      setShowSaved(true)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  if (vault.isLocked) {
    return (
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Change passphrase</h2>
          <p className={styles.sectionBody}>
            Unlock to re-encrypt your vault under a new passphrase.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => vault.requestUnlock({ dismissible: true })}
        >
          <Lock size={14} aria-hidden="true" />
          Unlock
        </Button>
      </section>
    )
  }

  const inputType = reveal ? 'text' : 'password'
  const busy = pending || vault.isRekeying

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>Change passphrase</h2>
          <button
            type="button"
            className={styles.revealLink}
            onClick={() => setReveal((v) => !v)}
            disabled={busy}
          >
            {reveal ? <EyeOff size={12} aria-hidden="true" /> : <Eye size={12} aria-hidden="true" />}
            {reveal ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className={styles.sectionBody}>
          Re-encrypts all vault items. Hint is unchanged.
        </p>
      </div>

      <form className={styles.compactForm} onSubmit={handleSubmit}>
        <Input
          id="vault-current-passphrase"
          type={inputType}
          autoComplete="current-password"
          aria-label="Current passphrase"
          placeholder="Current passphrase"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          disabled={busy}
        />
        <Input
          id="vault-new-passphrase"
          type={inputType}
          autoComplete="new-password"
          aria-label="New passphrase"
          placeholder={`New passphrase (${MIN_PASSPHRASE_LENGTH}+ chars)`}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          disabled={busy}
        />
        <Input
          id="vault-confirm-passphrase"
          type={inputType}
          autoComplete="new-password"
          aria-label="Confirm new passphrase"
          placeholder="Confirm new passphrase"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={busy}
        />

        {fieldHint && (
          <span
            className={cx(
              styles.fieldHint,
              (mismatch || sameAsCurrent) && styles.fieldHintError,
            )}
          >
            {fieldHint}
          </span>
        )}

        <Button type="submit" size="sm" fullWidth disabled={!canSubmit}>
          {busy ? (
            <>
              <Loader2 size={14} aria-hidden="true" />
              Re-encrypting
            </>
          ) : (
            'Change passphrase'
          )}
        </Button>
      </form>

      {error && (
        <div className={cx(styles.status, styles.statusError)}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {showSaved && !error && (
        <div className={cx(styles.status, styles.statusOk)}>
          <Check size={12} aria-hidden="true" />
          <span>
            Updated. Biometric unlock was turned off — enable it again after
            unlocking with your new passphrase.
          </span>
        </div>
      )}
    </section>
  )
}
