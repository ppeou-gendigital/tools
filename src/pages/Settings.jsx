import { ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Settings.module.scss'

export function Settings() {
  const { goBack, previousRouteLabel, goLockboxes } = useNavigation()

  return (
    <div className={styles.page}>
      <PageHeader
        title="Settings"
        subtitle="App preferences and shortcuts."
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className={styles.back}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        shortcuts={
          <PageShortcuts current="settings" className={styles.iconBtn} />
        }
      />

      <ul className={styles.cards}>
        <SettingsCard
          icon={Lock}
          title="Lockboxes"
          description="Passphrases, biometrics, and notebook protection."
          onClick={goLockboxes}
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
      </button>
    </li>
  )
}
