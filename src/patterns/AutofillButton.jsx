import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, Sparkles, TriangleAlert } from 'lucide-react'
import { HeaderIconButton } from '@/patterns/PageHeader'
import { Popover } from '@/patterns/Popover'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { useDecryptedCredentials } from '@/hooks/useDecryptedCredentials'
import { getActiveTabInfo } from '@/lib/activeTab'
import { autofillActiveTab } from '@/lib/pageAutofill'
import { findAllMatchingCredentials } from '@/lib/urlMatch'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './AutofillButton.module.scss'

// Ambient "log me in" button that lives inside the app toolbar and
// only reveals itself when three things line up: we're in the
// extension build, the vault is unlocked, and the user's saved
// credentials contain at least one hostname match for the active
// tab. Anything short of that and the button is invisible — the
// header stays clean.
//
// One-match-one-account is a single click. Multiple accounts or
// multiple matching credentials get a small picker popover so the
// user always picks which identity is going in.
//
// Firing the fill happens in the active tab, not the popup. See
// src/lib/pageAutofill.js + src/lib/pageFiller.js — same permission
// model as the Capture button (activeTab + scripting).

// Green-check confirmation before the popup dismisses itself so the
// user is back on the tab they just filled. Kept short — the fill
// itself is the real signal, this is just a beat of acknowledgement.
const SUCCESS_FLASH_MS = 600
// Longer window on the error path so the user has time to read the
// tooltip explaining what went wrong. No auto-close on error.
const ERROR_FLASH_MS = 1400

export function AutofillButton() {
  const { user } = useAuth()
  const vault = useVault()
  const extensionMode = isExtension()
  const enabled = extensionMode && !!user && vault.isUnlocked

  const [tabInfo, setTabInfo] = useState(null)
  useEffect(() => {
    if (!enabled) {
      setTabInfo(null)
      return
    }
    let cancelled = false
    getActiveTabInfo().then((info) => {
      if (!cancelled) setTabInfo(info)
    })
    return () => {
      cancelled = true
    }
  }, [enabled])

  const { decrypted } = useDecryptedCredentials()

  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null) // { kind: 'ok' | 'err', message?: string } | null
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

  const matches = findAllMatchingCredentials(decrypted, tabInfo.hostname)
  const entries = flattenEntries(matches)
  if (entries.length === 0) return null

  async function runFill(entry) {
    setOpen(false)
    setBusy(true)
    setStatus(null)
    try {
      await autofillActiveTab({
        username: entry.username,
        password: entry.password,
      })
      setBusy(false)
      setStatus({ kind: 'ok' })
      // Brief green-check flash, then close the popup so control
      // returns to the target tab. `window.close()` is the standard
      // MV3 popup dismiss — no messaging or chrome.windows API needed.
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        try {
          window.close()
        } catch {
          // no-op in web build / dev harness where close() may throw
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
    if (entries.length === 1) {
      runFill(entries[0])
      return
    }
    setOpen((v) => !v)
  }

  const singleMatch = entries.length === 1
  const label = singleMatch
    ? `Fill ${entries[0].credentialName} on ${tabInfo.hostname}`
    : `${entries.length} matches for ${tabInfo.hostname} — pick one`

  const Icon = busy
    ? Loader2
    : status?.kind === 'ok'
      ? Check
      : status?.kind === 'err'
        ? TriangleAlert
        : Sparkles

  return (
    <>
      <HeaderIconButton
        ref={anchorRef}
        onClick={handleClick}
        disabled={busy}
        aria-label={label}
        aria-haspopup={singleMatch ? undefined : 'menu'}
        aria-expanded={singleMatch ? undefined : open}
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
        open={open && !singleMatch}
        anchorRef={anchorRef}
        onDismiss={() => setOpen(false)}
        ariaLabel="Pick an account to autofill"
        className={styles.popover}
      >
        <div className={styles.pickerHeader}>
          Autofill on <span className={styles.host}>{tabInfo.hostname}</span>
        </div>
        <ul className={styles.pickerList} role="menu">
          {entries.map((entry) => (
            <li key={entry.key} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.pickerItem}
                onClick={() => runFill(entry)}
              >
                <span className={styles.pickerName} title={entry.credentialName}>
                  {entry.credentialName}
                </span>
                <span
                  className={cx(
                    styles.pickerUser,
                    !entry.username && styles.subtle,
                  )}
                  title={entry.username || 'no username'}
                >
                  {entry.username || '(no username)'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    </>
  )
}

// Turn `[credential, ...]` into `[{ credentialId, credentialName,
// accountIdx, username, password, key }, ...]` — one row per account.
// Credentials with zero accounts are dropped (nothing to fill).
function flattenEntries(matches) {
  const out = []
  for (const cred of matches) {
    if (!cred || !Array.isArray(cred.accounts)) continue
    for (let i = 0; i < cred.accounts.length; i++) {
      const acc = cred.accounts[i]
      if (!acc) continue
      const username = acc.username ?? ''
      const password = acc.password ?? ''
      if (!username && !password) continue
      out.push({
        key: `${cred.id}:${i}`,
        credentialId: cred.id,
        credentialName: cred.displayName || cred.urlOrApp || '(unnamed)',
        accountIdx: i,
        username,
        password,
      })
    }
  }
  return out
}
