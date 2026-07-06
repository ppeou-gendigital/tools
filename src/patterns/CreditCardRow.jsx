import { forwardRef, useEffect, useRef, useState } from 'react'
import {
  CalendarClock,
  Check,
  Copy,
  CreditCard,
  Hash,
  Pencil,
  ShieldCheck,
  StickyNote,
  TriangleAlert,
} from 'lucide-react'
import { Popover } from '@/patterns/Popover'
import { cx } from '@/lib/cx'
import {
  brandLabel,
  detectBrand,
  last4,
  maskedCardNumber,
  resolveDisplayName,
} from '@/lib/cardUtils'
import styles from './CreditCardRow.module.scss'

async function writeClipboard(value) {
  if (!value) return false
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch (err) {
    console.warn('[acceso] clipboard write failed', err)
    return false
  }
}

// Format expiration month + year for copy + display. Uses 2-digit
// month and 2-digit year (MM / YY), which is what card-not-present
// forms almost always expect. If either field is missing we return
// whatever we've got so the row doesn't render a lone slash.
function formatExpiry(month, year) {
  const m = String(month ?? '').trim()
  const y = String(year ?? '').trim()
  if (!m && !y) return ''
  const mm = m ? m.padStart(2, '0').slice(0, 2) : ''
  const yy = y.length >= 4 ? y.slice(-2) : y
  if (mm && yy) return `${mm} / ${yy}`
  return mm || yy
}

// A single credit card rendered as one grid-row inside the tabular
// list. Columns mirror CredentialRow's rhythm: brand+name, cardholder
// (secondary text), copy-number, copy-cvv, copy-expiry, note, edit.
// The three copy icons flash briefly on success so the user sees the
// copy landed without a popover round-trip.
export function CreditCardRow({ card, onEdit }) {
  const { id, displayName, cardholderName, cardNumber, cvv, expMonth, expYear, notes, issuerBank, error } = card
  const numBtnRef = useRef(null)
  const cvvBtnRef = useRef(null)
  const expBtnRef = useRef(null)
  const noteBtnRef = useRef(null)
  const [openPop, setOpenPop] = useState(null) // 'note' | null
  const [flash, setFlash] = useState(null) // 'num' | 'cvv' | 'exp' | null
  const flashTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    }
  }, [])

  function triggerFlash(which) {
    setFlash(which)
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    flashTimerRef.current = setTimeout(() => setFlash(null), 1200)
  }

  async function copyValue(value, which) {
    const ok = await writeClipboard(value)
    if (ok) triggerFlash(which)
  }

  async function handleCopyNumber() {
    if (!cardNumber) return
    // Strip formatting spaces/dashes before copying so pasted values
    // land cleanly into single-line card-number inputs.
    await copyValue(String(cardNumber).replace(/\s|-/g, ''), 'num')
  }

  async function handleCopyCvv() {
    if (!cvv) return
    await copyValue(String(cvv), 'cvv')
  }

  async function handleCopyExpiry() {
    const value = formatExpiry(expMonth, expYear)
    if (!value) return
    await copyValue(value, 'exp')
  }

  function handleNoteClick() {
    setOpenPop(openPop === 'note' ? null : 'note')
  }

  if (error) {
    return (
      <div className={cx(styles.row, styles.rowError)} role="row">
        <div className={styles.nameCell} role="cell">
          <span className={styles.icon} aria-hidden="true">
            <TriangleAlert size={14} />
          </span>
          <span className={styles.name} title={displayName}>
            {displayName || 'Unreadable card'}
          </span>
        </div>
        <div className={cx(styles.holderCell, styles.subtle)} role="cell">
          Could not decrypt this entry.
        </div>
        <div className={styles.iconCell} aria-hidden="true" />
        <div className={styles.iconCell} aria-hidden="true" />
        <div className={styles.iconCell} aria-hidden="true" />
        <div className={styles.iconCell} aria-hidden="true" />
        <div className={styles.iconCell} role="cell">
          <IconButton
            icon={Pencil}
            label="Edit"
            onClick={() => onEdit?.(id)}
          />
        </div>
      </div>
    )
  }

  const brand = detectBrand(cardNumber)
  const resolvedName = resolveDisplayName({ displayName, issuerBank, cardNumber })
  const tail = last4(cardNumber)
  const masked = maskedCardNumber(cardNumber)
  const hasNumber = !!tail
  const hasCvv = typeof cvv === 'string' && cvv.trim().length > 0
  const hasExp = !!formatExpiry(expMonth, expYear)
  const hasNotes = typeof notes === 'string' && notes.trim().length > 0
  const brandBadge = brand !== 'unknown' ? brandLabel(brand) : null

  return (
    <div className={styles.row} role="row">
      <div className={styles.nameCell} role="cell">
        <span
          className={cx(styles.icon, styles[`brand_${brand}`])}
          aria-hidden="true"
          title={brandBadge ?? undefined}
        >
          <CreditCard size={16} />
        </span>
        <div className={styles.nameStack}>
          <span className={styles.name} title={resolvedName}>
            {resolvedName}
          </span>
          {masked && (
            <span className={styles.subtitle} title={masked}>
              {masked}
            </span>
          )}
        </div>
        {brandBadge && (
          <span className={styles.badge} title={brandBadge}>
            {brandBadge}
          </span>
        )}
      </div>

      <div className={styles.holderCell} role="cell">
        {cardholderName ? (
          <span className={styles.holder} title={cardholderName}>
            {cardholderName}
          </span>
        ) : (
          <span className={cx(styles.holder, styles.subtle)}>—</span>
        )}
      </div>

      <div className={styles.iconCell} role="cell">
        <IconButton
          ref={numBtnRef}
          icon={flash === 'num' ? Check : Hash}
          label="Copy card number"
          onClick={handleCopyNumber}
          disabled={!hasNumber}
          ok={flash === 'num'}
        />
      </div>

      <div className={styles.iconCell} role="cell">
        <IconButton
          ref={cvvBtnRef}
          icon={flash === 'cvv' ? Check : ShieldCheck}
          label="Copy CVV"
          onClick={handleCopyCvv}
          disabled={!hasCvv}
          ok={flash === 'cvv'}
        />
      </div>

      <div className={styles.iconCell} role="cell">
        <IconButton
          ref={expBtnRef}
          icon={flash === 'exp' ? Check : CalendarClock}
          label="Copy expiration"
          onClick={handleCopyExpiry}
          disabled={!hasExp}
          ok={flash === 'exp'}
        />
      </div>

      <div className={styles.iconCell} role="cell">
        {hasNotes ? (
          <IconButton
            ref={noteBtnRef}
            icon={StickyNote}
            label="Show note"
            onClick={handleNoteClick}
            active={openPop === 'note'}
            aria-haspopup="dialog"
            aria-expanded={openPop === 'note'}
          />
        ) : (
          <span className={styles.iconPlaceholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.iconCell} role="cell">
        <IconButton
          icon={Pencil}
          label="Edit"
          onClick={() => onEdit?.(id)}
        />
      </div>

      <NotePopover
        open={openPop === 'note'}
        anchorRef={noteBtnRef}
        notes={notes}
        onDismiss={() => setOpenPop(null)}
      />
    </div>
  )
}

function NotePopover({ open, anchorRef, notes, onDismiss }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function handleCopyAll() {
    const ok = await writeClipboard(notes ?? '')
    if (ok) {
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <Popover open={open} anchorRef={anchorRef} onDismiss={onDismiss} ariaLabel="Note">
      <div className={styles.noteHeader}>
        <span>Note</span>
        <button
          type="button"
          className={cx(styles.noteCopyBtn, copied && styles.miniBtnOk)}
          onClick={handleCopyAll}
          title="Copy note"
          aria-label="Copy note"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <div className={styles.noteBody}>{notes}</div>
    </Popover>
  )
}

const IconButton = forwardRef(function IconButton(
  { icon: Icon, label, onClick, disabled, active, ok, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx(
        styles.miniBtn,
        active && styles.miniBtnActive,
        ok && styles.miniBtnOk,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon size={13} />
    </button>
  )
})
