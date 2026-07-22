import { useId, useState } from 'react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { Modal } from '@/patterns/Modal'
import styles from './PromptDialog.module.scss'

/**
 * Presentational prompt / confirm dialog built on Modal.
 * Controlled by PromptProvider — remount (via `key`) for each request
 * so defaultValue initializes cleanly without an effect.
 */
export function PromptDialog({
  open,
  mode = 'prompt',
  title,
  message,
  label,
  defaultValue = '',
  type = 'text',
  autoComplete,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onDismiss,
}) {
  const inputId = useId()
  const [value, setValue] = useState(defaultValue ?? '')
  const [error, setError] = useState(null)

  function handleDismiss() {
    onDismiss?.()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'confirm') {
      onConfirm?.(true)
      return
    }
    const trimmed = String(value ?? '').trim()
    if (!trimmed) {
      setError('This field is required.')
      return
    }
    onConfirm?.(trimmed)
  }

  return (
    <Modal open={open} onDismiss={handleDismiss} title={title} dismissible>
      <form className={styles.form} onSubmit={handleSubmit}>
        {message && <p className={styles.message}>{message}</p>}

        {mode === 'prompt' && (
          <div className={styles.field}>
            {label && <Label htmlFor={inputId}>{label}</Label>}
            <Input
              id={inputId}
              type={type}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (error) setError(null)
              }}
              autoComplete={
                autoComplete ??
                (type === 'password' ? 'current-password' : 'off')
              }
              aria-invalid={error ? 'true' : undefined}
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={handleDismiss}>
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            variant={destructive ? 'destructive' : 'default'}
          >
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
