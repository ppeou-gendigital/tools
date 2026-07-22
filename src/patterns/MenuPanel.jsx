import { useAuth } from '@/providers/AuthProvider'
import { APP_VERSION } from '@/env'
import { Divider } from '@/molecules/Divider'
import { Logo } from '@/molecules/Logo'
import { AboutRow } from '@/patterns/AboutRow'
import { AccountRow } from '@/patterns/AccountRow'
import { AppearanceRow } from '@/patterns/AppearanceRow'
import { DeckDemoItem } from '@/patterns/DeckDemoItem'
import { RichTextDemoItem } from '@/patterns/RichTextDemoItem'
import { DevBadgeItem } from '@/patterns/DevBadgeItem'
import styles from './MenuPanel.module.scss'

const TOOL_NAME = 'TOOLNAME'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const signedIn = !!user

  return (
    <div role="menu" className={styles.panel} data-corner={corner}>
      <div className={styles.brand}>
        <Logo size={28} alt={TOOL_NAME} />
        <span className={styles.brandName}>{TOOL_NAME}</span>
      </div>
      <Divider />
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      <Divider />
      <DeckDemoItem onClose={onClose} />
      <RichTextDemoItem onClose={onClose} />
      <DevBadgeItem />
      <AboutRow name={TOOL_NAME} version={APP_VERSION} />
    </div>
  )
}
