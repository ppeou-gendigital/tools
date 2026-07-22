import { useState } from 'react'
import { LockKeyhole, LockOpen } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useLockbox } from '@/providers/LockboxProvider'
import { cx } from '@/lib/cx'
import styles from './LockboxSessionToggle.module.scss'

/**
 * Icon toggle for a lockbox session key.
 * Locked → LockKeyhole (click unlocks); unlocked → LockOpen (click locks).
 */
export function LockboxSessionToggle({
  lockboxId,
  label = 'lockbox',
  className,
  size = 14,
  onClickCapture,
}) {
  const { isUnlocked, requestUnlock, lockOne } = useLockbox()
  const [busy, setBusy] = useState(false)

  if (!lockboxId) return null

  const locked = !isUnlocked(lockboxId)
  const Icon = locked ? LockKeyhole : LockOpen
  const actionLabel = locked ? `Unlock ${label}` : `Lock ${label}`

  async function handleClick(e) {
    onClickCapture?.(e)
    e.preventDefault()
    e.stopPropagation()
    if (busy) return
    if (locked) {
      setBusy(true)
      try {
        await requestUnlock(lockboxId)
      } catch {
        // unlock cancelled / failed — overlay already surfaced
      } finally {
        setBusy(false)
      }
      return
    }
    lockOne(lockboxId)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cx(styles.toggle, className)}
      onClick={handleClick}
      disabled={busy}
      aria-label={actionLabel}
      title={actionLabel}
      aria-pressed={!locked}
    >
      <Icon size={size} aria-hidden="true" />
    </Button>
  )
}
