import { useEffect, useRef, useState } from 'react'
import { Wrench } from 'lucide-react'
import { useCornerDrag } from '../hooks/useCornerDrag.js'

/**
 * @param {object} props
 * @param {any} [props.icon]
 * @param {string} [props.label]
 * @param {(ctx: { corner: string, onClose: () => void }) => import('react').ReactNode} props.renderPanel
 */
export function FloatingMenu({
  icon: Icon = Wrench,
  label = 'Menu',
  renderPanel,
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const skipClickToggleRef = useRef(false)
  const { corner, dragOffset, isDragging, wasDragged, bind } = useCornerDrag()
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

  const fabStyle = dragOffset
    ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }
    : undefined

  return (
    <div ref={wrapRef} className="bh-fab-wrap">
      <button
        type="button"
        className="bh-fab"
        data-corner={corner}
        data-dragging={isDragging ? 'true' : undefined}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={fabStyle}
        {...restBind}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <Icon size={20} aria-hidden="true" />
      </button>
      {open && !isDragging && renderPanel?.({
        corner,
        onClose: () => setOpen(false),
      })}
    </div>
  )
}
