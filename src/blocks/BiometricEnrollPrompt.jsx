import { useEffect, useState } from 'react'
import { Fingerprint, Loader2, X } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useVault } from '@/providers/VaultProvider'
import { asyncStorage } from '@/lib/storage'
import { useAuth } from '@/providers/AuthProvider'
import { BIO_PRF_UNAVAILABLE_MESSAGE } from '@/lib/biometrics'
import styles from './BiometricEnrollPrompt.module.scss'

const DISMISS_KEY_PREFIX = 'accesso.vault.bioEnrollDismissed.'
const PRF_FAIL_KEY_PREFIX = 'accesso.vault.bioPrfUnsupported.'

function isPrfError(message) {
  return (
    message === BIO_PRF_UNAVAILABLE_MESSAGE || /PRF key/i.test(message ?? '')
  )
}

// Soft prompt after unlock when biometrics are available but not enrolled.
export function BiometricEnrollPrompt() {
  const { user } = useAuth()
  const vault = useVault()
  const userId = user?.id ?? null
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [unavailable, setUnavailable] = useState(false)

  const capability = vault.biometrics?.capability
  const enrollment = vault.biometrics?.enrollment
  const bioLoading = vault.biometrics?.loading

  useEffect(() => {
    let cancelled = false
    async function check() {
      if (!userId || !vault.isUnlocked || bioLoading) {
        setOpen(false)
        return
      }
      if (enrollment) {
        setOpen(false)
        return
      }
      try {
        const [dismissed, prfFailed] = await Promise.all([
          asyncStorage.getItem(`${DISMISS_KEY_PREFIX}${userId}`),
          asyncStorage.getItem(`${PRF_FAIL_KEY_PREFIX}${userId}`),
        ])
        if (cancelled) return
        if (prfFailed === '1') {
          setOpen(false)
          return
        }
        if (!capability?.available) {
          setOpen(false)
          return
        }
        setOpen(dismissed !== '1')
      } catch {
        if (!cancelled) setOpen(Boolean(capability?.available))
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [
    userId,
    vault.isUnlocked,
    bioLoading,
    capability?.available,
    enrollment,
  ])

  async function dismissPermanently() {
    if (userId) {
      await asyncStorage.setItem(`${DISMISS_KEY_PREFIX}${userId}`, '1')
    }
    setOpen(false)
    setError(null)
    setUnavailable(false)
  }

  async function handleEnable() {
    if (pending || unavailable) return
    setPending(true)
    setError(null)
    try {
      await vault.enrollBiometrics()
      if (userId) {
        await asyncStorage.removeItem(`${DISMISS_KEY_PREFIX}${userId}`)
      }
      setOpen(false)
    } catch (err) {
      const msg = err?.message ?? String(err)
      setError(msg)
      if (isPrfError(msg)) {
        setUnavailable(true)
        if (userId) {
          await asyncStorage.setItem(`${PRF_FAIL_KEY_PREFIX}${userId}`, '1')
        }
      }
    } finally {
      setPending(false)
    }
  }

  if (!open) return null

  const label = capability?.label || 'biometrics'
  const showUnavailable = unavailable || isPrfError(error)
  const message = error || BIO_PRF_UNAVAILABLE_MESSAGE

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-label={
        showUnavailable
          ? 'Biometric unlock unavailable'
          : 'Enable biometric unlock'
      }
    >
      <button
        type="button"
        className={styles.close}
        onClick={() => {
          if (showUnavailable) dismissPermanently()
          else setOpen(false)
        }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
      <div className={styles.icon} aria-hidden="true">
        <Fingerprint size={18} />
      </div>
      <div className={styles.body}>
        <p className={styles.title}>
          {showUnavailable
            ? 'Biometric unlock unavailable'
            : 'Unlock faster next time?'}
        </p>
        <p className={styles.text}>
          {showUnavailable
            ? message
            : `Use ${label} on this device. Your master passphrase is still required on new devices.`}
        </p>
        {!showUnavailable && error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          {showUnavailable ? (
            <Button size="sm" onClick={dismissPermanently}>
              Got it
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={handleEnable} disabled={pending}>
                {pending ? (
                  <Loader2 size={14} className={styles.spin} />
                ) : (
                  <Fingerprint size={14} />
                )}
                Enable
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={dismissPermanently}
                disabled={pending}
              >
                Not now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
