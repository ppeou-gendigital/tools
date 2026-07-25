import { Button } from './Button.jsx'
import { Modal } from './Modal.jsx'

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
      {message ? <p className="ui-confirm__message">{message}</p> : null}
      <div className="ui-confirm__actions">
        <Button variant="secondary" onClick={onDismiss} disabled={confirming}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={confirming}>
          {confirming ? busyLabel : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
