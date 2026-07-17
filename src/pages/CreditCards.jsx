import { useEffect, useMemo, useState } from 'react'
import {
  CreditCard,
  Loader2,
  Lock,
  LockKeyhole,
  Plus,
  Search,
  TriangleAlert,
  Wand2,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { CreditCardRow } from '@/patterns/CreditCardRow'
import { HeaderIconButton, PageHeader } from '@/patterns/PageHeader'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVault } from '@/providers/VaultProvider'
import {
  findMatchingCreditCard,
  useDecryptedCreditCards,
} from '@/hooks/useDecryptedCreditCards'
import { updateCreditCard } from '@/lib/creditCardsApi'
import { capturePageCreditCard } from '@/lib/pageCardCapture'
import { detectBrand, last4, resolveDisplayName } from '@/lib/cardUtils'
import {
  clearVaultItemDirty,
  markVaultItemDirty,
} from '@/lib/vaultItemDirty'
import {
  optimisticUpsertVaultItem,
  revertVaultItemCaches,
  snapshotVaultItemCaches,
} from '@/lib/vaultItemsCache'
import { usePersistedListView } from '@/hooks/usePersistedListView'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './CreditCards.module.scss'

const STREAM = 'credit_cards'

const SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
]

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'has_notes', label: 'Has notes' },
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'Amex' },
  { value: 'other', label: 'Other' },
]

const LIST_VIEW_STORAGE_KEY = 'accesso.creditCards.listView'

const OTHER_BRANDS = new Set(['discover', 'jcb', 'diners', 'unionpay', 'unknown'])

export function CreditCards() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const vault = useVault()
  const { goCreditCardNew, goCreditCardEdit } = useNavigation()
  const queryClient = useQueryClient()
  const extensionMode = isExtension()

  const { search, setSearch, sort, setSort, filter, setFilter } =
    usePersistedListView({
      storageKey: LIST_VIEW_STORAGE_KEY,
      sortValues: SORT_OPTIONS.map((o) => o.value),
      filterValues: FILTER_OPTIONS.map((o) => o.value),
      defaults: { search: '', sort: 'updated_desc', filter: 'all' },
    })
  const [capturing, setCapturing] = useState(false)
  const [captureError, setCaptureError] = useState(null)

  const { decrypted, isLoading, isDecrypting, error, listQuery } =
    useDecryptedCreditCards()

  const favoriteMutation = useMutation({
    mutationFn: async ({ card, nextFavorite }) => {
      if (!userId) throw new Error('not signed in')
      const payload = {
        cardholderName: card.cardholderName ?? '',
        cardNumber: String(card.cardNumber || '').replace(/\D+/g, ''),
        expMonth: card.expMonth ?? '',
        expYear: card.expYear ?? '',
        cvv: card.cvv ?? '',
        issuerBank: card.issuerBank ?? '',
        billingZip: card.billingZip ?? '',
        pin: card.pin ?? '',
        notes: card.notes ?? '',
        isFavorite: nextFavorite,
      }
      const { ciphertext, iv } = await vault.encryptRecord(payload)
      const now = new Date().toISOString()
      const optimistic = {
        id: card.id,
        user_id: userId,
        display_name: card.displayName ?? '',
        ciphertext,
        iv,
        created_at: card.createdAt ?? now,
        updated_at: now,
      }
      const snapshot = snapshotVaultItemCaches(
        queryClient,
        STREAM,
        userId,
        card.id,
      )
      markVaultItemDirty(STREAM, card.id)
      optimisticUpsertVaultItem(queryClient, STREAM, userId, optimistic)
      try {
        const result = await updateCreditCard(userId, card.id, {
          displayName: card.displayName ?? '',
          ciphertext,
          iv,
        })
        clearVaultItemDirty(STREAM, card.id)
        return result
      } catch (err) {
        revertVaultItemCaches(queryClient, snapshot)
        clearVaultItemDirty(STREAM, card.id)
        throw err
      }
    },
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let out = decrypted
    if (filter === 'favorites') {
      out = out.filter((c) => c.isFavorite)
    } else if (filter === 'has_notes') {
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
        // Favorites float to the top within "recently updated".
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
    }
    return sorted
  }, [decrypted, search, sort, filter])

  async function handleCapture() {
    setCapturing(true)
    setCaptureError(null)
    let detected
    try {
      detected = await capturePageCreditCard()
    } catch (err) {
      setCaptureError(err?.message ?? 'Could not capture from this page.')
      setCapturing(false)
      return
    }
    try {
      const match = findMatchingCreditCard(decrypted, detected.cardNumber)
      const seedBase = {
        hostname: detected.hostname,
        cardholderName: detected.cardholderName,
        cardNumber: detected.cardNumber,
        expMonth: detected.expMonth,
        expYear: detected.expYear,
        cvv: detected.cvv,
        billingZip: detected.billingZip,
      }
      if (!match) {
        goCreditCardNew({
          seed: {
            mode: 'new',
            title: detected.title,
            ...seedBase,
          },
        })
        return
      }
      goCreditCardEdit(match.id, {
        seed: {
          mode: 'update',
          ...seedBase,
        },
      })
    } finally {
      setCapturing(false)
    }
  }

  const { isLocked, requestUnlock } = vault
  useEffect(() => {
    if (isLocked) {
      requestUnlock({ dismissible: false })
    }
  }, [isLocked, requestUnlock])

  if (vault.isLocked) {
    return (
      <LockedPlaceholder onUnlock={() => vault.requestUnlock({ dismissible: false })} />
    )
  }

  const loading = isLoading || isDecrypting
  const isEmpty = !loading && filtered.length === 0
  const errorMessage = error?.message ?? listQuery.error?.message ?? null

  return (
    <div className={styles.page}>
      <PageHeader
        title="Credit cards"
        subtitle={`${decrypted.length} ${decrypted.length === 1 ? 'card' : 'cards'}`}
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
                aria-label="Capture card from current page"
                title="Capture card from the current page"
                onClick={handleCapture}
                disabled={capturing}
              >
                {capturing ? (
                  <Loader2 size={16} aria-hidden="true" className={styles.spin} />
                ) : (
                  <Wand2 size={16} aria-hidden="true" />
                )}
              </HeaderIconButton>
            )}
            <HeaderIconButton
              aria-label="Add card"
              title="Add card"
              onClick={() => goCreditCardNew()}
            >
              <Plus size={16} aria-hidden="true" />
            </HeaderIconButton>
          </>
        }
      />

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

      {(errorMessage || captureError) && (
        <div className={cx(styles.status, styles.statusError)}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{captureError || errorMessage}</span>
        </div>
      )}

      {loading && (
        <div className={styles.emptyState}>Loading credit cards…</div>
      )}

      {isEmpty && !errorMessage && (
        <EmptyState
          hasAny={decrypted.length > 0}
          onAdd={() => goCreditCardNew()}
        />
      )}

      {!loading && filtered.length > 0 && (
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
                  onToggleFavorite={(c) =>
                    favoriteMutation.mutate({
                      card: c,
                      nextFavorite: !c.isFavorite,
                    })
                  }
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
      <PageHeader title="Credit cards" subtitle="Locked" />
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
