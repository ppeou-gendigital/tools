import { useEffect, useRef } from 'react'
import { AboutRow, Divider, Logo } from '@tools/ui'

/**
 * Slot-based FAB menu shell (viaggio a11y: role=dialog + focus trap).
 *
 * @param {object} props
 * @param {string} [props.corner] — legacy XL cell token (unused for layout)
 * @param {'left' | 'right'} [props.edgeX]
 * @param {'top' | 'bottom'} [props.edgeY]
 * @param {number} [props.fabLeft] — FAB left (px) within the fab wrap
 * @param {number} [props.fabTop] — FAB top (px) within the fab wrap
 * @param {() => void} [props.onClose]
 * @param {import('react').ReactNode} [props.brand] — custom brand block
 * @param {{ name: string, icon?: any, logoAlt?: string }} [props.brandConfig]
 * @param {import('react').ReactNode} [props.children] — sections between brand and footer
 * @param {import('react').ReactNode} [props.footer]
 * @param {string} [props.version]
 */
export function MenuPanel({
  corner: _corner,
  edgeX = 'right',
  edgeY = 'bottom',
  fabLeft,
  fabTop,
  onClose,
  brand,
  brandConfig,
  children,
  footer,
  version,
}) {
  const panelRef = useRef(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const focusables = panel.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    )
    const first = focusables[0]
    if (first instanceof HTMLElement) first.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
        return
      }
      if (e.key !== 'Tab' || focusables.length === 0) return
      const list = [...focusables]
      const firstEl = list[0]
      const lastEl = list[list.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onClose])

  const brandNode =
    brand ??
    (brandConfig ? (
      <div className="bh-menu-brand">
        <Logo
          icon={brandConfig.icon}
          size={28}
          alt={brandConfig.logoAlt || brandConfig.name}
        />
        <span className="bh-menu-brand__name">{brandConfig.name}</span>
      </div>
    ) : null)

  const style = {}
  if (Number.isFinite(fabLeft)) style['--fab-x'] = `${fabLeft}px`
  if (Number.isFinite(fabTop)) style['--fab-y'] = `${fabTop}px`

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={brandConfig?.name ? `${brandConfig.name} menu` : 'Menu'}
      className="bh-menu-panel"
      data-edge-x={edgeX}
      data-edge-y={edgeY}
      style={style}
    >
      {brandNode}
      {brandNode && <Divider />}
      {children}
      {footer}
      {brandConfig?.name && version != null && (
        <AboutRow name={brandConfig.name} version={version} />
      )}
    </div>
  )
}

export function MenuSectionLabel({ children }) {
  return <p className="bh-menu-section-label">{children}</p>
}
