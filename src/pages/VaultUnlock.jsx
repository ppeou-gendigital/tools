import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { useVault } from '@/providers/VaultProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './VaultUnlock.module.scss'

const MIN_PASSPHRASE_LENGTH = 8

// The full-page wrapper is now used only for first-time setup and as
// a defensive fallback. All `locked` cases route through the overlay
// (see src/blocks/VaultUnlockOverlay.jsx) — if some caller renders
// this component while `status === 'locked'`, we request the overlay
// and render nothing while the transition happens.
export function VaultUnlock() {
  const vault = useVault()
  const { goBack, previousRouteLabel } = useNavigation()

  const { isLocked, requestUnlock } = vault
  useEffect(() => {
    if (isLocked) {
      requestUnlock({ dismissible: false })
    }
  }, [isLocked, requestUnlock])

  if (vault.isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
          <span>Loading vault</span>
        </div>
      </div>
    )
  }

  if (vault.status === 'error') {
    return (
      <div className={styles.page}>
        <div className={cx(styles.header, styles.headerCenter)}>
          <Button variant="ghost" size="sm" onClick={goBack} className={styles.back}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        </div>
        <div className={styles.errorPanel}>
          <TriangleAlert size={20} aria-hidden="true" />
          <p>Could not load your vault.</p>
          <Button variant="outline" size="sm" onClick={vault.retryLoad}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (vault.needsSetup) return <SetupForm />

  return null
}

function SetupForm() {
  const vault = useVault()
  const { goBack, previousRouteLabel } = useNavigation()
  const [passphrase, setPassphrase] = useState('')
  const [confirm, setConfirm] = useState('')
  const [reveal, setReveal] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const tooShort = passphrase.length > 0 && passphrase.length < MIN_PASSPHRASE_LENGTH
  const mismatch = confirm.length > 0 && confirm !== passphrase
  const canSubmit =
    !pending &&
    passphrase.length >= MIN_PASSPHRASE_LENGTH &&
    confirm === passphrase

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setPending(true)
    setError(null)
    try {
      await vault.setup(passphrase)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button variant="ghost" size="sm" onClick={goBack} className={styles.back}>
          <ArrowLeft size={14} aria-hidden="true" />
          {previousRouteLabel ?? 'Back'}
        </Button>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroIcon} aria-hidden="true">
          <KeyRound size={20} />
        </div>
        <h1 className={styles.title}>Create your master passphrase</h1>
        <p className={styles.subtitle}>
          Everything you save (except the credential name) is encrypted with a
          key derived from this passphrase. Pick something strong and memorable.
        </p>
      </div>

      <div className={styles.warning}>
        <TriangleAlert size={14} aria-hidden="true" />
        <span>
          If you forget it, your credentials are gone. There is no reset.
        </span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Label htmlFor="passphrase">Master passphrase</Label>
          <div className={styles.inputWrap}>
            <Input
              id="passphrase"
              type={reveal ? 'text' : 'password'}
              autoComplete="new-password"
              autoFocus
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              disabled={pending}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              className={styles.revealBtn}
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? 'Hide passphrase' : 'Show passphrase'}
              title={reveal ? 'Hide passphrase' : 'Show passphrase'}
              tabIndex={-1}
            >
              {reveal ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {tooShort && (
            <span className={styles.hint}>Must be at least 8 characters.</span>
          )}
        </div>

        <div className={styles.field}>
          <Label htmlFor="confirm">Confirm passphrase</Label>
          <Input
            id="confirm"
            type={reveal ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={pending}
          />
          {mismatch && (
            <span className={cx(styles.hint, styles.hintError)}>
              Passphrases don&apos;t match.
            </span>
          )}
        </div>

        {error && (
          <div className={cx(styles.status, styles.statusError)}>
            <TriangleAlert size={12} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" disabled={!canSubmit} fullWidth>
          {pending ? (
            <>
              <Loader2 size={14} aria-hidden="true" />
              Creating vault
            </>
          ) : (
            <>
              <KeyRound size={14} aria-hidden="true" />
              Create vault
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

// Bare unlock form for use inside the overlay (or anywhere else a
// caller needs the field + submit without page chrome). Handles its
// own state so it's a drop-in "just render it" component. Auto-clears
// the input on success; consumers listen to VaultProvider state
// changes instead of onSuccess callbacks so no wire-up is needed.
//
// Wrong-passphrase path: clear the field, keep the overlay open, and
// put focus back in the input so the user can re-enter immediately.
// The input stays enabled during the attempt (only submit is gated)
// so a failed unlock never leaves the control disabled/unfocused.
export function UnlockForm({ autoFocus = true, className }) {
  const vault = useVault()
  const inputRef = useRef(null)
  const errorId = useId()
  const [passphrase, setPassphrase] = useState('')
  const [reveal, setReveal] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (pending || passphrase.length === 0) return
    setPending(true)
    setError(null)
    let failed = false
    try {
      await vault.unlock(passphrase)
      setPassphrase('')
    } catch (err) {
      failed = true
      setError(err?.message ?? String(err))
      setPassphrase('')
    } finally {
      setPending(false)
    }
    if (failed) {
      // Next frame: React has re-rendered with the cleared field.
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }

  return (
    <form className={cx(styles.form, className)} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <Label htmlFor="unlock-passphrase">Master passphrase</Label>
        <div className={styles.inputWrap}>
          <Input
            ref={inputRef}
            id="unlock-passphrase"
            type={reveal ? 'text' : 'password'}
            autoComplete="current-password"
            autoFocus={autoFocus}
            value={passphrase}
            onChange={(e) => {
              setPassphrase(e.target.value)
              if (error) setError(null)
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            aria-busy={pending || undefined}
          />
          <button
            type="button"
            className={styles.revealBtn}
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? 'Hide passphrase' : 'Show passphrase'}
            title={reveal ? 'Hide passphrase' : 'Show passphrase'}
            tabIndex={-1}
            disabled={pending}
          >
            {reveal ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          className={cx(styles.status, styles.statusError)}
        >
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" disabled={pending || passphrase.length === 0} fullWidth>
        {pending ? (
          <>
            <Loader2 size={14} aria-hidden="true" />
            Unlocking
          </>
        ) : (
          <>
            <Lock size={14} aria-hidden="true" />
            Unlock
          </>
        )}
      </Button>
    </form>
  )
}
