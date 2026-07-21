import toolLogo from '../../icons/tool.svg'
import { cx } from '@/lib/cx'
import styles from './Logo.module.scss'

/**
 * In-app brand mark. Uses the same SVG source as the extension / PWA icons
 * (`icons/tool.svg`). Swap that file and re-run `npm run icons` when
 * branding a new tool — this component picks up the new art automatically.
 */
export function Logo({ size = 40, className, alt = 'TOOLNAME' }) {
  return (
    <img
      src={toolLogo}
      alt={alt}
      width={size}
      height={size}
      className={cx(styles.logo, className)}
      draggable={false}
    />
  )
}
