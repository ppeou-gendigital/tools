import { AboutRow, Divider } from '@tools/ui'
import {
  AppearanceRow,
  DevBadgeItem,
  MenuPanel as ToolsMenuPanel,
} from '@tools/behavioral'
import { useAuth } from '@tools/service'
import { APP_VERSION, devAutoLoginConfig } from '@/env'
import { AccountRow } from '@/patterns/AccountRow'
import { AemJumpItem } from '@/patterns/AemJumpItem'
import { FavLinksItem } from '@/patterns/FavLinksItem'
import { LandingItem } from '@/patterns/LandingItem'
import { ProjectSiteItem } from '@/patterns/ProjectSiteItem'
import { SiteTreeItem } from '@/patterns/SiteTreeItem'
import { TrackThisSiteItem } from '@/patterns/TrackThisSiteItem'
import { VisitedUrlsItem } from '@/patterns/VisitedUrlsItem'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const signedIn = !!user
  const dev = devAutoLoginConfig()

  return (
    <ToolsMenuPanel
      corner={corner}
      onClose={onClose}
      footer={
        <>
          <DevBadgeItem email={dev?.email} />
          <AboutRow name="Loopy" version={APP_VERSION} />
        </>
      }
    >
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
    </ToolsMenuPanel>
  )
}
