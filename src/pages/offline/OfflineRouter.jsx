import { useNavigation } from '@/providers/NavigationProvider'
import { OfflineHydrate } from './OfflineHydrate'
import { OfflineHome } from './OfflineHome'
import { OfflineNoteView } from './OfflineNoteView'

export function OfflineRouter() {
  const { route } = useNavigation()

  return (
    <OfflineHydrate>
      {route === 'note-edit' ? <OfflineNoteView /> : <OfflineHome />}
    </OfflineHydrate>
  )
}
