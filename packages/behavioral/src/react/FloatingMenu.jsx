import { useEffect, useRef, useState } from 'react'
import { Wrench } from 'lucide-react'
import { useCornerDrag } from '../hooks/useCornerDrag.js'

/**
 * @param {object} props
 * @param {any} [props.icon]
 * @param {string} [props.label]
 * @param {(ctx: {
 *   corner: string,
 *   edgeX: 'left' | 'right',
 *   edgeY: 'top' | 'bottom',
 *   fabLeft: number,
 *   fabTop: number,
 *   onClose: () => void,
 * }) => import('react').ReactNode} props.renderPanel
 */
export function FloatingMenu({
  icon: Icon = Wrench,
  label = 'Menu',
  renderPanel,
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const skipClickToggleRef = useRef(false)
  const {
    corner,
    edgeX,
    edgeY,
    positionStyle,
    isDragging,
    wasDragged,
    setTargetRef,
    bind,
  } = useCornerDrag({
    fabId: 'menu',
  })
  const { onPointerDown: dragPointerDown, ...restBind } = bind

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handlePointerDown = (e) => {
    if (open) {
      setOpen(false)
      skipClickToggleRef.current = true
    } else {
      skipClickToggleRef.current = false
    }
    dragPointerDown(e)
  }

  const handleClick = () => {
    if (wasDragged()) return
    if (skipClickToggleRef.current) {
      skipClickToggleRef.current = false
      return
    }
    setOpen((v) => !v)
  }

  const fabLeft = Number.parseFloat(positionStyle.left)
  const fabTop = Number.parseFloat(positionStyle.top)

  return (
    <div ref={wrapRef} className="bh-fab-wrap">
      <button
        type="button"
        className="bh-fab"
        data-fab="menu"
        data-dragging={isDragging ? 'true' : undefined}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={positionStyle}
        ref={setTargetRef}
        {...restBind}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <Icon size={20} aria-hidden="true" />
      </button>
      {open &&
        !isDragging &&
        renderPanel?.({
          corner,
          edgeX,
          edgeY,
          fabLeft,
          fabTop,
          onClose: () => setOpen(false),
        })}
    </div>
  )
}
