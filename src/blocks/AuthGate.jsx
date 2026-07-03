import { Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { SignInForm } from '@/blocks/SignInForm'
import styles from './AuthGate.module.scss'

export function AuthGate({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
        <span>Loading</span>
      </div>
    )
  }

  if (!session) {
    return <SignInForm />
  }

  return children
}
