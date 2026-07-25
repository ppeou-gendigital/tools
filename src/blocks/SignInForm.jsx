import { Fingerprint } from 'lucide-react'
import { SignInForm as ToolsSignInForm } from '@tools/behavioral'

export function SignInForm(props) {
  return (
    <ToolsSignInForm appName="Accesso" logoIcon={Fingerprint} {...props} />
  )
}
