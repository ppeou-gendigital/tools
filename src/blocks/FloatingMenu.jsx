import { useEffect, useRef, useState } from 'react'
import { Wrench } from 'lucide-react'
import { useCornerDrag } from '@/hooks/useCornerDrag'
import { MenuPanel } from '@/patterns/MenuPanel'
import styles from './FloatingMenu.module.scss'

export function FloatingMenu() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
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
    // Starting a drag while the menu is open would leave the panel anchored to
    // the old corner mid-move. Close it before drag begins.
    if (open) setOpen(false)
    dragPointerDown(e)
  }

  const handleClick = () => {
    if (wasDragged()) return
    setOpen((v) => !v)
  }

  const fabStyle = dragOffset
    ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }
    : undefined

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        className={styles.fab}
        data-corner={corner}
        data-dragging={isDragging ? 'true' : undefined}
        aria-label="TOOLNAME menu"
        aria-haspopup="menu"
        aria-expanded={open}
        style={fabStyle}
        {...restBind}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <Wrench size={20} aria-hidden="true" />
      </button>
      {open && !isDragging && (
        <MenuPanel corner={corner} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}
