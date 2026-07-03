import { CircleUserRound, LogOut, Settings } from 'lucide-react'
import { IconButton } from '@/molecules/IconButton'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './AccountRow.module.scss'

// Compact account row: profile, settings, sign out as three ghost icon
// buttons. Only rendered when the user is signed in (see MenuPanel).
export function AccountRow({ onClose }) {
  const { goProfile, goSettings } = useNavigation()
  const { signOut } = useAuth()
  return (
    <div className={styles.row}>
      <IconButton
        icon={CircleUserRound}
        label="Profile"
        onClose={onClose}
        onClick={goProfile}
      />
      <IconButton
        icon={Settings}
        label="Settings"
        onClose={onClose}
        onClick={goSettings}
      />
      <IconButton
        icon={LogOut}
        label="Sign out"
        onClose={onClose}
        onClick={async () => {
          try {
            await signOut()
          } catch (err) {
            console.error('sign out failed', err)
          }
        }}
      />
    </div>
  )
}
