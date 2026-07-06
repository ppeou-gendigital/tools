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

export function SignInForm() {
  const { requestOtp, verifyOtp } = useAuth()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setError('')
    if (!EMAIL_RE.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setSubmitting(true)
    try {
      await requestOtp(email)
      setStep('token')
    } catch (err) {
      setError(err?.message ?? 'Could not send the login code.')
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
      await verifyOtp(email, clean)
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

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <div className={styles.stepIndicator}>
            <span className={styles.stepLabel}>
              Step {step === 'email' ? '1' : '2'} of 2
            </span>
          </div>
          <CardTitle>
            {step === 'email' ? 'Sign in to TOOLNAME' : 'Check your email'}
          </CardTitle>
          <CardDescription>
            {step === 'email'
              ? "We'll email you a 6-digit code. No password required."
              : `We sent a 6-digit code to ${email}.`}
          </CardDescription>
        </CardHeader>

        {step === 'email' ? (
          <form className={styles.form} onSubmit={handleEmailSubmit}>
            <CardBody>
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
              {error && <div className={styles.error}>{error}</div>}
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
                    Send code
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
