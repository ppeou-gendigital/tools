import { LineStyle } from 'lucide-react'
import { SignInForm as ToolsSignInForm } from '@tools/behavioral'

export function SignInForm(props) {
  return <ToolsSignInForm appName="Notas" logoIcon={LineStyle} {...props} />
}
