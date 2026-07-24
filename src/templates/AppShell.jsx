import { FloatingMenu } from '@/blocks/FloatingMenu'
import { PlaylistPlaybackHost } from '@/patterns/PlaylistPlaybackHost'
import styles from './AppShell.module.scss'

export function AppShell({ children }) {
  return (
    <div className={styles.shell} data-app-shell>
      <main className={styles.main}>{children}</main>
      <PlaylistPlaybackHost />
      <FloatingMenu />
    </div>
  )
}
