import { HeartPlus } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Logo.module.scss'

/**
 * In-app brand mark: sky Lucide `HeartPlus` glyph.
 * Extension / PWA toolbar icons come from `icons/tool.svg`
 * (filled sky circle + white glyph) via `npm run icons`.
 */
export function Logo({ size = 40, className, alt = 'Docto' }) {
  return (
    <HeartPlus
      size={size}
      strokeWidth={2.25}
      className={cx(styles.logo, className)}
      aria-label={alt}
      role="img"
    />
  )
}
