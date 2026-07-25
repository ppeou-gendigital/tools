import { CircleUserRound, LogOut, Settings } from 'lucide-react'
import { IconButton } from '@tools/ui'

export function AccountRow({
  onClose,
  onProfile,
  onSettings,
  onSignOut,
  showSettings = true,
}) {
  const cols = showSettings ? 3 : 2
  return (
    <div className="bh-account-row" style={{ '--bh-account-cols': cols }}>
      <IconButton
        icon={CircleUserRound}
        label="Profile"
        onClose={onClose}
        onClick={onProfile}
      />
      {showSettings && (
        <IconButton
          icon={Settings}
          label="Settings"
          onClose={onClose}
          onClick={onSettings}
        />
      )}
      <IconButton
        icon={LogOut}
        label="Sign out"
        onClose={onClose}
        onClick={async () => {
          try {
            await onSignOut?.()
          } catch (err) {
            console.error('sign out failed', err)
          }
        }}
      />
    </div>
  )
}
