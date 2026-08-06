import { Divider } from '@tools/ui'
import {
  AppearanceRow,
  MenuPanel as ToolsMenuPanel,
} from '@tools/behavioral'
import { Summary } from 'lucide-react'
import { APP_VERSION } from '@/env'
import { AccountRow } from '@/patterns/AccountRow'
import { AppNavItems } from '@/patterns/AppNavItems'
import styles from './MenuPanel.module.scss'

const TOOL_NAME = 'Jira Capacity'

export function MenuPanel({
  corner,
  edgeX,
  edgeY,
  fabLeft,
  fabTop,
  onClose,
}) {
  return (
    <ToolsMenuPanel
      corner={corner}
      edgeX={edgeX}
      edgeY={edgeY}
      fabLeft={fabLeft}
      fabTop={fabTop}
      onClose={onClose}
      brandConfig={{ name: TOOL_NAME, icon: Summary, logoAlt: TOOL_NAME }}
      version={APP_VERSION}
    >
      <div className={styles.toolsRow}>
        <AppearanceRow onClose={onClose} />
        <AccountRow onClose={onClose} />
      </div>
      <Divider />
      <AppNavItems onClose={onClose} />
    </ToolsMenuPanel>
  )
}
