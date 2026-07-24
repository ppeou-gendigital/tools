import { FloatingMenu } from '@/blocks/FloatingMenu'
import { useOfflineOptional } from '@/providers/OfflineProvider'
import styles from './AppShell.module.scss'

export function AppShell({ children }) {
  const offline = useOfflineOptional()
  const hideChrome =
    offline?.isOfflineMode || offline?.isOfflineEmpty

  return (
    <div className={styles.shell}>
      <main className={styles.main}>{children}</main>
      {!hideChrome && <FloatingMenu />}
    </div>
  )
}
