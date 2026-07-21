import { useEffect, useState } from 'react'
import { Fingerprint, Loader2, X } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useVault } from '@/providers/VaultProvider'
import { asyncStorage } from '@/lib/storage'
import { useAuth } from '@/providers/AuthProvider'
import styles from './BiometricEnrollPrompt.module.scss'

const DISMISS_KEY_PREFIX = 'accesso.vault.bioEnrollDismissed.'

// Soft prompt after unlock when biometrics are available but not enrolled.
export function BiometricEnrollPrompt() {
  const { user } = useAuth()
  const vault = useVault()
  const userId = user?.id ?? null
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

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
      if (!capability?.available || enrollment) {
        setOpen(false)
        return
      }
      try {
        const dismissed = await asyncStorage.getItem(
          `${DISMISS_KEY_PREFIX}${userId}`,
        )
        if (!cancelled) setOpen(dismissed !== '1')
      } catch {
        if (!cancelled) setOpen(true)
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
  }

  async function handleEnable() {
    if (pending) return
    setPending(true)
    setError(null)
    try {
      await vault.enrollBiometrics()
      if (userId) {
        await asyncStorage.removeItem(`${DISMISS_KEY_PREFIX}${userId}`)
      }
      setOpen(false)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  if (!open) return null

  const label = capability?.label || 'biometrics'

  return (
    <div className={styles.banner} role="dialog" aria-label="Enable biometric unlock">
      <button
        type="button"
        className={styles.close}
        onClick={() => setOpen(false)}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
      <div className={styles.icon} aria-hidden="true">
        <Fingerprint size={18} />
      </div>
      <div className={styles.body}>
        <p className={styles.title}>Unlock faster next time?</p>
        <p className={styles.text}>
          Use {label} on this device. Your master passphrase is still required
          on new devices.
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
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
        </div>
      </div>
    </div>
  )
}
