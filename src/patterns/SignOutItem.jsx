import { LogOut } from 'lucide-react'
import { MenuRow } from '@/molecules/MenuRow'
import { useAuth } from '@/providers/AuthProvider'

export function SignOutItem({ onClose }) {
  const { signOut } = useAuth()
  return (
    <MenuRow
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
  )
}
