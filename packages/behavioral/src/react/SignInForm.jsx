import { useState } from 'react'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import {
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Logo,
} from '@tools/ui'
import { formatAuthError, useAuth } from '@tools/service'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Single passwordless OTP form (email → 6-digit code).
 * New accounts are created implicitly via shouldCreateUser.
 *
 * @param {object} [props]
 * @param {string} [props.appName]
 * @param {any} [props.logoIcon]
 * @param {string} [props.contextMessage]
 * @param {() => void} [props.onBack]
 */
export function SignInForm({
  appName = 'App',
  logoIcon,
  contextMessage,
  onBack,
} = {}) {
  const { requestOtp, verifyOtp } = useAuth()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
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
      await requestOtp(trimmed, { shouldCreateUser: true })
      setStep('token')
    } catch (err) {
      setError(formatAuthError(err, 'Could not send the login code. Try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleTokenSubmit(e) {
    e.preventDefault()
    setError(null)
    const code = token.replace(/\s+/g, '')
    if (code.length < 6) {
      setError('The code is 6 digits.')
      return
    }
    setSubmitting(true)
    try {
      await verifyOtp(email.trim(), code)
    } catch (err) {
      setError(formatAuthError(err, 'That code did not work. Try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  function backToEmail() {
    setStep('email')
    setToken('')
    setError(null)
  }

  const title =
    step === 'token' ? 'Check your email' : `Sign in to ${appName}`
  const description =
    contextMessage ||
    (step === 'token'
      ? `We sent a 6-digit code to ${email.trim()}.`
      : "We'll email you a 6-digit code. No password required.")

  return (
    <div className="bh-signin">
      <Card className="bh-signin__card">
        <CardHeader className="bh-signin__header">
          {onBack && step === 'email' && (
            <div className="bh-signin__back">
              <Button variant="ghost" size="sm" onClick={onBack} type="button">
                <ArrowLeft size={14} aria-hidden="true" />
                Back
              </Button>
            </div>
          )}
          <div className="bh-signin__brand">
            <Logo icon={logoIcon} size={48} alt={appName} />
          </div>
          <p className="bh-signin__step">
            Step {step === 'email' ? '1' : '2'} of 2
          </p>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        {step === 'email' ? (
          <form className="bh-signin__form" onSubmit={handleEmailSubmit}>
            <CardBody className="bh-signin__body">
              <div className="bh-signin__field">
                <Label htmlFor="bh-signin-email">Email</Label>
                <Input
                  id="bh-signin-email"
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
              {error && <p className="bh-signin__error">{error}</p>}
            </CardBody>
            <div className="bh-signin__actions">
              <Button type="submit" fullWidth disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="bh-signin__spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Mail size={16} aria-hidden="true" />
                    Send code
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form className="bh-signin__form" onSubmit={handleTokenSubmit}>
            <CardBody className="bh-signin__body">
              <div className="bh-signin__field">
                <Label htmlFor="bh-signin-token">One-time code</Label>
                <Input
                  id="bh-signin-token"
                  className="bh-signin__token"
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
                <span className="bh-signin__helper">
                  It may take a minute to arrive. Check spam too.
                </span>
              </div>
              {error && <p className="bh-signin__error">{error}</p>}
            </CardBody>
            <div className="bh-signin__actions">
              <Button type="submit" fullWidth disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="bh-signin__spinner" aria-hidden="true" />
                    Verifying…
                  </>
                ) : (
                  'Verify & continue'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={backToEmail}
                disabled={submitting}
              >
                Use a different email
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
