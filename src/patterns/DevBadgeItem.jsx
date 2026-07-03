import { Bug } from 'lucide-react'
import { devAutoLoginConfig } from '@/env'
import styles from './DevBadgeItem.module.scss'

export function DevBadgeItem() {
  const cfg = devAutoLoginConfig()
  if (!cfg) return null
  return (
    <div className={styles.devRow} title={`Dev auto-login active as ${cfg.email}`}>
      <Bug size={12} className={styles.devIcon} aria-hidden="true" />
      <span>Dev auto-login</span>
    </div>
  )
}
