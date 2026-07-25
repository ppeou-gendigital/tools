import { PlaneTakeoff } from 'lucide-react'
import { SignInForm as ToolsSignInForm } from '@tools/behavioral'

export function SignInForm(props) {
  return (
    <ToolsSignInForm appName="Viaggio" logoIcon={PlaneTakeoff} {...props} />
  )
}
