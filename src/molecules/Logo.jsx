import { LineStyle } from 'lucide-react'
import { Logo as ToolsLogo } from '@tools/ui'

export function Logo({ size, className, alt = 'Notas' }) {
  return (
    <ToolsLogo
      icon={LineStyle}
      size={size}
      className={className}
      alt={alt}
    />
  )
}
