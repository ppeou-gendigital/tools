import { useState } from 'react'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import {
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Logo,
} from '@tools/ui'
import { formatAuthError, useAuth } from '@tools/service'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Merged viaggio UX + accesso signup API.
 *
 * @param {object} [props]
 * @param {string} [props.appName]
 * @param {any} [props.logoIcon]
 * @param {string} [props.contextMessage]
 * @param {() => void} [props.onBack]
 * @param {Array<'login'|'signup'>} [props.modes] — default ['login']
 */
export function SignInForm({
  appName = 'App',
  logoIcon,
  contextMessage,
  onBack,
  modes = ['login'],
} = {}) {
  const { requestOtp, verifyOtp, finalizeSignup } = useAuth()
  const allowSignup = modes.includes('signup')
  const [mode, setMode] = useState('login')
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [pendingDisplayName, setPendingDisplayName] = useState('')
  const [token, setToken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setError(null)
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setError('Enter a valid email address.')
      return
    }
    setSubmitting(true)
    try {
      const isSignup = allowSignup && mode === 'signup'
      await requestOtp(trimmed, {
        shouldCreateUser: isSignup || !allowSignup,
        displayName: isSignup ? displayName.trim() || undefined : undefined,
      })
      if (isSignup) setPendingDisplayName(displayName.trim())
      setStep('token')
    } catch (err) {
      const msg = formatAuthError(err, 'Could not send login code.')
      if (
        allowSignup &&
        mode === 'login' &&
        /sign up|not found|user/i.test(String(err?.message ?? ''))
      ) {
        setError(`${msg} Try signing up instead.`)
      } else {
        setError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleTokenSubmit(e) {
    e.preventDefault()
    setError(null)
    const code = token.trim()
    if (!code) {
      setError('Enter the code from your email.')
      return
    }
    setSubmitting(true)
    try {
      const session = await verifyOtp(email.trim(), code)
      if (allowSignup && mode === 'signup' && finalizeSignup) {
        void finalizeSignup(session, pendingDisplayName)
      }
    } catch (err) {
      setError(formatAuthError(err, 'Invalid or expired code.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bh-signin">
      <Card style={{ width: '100%', maxWidth: 380 }}>
        <CardHeader>
          {onBack && (
            <div className="bh-signin__back">
              <Button variant="ghost" size="sm" onClick={onBack} type="button">
                <ArrowLeft size={14} aria-hidden="true" />
                Back
              </Button>
            </div>
          )}
          <Logo icon={logoIcon} size={40} alt={appName} />
          <CardTitle>
            {mode === 'signup' ? `Create ${appName} account` : `Sign in to ${appName}`}
          </CardTitle>
          <CardDescription>
            {contextMessage ||
              (step === 'email'
                ? 'We will email you a one-time code.'
                : `Enter the code sent to ${email.trim()}.`)}
          </CardDescription>
        </CardHeader>
        <CardBody>
          {allowSignup && step === 'email' && (
            <div className="ui-row" style={{ gap: 'var(--space-2)' }}>
              <Button
                type="button"
                variant={mode === 'login' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('login')}
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant={mode === 'signup' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('signup')}
              >
                Sign up
              </Button>
            </div>
          )}
          {step === 'email' ? (
            <form className="bh-signin__form" onSubmit={handleEmailSubmit}>
              {allowSignup && mode === 'signup' && (
                <div className="ui-stack">
                  <Label htmlFor="display-name">Display name (optional)</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="ui-stack">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="bh-signin__error">{error}</p>}
              <CardFooter>
                <Button type="submit" fullWidth disabled={submitting}>
                  {submitting ? (
                    <Loader2 size={16} className="spin" aria-hidden="true" />
                  ) : (
                    <Mail size={16} aria-hidden="true" />
                  )}
                  {submitting ? 'Sending…' : 'Send code'}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form className="bh-signin__form" onSubmit={handleTokenSubmit}>
              <div className="ui-stack">
                <Label htmlFor="token">One-time code</Label>
                <Input
                  id="token"
                  className="bh-signin__token"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>
              {error && <p className="bh-signin__error">{error}</p>}
              <CardFooter>
                <Button type="submit" fullWidth disabled={submitting}>
                  {submitting ? 'Verifying…' : 'Verify & continue'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => {
                    setStep('email')
                    setToken('')
                    setError(null)
                  }}
                >
                  Use a different email
                </Button>
              </CardFooter>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
