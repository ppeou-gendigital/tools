import { FloatingMenu } from '@/blocks/FloatingMenu'
import { PlaylistPlaybackHost } from '@/patterns/PlaylistPlaybackHost'
import { useOfflineOptional } from '@/providers/OfflineProvider'
import styles from './AppShell.module.scss'

export function AppShell({ children }) {
  const offline = useOfflineOptional()
  const hideChrome =
    offline?.isOfflineMode || offline?.isOfflineEmpty

  return (
    <div className={styles.shell} data-app-shell>
      <main className={styles.main}>{children}</main>
      {!hideChrome && <PlaylistPlaybackHost />}
      {!hideChrome && <FloatingMenu />}
    </div>
  )
}
