import { Loader2 } from 'lucide-react'
import { AcceptInvite } from '@/pages/AcceptInvite'
import { SignInForm } from '@/blocks/SignInForm'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './AuthGate.module.scss'

export function AuthGate({ children }) {
  const { session, loading } = useAuth()
  const { route } = useNavigation()

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
        <span>Loading</span>
      </div>
    )
  }

  // Invite peek is visible before OTP so travellers see the journey first.
  if (!session) {
    if (route === 'accept-invite') return <AcceptInvite />
    return <SignInForm />
  }

  return children
}
