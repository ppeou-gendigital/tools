import { LineStyle } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Logo.module.scss'

/**
 * In-app brand mark: emerald Lucide `LineStyle` glyph.
 * Extension / PWA toolbar icons come from `icons/notas.svg`
 * (filled emerald circle + white glyph) via `npm run icons`.
 */
export function Logo({ size = 40, className, alt = 'Notas' }) {
  return (
    <LineStyle
      size={size}
      strokeWidth={2.25}
      className={cx(styles.logo, className)}
      aria-label={alt}
      role="img"
    />
  )
}
