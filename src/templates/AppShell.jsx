import { FloatingMenu } from '@/blocks/FloatingMenu'
import styles from './AppShell.module.scss'

export function AppShell({ children }) {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>{children}</main>
      <FloatingMenu />
    </div>
  )
}
