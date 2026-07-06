import { Unlock } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useVault } from '@/providers/VaultProvider'

// Menu entry the user can hit any time to open the unlock overlay
// without first navigating to the credentials page. The MenuPanel is
// responsible for hiding this row when it wouldn't make sense
// (signed out, already unlocked, or first-time setup); we still
// no-op if requestUnlock is called in an ineligible state.
export function UnlockVaultItem({ onClose }) {
  const vault = useVault()
  return (
    <MenuRow
      icon={Unlock}
      label="Unlock vault"
      onClose={onClose}
      onClick={() => vault.requestUnlock({ dismissible: true })}
    />
  )
}
