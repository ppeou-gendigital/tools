import { PlaneTakeoff } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Logo.module.scss'

/**
 * In-app brand mark: white PlaneTakeoff on a fuchsia rounded square.
 * Extension / PWA / favicon assets come from `icons/tool.svg`
 * (same shape) via `npm run icons`.
 */
export function Logo({ size = 40, className, alt = 'Viaggio' }) {
  const glyph = Math.max(12, Math.round(size * 0.58))
  return (
    <span
      className={cx(styles.logo, className)}
      style={{ width: size, height: size }}
      aria-label={alt}
      role="img"
    >
      <PlaneTakeoff size={glyph} strokeWidth={2.25} aria-hidden="true" />
    </span>
  )
}
