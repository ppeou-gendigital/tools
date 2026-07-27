import { useMemo } from 'react'
import {
  CreditCard,
  KeyRound,
  Loader2,
  Lock,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { PageHeader } from '@/patterns/PageHeader'
import { CredentialRow } from '@/patterns/CredentialRow'
import { CreditCardRow } from '@/patterns/CreditCardRow'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVault } from '@/providers/VaultProvider'
import { useDecryptedCredentials } from '@/hooks/useDecryptedCredentials'
import { useDecryptedCreditCards } from '@/hooks/useDecryptedCreditCards'
import { updateCredential } from '@/lib/credentialsApi'
import { updateCreditCard } from '@/lib/creditCardsApi'
import { resolveDisplayName } from '@/lib/cardUtils'
import {
  clearVaultItemDirty,
  markVaultItemDirty,
} from '@/lib/vaultItemDirty'
import {
  optimisticUpsertVaultItem,
  revertVaultItemCaches,
  snapshotVaultItemCaches,
} from '@/lib/vaultItemsCache'
import styles from './Home.module.scss'

const CRED_STREAM = 'credentials'
const CARD_STREAM = 'credit_cards'

export function Home() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const vault = useVault()
  const queryClient = useQueryClient()
  const {
    goCredentials,
    goCredentialEdit,
    goCreditCards,
    goCreditCardEdit,
  } = useNavigation()

  const creds = useDecryptedCredentials()
  const cards = useDecryptedCreditCards()

  const favoriteCreds = useMemo(
    () =>
      (creds.decrypted ?? [])
        .filter((c) => !c.error && c.isFavorite)
        .sort((a, b) =>
          (a.displayName || '').localeCompare(b.displayName || ''),
        ),
    [creds.decrypted],
  )

  const favoriteCards = useMemo(
    () =>
      (cards.decrypted ?? [])
        .filter((c) => !c.error && c.isFavorite)
        .sort((a, b) => cardLabel(a).localeCompare(cardLabel(b))),
    [cards.decrypted],
  )

  const credFavoriteMutation = useMutation({
    mutationFn: async ({ credential, nextFavorite }) => {
      if (!userId) throw new Error('not signed in')
      const payload = {
        urlOrApp: credential.urlOrApp ?? '',
        accounts: Array.isArray(credential.accounts)
          ? credential.accounts.map((a) => ({
              username: a?.username ?? '',
              password: a?.password ?? '',
            }))
          : [{ username: '', password: '' }],
        notes: credential.notes ?? '',
        isFavorite: nextFavorite,
      }
      const { ciphertext, iv } = await vault.encryptRecord(payload)
      const now = new Date().toISOString()
      const optimistic = {
        id: credential.id,
        user_id: userId,
        display_name: credential.displayName ?? '',
        ciphertext,
        iv,
        created_at: credential.createdAt ?? now,
        updated_at: now,
      }
      const snapshot = snapshotVaultItemCaches(
        queryClient,
        CRED_STREAM,
        userId,
        credential.id,
      )
      markVaultItemDirty(CRED_STREAM, credential.id)
      optimisticUpsertVaultItem(queryClient, CRED_STREAM, userId, optimistic)
      try {
        const result = await updateCredential(userId, credential.id, {
          displayName: credential.displayName ?? '',
          ciphertext,
          iv,
        })
        clearVaultItemDirty(CRED_STREAM, credential.id)
        return result
      } catch (err) {
        revertVaultItemCaches(queryClient, snapshot)
        clearVaultItemDirty(CRED_STREAM, credential.id)
        throw err
      }
    },
  })

  const cardFavoriteMutation = useMutation({
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
        CARD_STREAM,
        userId,
        card.id,
      )
      markVaultItemDirty(CARD_STREAM, card.id)
      optimisticUpsertVaultItem(queryClient, CARD_STREAM, userId, optimistic)
      try {
        const result = await updateCreditCard(userId, card.id, {
          displayName: card.displayName ?? '',
          ciphertext,
          iv,
        })
        clearVaultItemDirty(CARD_STREAM, card.id)
        return result
      } catch (err) {
        revertVaultItemCaches(queryClient, snapshot)
        clearVaultItemDirty(CARD_STREAM, card.id)
        throw err
      }
    },
  })

  const unlocked = vault.isUnlocked
  const loading =
    unlocked &&
    (creds.isLoading ||
      creds.isDecrypting ||
      cards.isLoading ||
      cards.isDecrypting)

  return (
    <div className={styles.page}>
      <PageHeader
        title="Welcome back"
        subtitle={
          user?.email ? `Signed in as ${user.email}` : "You're signed in."
        }
      />

      {!unlocked ? (
        <div className={styles.unlockPanel}>
          <div className={styles.unlockIcon} aria-hidden="true">
            <Lock size={18} />
          </div>
          <p className={styles.unlockTitle}>Unlock to see favorites</p>
          <p className={styles.unlockBody}>
            Your starred credentials and cards stay encrypted until the vault
            is unlocked.
          </p>
          <Button
            size="sm"
            onClick={() => vault.requestUnlock({ dismissible: true })}
          >
            <Lock size={14} aria-hidden="true" />
            Unlock vault
          </Button>
        </div>
      ) : loading ? (
        <p className={styles.loading}>
          <Loader2 size={14} className={styles.spin} aria-hidden="true" />
          Loading favorites…
        </p>
      ) : (
        <>
          <FavoritesSection
            title="Favorite credentials"
            icon={KeyRound}
            count={favoriteCreds.length}
            emptyHint="Star a credential from the list or edit form to pin it here."
            onViewAll={goCredentials}
            viewAllLabel="All credentials"
            tableLabel="Favorite credentials"
            headers={
              <>
                <span role="columnheader">Name</span>
                <span role="columnheader">URL / app</span>
                <span role="columnheader" className={styles.srOnly}>
                  User
                </span>
                <span role="columnheader" className={styles.srOnly}>
                  Password
                </span>
                <span role="columnheader" className={styles.srOnly}>
                  Note
                </span>
                <span role="columnheader" className={styles.srOnly}>
                  Edit
                </span>
              </>
            }
            headerClassName={styles.credHeader}
          >
            {favoriteCreds.map((c) => (
              <li key={c.id}>
                <CredentialRow
                  credential={c}
                  onEdit={(id) => goCredentialEdit(id)}
                  onToggleFavorite={(cred) =>
                    credFavoriteMutation.mutate({
                      credential: cred,
                      nextFavorite: !cred.isFavorite,
                    })
                  }
                />
              </li>
            ))}
          </FavoritesSection>

          <FavoritesSection
            title="Favorite cards"
            icon={CreditCard}
            count={favoriteCards.length}
            emptyHint="Star a credit card to pin it here for faster fill."
            onViewAll={goCreditCards}
            viewAllLabel="All cards"
            tableLabel="Favorite cards"
            headers={
              <>
                <span role="columnheader">Name</span>
                <span role="columnheader">Cardholder</span>
                <span role="columnheader" className={styles.srOnly}>
                  Number
                </span>
                <span role="columnheader" className={styles.srOnly}>
                  CVV
                </span>
                <span role="columnheader" className={styles.srOnly}>
                  Expiration
                </span>
                <span role="columnheader" className={styles.srOnly}>
                  Note
                </span>
                <span role="columnheader" className={styles.srOnly}>
                  Edit
                </span>
              </>
            }
            headerClassName={styles.cardHeader}
          >
            {favoriteCards.map((c) => (
              <li key={c.id}>
                <CreditCardRow
                  card={c}
                  onEdit={(id) => goCreditCardEdit(id)}
                  onToggleFavorite={(card) =>
                    cardFavoriteMutation.mutate({
                      card,
                      nextFavorite: !card.isFavorite,
                    })
                  }
                />
              </li>
            ))}
          </FavoritesSection>
        </>
      )}
    </div>
  )
}

function FavoritesSection({
  title,
  icon: Icon,
  count,
  emptyHint,
  onViewAll,
  viewAllLabel,
  tableLabel,
  headers,
  headerClassName,
  children,
}) {
  const empty = count === 0
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitleRow}>
          <Icon size={14} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>{title}</h2>
          {!empty && <span className={styles.sectionCount}>{count}</span>}
        </div>
        <button type="button" className={styles.viewAll} onClick={onViewAll}>
          {viewAllLabel}
        </button>
      </div>
      {empty ? (
        <p className={styles.emptyHint}>{emptyHint}</p>
      ) : (
        <div className={styles.table} role="table" aria-label={tableLabel}>
          <div
            className={`${styles.tableHeader} ${headerClassName}`}
            role="row"
          >
            {headers}
          </div>
          <ul className={styles.rows}>{children}</ul>
        </div>
      )}
    </section>
  )
}

function cardLabel(card) {
  return resolveDisplayName({
    displayName: card.displayName,
    issuerBank: card.issuerBank,
    cardNumber: card.cardNumber,
  })
}
