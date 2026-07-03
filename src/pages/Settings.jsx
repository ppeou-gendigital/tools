import { ArrowLeft, ChevronRight, Server } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Settings.module.scss'

// Settings page-group landing. Renders a card list of sub-pages so the
// group can grow (profile prefs, sync controls, etc.) without adding
// depth to the FAB menu. Each sub-page owns its own back button which
// returns here rather than jumping straight home.
export function Settings() {
  const { goHome, goSettingsAemEnvironments } = useNavigation()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onClick={goHome}
          className={styles.back}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Home
        </Button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Configure and personalize Loopy.</p>
        </div>
      </div>

      <ul className={styles.cards}>
        <SettingsCard
          icon={Server}
          title="AEM Environments"
          description="Manage the AEM domains that power the AEM Jump page."
          onClick={goSettingsAemEnvironments}
        />
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
        <ChevronRight size={16} aria-hidden="true" className={styles.cardChevron} />
      </button>
    </li>
  )
}
