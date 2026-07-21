import { useEffect, useRef, useState } from 'react'
import { Fingerprint, Loader2 } from 'lucide-react'
import { Modal } from '@/patterns/Modal'
import { Button } from '@/molecules/Button'
import { UnlockForm } from '@/pages/VaultUnlock'
import { useVault } from '@/providers/VaultProvider'
import { needsBiometricPrompt } from '@/lib/biometrics'
import styles from './VaultUnlockOverlay.module.scss'

// Global overlay driven by `vault.unlockPrompt`. Mounted once at the
// AppShell root so it can appear over any page without pushing the router.
export function VaultUnlockOverlay() {
  const vault = useVault()
  const prompt = vault.unlockPrompt
  const shouldShow = Boolean(prompt) && vault.isLocked
  const enrollment = vault.biometrics?.enrollment
  const capability = vault.biometrics?.capability
  const bioAvailable = Boolean(capability?.available && enrollment)
  const bioLabel = capability?.label || 'biometrics'

  return (
    <Modal
      open={shouldShow}
      onDismiss={vault.dismissUnlock}
      dismissible={prompt?.dismissible ?? true}
      title="Unlock your vault"
    >
      {shouldShow && (
        <UnlockOverlayBody
          key={bioAvailable ? 'bio' : 'pass'}
          bioAvailable={bioAvailable}
          bioLabel={bioLabel}
          enrollment={enrollment}
          unlockWithBiometrics={vault.unlockWithBiometrics}
        />
      )}
    </Modal>
  )
}

function UnlockOverlayBody({
  bioAvailable,
  bioLabel,
  enrollment,
  unlockWithBiometrics,
}) {
  const [mode, setMode] = useState(bioAvailable ? 'bio' : 'passphrase')
  const [bioPending, setBioPending] = useState(false)
  const [bioError, setBioError] = useState(null)
  const autoTriedRef = useRef(false)

  useEffect(() => {
    if (!bioAvailable || mode !== 'bio') return
    if (!needsBiometricPrompt(enrollment)) return
    if (autoTriedRef.current) return
    autoTriedRef.current = true
    let cancelled = false
    ;(async () => {
      setBioPending(true)
      setBioError(null)
      try {
        await unlockWithBiometrics()
      } catch (err) {
        if (!cancelled) {
          const msg = err?.message ?? String(err)
          const cancelledByUser =
            /cancel|not allowed|abort/i.test(msg) ||
            err?.name === 'NotAllowedError'
          setBioError(
            cancelledByUser
              ? 'Biometric unlock cancelled. Enter your master passphrase.'
              : msg,
          )
          setMode('passphrase')
        }
      } finally {
        if (!cancelled) setBioPending(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [bioAvailable, mode, enrollment, unlockWithBiometrics])

  async function handleBioClick() {
    if (bioPending) return
    setBioPending(true)
    setBioError(null)
    try {
      await unlockWithBiometrics()
    } catch (err) {
      const msg = err?.message ?? String(err)
      const cancelledByUser =
        /cancel|not allowed|abort/i.test(msg) || err?.name === 'NotAllowedError'
      setBioError(
        cancelledByUser
          ? 'Biometric unlock cancelled. Enter your master passphrase.'
          : msg,
      )
      setMode('passphrase')
    } finally {
      setBioPending(false)
    }
  }

  if (mode === 'bio' && bioAvailable) {
    return (
      <div className={styles.bioPanel}>
        <p className={styles.intro}>
          Confirm it&apos;s you to unlock credentials on this device.
        </p>
        <Button fullWidth onClick={handleBioClick} disabled={bioPending}>
          {bioPending ? (
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
            setBioError(null)
          }}
          disabled={bioPending}
        >
          Use master passphrase instead
        </button>
        {bioError && <p className={styles.bioError}>{bioError}</p>}
      </div>
    )
  }

  return (
    <>
      <p className={styles.intro}>
        Enter your master passphrase to decrypt your credentials on this
        device.
      </p>
      {bioError && <p className={styles.bioError}>{bioError}</p>}
      <UnlockForm autoFocus={!bioPending} />
      {bioAvailable && (
        <button
          type="button"
          className={styles.passphraseLink}
          onClick={() => {
            setMode('bio')
            setBioError(null)
          }}
        >
          Unlock with {bioLabel}
        </button>
      )}
    </>
  )
}
