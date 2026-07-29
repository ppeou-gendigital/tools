import { Loader2, Wrench } from 'lucide-react'
import { AuthGate as ToolsAuthGate, SignInForm } from '@tools/behavioral'
import { AcceptInvite } from '@/pages/AcceptInvite'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './AuthGate.module.scss'

export function AuthGate({ children }) {
  const { route } = useNavigation()

  return (
    <ToolsAuthGate
      route={route}
      renderPreAuth={(r) => (r === 'accept-invite' ? <AcceptInvite /> : null)}
      loadingFallback={
        <div className={styles.loading}>
          <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
          <span>Loading</span>
        </div>
      }
      signIn={<SignInForm appName="TOOLNAME" logoIcon={Wrench} />}
    >
      {children}
    </ToolsAuthGate>
  )
}
