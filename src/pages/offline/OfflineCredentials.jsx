import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { PageHeader } from '@/patterns/PageHeader'
import { CredentialRow } from '@/patterns/CredentialRow'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVault } from '@/providers/VaultProvider'
import { useOfflineVaultDecrypt } from '@/hooks/useOfflineVaultDecrypt'
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

export function OfflineCredentials() {
  const vault = useVault()
  const { goHome, navigate, params, goBack, previousRouteLabel } =
    useNavigation()
  const detailId = params?.id ?? null
  const { decrypted, loading, decrypting, syncedAt, integrityFailed } =
    useOfflineVaultDecrypt('credentials')
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
        if (c.displayName?.toLowerCase().includes(q)) return true
        if (c.urlOrApp?.toLowerCase().includes(q)) return true
        for (const acc of c.accounts ?? []) {
          if (acc.username?.toLowerCase().includes(q)) return true
        }
        return false
      })
    }
    return [...out].sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
      return (a.displayName || '').localeCompare(b.displayName || '')
    })
  }, [decrypted, search])

  const detail = useMemo(
    () => decrypted.find((c) => c.id === detailId) ?? null,
    [decrypted, detailId],
  )

  if (detailId) {
    return (
      <OfflineCredentialDetail
        item={detail}
        loading={loading || decrypting}
        syncedAt={syncedAt}
        onBack={() =>
          previousRouteLabel ? goBack() : navigate('credentials')
        }
        backLabel={previousRouteLabel ?? 'Credentials'}
      />
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Credentials"
        leading={
          <Button variant="ghost" size="sm" onClick={goHome}>
            <ArrowLeft size={14} aria-hidden="true" />
            Home
          </Button>
        }
      />
      <OfflineBanner syncedAt={syncedAt} />
      {!vault.isUnlocked ? (
        <p className={styles.hint}>Unlock to decrypt credentials.</p>
      ) : (
        <>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            aria-label="Search credentials"
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
            <p className={styles.hint}>No credentials in this offline copy.</p>
          )}
          <ul className={styles.list}>
            {filtered.map((c) => (
              <li key={c.id}>
                <CredentialRow
                  credential={c}
                  onEdit={(id) => navigate('credentials', { id })}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function OfflineCredentialDetail({ item, loading, syncedAt, onBack, backLabel }) {
  const [flash, setFlash] = useState('')

  if (loading && !item) {
    return (
      <div className={styles.page}>
        <PageHeader title="Credential" />
        <p className={styles.hint}>Loading…</p>
      </div>
    )
  }

  if (!item || item.error) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Credential"
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
        title={item.displayName || 'Credential'}
        leading={
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {backLabel}
          </Button>
        }
      />
      <OfflineBanner syncedAt={syncedAt} />
      <div className={styles.detail}>
        {item.urlOrApp && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>URL / app</span>
            <span className={styles.fieldValue}>{item.urlOrApp}</span>
          </div>
        )}
        {(item.accounts ?? []).map((acc, i) => (
          <div key={i} className={styles.field}>
            <span className={styles.fieldLabel}>
              Account {item.accounts.length > 1 ? i + 1 : ''}
            </span>
            <div className={styles.actions}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(acc.username, 'user')}
              >
                <Copy size={12} aria-hidden="true" />
                {flash === 'user' ? 'Copied' : acc.username || 'Username'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(acc.password, 'pass')}
              >
                <Copy size={12} aria-hidden="true" />
                {flash === 'pass' ? 'Copied' : 'Password'}
              </Button>
            </div>
          </div>
        ))}
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
