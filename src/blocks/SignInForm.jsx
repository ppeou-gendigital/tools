import { useState } from 'react'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/patterns/Card'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { useAuth } from '@/providers/AuthProvider'
import styles from './SignInForm.module.scss'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Heuristic for "the email you tried to log in with doesn't have an account
// yet". Supabase has changed the exact wording across versions, so we match
// loosely on the strings that have all meant this over time.
function isUnknownUserError(err) {
  const msg = (err?.message ?? '').toLowerCase()
  return (
    msg.includes('not found') ||
    msg.includes('signups not allowed') ||
    msg.includes('signup') ||
    msg.includes('does not exist') ||
    msg.includes('no user')
  )
}

export function SignInForm() {
  const { requestOtp, verifyOtp, finalizeSignup } = useAuth()
  const [mode, setMode] = useState('login')
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  // Snapshot of the display name captured at signup step 1. Kept separate
  // from `displayName` so that if the user switches modes or edits the field
  // between steps, we still upsert the value they actually signed up with.
  const [pendingDisplayName, setPendingDisplayName] = useState('')
  const [token, setToken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSignupRecovery, setShowSignupRecovery] = useState(false)

  function switchMode(nextMode) {
    if (nextMode === mode) return
    setMode(nextMode)
    setStep('email')
    setToken('')
    setError('')
    setShowSignupRecovery(false)
  }

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setError('')
    setShowSignupRecovery(false)
    if (!EMAIL_RE.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setSubmitting(true)
    try {
      const trimmedName = displayName.trim()
      await requestOtp(email, {
        shouldCreateUser: mode === 'signup',
        displayName: mode === 'signup' && trimmedName ? trimmedName : undefined,
      })
      if (mode === 'signup') {
        setPendingDisplayName(trimmedName)
      }
      setStep('token')
    } catch (err) {
      if (mode === 'login' && isUnknownUserError(err)) {
        setError("We couldn't find an account with that email.")
        setShowSignupRecovery(true)
      } else {
        setError(err?.message ?? 'Could not send the login code.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleTokenSubmit(e) {
    e.preventDefault()
    setError('')
    const clean = token.replace(/\s+/g, '')
    if (clean.length < 6) {
      setError('The code is 6 digits.')
      return
    }
    setSubmitting(true)
    try {
      const data = await verifyOtp(email, clean)
      // Fire-and-forget: a profiles write failure shouldn't block sign-in.
      // The handle_new_user trigger already created the row.
      if (mode === 'signup' && pendingDisplayName) {
        finalizeSignup(data?.session ?? null, pendingDisplayName).catch(
          (err) => console.warn('[acceso] display name upsert failed:', err),
        )
      }
      // AuthProvider's onAuthStateChange will flip the gate.
    } catch (err) {
      setError(err?.message ?? 'That code did not work. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function backToEmail() {
    setStep('email')
    setToken('')
    setError('')
  }

  function useThisEmailForSignup() {
    setMode('signup')
    setStep('email')
    setToken('')
    setError('')
    setShowSignupRecovery(false)
  }

  const isSignup = mode === 'signup'

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          {step === 'email' && (
            <div className={styles.tabs} role="tablist" aria-label="Auth mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={styles.tab}
                data-active={mode === 'login'}
                onClick={() => switchMode('login')}
                disabled={submitting}
              >
                Log in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={styles.tab}
                data-active={mode === 'signup'}
                onClick={() => switchMode('signup')}
                disabled={submitting}
              >
                Sign up
              </button>
            </div>
          )}
          <div className={styles.stepIndicator}>
            <span className={styles.stepLabel}>
              Step {step === 'email' ? '1' : '2'} of 2
            </span>
          </div>
          <CardTitle>
            {step === 'token'
              ? 'Check your email'
              : isSignup
                ? 'Create your Acceso account'
                : 'Log in to Acceso'}
          </CardTitle>
          <CardDescription>
            {step === 'token'
              ? `We sent a 6-digit code to ${email}.`
              : isSignup
                ? "We'll email you a 6-digit code. No password required."
                : "Enter your email and we'll send you a 6-digit code."}
          </CardDescription>
        </CardHeader>

        {step === 'email' ? (
          <form className={styles.form} onSubmit={handleEmailSubmit}>
            <CardBody>
              {isSignup && (
                <div className={styles.field}>
                  <Label htmlFor="display-name">
                    Display name{' '}
                    <span className={styles.optional}>(optional)</span>
                  </Label>
                  <Input
                    id="display-name"
                    type="text"
                    autoComplete="name"
                    placeholder="How should we call you?"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={submitting}
                    maxLength={80}
                  />
                </div>
              )}
              <div className={styles.field}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  required
                  autoFocus
                />
              </div>
              {error && (
                <div className={styles.error}>
                  <span>{error}</span>
                  {showSignupRecovery && (
                    <button
                      type="button"
                      className={styles.recoveryAction}
                      onClick={useThisEmailForSignup}
                      disabled={submitting}
                    >
                      Sign up with this email instead
                    </button>
                  )}
                </div>
              )}
            </CardBody>
            <CardFooter>
              <Button type="submit" fullWidth disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    <Mail size={14} aria-hidden="true" />
                    {isSignup ? 'Create account' : 'Send code'}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleTokenSubmit}>
            <CardBody>
              <div className={styles.field}>
                <Label htmlFor="token">6-digit code</Label>
                <Input
                  id="token"
                  className={styles.tokenInput}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={token}
                  onChange={(e) =>
                    setToken(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  disabled={submitting}
                  required
                  autoFocus
                />
                <span className={styles.helper}>
                  It may take a minute to arrive. Check spam too.
                </span>
              </div>
              {error && <div className={styles.error}>{error}</div>}
            </CardBody>
            <CardFooter>
              <button
                type="button"
                className={styles.backButton}
                onClick={backToEmail}
                disabled={submitting}
              >
                <ArrowLeft size={12} aria-hidden="true" />
                Use a different email
              </button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" />
                    Verifying
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
