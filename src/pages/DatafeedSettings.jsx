import { useRef, useState } from 'react'
import {
  Check,
  Download,
  Loader2,
  LockKeyhole,
  TriangleAlert,
  Upload,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { PageHeader } from '@/patterns/PageHeader'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { useDecryptedCredentials } from '@/hooks/useDecryptedCredentials'
import { useDecryptedCreditCards } from '@/hooks/useDecryptedCreditCards'
import {
  DATAFEED_TYPES,
  buildCredentialsFeed,
  buildCreditCardsFeed,
  buildVaultFeed,
  datafeedFilename,
  downloadTextFile,
  importDatafeedItems,
  parseDatafeed,
  stringifyDatafeed,
} from '@/lib/datafeed'
import styles from './DatafeedSettings.module.scss'

// Settings sub-page: JSON import / export for credentials + credit cards.
// Spec and samples for external systems live in /datafeed at the repo root.
export function DatafeedSettings() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const vault = useVault()
  const queryClient = useQueryClient()
  const fileRef = useRef(null)

  const {
    decrypted: credentials,
    isLoading: credsLoading,
    isDecrypting: credsDecrypting,
  } = useDecryptedCredentials()
  const {
    decrypted: cards,
    isLoading: cardsLoading,
    isDecrypting: cardsDecrypting,
  } = useDecryptedCreditCards()

  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const unlocked = vault.isUnlocked
  const exporting =
    busy === 'export-credentials' ||
    busy === 'export-cards' ||
    busy === 'export-vault'
  const importing = busy === 'import'
  const listsReady =
    unlocked &&
    !credsLoading &&
    !cardsLoading &&
    !credsDecrypting &&
    !cardsDecrypting

  function clearMessages() {
    setError(null)
    setResult(null)
  }

  function handleExport(kind) {
    if (!unlocked || exporting || importing) return
    clearMessages()
    setBusy(`export-${kind === 'credit_cards' ? 'cards' : kind}`)
    try {
      const at = new Date().toISOString()
      let doc
      let type
      if (kind === DATAFEED_TYPES.CREDENTIALS) {
        doc = buildCredentialsFeed(credentials, { exportedAt: at })
        type = DATAFEED_TYPES.CREDENTIALS
      } else if (kind === DATAFEED_TYPES.CREDIT_CARDS) {
        doc = buildCreditCardsFeed(cards, { exportedAt: at })
        type = DATAFEED_TYPES.CREDIT_CARDS
      } else {
        doc = buildVaultFeed(credentials, cards, { exportedAt: at })
        type = DATAFEED_TYPES.VAULT
      }
      downloadTextFile(datafeedFilename(type), stringifyDatafeed(doc))
      setResult({
        kind: 'export',
        message: `Downloaded ${datafeedFilename(type)}`,
      })
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setBusy(null)
    }
  }

  function handlePickFile() {
    if (!unlocked || exporting || importing) return
    clearMessages()
    fileRef.current?.click()
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    // Allow re-selecting the same file.
    e.target.value = ''
    if (!file) return
    if (!userId || !unlocked) {
      setError('Unlock the vault before importing.')
      return
    }

    setBusy('import')
    clearMessages()
    try {
      const text = await file.text()
      const parsed = parseDatafeed(text)
      const total = parsed.credentials.length + parsed.creditCards.length
      if (total === 0 && parsed.errors.length === 0) {
        setError('Datafeed contains no items to import.')
        return
      }

      const importResult = await importDatafeedItems({
        userId,
        vault,
        queryClient,
        credentials: parsed.credentials,
        creditCards: parsed.creditCards,
      })

      const skipped = parsed.errors.length
      const failed = importResult.failures.length
      setResult({
        kind: 'import',
        message: [
          `Imported ${importResult.credentialsCreated} credential(s)`,
          `and ${importResult.creditCardsCreated} card(s).`,
          skipped ? `${skipped} item(s) skipped (invalid).` : null,
          failed ? `${failed} item(s) failed to save.` : null,
        ]
          .filter(Boolean)
          .join(' '),
        parseErrors: parsed.errors,
        failures: importResult.failures,
      })
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setBusy(null)
    }
  }

  if (!unlocked) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Import / Export"
          subtitle="Move credentials and cards as JSON datafeeds."
        />
        <div className={styles.locked}>
          <LockKeyhole size={18} aria-hidden="true" />
          <p>
            Unlock the vault to import or export. Feeds contain plaintext
            secrets and are encrypted with your passphrase on import.
          </p>
          <Button
            size="sm"
            onClick={() => vault.requestUnlock({ dismissible: true })}
          >
            Unlock
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Import / Export"
        subtitle="JSON datafeeds for credentials and credit cards."
      />

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Export</h2>
          <p className={styles.sectionBody}>
            Download a JSON file matching the{' '}
            <code>datafeed/</code> samples. Files are plaintext — store them
            securely.
          </p>
          <p className={styles.warn}>
            Exported files contain passwords, card numbers, and CVVs in clear
            text.
          </p>
        </div>
        <div className={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            disabled={!listsReady || !!busy}
            onClick={() => handleExport(DATAFEED_TYPES.CREDENTIALS)}
          >
            {busy === 'export-credentials' ? (
              <Loader2 size={14} className={styles.spin} />
            ) : (
              <Download size={14} />
            )}
            Credentials
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!listsReady || !!busy}
            onClick={() => handleExport(DATAFEED_TYPES.CREDIT_CARDS)}
          >
            {busy === 'export-cards' ? (
              <Loader2 size={14} className={styles.spin} />
            ) : (
              <Download size={14} />
            )}
            Credit cards
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={!listsReady || !!busy}
            onClick={() => handleExport(DATAFEED_TYPES.VAULT)}
          >
            {busy === 'export-vault' ? (
              <Loader2 size={14} className={styles.spin} />
            ) : (
              <Download size={14} />
            )}
            Full vault
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Import</h2>
          <p className={styles.sectionBody}>
            Accepts <code>credentials</code>, <code>credit_cards</code>, or
            combined <code>vault</code> feeds (version 1). Each item is created
            as a new row — nothing is merged or overwritten.
          </p>
        </div>
        <div className={styles.actions}>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className={styles.fileInput}
            onChange={handleFileChange}
          />
          <Button
            variant="default"
            size="sm"
            disabled={!!busy}
            onClick={handlePickFile}
          >
            {importing ? (
              <Loader2 size={14} className={styles.spin} />
            ) : (
              <Upload size={14} />
            )}
            Choose JSON file
          </Button>
        </div>
      </section>

      {error && (
        <div className={`${styles.status} ${styles.statusError}`} role="alert">
          <TriangleAlert size={14} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className={`${styles.status} ${styles.statusOk}`} role="status">
          <Check size={14} aria-hidden="true" />
          <div>
            <div>{result.message}</div>
            {result.parseErrors?.length > 0 && (
              <ul className={styles.failureList}>
                {result.parseErrors.slice(0, 8).map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}
            {result.failures?.length > 0 && (
              <ul className={styles.failureList}>
                {result.failures.slice(0, 8).map((f, i) => (
                  <li key={`${f.kind}-${f.index}-${i}`}>
                    {f.kind}[{f.index}]
                    {f.displayName ? ` (${f.displayName})` : ''}: {f.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
