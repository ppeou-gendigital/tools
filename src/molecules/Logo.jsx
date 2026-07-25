import { PlaneTakeoff } from 'lucide-react'
import { Logo as ToolsLogo } from '@tools/ui'

export function Logo({ size, className, alt = 'Viaggio' }) {
  return (
    <ToolsLogo
      icon={PlaneTakeoff}
      size={size}
      className={className}
      alt={alt}
    />
  )
}
