import { ArrowLeftRight, KeyRound } from 'lucide-react'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { labelForIdleTimeoutMs } from '@/lib/vaultIdleOptions'
import styles from './Settings.module.scss'

// Settings page-group landing. Renders a card list of sub-pages so the
// group can grow without adding depth to the FAB menu. Sub-pages are
// reached by tapping a card; navigation back out lives in the app
// toolbar / FAB.
export function Settings() {
  const { goVaultSettings, goDatafeedSettings } = useNavigation()
  const { user } = useAuth()
  const vault = useVault()

  // Only show the Vault card once the user is signed in AND has set
  // up a vault at least once — before that the settings would apply
  // to nothing.
  const showVaultCard = !!user && !vault.needsSetup && !vault.isLoading

  return (
    <div className={styles.page}>
      <PageHeader title="Settings" subtitle="Manage your tool preferences." />

      <ul className={styles.cards}>
        {showVaultCard && (
          <SettingsCard
            icon={KeyRound}
            title="Vault"
            description={
              vault.idleTimeoutMs
                ? `Auto-lock after ${labelForIdleTimeoutMs(vault.idleTimeoutMs)}. Hint & passphrase.`
                : 'Auto-lock, hint, and passphrase settings.'
            }
            onClick={goVaultSettings}
          />
        )}
        {showVaultCard && (
          <SettingsCard
            icon={ArrowLeftRight}
            title="Import / Export"
            description="JSON datafeeds for credentials and credit cards."
            onClick={goDatafeedSettings}
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
