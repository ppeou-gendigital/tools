import { useNavigation } from '@/providers/NavigationProvider'
import { OfflineCreditCards } from './OfflineCreditCards'
import { OfflineCredentials } from './OfflineCredentials'
import { OfflineHome } from './OfflineHome'

export function OfflineRouter() {
  const { route } = useNavigation()
  if (route === 'credentials' || route === 'credential-edit') {
    return <OfflineCredentials />
  }
  if (route === 'credit-cards' || route === 'credit-card-edit') {
    return <OfflineCreditCards />
  }
  return <OfflineHome />
}
