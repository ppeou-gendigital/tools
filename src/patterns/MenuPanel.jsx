import { useAuth } from '@/providers/AuthProvider'
import { Divider } from '@/molecules/Divider'
import { AboutRow } from '@/patterns/AboutRow'
import { AemJumpItem } from '@/patterns/AemJumpItem'
import { DeckTestItem } from '@/patterns/DeckTestItem'
import { DevBadgeItem } from '@/patterns/DevBadgeItem'
import { FontSizeRow } from '@/patterns/FontSizeRow'
import { ProfileItem } from '@/patterns/ProfileItem'
import { ProjectSiteItem } from '@/patterns/ProjectSiteItem'
import { SettingsItem } from '@/patterns/SettingsItem'
import { SignOutItem } from '@/patterns/SignOutItem'
import { ThemeItem } from '@/patterns/ThemeItem'
import styles from './MenuPanel.module.scss'

const VERSION = '0.1.0'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const signedIn = !!user

  return (
    <div role="menu" className={styles.panel} data-corner={corner}>
      <ThemeItem onClose={onClose} />
      <FontSizeRow />
      {signedIn && <Divider />}
      {signedIn && <ProfileItem onClose={onClose} />}
      {signedIn && <SettingsItem onClose={onClose} />}
      {signedIn && <SignOutItem onClose={onClose} />}
      <Divider />
      <AemJumpItem onClose={onClose} />
      <DeckTestItem onClose={onClose} />
      <ProjectSiteItem onClose={onClose} />
      <DevBadgeItem />
      <AboutRow version={VERSION} />
    </div>
  )
}
