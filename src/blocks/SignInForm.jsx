import { HeartPlus } from 'lucide-react'
import { SignInForm as ToolsSignInForm } from '@tools/behavioral'

export function SignInForm(props) {
  return <ToolsSignInForm appName="Docto" logoIcon={HeartPlus} {...props} />
}
