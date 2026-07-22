import { CircleUserRound, LogOut } from 'lucide-react'
import { IconButton } from '@/molecules/IconButton'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './AccountRow.module.scss'

// Compact account row: profile + sign out. Only rendered when the user
// is signed in (see MenuPanel).
export function AccountRow({ onClose }) {
  const { goProfile } = useNavigation()
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
