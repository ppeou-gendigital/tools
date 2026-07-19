import { useEffect, useState } from 'react'
import { Check, Loader2, TriangleAlert } from 'lucide-react'
import { PageHeader } from '@/patterns/PageHeader'
import { useVault } from '@/providers/VaultProvider'
import { VAULT_IDLE_OPTIONS } from '@/lib/vaultIdleOptions'
import { cx } from '@/lib/cx'
import styles from './VaultSettings.module.scss'

// Vault preferences page. Currently the only knob is the auto-lock
// idle timeout, but the page is set up to grow (passphrase change,
// etc.) — new sections can be added as sibling <section> blocks
// below the idle picker. JSON import/export lives on the separate
// DatafeedSettings page under Settings.
//
// The change persists to `user_data.data.vault.idleTimeoutMs` via
// VaultProvider.setIdleTimeoutMs (which shallow-merges so it doesn't
// clobber salt/iterations/verifier).
export function VaultSettings() {
  const vault = useVault()

  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [showSaved, setShowSaved] = useState(false)

  // A soft "saved" flash — the indicator auto-hides 1.5s after a
  // successful save. Kept in a useEffect (not derived from a Date
  // reading during render) so React's purity rules stay happy and
  // consecutive saves properly restart the timer.
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
    <div className={styles.page}>
      <PageHeader
        title="Vault"
        subtitle="How long your passphrase stays cached on this device."
      />

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
    </div>
  )
}
