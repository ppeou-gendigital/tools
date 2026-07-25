import {
  Archive,
  CircleDollarSign,
  ListChecks,
  ListMusic,
  MapPin,
  PlaneTakeoff,
  UserRound,
  Users,
} from 'lucide-react'
import { Divider, MenuRow } from '@tools/ui'
import {
  AppearanceRow,
  DevBadgeItem,
  MenuPanel as ToolsMenuPanel,
  MenuSectionLabel,
} from '@tools/behavioral'
import { useAuth } from '@tools/service'
import { APP_VERSION, devAutoLoginConfig } from '@/env'
import { useNavigation } from '@/providers/NavigationProvider'
import { AccountRow } from '@/patterns/AccountRow'
import { AppNavItems } from '@/patterns/AppNavItems'

const TOOL_NAME = 'Viaggio'

const JOURNEY_ROUTES = new Set([
  'journey',
  'entry-edit',
  'expense-edit',
  'members',
  'spending',
  'playlist',
  'todos',
  'map',
  'journey-settings',
])

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const nav = useNavigation()
  const signedIn = !!user
  const journeyId = nav.params?.journeyId
  const inJourney = signedIn && journeyId && JOURNEY_ROUTES.has(nav.route)
  const dev = devAutoLoginConfig()

  return (
    <ToolsMenuPanel
      corner={corner}
      onClose={onClose}
      brandConfig={{ name: TOOL_NAME, icon: PlaneTakeoff, logoAlt: TOOL_NAME }}
      version={APP_VERSION}
      footer={<DevBadgeItem email={dev?.email} />}
    >
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      {inJourney && (
        <>
          <Divider />
          <MenuSectionLabel>This journey</MenuSectionLabel>
          <MenuRow
            icon={Users}
            label="Travelers"
            onClose={onClose}
            onClick={() => nav.goMembers(journeyId)}
          />
          <MenuRow
            icon={CircleDollarSign}
            label="Spending"
            onClose={onClose}
            onClick={() => nav.goSpending(journeyId)}
          />
          <MenuRow
            icon={ListMusic}
            label="Playlist"
            onClose={onClose}
            onClick={() => nav.goPlaylist(journeyId)}
          />
          <MenuRow
            icon={ListChecks}
            label="To-dos"
            onClose={onClose}
            onClick={() => nav.goTodos(journeyId)}
          />
          <MenuRow
            icon={MapPin}
            label="Map"
            onClose={onClose}
            onClick={() => nav.goMap(journeyId)}
          />
        </>
      )}
      {signedIn && (
        <>
          <Divider />
          <MenuSectionLabel>App</MenuSectionLabel>
          <AppNavItems onClose={onClose} />
          <MenuRow
            icon={UserRound}
            label="People"
            onClose={onClose}
            onClick={nav.goPeople}
          />
          <MenuRow
            icon={Archive}
            label="Archives"
            onClose={onClose}
            onClick={nav.goArchives}
          />
        </>
      )}
    </ToolsMenuPanel>
  )
}
