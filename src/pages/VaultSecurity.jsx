import { useId, useState } from 'react'
import { ArrowLeft, ArrowLeftRight, Fingerprint, KeyRound } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { useNavigation } from '@/providers/NavigationProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { PASSPHRASE_HINT_MAX_LENGTH } from '@/lib/prefs'
import styles from './Settings.module.scss'
import section from './SectionPage.module.scss'

export function VaultSecurity() {
  const { goBack, previousRouteLabel, goDatafeedSettings } = useNavigation()
  const vault = usePatientVault()
  const hintId = useId()
  const [hintDraft, setHintDraft] = useState(vault.hint ?? '')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)

  const capability = vault.biometrics?.capability
  const enrollment = vault.biometrics?.enrollment
  const bioLabel = capability?.label || 'biometrics'

  async function saveHint(e) {
    e.preventDefault()
    setPending(true)
    setError(null)
    setMessage(null)
    try {
      await vault.updatePassphraseHint(hintDraft)
      setMessage('Hint saved.')
    } catch (err) {
      setError(err?.message ?? 'Could not save hint')
    } finally {
      setPending(false)
    }
  }

  async function toggleBiometrics() {
    setPending(true)
    setError(null)
    setMessage(null)
    try {
      if (enrollment) {
        await vault.disableBiometrics()
        setMessage('Biometric unlock turned off on this device.')
      } else {
        await vault.enrollBiometrics()
        setMessage(`${bioLabel} enabled on this device.`)
      }
    } catch (err) {
      setError(err?.message ?? 'Biometrics update failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className={styles.back}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {previousRouteLabel ?? 'Back'}
        </Button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Vault security</h1>
          <p className={styles.subtitle}>
            Passphrase hint and biometric unlock for this device.
          </p>
        </div>
      </div>

      <form className={section.form} onSubmit={saveHint}>
        <div className={styles.cardIcon} aria-hidden="true">
          <KeyRound size={18} />
        </div>
        <div className={section.field}>
          <Label htmlFor={hintId}>Passphrase hint</Label>
          <Input
            id={hintId}
            value={hintDraft}
            onChange={(e) => setHintDraft(e.target.value)}
            maxLength={PASSPHRASE_HINT_MAX_LENGTH}
            placeholder="Optional reminder"
            autoComplete="off"
          />
          <span className={section.muted}>
            Shown when unlocking. Never put the passphrase itself here.
          </span>
        </div>
        <Button type="submit" size="sm" disabled={pending}>
          Save hint
        </Button>
      </form>

      <div className={section.form}>
        <div className={styles.cardIcon} aria-hidden="true">
          <Fingerprint size={18} />
        </div>
        <p className={styles.cardTitle}>
          {enrollment ? `${bioLabel} is on` : `Unlock with ${bioLabel}`}
        </p>
        <p className={section.muted}>
          {capability?.available
            ? enrollment
              ? `Turn off to require your passphrase every time on this device.`
              : `Wrap your passphrase with ${bioLabel}. Still required on new devices.`
            : capability?.reason || 'Biometrics are not available here.'}
        </p>
        {capability?.available && (
          <Button
            type="button"
            size="sm"
            variant={enrollment ? 'outline' : 'default'}
            onClick={toggleBiometrics}
            disabled={pending}
          >
            <Fingerprint size={14} aria-hidden="true" />
            {enrollment ? 'Turn off biometrics' : `Enable ${bioLabel}`}
          </Button>
        )}
      </div>

      <div className={section.form}>
        <div className={styles.cardIcon} aria-hidden="true">
          <ArrowLeftRight size={18} />
        </div>
        <p className={styles.cardTitle}>Import / Export</p>
        <p className={section.muted}>
          Patient JSON datafeeds (export, import, and the contract for other
          systems) live under Settings → Import / Export.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={goDatafeedSettings}
        >
          <ArrowLeftRight size={14} aria-hidden="true" />
          Open Import / Export
        </Button>
      </div>

      {(message || error) && (
        <p className={error ? section.empty : section.muted}>
          {error || message}
        </p>
      )}
    </div>
  )
}
