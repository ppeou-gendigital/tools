import { ArrowLeft } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Settings.module.scss'

// Settings page-group landing. Renders a card list of sub-pages so the
// group can grow without adding depth to the FAB menu. Each sub-page
// owns its own back button which returns here rather than jumping
// straight home.
//
// Template: no sub-pages ship out of the box. Add your own by importing
// an icon and calling `<SettingsCard ... />` below (and register the
// route in NavigationProvider).
export function Settings() {
  const { goBack, previousRouteLabel } = useNavigation()

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
          <p className={styles.subtitle}>Add sub-pages here as your tool grows.</p>
        </div>
      </div>

      <ul className={styles.cards}>
        {/* Example:
        <SettingsCard
          icon={Server}
          title="My section"
          description="Describe the sub-page."
          onClick={() => navigate('my-route')}
        />
        */}
      </ul>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
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
