import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CreditCard,
  Lock,
  LockKeyhole,
  Plus,
  Search,
  TriangleAlert,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { CreditCardRow } from '@/patterns/CreditCardRow'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVault } from '@/providers/VaultProvider'
import { listCreditCards } from '@/lib/creditCardsApi'
import { detectBrand, last4, resolveDisplayName } from '@/lib/cardUtils'
import { cx } from '@/lib/cx'
import styles from './CreditCards.module.scss'

const SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
]

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'has_notes', label: 'Has notes' },
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'Amex' },
  { value: 'other', label: 'Other' },
]

// Brand codes that fold into the "Other" filter chip. Anything not
// listed here (and not one of the top-3 explicit chips) counts as
// "other" — that includes Discover, JCB, Diners, UnionPay, and any
// unresolvable numbers.
const OTHER_BRANDS = new Set(['discover', 'jcb', 'diners', 'unionpay', 'unknown'])

export function CreditCards() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const vault = useVault()
  const {
    goBack,
    previousRouteLabel,
    goCreditCardNew,
    goCreditCardEdit,
  } = useNavigation()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('updated_desc')
  const [filter, setFilter] = useState('all')
  const [decrypted, setDecrypted] = useState([])
  const [decrypting, setDecrypting] = useState(false)

  const listQuery = useQuery({
    queryKey: ['credit_cards', userId],
    queryFn: () => listCreditCards(userId),
    enabled: !!userId && vault.isUnlocked,
  })

  // Decrypt when either the row set or the vault key changes. Same
  // pattern as Credentials: rows that fail to decrypt stay in the
  // list marked `error: true` so the user can still delete them.
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
              cardholderName: plain?.cardholderName ?? '',
              cardNumber: plain?.cardNumber ?? '',
              expMonth: plain?.expMonth ?? '',
              expYear: plain?.expYear ?? '',
              cvv: plain?.cvv ?? '',
              issuerBank: plain?.issuerBank ?? '',
              billingZip: plain?.billingZip ?? '',
              pin: plain?.pin ?? '',
              notes: plain?.notes ?? '',
              updatedAt: row.updated_at,
              createdAt: row.created_at,
              error: false,
            }
          } catch (err) {
            console.warn('[acceso] credit card decrypt failed', err)
            return {
              id: row.id,
              displayName: row.display_name,
              cardholderName: '',
              cardNumber: '',
              expMonth: '',
              expYear: '',
              cvv: '',
              issuerBank: '',
              billingZip: '',
              pin: '',
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
    } else if (filter === 'visa' || filter === 'mastercard' || filter === 'amex') {
      out = out.filter((c) => detectBrand(c.cardNumber) === filter)
    } else if (filter === 'other') {
      out = out.filter((c) => OTHER_BRANDS.has(detectBrand(c.cardNumber)))
    }
    if (q) {
      out = out.filter((c) => {
        const resolved = resolveDisplayName({
          displayName: c.displayName,
          issuerBank: c.issuerBank,
          cardNumber: c.cardNumber,
        }).toLowerCase()
        if (resolved.includes(q)) return true
        if (c.displayName?.toLowerCase().includes(q)) return true
        if (c.issuerBank?.toLowerCase().includes(q)) return true
        if (c.cardholderName?.toLowerCase().includes(q)) return true
        if (last4(c.cardNumber).includes(q)) return true
        return false
      })
    }
    const sorted = [...out]
    // Sort by the resolved display name (user name if set, otherwise
    // Issuer •••• last4) so blank-name rows land in a predictable
    // spot rather than clustering at the start of the alphabet.
    const nameOf = (c) =>
      resolveDisplayName({
        displayName: c.displayName,
        issuerBank: c.issuerBank,
        cardNumber: c.cardNumber,
      })
    if (sort === 'name_asc') {
      sorted.sort((a, b) => nameOf(a).localeCompare(nameOf(b)))
    } else if (sort === 'name_desc') {
      sorted.sort((a, b) => nameOf(b).localeCompare(nameOf(a)))
    } else {
      sorted.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
    }
    return sorted
  }, [decrypted, search, sort, filter])

  // While the vault is locked, raise the non-dismissible unlock
  // overlay. Effect re-fires if the vault re-locks (auto-lock,
  // manual lock) while the user is still on this page.
  const { isLocked, requestUnlock } = vault
  useEffect(() => {
    if (isLocked) {
      requestUnlock({ dismissible: false })
    }
  }, [isLocked, requestUnlock])

  if (vault.isLocked) return <LockedPlaceholder onBack={goBack} previousRouteLabel={previousRouteLabel} onUnlock={() => vault.requestUnlock({ dismissible: false })} />

  const isLoading = listQuery.isLoading || decrypting
  const isEmpty = !isLoading && filtered.length === 0
  const errorMessage = listQuery.error?.message ?? null

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button variant="ghost" size="sm" onClick={goBack} className={styles.back}>
          <ArrowLeft size={14} aria-hidden="true" />
          {previousRouteLabel ?? 'Back'}
        </Button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Credit cards</h1>
          <p className={styles.subtitle}>
            {decrypted.length} {decrypted.length === 1 ? 'card' : 'cards'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => vault.lock()}
            className={styles.lockBtn}
            title="Lock vault"
          >
            <Lock size={14} aria-hidden="true" />
            Lock
          </Button>
          <Button size="sm" onClick={() => goCreditCardNew()}>
            <Plus size={14} aria-hidden="true" />
            Add
          </Button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={14} aria-hidden="true" className={styles.searchIcon} />
          <Input
            className={styles.searchInput}
            placeholder="Search by name, issuer, cardholder, or last 4"
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
        <div className={styles.emptyState}>Loading credit cards…</div>
      )}

      {isEmpty && !errorMessage && (
        <EmptyState
          hasAny={decrypted.length > 0}
          onAdd={() => goCreditCardNew()}
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <div className={styles.table} role="table" aria-label="Credit cards">
          <div className={styles.tableHeader} role="row">
            <span role="columnheader">Name</span>
            <span role="columnheader">Cardholder</span>
            <span role="columnheader" className={styles.srOnly}>Number</span>
            <span role="columnheader" className={styles.srOnly}>CVV</span>
            <span role="columnheader" className={styles.srOnly}>Expiration</span>
            <span role="columnheader" className={styles.srOnly}>Note</span>
            <span role="columnheader" className={styles.srOnly}>Edit</span>
          </div>
          <ul className={styles.rows}>
            {filtered.map((card) => (
              <li key={card.id}>
                <CreditCardRow
                  card={card}
                  onEdit={(id) => goCreditCardEdit(id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function LockedPlaceholder({ onBack, previousRouteLabel, onUnlock }) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button variant="ghost" size="sm" onClick={onBack} className={styles.back}>
          <ArrowLeft size={14} aria-hidden="true" />
          {previousRouteLabel ?? 'Back'}
        </Button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Credit cards</h1>
          <p className={styles.subtitle}>Locked</p>
        </div>
      </div>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon} aria-hidden="true">
          <LockKeyhole size={20} />
        </div>
        <p className={styles.emptyTitle}>Vault locked</p>
        <p className={styles.emptyBody}>
          Enter your master passphrase to view and edit your credit cards.
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
        <CreditCard size={20} />
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
          <p className={styles.emptyTitle}>No cards yet</p>
          <p className={styles.emptyBody}>
            Add your first card to keep number, CVV, and expiry a click away.
          </p>
          <Button size="sm" onClick={onAdd}>
            <Plus size={14} aria-hidden="true" />
            Add card
          </Button>
        </>
      )}
    </div>
  )
}
