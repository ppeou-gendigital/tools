import { Wrench } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Logo.module.scss'

/**
 * In-app brand mark: white glyph on a rounded brand square.
 *
 * Extension / PWA / favicon assets come from `icons/tool.svg` (same
 * rounded-square shape) via `npm run icons`. When branding a new tool:
 * 1. Replace `icons/tool.svg` and update BRAND_BG in generate-icons.mjs
 * 2. Swap the Lucide icon here (and in FloatingMenu) to match
 * 3. Run `npm run icons`
 */
export function Logo({ size = 40, className, alt = 'TOOLNAME' }) {
  const glyph = Math.max(12, Math.round(size * 0.58))
  return (
    <span
      className={cx(styles.logo, className)}
      style={{ width: size, height: size }}
      aria-label={alt}
      role="img"
    >
      <Wrench size={glyph} strokeWidth={2.25} aria-hidden="true" />
    </span>
  )
}
