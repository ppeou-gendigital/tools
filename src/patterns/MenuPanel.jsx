import { Repeat } from 'lucide-react'
import { Divider } from '@tools/ui'
import {
  AppearanceRow,
  DevBadgeItem,
  MenuPanel as ToolsMenuPanel,
} from '@tools/behavioral'
import { useAuth } from '@tools/service'
import { APP_VERSION, devAutoLoginConfig } from '@/env'
import { AccountRow } from '@/patterns/AccountRow'
import { AemEdsUeItem } from '@/patterns/AemEdsUeItem'
import { AemJumpItem } from '@/patterns/AemJumpItem'
import { FavLinksItem } from '@/patterns/FavLinksItem'
import { LandingItem } from '@/patterns/LandingItem'
import { ProjectSiteItem } from '@/patterns/ProjectSiteItem'
import { SiteTreeItem } from '@/patterns/SiteTreeItem'
import { TrackThisSiteItem } from '@/patterns/TrackThisSiteItem'
import { VisitedUrlsItem } from '@/patterns/VisitedUrlsItem'

const TOOL_NAME = 'Loopy'

export function MenuPanel({
  corner,
  edgeX,
  edgeY,
  fabLeft,
  fabTop,
  onClose,
}) {
  const { user } = useAuth()
  const signedIn = !!user
  const dev = devAutoLoginConfig()

  return (
    <ToolsMenuPanel
      corner={corner}
      edgeX={edgeX}
      edgeY={edgeY}
      fabLeft={fabLeft}
      fabTop={fabTop}
      onClose={onClose}
      brandConfig={{ name: TOOL_NAME, icon: Repeat, logoAlt: TOOL_NAME }}
      version={APP_VERSION}
      footer={<DevBadgeItem email={dev?.email} />}
    >
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      <Divider />
      <LandingItem onClose={onClose} />
      <AemJumpItem onClose={onClose} />
      <AemEdsUeItem onClose={onClose} />
      <TrackThisSiteItem onClose={onClose} />
      <VisitedUrlsItem onClose={onClose} />
      <SiteTreeItem onClose={onClose} />
      <FavLinksItem onClose={onClose} />
      <ProjectSiteItem onClose={onClose} />
    </ToolsMenuPanel>
  )
}
