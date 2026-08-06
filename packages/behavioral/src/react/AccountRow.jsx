import { Settings } from 'lucide-react'
import { IconButton } from '@tools/ui'

export function AccountRow({ onClose, onSettings }) {
  return (
    <div className="bh-account-row" style={{ '--bh-account-cols': 1 }}>
      <IconButton
        icon={Settings}
        label="Settings"
        onClose={onClose}
        onClick={onSettings}
      />
    </div>
  )
}
