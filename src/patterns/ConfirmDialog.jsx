import { Button } from '@/molecules/Button'
import { Modal } from '@/patterns/Modal'
import styles from './ConfirmDialog.module.scss'

/**
 * App-styled confirm dialog (replaces window.confirm).
 * Destructive by default for delete / remove flows.
 */
export function ConfirmDialog({
  open,
  onDismiss,
  title,
  message,
  confirmLabel = 'Delete',
  busyLabel = 'Deleting…',
  cancelLabel = 'Cancel',
  confirmVariant = 'destructive',
  confirming = false,
  onConfirm,
}) {
  return (
    <Modal open={open} onDismiss={onDismiss} title={title}>
      {message ? <p className={styles.message}>{message}</p> : null}
      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={onDismiss}
          disabled={confirming}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={confirming}
        >
          {confirming ? busyLabel : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
