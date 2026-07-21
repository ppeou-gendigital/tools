import { useEffect, useState } from 'react'
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  TriangleAlert,
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
import { cx } from '@/lib/cx'
import styles from './VaultSettings.module.scss'

const MIN_PASSPHRASE_LENGTH = 8

// Vault preferences: idle timeout, optional hint, and passphrase change.
// JSON import/export lives on the separate DatafeedSettings page.
export function VaultSettings() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Vault"
        subtitle="Auto-lock, hint, and passphrase settings."
      />
      <IdleTimeoutSection />
      <PassphraseHintSection />
      <ChangePassphraseSection />
    </div>
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
          Any activity (typing, clicking, focusing the popup) resets the
          timer. The vault always locks when your browser closes.
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
          <span>Updated. Use the new passphrase next unlock.</span>
        </div>
      )}
    </section>
  )
}
