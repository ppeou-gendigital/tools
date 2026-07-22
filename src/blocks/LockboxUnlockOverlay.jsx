import { useEffect, useRef, useState } from 'react'
import { Fingerprint, Loader2 } from 'lucide-react'
import { Modal } from '@/patterns/Modal'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { useLockbox } from '@/providers/LockboxProvider'
import { useNotes } from '@/providers/NotesProvider'
import styles from './LockboxUnlockOverlay.module.scss'

export function LockboxUnlockOverlay() {
  const lockbox = useLockbox()
  const { lockboxes } = useNotes()
  const prompt = lockbox.unlockPrompt
  const meta = lockboxes.find((l) => l.id === prompt?.lockboxId)
  const shouldShow =
    Boolean(prompt?.lockboxId) && !lockbox.isUnlocked(prompt?.lockboxId)
  const enrollment = prompt?.lockboxId
    ? lockbox.biometrics.enrollments?.[prompt.lockboxId]
    : null
  const capability = lockbox.biometrics?.capability
  const bioLoading = Boolean(lockbox.biometrics?.loading)
  const bioAvailable = Boolean(capability?.available && enrollment)
  const bioLabel = capability?.label || 'biometrics'

  return (
    <Modal
      open={shouldShow}
      onDismiss={lockbox.dismissUnlock}
      dismissible={prompt?.dismissible ?? true}
      title={meta ? `Unlock ${meta.name}` : 'Unlock lockbox'}
    >
      {shouldShow && (
        <UnlockOverlayBody
          // Remount when bio becomes available so we don't stick on
          // passphrase mode from the loading race.
          key={`${prompt.lockboxId}:${bioAvailable ? 'bio' : 'pass'}`}
          lockboxId={prompt.lockboxId}
          hint={meta?.hint}
          bioAvailable={bioAvailable}
          bioLoading={bioLoading}
          bioLabel={bioLabel}
          unlock={lockbox.unlock}
          unlockWithBiometrics={lockbox.unlockWithBiometrics}
        />
      )}
    </Modal>
  )
}

function UnlockOverlayBody({
  lockboxId,
  hint,
  bioAvailable,
  bioLoading,
  bioLabel,
  unlock,
  unlockWithBiometrics,
}) {
  const [mode, setMode] = useState(bioAvailable ? 'bio' : 'passphrase')
  const [passphrase, setPassphrase] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const unlockBioRef = useRef(unlockWithBiometrics)

  useEffect(() => {
    unlockBioRef.current = unlockWithBiometrics
  }, [unlockWithBiometrics])

  // After lock, always auto-prompt biometrics when enrolled. Debounce so
  // React Strict Mode's effect re-run doesn't start two WebAuthn gets.
  useEffect(() => {
    if (!bioAvailable || mode !== 'bio') return
    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled) return
      ;(async () => {
        setPending(true)
        setError(null)
        try {
          await unlockBioRef.current(lockboxId)
        } catch (err) {
          if (!cancelled) {
            const msg = err?.message ?? String(err)
            const cancelledByUser =
              /cancel|not allowed|abort/i.test(msg) ||
              err?.name === 'NotAllowedError'
            setError(
              cancelledByUser
                ? 'Biometric unlock cancelled. Try again or use your passphrase.'
                : msg,
            )
            // Stay on bio so the user can retry; passphrase is opt-in.
          }
        } finally {
          if (!cancelled) setPending(false)
        }
      })()
    }, 100)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [bioAvailable, mode, lockboxId])

  async function handleBioClick() {
    if (pending) return
    setPending(true)
    setError(null)
    try {
      await unlockWithBiometrics(lockboxId)
    } catch (err) {
      const msg = err?.message ?? String(err)
      const cancelledByUser =
        /cancel|not allowed|abort/i.test(msg) || err?.name === 'NotAllowedError'
      setError(
        cancelledByUser
          ? 'Biometric unlock cancelled. Try again or use your passphrase.'
          : msg,
      )
    } finally {
      setPending(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (pending) return
    setPending(true)
    setError(null)
    try {
      await unlock(lockboxId, passphrase)
      setPassphrase('')
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  if (bioLoading && !bioAvailable) {
    return (
      <div className={styles.bioPanel}>
        <p className={styles.intro}>Checking biometrics…</p>
        <Loader2 size={16} className={styles.spin} />
      </div>
    )
  }

  if (mode === 'bio' && bioAvailable) {
    return (
      <div className={styles.bioPanel}>
        <p className={styles.intro}>
          Confirm it&apos;s you to unlock this lockbox on this device.
        </p>
        <Button fullWidth onClick={handleBioClick} disabled={pending}>
          {pending ? (
            <Loader2 size={14} className={styles.spin} />
          ) : (
            <Fingerprint size={14} />
          )}
          Unlock with {bioLabel}
        </Button>
        <button
          type="button"
          className={styles.passphraseLink}
          onClick={() => {
            setMode('passphrase')
            setError(null)
          }}
          disabled={pending}
        >
          Use passphrase instead
        </button>
        {error && <p className={styles.bioError}>{error}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className={styles.intro}>
        Enter the passphrase for this lockbox to decrypt protected notes.
      </p>
      {hint && <p className={styles.intro}>Hint: {hint}</p>}
      {error && <p className={styles.bioError}>{error}</p>}
      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Label htmlFor="lockbox-pass">Passphrase</Label>
        <Input
          id="lockbox-pass"
          type="password"
          autoComplete="current-password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          autoFocus={!pending}
          disabled={pending}
        />
      </div>
      <Button type="submit" fullWidth disabled={pending || !passphrase}>
        {pending ? 'Unlocking…' : 'Unlock'}
      </Button>
      {bioAvailable && (
        <button
          type="button"
          className={styles.passphraseLink}
          onClick={() => {
            setMode('bio')
            setError(null)
          }}
          disabled={pending}
        >
          Use {bioLabel} instead
        </button>
      )}
    </form>
  )
}
