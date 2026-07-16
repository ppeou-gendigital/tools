import { useEffect, useMemo, useState } from 'react'
import {
  KeyRound,
  Loader2,
  Lock,
  LockKeyhole,
  Plus,
  Search,
  TriangleAlert,
  Wand2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { CredentialRow } from '@/patterns/CredentialRow'
import { HeaderIconButton, PageHeader } from '@/patterns/PageHeader'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVault } from '@/providers/VaultProvider'
import { listCredentials } from '@/lib/credentialsApi'
import { capturePageCredentials } from '@/lib/pageCapture'
import { findMatchingCredential, hostnameOf } from '@/lib/urlMatch'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './Credentials.module.scss'

const SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
]

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'has_notes', label: 'Has notes' },
  { value: 'multi_account', label: 'Multiple accounts' },
]

export function Credentials() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const vault = useVault()
  const { goCredentialNew, goCredentialEdit } = useNavigation()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('updated_desc')
  const [filter, setFilter] = useState('all')
  const [decrypted, setDecrypted] = useState([])
  const [decrypting, setDecrypting] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [captureError, setCaptureError] = useState(null)
  const extensionMode = isExtension()

  const listQuery = useQuery({
    queryKey: ['credentials', userId],
    queryFn: () => listCredentials(userId),
    enabled: !!userId && vault.isUnlocked,
  })

  // Decrypt when either the row set or the vault key changes. We
  // debounce nothing here; decrypt cost per row is a single AES-GCM
  // call and the list is small. If any row fails, keep it in the list
  // marked `error: true` so the user can still delete it.
  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!listQuery.data) {
        setDecrypted([])
        return
      }
      setDecrypting(true)
      const results = await Promise.all(
        listQuery.data.map(async (row) => {
          try {
            const plain = await vault.decryptRecord({
              ciphertext: row.ciphertext,
              iv: row.iv,
            })
            return {
              id: row.id,
              displayName: row.display_name,
              urlOrApp: plain?.urlOrApp ?? '',
              accounts: Array.isArray(plain?.accounts) ? plain.accounts : [],
              notes: plain?.notes ?? '',
              updatedAt: row.updated_at,
              createdAt: row.created_at,
              error: false,
            }
          } catch (err) {
            console.warn('[accesso] credential decrypt failed', err)
            return {
              id: row.id,
              displayName: row.display_name,
              urlOrApp: '',
              accounts: [],
              notes: '',
              updatedAt: row.updated_at,
              createdAt: row.created_at,
              error: true,
            }
          }
        }),
      )
      if (!cancelled) {
        setDecrypted(results)
        setDecrypting(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [listQuery.data, vault])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let out = decrypted
    if (filter === 'has_notes') {
      out = out.filter((c) => c.notes && c.notes.trim().length > 0)
    } else if (filter === 'multi_account') {
      out = out.filter((c) => (c.accounts?.length ?? 0) > 1)
    }
    if (q) {
      out = out.filter((c) => {
        if (c.displayName?.toLowerCase().includes(q)) return true
        if (c.urlOrApp?.toLowerCase().includes(q)) return true
        for (const acc of c.accounts ?? []) {
          if (acc.username?.toLowerCase().includes(q)) return true
        }
        return false
      })
    }
    const sorted = [...out]
    if (sort === 'name_asc') {
      sorted.sort((a, b) => a.displayName.localeCompare(b.displayName))
    } else if (sort === 'name_desc') {
      sorted.sort((a, b) => b.displayName.localeCompare(a.displayName))
    } else {
      sorted.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
    }
    return sorted
  }, [decrypted, search, sort, filter])

  // While the vault is locked, ask the provider to raise a
  // non-dismissible unlock overlay. The overlay covers the page and
  // the placeholder below is what the user briefly sees in the
  // background. The effect re-fires if the user manually locks the
  // vault while still on this page. `requestUnlock` is a stable
  // callback keyed on status, so it's safe as an effect dep.
  const { isLocked, requestUnlock } = vault
  useEffect(() => {
    if (isLocked) {
      requestUnlock({ dismissible: false })
    }
  }, [isLocked, requestUnlock])

  // Read login fields from the active tab and route the user into
  // the edit form pre-filled with what we found. The Credentials
  // page never mutates the store itself — every branch below lands
  // in CredentialEdit for a review-and-save step.
  async function handleCapture() {
    setCapturing(true)
    setCaptureError(null)
    let detected
    try {
      detected = await capturePageCredentials()
    } catch (err) {
      setCaptureError(err?.message ?? 'Could not capture from this page.')
      setCapturing(false)
      return
    }
    try {
      const host = hostnameOf(detected.url) ?? detected.hostname
      const match = findMatchingCredential(decrypted, host)
      if (!match) {
        goCredentialNew({
          seed: {
            mode: 'new',
            url: detected.origin,
            title: detected.title,
            hostname: host,
            username: detected.username,
            password: detected.password,
          },
        })
        return
      }
      const targetUsername = (detected.username || '').trim()
      const accountIdx = targetUsername
        ? match.accounts.findIndex(
            (a) => (a.username || '').trim() === targetUsername,
          )
        : -1
      if (accountIdx >= 0) {
        goCredentialEdit(match.id, {
          seed: {
            mode: 'update-account',
            accountIdx,
            username: detected.username,
            password: detected.password,
            hostname: host,
          },
        })
      } else {
        goCredentialEdit(match.id, {
          seed: {
            mode: 'add-account',
            username: detected.username,
            password: detected.password,
            hostname: host,
          },
        })
      }
    } finally {
      setCapturing(false)
    }
  }

  if (vault.isLocked) return <LockedPlaceholder onUnlock={() => vault.requestUnlock({ dismissible: false })} />

  const isLoading = listQuery.isLoading || decrypting
  const isEmpty = !isLoading && filtered.length === 0
  const errorMessage = listQuery.error?.message ?? null

  return (
    <div className={styles.page}>
      <PageHeader
        title="Credentials"
        subtitle={`${decrypted.length} ${decrypted.length === 1 ? 'entry' : 'entries'}`}
        actions={
          <>
            <HeaderIconButton
              aria-label="Lock vault"
              title="Lock vault"
              onClick={() => vault.lock()}
            >
              <Lock size={16} aria-hidden="true" />
            </HeaderIconButton>
            {extensionMode && (
              <HeaderIconButton
                aria-label="Capture login from current page"
                title="Capture login from the current page"
                onClick={handleCapture}
                disabled={capturing}
              >
                {capturing ? (
                  <Loader2
                    size={16}
                    aria-hidden="true"
                    className={styles.spin}
                  />
                ) : (
                  <Wand2 size={16} aria-hidden="true" />
                )}
              </HeaderIconButton>
            )}
            <HeaderIconButton
              aria-label="Add credential"
              title="Add credential"
              onClick={() => goCredentialNew()}
            >
              <Plus size={16} aria-hidden="true" />
            </HeaderIconButton>
          </>
        }
      />

      {captureError && (
        <div className={cx(styles.captureStatus, styles.statusError)}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{captureError}</span>
        </div>
      )}

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={14} aria-hidden="true" className={styles.searchIcon} />
          <Input
            className={styles.searchInput}
            placeholder="Search by name, url, or username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.toolbarRow}>
          <select
            className={styles.select}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <div className={styles.chips} role="group" aria-label="Filter">
            {FILTER_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                className={cx(styles.chip, filter === o.value && styles.chipActive)}
                onClick={() => setFilter(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className={cx(styles.status, styles.statusError)}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading && (
        <div className={styles.emptyState}>Loading credentials…</div>
      )}

      {isEmpty && !errorMessage && (
        <EmptyState
          hasAny={decrypted.length > 0}
          onAdd={() => goCredentialNew()}
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <div className={styles.table} role="table" aria-label="Credentials">
          <div className={styles.tableHeader} role="row">
            <span role="columnheader">Name</span>
            <span role="columnheader">URL / app</span>
            <span role="columnheader" className={styles.srOnly}>User</span>
            <span role="columnheader" className={styles.srOnly}>Password</span>
            <span role="columnheader" className={styles.srOnly}>Note</span>
            <span role="columnheader" className={styles.srOnly}>Edit</span>
          </div>
          <ul className={styles.rows}>
            {filtered.map((cred) => (
              <li key={cred.id}>
                <CredentialRow
                  credential={cred}
                  onEdit={(id) => goCredentialEdit(id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function LockedPlaceholder({ onUnlock }) {
  return (
    <div className={styles.page}>
      <PageHeader title="Credentials" subtitle="Locked" />
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon} aria-hidden="true">
          <LockKeyhole size={20} />
        </div>
        <p className={styles.emptyTitle}>Vault locked</p>
        <p className={styles.emptyBody}>
          Enter your master passphrase to view and edit your credentials.
        </p>
        <Button size="sm" onClick={onUnlock}>
          <Lock size={14} aria-hidden="true" />
          Unlock
        </Button>
      </div>
    </div>
  )
}

function EmptyState({ hasAny, onAdd }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon} aria-hidden="true">
        <KeyRound size={20} />
      </div>
      {hasAny ? (
        <>
          <p className={styles.emptyTitle}>No matches</p>
          <p className={styles.emptyBody}>
            Try a different search or filter.
          </p>
        </>
      ) : (
        <>
          <p className={styles.emptyTitle}>Your vault is empty</p>
          <p className={styles.emptyBody}>
            Add your first credential to start filling in logins from any device.
          </p>
          <Button size="sm" onClick={onAdd}>
            <Plus size={14} aria-hidden="true" />
            Add credential
          </Button>
        </>
      )}
    </div>
  )
}
