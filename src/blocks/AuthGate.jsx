import { Loader2 } from 'lucide-react'
import { AuthGate as ToolsAuthGate, SignInForm } from '@tools/behavioral'
import { Wrench } from 'lucide-react'
import styles from './AuthGate.module.scss'

export function AuthGate({ children }) {
  return (
    <ToolsAuthGate
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
