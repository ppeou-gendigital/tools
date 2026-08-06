import {
  Columns3,
  FileBarChart2,
  FolderKanban,
  ListChecks,
  Tags,
  Users,
  CircleDot,
  CheckCircle2,
  UserRound,
} from 'lucide-react'
import {
  AppNavItems as ToolsAppNavItems,
  MenuSectionLabel,
} from '@tools/behavioral'
import { useNavigation } from '@/providers/NavigationProvider'

export const APP_NAV = [
  { id: 'profiles', label: 'Profiles', icon: UserRound, go: 'goProfiles' },
  { id: 'report', label: 'Report', icon: FileBarChart2, go: 'goReport' },
  { id: 'sprints', label: 'Sprints', icon: ListChecks, go: 'goSprints' },
  { id: 'columns', label: 'Columns', icon: Columns3, go: 'goColumns' },
  { id: 'users', label: 'Users', icon: Users, go: 'goUsers' },
  { id: 'issue-type', label: 'Type', icon: Tags, go: 'goIssueType' },
  { id: 'issue-status', label: 'Status', icon: CircleDot, go: 'goIssueStatus' },
  {
    id: 'resolutions',
    label: 'Resolutions',
    icon: CheckCircle2,
    go: 'goResolutions',
  },
  { id: 'projects', label: 'Projects', icon: FolderKanban, go: 'goProjects' },
]

const HOME_IDS = new Set(['profiles'])

function toItems(defs, nav) {
  return defs.map(({ id, label, icon, go }) => ({
    id,
    label,
    icon,
    onClick: nav[go],
  }))
}

export function AppNavItems({ onClose }) {
  const nav = useNavigation()
  const { route } = nav
  const home = APP_NAV.filter((item) => HOME_IDS.has(item.id))
  const workspace = APP_NAV.filter((item) => !HOME_IDS.has(item.id))

  return (
    <>
      <MenuSectionLabel>Home</MenuSectionLabel>
      <ToolsAppNavItems
        items={toItems(home, nav)}
        onClose={onClose}
        activeId={route}
      />
      <MenuSectionLabel>Workspace</MenuSectionLabel>
      <ToolsAppNavItems
        items={toItems(workspace, nav)}
        onClose={onClose}
        activeId={route}
      />
    </>
  )
}
