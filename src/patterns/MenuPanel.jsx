import { Lock } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { APP_VERSION } from '@/env'
import { Divider } from '@/molecules/Divider'
import { Logo } from '@/molecules/Logo'
import { MenuRow } from '@/molecules/MenuRow'
import { AboutRow } from '@/patterns/AboutRow'
import { AccountRow } from '@/patterns/AccountRow'
import { AppearanceRow } from '@/patterns/AppearanceRow'
import { AppNavItems } from '@/patterns/AppNavItems'
import { DevBadgeItem } from '@/patterns/DevBadgeItem'
import styles from './MenuPanel.module.scss'

const TOOL_NAME = 'Docto'

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const vault = usePatientVault()
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
      {signedIn && vault.isUnlocked && (
        <>
          <Divider />
          <p className={styles.sectionLabel}>App</p>
          <AppNavItems onClose={onClose} />
          <Divider />
          <MenuRow
            icon={Lock}
            label="Lock vault"
            onClose={onClose}
            onClick={() => vault.lock()}
          />
        </>
      )}
      <DevBadgeItem />
      <AboutRow name={TOOL_NAME} version={APP_VERSION} />
    </div>
  )
}
