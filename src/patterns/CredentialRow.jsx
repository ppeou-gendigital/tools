import { forwardRef, useEffect, useRef, useState } from 'react'
import {
  Check,
  Copy,
  Key,
  KeyRound,
  Pencil,
  StickyNote,
  TriangleAlert,
  User,
} from 'lucide-react'
import { Popover } from '@/patterns/Popover'
import { cx } from '@/lib/cx'
import styles from './CredentialRow.module.scss'

// Google's public s2 favicon proxy. No auth required and it works on
// bare domains too. If a domain isn't resolvable we fall back to a
// KeyRound icon; onError below handles that at runtime.
function faviconUrl(urlOrApp) {
  if (!urlOrApp) return null
  const raw = String(urlOrApp).trim()
  if (!raw) return null
  let host
  try {
    host = new URL(raw.startsWith('http') ? raw : `https://${raw}`).hostname
  } catch {
    return null
  }
  if (!host) return null
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`
}

async function writeClipboard(value) {
  if (!value) return false
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch (err) {
    console.warn('[accesso] clipboard write failed', err)
    return false
  }
}

// A single credential rendered as one grid-row inside the tabular
// list. Columns: favicon + name, URL, user-copy, pass-copy, note,
// edit. Icons open a popover picker when the credential has 2+
// accounts and copy directly when there's just one.
export function CredentialRow({ credential, onEdit }) {
  const { id, displayName, urlOrApp, accounts, notes, error } = credential
  const userBtnRef = useRef(null)
  const passBtnRef = useRef(null)
  const noteBtnRef = useRef(null)
  const [openPop, setOpenPop] = useState(null) // 'user' | 'pass' | 'note' | null
  const [flash, setFlash] = useState(null) // 'user' | 'pass' | null
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

  async function copyField(acc, field) {
    const ok = await writeClipboard(acc?.[field] ?? '')
    if (ok) triggerFlash(field === 'username' ? 'user' : 'pass')
  }

  async function handleUserClick() {
    if (!accounts || accounts.length === 0) return
    if (accounts.length === 1) {
      await copyField(accounts[0], 'username')
      return
    }
    setOpenPop(openPop === 'user' ? null : 'user')
  }

  async function handlePassClick() {
    if (!accounts || accounts.length === 0) return
    if (accounts.length === 1) {
      await copyField(accounts[0], 'password')
      return
    }
    setOpenPop(openPop === 'pass' ? null : 'pass')
  }

  function handleNoteClick() {
    setOpenPop(openPop === 'note' ? null : 'note')
  }

  async function handlePick(acc, field) {
    setOpenPop(null)
    await copyField(acc, field)
  }

  if (error) {
    return (
      <div className={cx(styles.row, styles.rowError)} role="row">
        <div className={styles.nameCell} role="cell">
          <span className={styles.icon} aria-hidden="true">
            <TriangleAlert size={14} />
          </span>
          <span className={styles.name} title={displayName}>
            {displayName || 'Unreadable credential'}
          </span>
        </div>
        <div className={cx(styles.urlCell, styles.subtle)} role="cell">
          Could not decrypt this entry.
        </div>
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

  const favicon = faviconUrl(urlOrApp)
  const multiple = accounts?.length > 1
  const hasAccounts = (accounts?.length ?? 0) > 0
  const hasNotes = typeof notes === 'string' && notes.trim().length > 0

  return (
    <div className={styles.row} role="row">
      <div className={styles.nameCell} role="cell">
        <span className={styles.icon} aria-hidden="true">
          {favicon ? <FaviconOrFallback src={favicon} /> : <KeyRound size={16} />}
        </span>
        <span className={styles.name} title={displayName}>
          {displayName}
        </span>
        {multiple && (
          <span className={styles.badge} title={`${accounts.length} accounts`}>
            {accounts.length}
          </span>
        )}
      </div>

      <div className={styles.urlCell} role="cell">
        {urlOrApp ? (
          <span className={styles.url} title={urlOrApp}>
            {urlOrApp}
          </span>
        ) : (
          <span className={cx(styles.url, styles.subtle)}>—</span>
        )}
      </div>

      <div className={styles.iconCell} role="cell">
        <IconButton
          ref={userBtnRef}
          icon={flash === 'user' ? Check : User}
          label={
            multiple ? 'Copy username (pick account)' : 'Copy username'
          }
          onClick={handleUserClick}
          disabled={!hasAccounts}
          active={openPop === 'user'}
          ok={flash === 'user'}
          aria-haspopup={multiple ? 'menu' : undefined}
          aria-expanded={multiple ? openPop === 'user' : undefined}
        />
      </div>

      <div className={styles.iconCell} role="cell">
        <IconButton
          ref={passBtnRef}
          icon={flash === 'pass' ? Check : Key}
          label={
            multiple ? 'Copy password (pick account)' : 'Copy password'
          }
          onClick={handlePassClick}
          disabled={!hasAccounts}
          active={openPop === 'pass'}
          ok={flash === 'pass'}
          aria-haspopup={multiple ? 'menu' : undefined}
          aria-expanded={multiple ? openPop === 'pass' : undefined}
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

      <AccountPickerPopover
        open={openPop === 'user'}
        anchorRef={userBtnRef}
        accounts={accounts}
        field="username"
        onDismiss={() => setOpenPop(null)}
        onPick={handlePick}
      />
      <AccountPickerPopover
        open={openPop === 'pass'}
        anchorRef={passBtnRef}
        accounts={accounts}
        field="password"
        onDismiss={() => setOpenPop(null)}
        onPick={handlePick}
      />
      <NotePopover
        open={openPop === 'note'}
        anchorRef={noteBtnRef}
        notes={notes}
        onDismiss={() => setOpenPop(null)}
      />
    </div>
  )
}

function AccountPickerPopover({ open, anchorRef, accounts, field, onDismiss, onPick }) {
  const label = field === 'username' ? 'Pick account to copy username' : 'Pick account to copy password'
  return (
    <Popover open={open} anchorRef={anchorRef} onDismiss={onDismiss} ariaLabel={label}>
      <div className={styles.pickerHeader}>{label}</div>
      <ul className={styles.pickerList} role="menu">
        {accounts?.map((acc, i) => {
          const value = acc?.[field] ?? ''
          const hasValue = value.length > 0
          const usernameLabel = acc?.username || <span className={styles.subtle}>(no username)</span>
          return (
            <li key={i} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.pickerItem}
                onClick={() => onPick(acc, field)}
                disabled={!hasValue}
                title={
                  hasValue
                    ? `Copy ${field}`
                    : `No ${field} on this account`
                }
              >
                <span className={styles.pickerLabel}>{usernameLabel}</span>
                <span className={styles.pickerHint} aria-hidden="true">
                  {hasValue ? <Copy size={12} /> : '—'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Popover>
  )
}

function NotePopover({ open, anchorRef, notes, onDismiss }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  // No open/close reset effect — the copy-flash auto-clears via the
  // timer below, and the parent always renders <NotePopover /> (only
  // the internal <Popover> mounts/unmounts on `open`), so the timer
  // survives close and reliably clears `copied` back to false.
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

function FaviconOrFallback({ src }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <KeyRound size={16} />
  return (
    <img
      src={src}
      alt=""
      width={16}
      height={16}
      onError={() => setFailed(true)}
      className={styles.faviconImg}
    />
  )
}
