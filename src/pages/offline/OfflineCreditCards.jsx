import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVault } from '@/providers/VaultProvider'
import { useOfflineVaultDecrypt } from '@/hooks/useOfflineVaultDecrypt'
import { formatCardNumber, last4, resolveDisplayName } from '@/lib/cardUtils'

function cardLabel(c) {
  return resolveDisplayName({
    displayName: c.displayName,
    issuerBank: c.issuerBank,
    cardNumber: c.cardNumber,
  })
}
import { OfflineBanner } from './OfflineBanner'
import styles from './Offline.module.scss'

async function writeClipboard(value) {
  if (!value) return false
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

export function OfflineCreditCards() {
  const vault = useVault()
  const { goHome, navigate, params, goBack, previousRouteLabel } =
    useNavigation()
  const detailId = params?.id ?? null
  const { decrypted, loading, decrypting, syncedAt, integrityFailed } =
    useOfflineVaultDecrypt('creditCards')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (vault.isLocked) {
      vault.requestUnlock({ dismissible: false })
    }
  }, [vault.isLocked, vault])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let out = decrypted.filter((c) => !c.error)
    if (q) {
      out = out.filter((c) => {
        const label = cardLabel(c).toLowerCase()
        if (label.includes(q)) return true
        if (last4(c.cardNumber).includes(q)) return true
        if (c.cardholderName?.toLowerCase().includes(q)) return true
        return false
      })
    }
    return out
  }, [decrypted, search])

  const detail = useMemo(
    () => decrypted.find((c) => c.id === detailId) ?? null,
    [decrypted, detailId],
  )

  if (detailId) {
    return (
      <OfflineCardDetail
        item={detail}
        loading={loading || decrypting}
        syncedAt={syncedAt}
        onBack={() =>
          previousRouteLabel ? goBack() : navigate('credit-cards')
        }
        backLabel={previousRouteLabel ?? 'Credit cards'}
      />
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Credit cards"
        leading={
          <Button variant="ghost" size="sm" onClick={goHome}>
            <ArrowLeft size={14} aria-hidden="true" />
            Home
          </Button>
        }
      />
      <OfflineBanner syncedAt={syncedAt} />
      {!vault.isUnlocked ? (
        <p className={styles.hint}>Unlock to decrypt cards.</p>
      ) : (
        <>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            aria-label="Search cards"
          />
          {(loading || decrypting) && (
            <p className={styles.hint}>
              <Loader2 size={14} aria-hidden="true" /> Decrypting…
            </p>
          )}
          {integrityFailed && (
            <p className={styles.error}>
              Could not decrypt items. Wrong passphrase or stale offline pack.
            </p>
          )}
          {!loading && !decrypting && filtered.length === 0 && (
            <p className={styles.hint}>No cards in this offline copy.</p>
          )}
          <ul className={styles.list}>
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => navigate('credit-cards', { id: c.id })}
                >
                  <span className={styles.rowTitle}>{cardLabel(c)}</span>
                  <span className={styles.rowMeta}>
                    {c.cardholderName ||
                      (last4(c.cardNumber)
                        ? `•••• ${last4(c.cardNumber)}`
                        : 'Card')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function OfflineCardDetail({ item, loading, syncedAt, onBack, backLabel }) {
  const [flash, setFlash] = useState('')

  if (loading && !item) {
    return (
      <div className={styles.page}>
        <PageHeader title="Card" />
        <p className={styles.hint}>Loading…</p>
      </div>
    )
  }

  if (!item || item.error) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Card"
          leading={
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft size={14} aria-hidden="true" />
              {backLabel}
            </Button>
          }
        />
        <p className={styles.error}>Not available offline.</p>
      </div>
    )
  }

  async function copy(text, label) {
    const ok = await writeClipboard(text)
    if (ok) {
      setFlash(label)
      window.setTimeout(() => setFlash(''), 1200)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={cardLabel(item)}
        leading={
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {backLabel}
          </Button>
        }
      />
      <OfflineBanner syncedAt={syncedAt} />
      <div className={styles.detail}>
        {item.cardholderName && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Cardholder</span>
            <span className={styles.fieldValue}>{item.cardholderName}</span>
          </div>
        )}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Number</span>
          <div className={styles.actions}>
            <span className={styles.fieldValue}>
              {formatCardNumber(item.cardNumber) || '—'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(item.cardNumber, 'num')}
            >
              <Copy size={12} aria-hidden="true" />
              {flash === 'num' ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Expiry</span>
          <span className={styles.fieldValue}>
            {[item.expMonth, item.expYear].filter(Boolean).join('/') || '—'}
          </span>
        </div>
        {item.cvv && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>CVV</span>
            <div className={styles.actions}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(item.cvv, 'cvv')}
              >
                <Copy size={12} aria-hidden="true" />
                {flash === 'cvv' ? 'Copied' : 'Copy CVV'}
              </Button>
            </div>
          </div>
        )}
        {item.notes && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Notes</span>
            <span className={styles.fieldValue}>{item.notes}</span>
          </div>
        )}
      </div>
    </div>
  )
}
