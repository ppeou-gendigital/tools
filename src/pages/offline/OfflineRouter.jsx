import { useNavigation } from '@/providers/NavigationProvider'
import { OfflineHome } from './OfflineHome'
import { OfflineJourney } from './OfflineJourney'
import { OfflineMembers } from './OfflineMembers'
import { OfflinePlaces } from './OfflinePlaces'
import { OfflinePlaylist } from './OfflinePlaylist'
import { OfflineSpending } from './OfflineSpending'
import { OfflineTodos } from './OfflineTodos'

/** Read-only offline product path — similar layout, no mutations. */
export function OfflineRouter() {
  const { route } = useNavigation()
  if (route === 'journey') return <OfflineJourney />
  if (route === 'spending') return <OfflineSpending />
  if (route === 'todos') return <OfflineTodos />
  if (route === 'playlist') return <OfflinePlaylist />
  if (route === 'map') return <OfflinePlaces />
  if (route === 'members') return <OfflineMembers />
  return <OfflineHome />
}
