import { useAuth } from '@/providers/AuthProvider'
import { Divider } from '@/molecules/Divider'
import { AboutRow } from '@/patterns/AboutRow'
import { AccountRow } from '@/patterns/AccountRow'
import { AppearanceRow } from '@/patterns/AppearanceRow'
import { DeckDemoItem } from '@/patterns/DeckDemoItem'
import { DevBadgeItem } from '@/patterns/DevBadgeItem'
import styles from './MenuPanel.module.scss'

const VERSION = '0.1.0'
const TOOL_NAME = 'TOOLNAME'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const signedIn = !!user

  return (
    <div role="menu" className={styles.panel} data-corner={corner}>
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      <Divider />
      <DeckDemoItem onClose={onClose} />
      <DevBadgeItem />
      <AboutRow name={TOOL_NAME} version={VERSION} />
    </div>
  )
}
