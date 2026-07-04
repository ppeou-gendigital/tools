import { ArrowLeft, ChevronRight, Filter, History, Server } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Settings.module.scss'

// Settings page-group landing. Renders a card list of sub-pages so the
// group can grow (profile prefs, sync controls, etc.) without adding
// depth to the FAB menu. Each sub-page owns its own back button which
// returns here rather than jumping straight home.
export function Settings() {
  const {
    goBack,
    previousRouteLabel,
    goSettingsAemEnvironments,
    goSettingsTrackedHosts,
    goVisitedUrls,
  } = useNavigation()

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
        <SettingsCard
          icon={Filter}
          title="Tracked hosts"
          description="Wildcard rules that decide which tabs get recorded to your visit history."
          onClick={goSettingsTrackedHosts}
        />
        <SettingsCard
          icon={History}
          title="Visited URLs"
          description="Browse pages you've opened on your tracked hosts."
          onClick={goVisitedUrls}
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
