import { ArrowLeft, KeyRound } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useNavigation } from '@/providers/NavigationProvider'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { labelForIdleTimeoutMs } from '@/lib/vaultIdleOptions'
import styles from './Settings.module.scss'

// Settings page-group landing. Renders a card list of sub-pages so the
// group can grow without adding depth to the FAB menu. Each sub-page
// owns its own back button which returns here rather than jumping
// straight home.
export function Settings() {
  const { goBack, previousRouteLabel, goVaultSettings } = useNavigation()
  const { user } = useAuth()
  const vault = useVault()

  // Only show the Vault card once the user is signed in AND has set
  // up a vault at least once — before that the settings would apply
  // to nothing.
  const showVaultCard = !!user && !vault.needsSetup && !vault.isLoading

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
          <p className={styles.subtitle}>Manage your tool preferences.</p>
        </div>
      </div>

      <ul className={styles.cards}>
        {showVaultCard && (
          <SettingsCard
            icon={KeyRound}
            title="Vault"
            description={
              vault.idleTimeoutMs
                ? `Auto-lock after ${labelForIdleTimeoutMs(vault.idleTimeoutMs)} of inactivity.`
                : 'Auto-lock and passphrase settings.'
            }
            onClick={goVaultSettings}
          />
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
