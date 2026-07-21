import { useEffect, useState } from 'react'
import { Check, Loader2, TriangleAlert } from 'lucide-react'
import { PageHeader } from '@/patterns/PageHeader'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { useVault } from '@/providers/VaultProvider'
import {
  PASSPHRASE_HINT_MAX_LENGTH,
  normalizePassphraseHint,
} from '@/lib/prefs'
import { VAULT_IDLE_OPTIONS } from '@/lib/vaultIdleOptions'
import { cx } from '@/lib/cx'
import styles from './VaultSettings.module.scss'

// Vault preferences page. Idle timeout + optional passphrase hint.
// Passphrase change can land here later as another sibling section.
// JSON import/export lives on the separate DatafeedSettings page.
export function VaultSettings() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Vault"
        subtitle="Auto-lock and passphrase reminder settings."
      />
      <IdleTimeoutSection />
      <PassphraseHintSection />
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
    if (pending) return
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
          disabled={pending}
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
    if (pending || !dirty) return
    setPending(true)
    setError(null)
    setShowSaved(false)
    try {
      await vault.setPassphraseHint(hint)
      // Mirror the server-side normalize so the draft isn't left dirty.
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

      <form className={styles.hintForm} onSubmit={handleSave}>
        <div className={styles.field}>
          <Label htmlFor="vault-passphrase-hint">Hint</Label>
          <Input
            id="vault-passphrase-hint"
            type="text"
            autoComplete="off"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            disabled={pending}
            maxLength={PASSPHRASE_HINT_MAX_LENGTH}
            placeholder="A reminder only you would understand"
          />
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={pending || !dirty}
        >
          {pending ? (
            <>
              <Loader2 size={14} aria-hidden="true" />
              Saving
            </>
          ) : (
            'Save hint'
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
          <span>Saved. It will show the next time you unlock.</span>
        </div>
      )}
    </section>
  )
}
