import { useEffect, useRef, useState } from 'react'
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LockKeyhole,
  Star,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { Textarea } from '@/molecules/Textarea'
import { PageHeader } from '@/patterns/PageHeader'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVault } from '@/providers/VaultProvider'
import {
  createCreditCard,
  deleteCreditCard,
  fetchCreditCard,
  updateCreditCard,
} from '@/lib/creditCardsApi'
import { formatCardNumber } from '@/lib/cardUtils'
import { cx } from '@/lib/cx'
import styles from './CreditCardEdit.module.scss'

function emptyForm() {
  return {
    cardholderName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    issuerBank: '',
    billingZip: '',
    pin: '',
    notes: '',
    isFavorite: false,
  }
}

function applySeedToForm(base, seed) {
  if (!seed) return base
  return {
    ...base,
    cardholderName: seed.cardholderName ?? base.cardholderName,
    cardNumber: seed.cardNumber ?? base.cardNumber,
    expMonth: seed.expMonth ?? base.expMonth,
    expYear: seed.expYear ?? base.expYear,
    cvv: seed.cvv ?? base.cvv,
    billingZip: seed.billingZip ?? base.billingZip,
  }
}

// Single form for add + edit. Capture seeds arrive via navigation
// params and never auto-save — user reviews then clicks Save.
export function CreditCardEdit() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const vault = useVault()
  const { params, goBack, goCreditCards, route } = useNavigation()
  const queryClient = useQueryClient()

  const editingId = route === 'credit-card-edit' ? params?.id ?? null : null
  const seed = params?.seed ?? null

  const cardQuery = useQuery({
    queryKey: ['credit_card', userId, editingId],
    queryFn: () => fetchCreditCard(userId, editingId),
    enabled: !!userId && !!editingId && vault.isUnlocked,
  })

  const [displayName, setDisplayName] = useState('')
  const [form, setForm] = useState(emptyForm())
  const [hydratedFor, setHydratedFor] = useState(null)
  const [reveal, setReveal] = useState({ number: false, cvv: false, pin: false })
  const [error, setError] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [seedBannerOpen, setSeedBannerOpen] = useState(Boolean(seed))
  const seedAppliedRef = useRef(null)

  useEffect(() => {
    setSeedBannerOpen(Boolean(seed))
  }, [seed])

  useEffect(() => {
    let cancelled = false
    async function hydrate() {
      if (!editingId) {
        if (hydratedFor !== 'new') {
          let nextName = ''
          let nextForm = emptyForm()
          if (seed && seed.mode === 'new' && seedAppliedRef.current !== seed) {
            nextName = seed.title || seed.hostname || ''
            nextForm = applySeedToForm(nextForm, seed)
            seedAppliedRef.current = seed
          }
          setDisplayName(nextName)
          setForm(nextForm)
          setHydratedFor('new')
        } else if (
          seed &&
          seed.mode === 'new' &&
          seedAppliedRef.current !== seed
        ) {
          setDisplayName(seed.title || seed.hostname || '')
          setForm((prev) => applySeedToForm(prev, seed))
          seedAppliedRef.current = seed
        }
        return
      }
      const row = cardQuery.data
      if (!row) return
      if (hydratedFor === row.id && seedAppliedRef.current === seed) return
      try {
        const plain = await vault.decryptRecord({
          ciphertext: row.ciphertext,
          iv: row.iv,
        })
        if (cancelled) return
        let nextForm = {
          cardholderName: plain?.cardholderName ?? '',
          cardNumber: plain?.cardNumber ?? '',
          expMonth: plain?.expMonth ?? '',
          expYear: plain?.expYear ?? '',
          cvv: plain?.cvv ?? '',
          issuerBank: plain?.issuerBank ?? '',
          billingZip: plain?.billingZip ?? '',
          pin: plain?.pin ?? '',
          notes: plain?.notes ?? '',
          isFavorite: Boolean(plain?.isFavorite),
        }
        if (seed && seedAppliedRef.current !== seed) {
          if (seed.mode === 'update' || seed.mode === 'new') {
            nextForm = applySeedToForm(nextForm, seed)
          }
          seedAppliedRef.current = seed
        }
        setDisplayName(row.display_name ?? '')
        setForm(nextForm)
        setHydratedFor(row.id)
      } catch (err) {
        if (cancelled) return
        setError('Could not decrypt this card.')
        console.warn(err)
      }
    }
    hydrate()
    return () => {
      cancelled = true
    }
  }, [cardQuery.data, editingId, hydratedFor, seed, vault])

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!editingId) throw new Error('nothing to delete')
      await deleteCreditCard(editingId)
      return editingId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit_cards', userId] })
      queryClient.removeQueries({ queryKey: ['credit_card', userId, editingId] })
      goCreditCards()
    },
    onError: (err) => {
      setError(err?.message ?? String(err))
      setConfirmingDelete(false)
    },
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const digits = (form.cardNumber || '').replace(/\D+/g, '')
      const payload = {
        cardholderName: (form.cardholderName || '').trim(),
        cardNumber: digits,
        expMonth: (form.expMonth || '').trim(),
        expYear: (form.expYear || '').trim(),
        cvv: (form.cvv || '').trim(),
        issuerBank: (form.issuerBank || '').trim(),
        billingZip: (form.billingZip || '').trim(),
        pin: (form.pin || '').trim(),
        notes: form.notes ?? '',
        isFavorite: Boolean(form.isFavorite),
      }
      const { ciphertext, iv } = await vault.encryptRecord(payload)
      if (editingId) {
        return updateCreditCard(editingId, {
          displayName,
          ciphertext,
          iv,
        })
      }
      return createCreditCard(userId, {
        displayName,
        ciphertext,
        iv,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit_cards', userId] })
      if (editingId) {
        queryClient.invalidateQueries({ queryKey: ['credit_card', userId, editingId] })
      }
      goCreditCards()
    },
    onError: (err) => {
      setError(err?.message ?? String(err))
    },
  })

  function handleFieldChange(patch) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (saveMutation.isPending) return
    setError(null)
    saveMutation.mutate()
  }

  const { isLocked, requestUnlock } = vault
  useEffect(() => {
    if (isLocked) {
      requestUnlock({ dismissible: false })
    }
  }, [isLocked, requestUnlock])

  if (vault.isLocked) {
    return (
      <div className={styles.page}>
        <PageHeader title={editingId ? 'Edit card' : 'New card'} />
        <div className={styles.lockedPanel}>
          <div className={styles.lockedIcon} aria-hidden="true">
            <LockKeyhole size={20} />
          </div>
          <p className={styles.lockedTitle}>Vault locked</p>
          <p className={styles.lockedBody}>
            Enter your master passphrase to continue editing.
          </p>
          <Button
            size="sm"
            onClick={() => vault.requestUnlock({ dismissible: false })}
          >
            <Lock size={14} aria-hidden="true" />
            Unlock
          </Button>
        </div>
      </div>
    )
  }

  const loading = editingId && cardQuery.isLoading
  const isBusy = saveMutation.isPending || deleteMutation.isPending || loading

  return (
    <div className={styles.page}>
      <PageHeader title={editingId ? 'Edit card' : 'New card'} />

      {seed && seedBannerOpen && (
        <div className={styles.seedBanner} role="status">
          <span>
            Captured from {seed.hostname || 'this page'} — review and save.
          </span>
          <button
            type="button"
            className={styles.seedBannerClose}
            onClick={() => setSeedBannerOpen(false)}
            aria-label="Dismiss"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Label htmlFor="displayName">Card name</Label>
          <Input
            id="displayName"
            placeholder="e.g. Chase Sapphire — personal"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value)
              if (seedBannerOpen) setSeedBannerOpen(false)
            }}
            disabled={isBusy}
            autoFocus={!editingId}
            maxLength={120}
          />
          <span className={styles.hint}>
            Optional. Leave blank to fall back to &ldquo;Issuer •••• last 4&rdquo;. Not encrypted.
          </span>
        </div>

        <div className={styles.field}>
          <button
            type="button"
            className={cx(styles.favoriteToggle, form.isFavorite && styles.favoriteToggleOn)}
            onClick={() => handleFieldChange({ isFavorite: !form.isFavorite })}
            disabled={isBusy}
            aria-pressed={form.isFavorite}
          >
            <Star size={14} fill={form.isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
            {form.isFavorite ? 'Favorite — shown first when filling' : 'Mark as favorite'}
          </button>
        </div>

        <div className={styles.field}>
          <Label htmlFor="cardholderName">Cardholder name</Label>
          <Input
            id="cardholderName"
            placeholder="Name as printed on the card"
            value={form.cardholderName}
            onChange={(e) => handleFieldChange({ cardholderName: e.target.value })}
            disabled={isBusy}
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor="cardNumber">Card number</Label>
          <div className={styles.revealWrap}>
            <Input
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              type={reveal.number ? 'text' : 'password'}
              inputMode="numeric"
              value={reveal.number ? formatCardNumber(form.cardNumber) : form.cardNumber}
              onChange={(e) => handleFieldChange({ cardNumber: e.target.value })}
              disabled={isBusy}
              autoComplete="off"
            />
            <button
              type="button"
              className={styles.revealBtn}
              onClick={() => setReveal((r) => ({ ...r, number: !r.number }))}
              aria-label={reveal.number ? 'Hide card number' : 'Show card number'}
              title={reveal.number ? 'Hide card number' : 'Show card number'}
              tabIndex={-1}
            >
              {reveal.number ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className={styles.rowFields}>
          <div className={styles.field}>
            <Label htmlFor="expMonth">Exp. month</Label>
            <Input
              id="expMonth"
              placeholder="MM"
              inputMode="numeric"
              maxLength={2}
              value={form.expMonth}
              onChange={(e) => handleFieldChange({ expMonth: e.target.value })}
              disabled={isBusy}
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="expYear">Exp. year</Label>
            <Input
              id="expYear"
              placeholder="YYYY"
              inputMode="numeric"
              maxLength={4}
              value={form.expYear}
              onChange={(e) => handleFieldChange({ expYear: e.target.value })}
              disabled={isBusy}
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="cvv">CVV</Label>
            <div className={styles.revealWrap}>
              <Input
                id="cvv"
                placeholder="123"
                inputMode="numeric"
                maxLength={4}
                type={reveal.cvv ? 'text' : 'password'}
                value={form.cvv}
                onChange={(e) => handleFieldChange({ cvv: e.target.value })}
                disabled={isBusy}
                autoComplete="off"
              />
              <button
                type="button"
                className={styles.revealBtn}
                onClick={() => setReveal((r) => ({ ...r, cvv: !r.cvv }))}
                aria-label={reveal.cvv ? 'Hide CVV' : 'Show CVV'}
                title={reveal.cvv ? 'Hide CVV' : 'Show CVV'}
                tabIndex={-1}
              >
                {reveal.cvv ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.rowFields}>
          <div className={styles.field}>
            <Label htmlFor="issuerBank">Issuer / bank</Label>
            <Input
              id="issuerBank"
              placeholder="e.g. Chase"
              value={form.issuerBank}
              onChange={(e) => handleFieldChange({ issuerBank: e.target.value })}
              disabled={isBusy}
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="billingZip">Billing ZIP</Label>
            <Input
              id="billingZip"
              placeholder="94103"
              value={form.billingZip}
              onChange={(e) => handleFieldChange({ billingZip: e.target.value })}
              disabled={isBusy}
              autoComplete="off"
            />
          </div>
        </div>

        <div className={styles.field}>
          <Label htmlFor="pin">PIN</Label>
          <div className={styles.revealWrap}>
            <Input
              id="pin"
              placeholder="Optional"
              inputMode="numeric"
              type={reveal.pin ? 'text' : 'password'}
              value={form.pin}
              onChange={(e) => handleFieldChange({ pin: e.target.value })}
              disabled={isBusy}
              autoComplete="off"
            />
            <button
              type="button"
              className={styles.revealBtn}
              onClick={() => setReveal((r) => ({ ...r, pin: !r.pin }))}
              aria-label={reveal.pin ? 'Hide PIN' : 'Show PIN'}
              title={reveal.pin ? 'Hide PIN' : 'Show PIN'}
              tabIndex={-1}
            >
              {reveal.pin ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={4}
            placeholder="Anything else worth remembering. Encrypted."
            value={form.notes}
            onChange={(e) => handleFieldChange({ notes: e.target.value })}
            disabled={isBusy}
          />
        </div>

        {error && (
          <div className={cx(styles.status, styles.statusError)}>
            <TriangleAlert size={12} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {confirmingDelete ? (
          <div className={styles.confirm} role="alertdialog" aria-label="Confirm delete">
            <span>Delete this card? This cannot be undone.</span>
            <div className={styles.confirmActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" />
                    Deleting
                  </>
                ) : (
                  <>
                    <Trash2 size={14} aria-hidden="true" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.actions}>
            {editingId && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmingDelete(true)}
                disabled={isBusy}
                className={styles.deleteBtn}
              >
                <Trash2 size={14} aria-hidden="true" />
                Delete
              </Button>
            )}
            <div className={styles.actionsRight}>
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isBusy}>
                {saveMutation.isPending ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" />
                    Saving
                  </>
                ) : editingId ? (
                  'Save changes'
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
