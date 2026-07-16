import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, CreditCard, Loader2, Star, TriangleAlert } from 'lucide-react'
import { HeaderIconButton } from '@/patterns/PageHeader'
import { Popover } from '@/patterns/Popover'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { useDecryptedCreditCards } from '@/hooks/useDecryptedCreditCards'
import { getActiveTabInfo } from '@/lib/activeTab'
import {
  activeTabHasPaymentForm,
  autofillActiveTabCreditCard,
} from '@/lib/pageCardAutofill'
import {
  brandLabel,
  detectBrand,
  last4,
  resolveDisplayName,
} from '@/lib/cardUtils'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './AutofillButton.module.scss'

// Ambient "fill this checkout form" button. Reveals when:
//   extension build + unlocked vault + http(s) tab + payment form
//   detected + at least one usable card.
//
// Picker lists Favorites first (Star section), then other cards.
// One usable card → fill immediately. Multiple → pick.
const SUCCESS_FLASH_MS = 600
const ERROR_FLASH_MS = 1400

export function FillCardButton() {
  const { user } = useAuth()
  const vault = useVault()
  const extensionMode = isExtension()
  const enabled = extensionMode && !!user && vault.isUnlocked

  const [tabInfo, setTabInfo] = useState(null)
  const [hasPaymentForm, setHasPaymentForm] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setTabInfo(null)
      setHasPaymentForm(false)
      return
    }
    let cancelled = false
    Promise.all([getActiveTabInfo(), activeTabHasPaymentForm()]).then(
      ([info, hasForm]) => {
        if (cancelled) return
        setTabInfo(info)
        setHasPaymentForm(hasForm)
      },
    )
    return () => {
      cancelled = true
    }
  }, [enabled])

  const { decrypted } = useDecryptedCreditCards()

  const cards = useMemo(
    () => decrypted.filter((c) => !c.error && last4(c.cardNumber)),
    [decrypted],
  )

  const favorites = useMemo(
    () => cards.filter((c) => c.isFavorite),
    [cards],
  )
  const others = useMemo(
    () => cards.filter((c) => !c.isFavorite),
    [cards],
  )

  // Prefer the favorite list when the user has marked any. Falls
  // back to every card so fill still works before favorites exist.
  const pickerCards = favorites.length > 0 ? favorites : cards
  const showOtherSection = favorites.length > 0 && others.length > 0

  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const anchorRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function flash(next, ms = ERROR_FLASH_MS) {
    setStatus(next)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus(null), ms)
  }

  if (!enabled) return null
  if (!tabInfo?.hostname) return null
  if (!hasPaymentForm) return null
  if (cards.length === 0) return null

  async function runFill(card) {
    setOpen(false)
    setBusy(true)
    setStatus(null)
    try {
      await autofillActiveTabCreditCard(card)
      setBusy(false)
      setStatus({ kind: 'ok' })
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        try {
          window.close()
        } catch {
          // web / dev harness
        }
      }, SUCCESS_FLASH_MS)
    } catch (err) {
      setBusy(false)
      flash(
        { kind: 'err', message: err?.message ?? 'Autofill failed.' },
        ERROR_FLASH_MS,
      )
    }
  }

  function handleClick() {
    if (busy) return
    // Single favorite (or single card when none are favorited) → fill.
    if (pickerCards.length === 1 && !showOtherSection) {
      runFill(pickerCards[0])
      return
    }
    setShowAll(false)
    setOpen((v) => !v)
  }

  const label =
    pickerCards.length === 1 && !showOtherSection
      ? `Fill ${cardLabel(pickerCards[0])} on ${tabInfo.hostname}`
      : favorites.length > 0
        ? `Fill a favorite card on ${tabInfo.hostname}`
        : `Fill a card on ${tabInfo.hostname}`

  const Icon = busy
    ? Loader2
    : status?.kind === 'ok'
      ? Check
      : status?.kind === 'err'
        ? TriangleAlert
        : CreditCard

  const listCards = showAll ? cards : pickerCards

  return (
    <>
      <HeaderIconButton
        ref={anchorRef}
        onClick={handleClick}
        disabled={busy}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        title={status?.kind === 'err' ? status.message : label}
        className={cx(
          status?.kind === 'ok' && styles.btnOk,
          status?.kind === 'err' && styles.btnErr,
        )}
      >
        <Icon
          size={16}
          aria-hidden="true"
          className={busy ? styles.spin : undefined}
        />
      </HeaderIconButton>

      <Popover
        open={open}
        anchorRef={anchorRef}
        onDismiss={() => setOpen(false)}
        ariaLabel="Pick a card to autofill"
        className={styles.popover}
      >
        <div className={styles.pickerHeader}>
          {favorites.length > 0 && !showAll ? (
            <>
              Favorites on <span className={styles.host}>{tabInfo.hostname}</span>
            </>
          ) : (
            <>
              Fill card on <span className={styles.host}>{tabInfo.hostname}</span>
            </>
          )}
        </div>
        <ul className={styles.pickerList} role="menu">
          {listCards.map((card) => (
            <li key={card.id} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.pickerItem}
                onClick={() => runFill(card)}
              >
                <span className={styles.pickerName} title={cardLabel(card)}>
                  {card.isFavorite && (
                    <Star
                      size={10}
                      aria-hidden="true"
                      style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }}
                    />
                  )}
                  {cardLabel(card)}
                </span>
                <span className={styles.pickerUser} title={cardSubtitle(card)}>
                  {cardSubtitle(card)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {showOtherSection && !showAll && (
          <button
            type="button"
            className={styles.pickerItem}
            onClick={() => setShowAll(true)}
            style={{ marginTop: 2 }}
          >
            <span className={styles.pickerUser}>Show all cards ({others.length} more)</span>
          </button>
        )}
      </Popover>
    </>
  )
}

function cardLabel(card) {
  return resolveDisplayName({
    displayName: card.displayName,
    issuerBank: card.issuerBank,
    cardNumber: card.cardNumber,
  })
}

function cardSubtitle(card) {
  const brand = detectBrand(card.cardNumber)
  const brandText = brand !== 'unknown' ? brandLabel(brand) : ''
  const tail = last4(card.cardNumber)
  const parts = [brandText, tail ? `•••• ${tail}` : ''].filter(Boolean)
  return parts.join(' · ') || card.cardholderName || ''
}
