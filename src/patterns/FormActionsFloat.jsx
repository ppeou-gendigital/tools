import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, Save, Trash2 } from 'lucide-react'
import { setFabBottomRightReserved } from '@tools/behavioral'
import { cx } from '@/lib/cx'
import styles from './FormActionsFloat.module.scss'

/**
 * Bottom-right floating Save / Delete (icon-only). Reserves the BR FAB corner
 * so menu/AI FABs temporarily shift one grid row up while mounted.
 * Portals to document.body with position:fixed (no shell race on cold load).
 */
export function FormActionsFloat({
  onSave,
  onDelete,
  saving = false,
  deleting = false,
  canSave = true,
  canDelete = false,
  saveLabel = 'Save',
  deleteLabel = 'Delete',
}) {
  useEffect(() => {
    setFabBottomRightReserved(true)
    return () => setFabBottomRightReserved(false)
  }, [])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={styles.bar}
      data-form-actions-float=""
      role="toolbar"
      aria-label="Form actions"
    >
      <button
        type="button"
        className={styles.btn}
        onClick={onSave}
        disabled={!canSave || saving || deleting}
        aria-label={saving ? 'Saving…' : saveLabel}
        title={saving ? 'Saving…' : saveLabel}
      >
        {saving ? (
          <Loader2 size={20} aria-hidden="true" className={styles.spin} />
        ) : (
          <Save size={20} aria-hidden="true" />
        )}
      </button>
      {canDelete ? (
        <button
          type="button"
          className={cx(styles.btn, styles.delete)}
          onClick={onDelete}
          disabled={deleting || saving}
          aria-label={deleting ? 'Deleting…' : deleteLabel}
          title={deleting ? 'Deleting…' : deleteLabel}
        >
          {deleting ? (
            <Loader2 size={20} aria-hidden="true" className={styles.spin} />
          ) : (
            <Trash2 size={20} aria-hidden="true" />
          )}
        </button>
      ) : null}
    </div>,
    document.body,
  )
}
