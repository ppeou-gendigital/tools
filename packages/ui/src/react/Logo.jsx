import { Wrench } from 'lucide-react'
import { cx } from './cx.js'

export function Logo({
  icon: Icon = Wrench,
  size = 40,
  className,
  alt = 'App',
}) {
  const glyph = Math.max(12, Math.round(size * 0.58))
  return (
    <span
      className={cx('ui-logo', className)}
      style={{ width: size, height: size }}
      aria-label={alt}
      role="img"
    >
      <Icon size={glyph} strokeWidth={2.25} aria-hidden="true" />
    </span>
  )
}
