import { useAuth } from '@/providers/AuthProvider'
import { Divider } from '@/molecules/Divider'
import { AboutRow } from '@/patterns/AboutRow'
import { AccountRow } from '@/patterns/AccountRow'
import { AemJumpItem } from '@/patterns/AemJumpItem'
import { AppearanceRow } from '@/patterns/AppearanceRow'
import { DevBadgeItem } from '@/patterns/DevBadgeItem'
import { FavLinksItem } from '@/patterns/FavLinksItem'
import { LandingItem } from '@/patterns/LandingItem'
import { ProjectSiteItem } from '@/patterns/ProjectSiteItem'
import { SiteTreeItem } from '@/patterns/SiteTreeItem'
import { TrackThisSiteItem } from '@/patterns/TrackThisSiteItem'
import { VisitedUrlsItem } from '@/patterns/VisitedUrlsItem'
import styles from './MenuPanel.module.scss'

const VERSION = '0.1.0'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const signedIn = !!user

  return (
    <div role="menu" className={styles.panel} data-corner={corner}>
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      <Divider />
      <LandingItem onClose={onClose} />
      <AemJumpItem onClose={onClose} />
      <TrackThisSiteItem onClose={onClose} />
      <VisitedUrlsItem onClose={onClose} />
      <SiteTreeItem onClose={onClose} />
      <FavLinksItem onClose={onClose} />
      <ProjectSiteItem onClose={onClose} />
      <DevBadgeItem />
      <AboutRow version={VERSION} />
    </div>
  )
}
