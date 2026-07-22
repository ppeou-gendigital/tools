import { useEffect, useId, useState } from 'react'
import { Fingerprint, HeartPlus, Loader2, Lock } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { PASSPHRASE_HINT_MAX_LENGTH } from '@/lib/prefs'
import { needsBiometricPrompt } from '@/lib/biometrics'
import styles from './PatientVaultGate.module.scss'

export function PatientVaultGate({ children }) {
  const vault = usePatientVault()

  if (vault.isLoading) {
    return (
      <div className={styles.panel}>
        <Loader2 size={18} className={styles.spin} aria-hidden="true" />
        <p>Loading your health vault…</p>
      </div>
    )
  }

  if (vault.status === 'error') {
    return (
      <div className={styles.panel}>
        <p className={styles.error}>{vault.error || 'Something went wrong.'}</p>
        <Button variant="outline" size="sm" onClick={vault.retryLoad}>
          Try again
        </Button>
      </div>
    )
  }

  if (vault.needsSetup) return <SetupForm />
  if (vault.isLocked) return <UnlockPanel />
  return children
}

function SetupForm() {
  const vault = usePatientVault()
  const nameId = useId()
  const passId = useId()
  const confirmId = useId()
  const hintId = useId()
  const [name, setName] = useState('Me')
  const [passphrase, setPassphrase] = useState('')
  const [confirm, setConfirm] = useState('')
  const [hint, setHint] = useState('')
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    if (passphrase !== confirm) {
      setError('Passphrases do not match')
      return
    }
    try {
      await vault.setup(passphrase, name.trim() || 'Me', hint)
    } catch (err) {
      setError(err?.message ?? 'Could not create vault')
    }
  }

  return (
    <form className={styles.panel} onSubmit={onSubmit}>
      <HeartPlus size={28} className={styles.brand} aria-hidden="true" />
      <h1 className={styles.title}>Protect your health data</h1>
      <p className={styles.lead}>
        Create a passphrase. Only you (and family you invite later) can decrypt
        visits, meds, and files. We never see the plaintext.
      </p>
      <div className={styles.field}>
        <Label htmlFor={nameId}>Your name</Label>
        <Input
          id={nameId}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className={styles.field}>
        <Label htmlFor={passId}>Passphrase</Label>
        <Input
          id={passId}
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          autoComplete="new-password"
          minLength={vault.minPassphraseLength}
          required
        />
        <span className={styles.hint}>
          At least {vault.minPassphraseLength} characters.
        </span>
      </div>
      <div className={styles.field}>
        <Label htmlFor={confirmId}>Confirm passphrase</Label>
        <Input
          id={confirmId}
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          minLength={vault.minPassphraseLength}
          required
        />
      </div>
      <div className={styles.field}>
        <Label htmlFor={hintId}>Passphrase hint (optional)</Label>
        <Input
          id={hintId}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          maxLength={PASSPHRASE_HINT_MAX_LENGTH}
          placeholder="A reminder only you understand"
          autoComplete="off"
        />
        <span className={styles.hint}>
          Shown on the unlock screen. Do not put the passphrase itself here.
        </span>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" fullWidth disabled={vault.busy}>
        {vault.busy ? 'Creating…' : 'Create vault'}
      </Button>
    </form>
  )
}

function UnlockPanel() {
  const vault = usePatientVault()
  const enrollment = vault.biometrics?.enrollment
  const capability = vault.biometrics?.capability
  const bioAvailable = Boolean(capability?.available && enrollment)
  const bioLabel = capability?.label || 'biometrics'
  const [mode, setMode] = useState(bioAvailable ? 'bio' : 'passphrase')

  useEffect(() => {
    setMode(bioAvailable ? 'bio' : 'passphrase')
  }, [bioAvailable])

  if (mode === 'bio' && bioAvailable) {
    return (
      <BiometricUnlock
        bioLabel={bioLabel}
        enrollment={enrollment}
        onUsePassphrase={() => setMode('passphrase')}
      />
    )
  }

  return (
    <UnlockForm
      bioAvailable={bioAvailable}
      bioLabel={bioLabel}
      onUseBiometrics={() => setMode('bio')}
    />
  )
}

function BiometricUnlock({ bioLabel, enrollment, onUsePassphrase }) {
  const vault = usePatientVault()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!needsBiometricPrompt(enrollment)) return
    let cancelled = false
    ;(async () => {
      setPending(true)
      setError(null)
      try {
        await vault.unlockWithBiometrics()
      } catch (err) {
        if (!cancelled) {
          const msg = err?.message ?? String(err)
          setError(
            /cancel/i.test(msg)
              ? 'Biometric unlock cancelled. Enter your passphrase.'
              : msg,
          )
          onUsePassphrase()
        }
      } finally {
        if (!cancelled) setPending(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // Auto-prompt once when this panel mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleClick() {
    if (pending) return
    setPending(true)
    setError(null)
    try {
      await vault.unlockWithBiometrics()
    } catch (err) {
      const msg = err?.message ?? String(err)
      setError(
        /cancel/i.test(msg)
          ? 'Biometric unlock cancelled. Enter your passphrase.'
          : msg,
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={styles.panel}>
      <Fingerprint size={28} className={styles.brand} aria-hidden="true" />
      <h1 className={styles.title}>Unlock Docto</h1>
      <p className={styles.lead}>Use {bioLabel} on this device.</p>
      <Button fullWidth onClick={handleClick} disabled={pending || vault.busy}>
        {pending || vault.busy ? (
          <Loader2 size={16} className={styles.spin} aria-hidden="true" />
        ) : (
          <Fingerprint size={16} aria-hidden="true" />
        )}
        Unlock with {bioLabel}
      </Button>
      <button
        type="button"
        className={styles.linkBtn}
        onClick={onUsePassphrase}
        disabled={pending}
      >
        Use passphrase instead
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}

function UnlockForm({ bioAvailable, bioLabel, onUseBiometrics }) {
  const vault = usePatientVault()
  const passId = useId()
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await vault.unlock(passphrase)
    } catch (err) {
      setError(err?.message ?? 'Could not unlock')
    }
  }

  return (
    <form className={styles.panel} onSubmit={onSubmit}>
      <Lock size={28} className={styles.brand} aria-hidden="true" />
      <h1 className={styles.title}>Unlock Docto</h1>
      <p className={styles.lead}>
        Enter your passphrase to open your encrypted health records.
      </p>
      {vault.hint && (
        <p className={styles.hintBanner}>
          Hint: <strong>{vault.hint}</strong>
        </p>
      )}
      <div className={styles.field}>
        <Label htmlFor={passId}>Passphrase</Label>
        <Input
          id={passId}
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" fullWidth disabled={vault.busy}>
        {vault.busy ? 'Unlocking…' : 'Unlock'}
      </Button>
      {bioAvailable && (
        <button
          type="button"
          className={styles.linkBtn}
          onClick={onUseBiometrics}
          disabled={vault.busy}
        >
          Unlock with {bioLabel}
        </button>
      )}
    </form>
  )
}
