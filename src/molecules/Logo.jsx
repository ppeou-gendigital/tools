import { HeartPlus } from 'lucide-react'
import { Logo as ToolsLogo } from '@tools/ui'

export function Logo({ size, className, alt = 'Docto' }) {
  return (
    <ToolsLogo
      icon={HeartPlus}
      size={size}
      className={className}
      alt={alt}
    />
  )
}
