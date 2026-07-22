import { ArrowLeft, ArrowLeftRight, Shield } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useNavigation } from '@/providers/NavigationProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import styles from './Settings.module.scss'

export function Settings() {
  const { goBack, previousRouteLabel, navigate } = useNavigation()
  const vault = usePatientVault()

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
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Account and vault options.</p>
        </div>
      </div>

      <ul className={styles.cards}>
        {vault.isUnlocked && (
          <>
            <SettingsCard
              icon={Shield}
              title="Vault security"
              description="Passphrase hint and biometric unlock"
              onClick={() => navigate('vault-security')}
            />
            <SettingsCard
              icon={ArrowLeftRight}
              title="Import / Export"
              description="JSON datafeeds for patient records"
              onClick={() => navigate('datafeed-settings')}
            />
          </>
        )}
      </ul>
    </div>
  )
}

function SettingsCard({ icon: Icon, title, description, onClick }) {
  return (
    <li className={styles.cardItem}>
      <button type="button" className={styles.card} onClick={onClick}>
        <span className={styles.cardIcon} aria-hidden="true">
          <Icon size={18} />
        </span>
        <span className={styles.cardBody}>
          <span className={styles.cardTitle}>{title}</span>
          <span className={styles.cardDescription}>{description}</span>
        </span>
      </button>
    </li>
  )
}
