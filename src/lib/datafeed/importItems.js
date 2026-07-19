import { createCredential } from '@/lib/credentialsApi'
import { createCreditCard } from '@/lib/creditCardsApi'
import {
  markVaultItemDirty,
  clearVaultItemDirty,
} from '@/lib/vaultItemDirty'
import {
  optimisticUpsertVaultItem,
  revertVaultItemCaches,
  snapshotVaultItemCaches,
} from '@/lib/vaultItemsCache'

/**
 * Encrypt + create vault rows from a parsed datafeed.
 * Always inserts new rows (no merge). Continues on per-item failure.
 *
 * @param {{
 *   userId: string,
 *   vault: { encryptRecord: (plain: object) => Promise<{ ciphertext: string, iv: string }> },
 *   queryClient: import('@tanstack/react-query').QueryClient,
 *   credentials?: object[],
 *   creditCards?: object[],
 *   onProgress?: (info: { done: number, total: number }) => void,
 * }} args
 */
export async function importDatafeedItems({
  userId,
  vault,
  queryClient,
  credentials = [],
  creditCards = [],
  onProgress,
}) {
  if (!userId) throw new Error('not signed in')
  if (!vault?.encryptRecord) throw new Error('vault is locked')

  const total = credentials.length + creditCards.length
  let done = 0
  const report = () => onProgress?.({ done, total })

  const result = {
    credentialsCreated: 0,
    creditCardsCreated: 0,
    failures: [],
  }

  for (let i = 0; i < credentials.length; i++) {
    const item = credentials[i]
    try {
      await createEncryptedCredential(userId, vault, queryClient, item)
      result.credentialsCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'credential',
        index: i,
        displayName: item.displayName,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  for (let i = 0; i < creditCards.length; i++) {
    const item = creditCards[i]
    try {
      await createEncryptedCreditCard(userId, vault, queryClient, item)
      result.creditCardsCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'credit_card',
        index: i,
        displayName: item.displayName,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  return result
}

async function createEncryptedCredential(userId, vault, queryClient, item) {
  const payload = {
    urlOrApp: item.urlOrApp ?? '',
    accounts: Array.isArray(item.accounts)
      ? item.accounts
      : [{ username: '', password: '' }],
    notes: item.notes ?? '',
  }
  const { ciphertext, iv } = await vault.encryptRecord(payload)
  const rowId = crypto.randomUUID()
  const now = new Date().toISOString()
  const optimistic = {
    id: rowId,
    user_id: userId,
    display_name: item.displayName,
    ciphertext,
    iv,
    created_at: now,
    updated_at: now,
  }
  const stream = 'credentials'
  const snapshot = snapshotVaultItemCaches(
    queryClient,
    stream,
    userId,
    rowId,
  )
  markVaultItemDirty(stream, rowId)
  optimisticUpsertVaultItem(queryClient, stream, userId, optimistic)
  try {
    await createCredential(userId, {
      id: rowId,
      displayName: item.displayName,
      ciphertext,
      iv,
    })
    clearVaultItemDirty(stream, rowId)
  } catch (err) {
    revertVaultItemCaches(queryClient, snapshot)
    clearVaultItemDirty(stream, rowId)
    throw err
  }
}

async function createEncryptedCreditCard(userId, vault, queryClient, item) {
  const payload = {
    cardholderName: item.cardholderName ?? '',
    cardNumber: item.cardNumber ?? '',
    expMonth: item.expMonth ?? '',
    expYear: item.expYear ?? '',
    cvv: item.cvv ?? '',
    issuerBank: item.issuerBank ?? '',
    billingZip: item.billingZip ?? '',
    pin: item.pin ?? '',
    notes: item.notes ?? '',
    isFavorite: Boolean(item.isFavorite),
  }
  const { ciphertext, iv } = await vault.encryptRecord(payload)
  const rowId = crypto.randomUUID()
  const now = new Date().toISOString()
  const optimistic = {
    id: rowId,
    user_id: userId,
    display_name: item.displayName ?? '',
    ciphertext,
    iv,
    created_at: now,
    updated_at: now,
  }
  const stream = 'credit_cards'
  const snapshot = snapshotVaultItemCaches(
    queryClient,
    stream,
    userId,
    rowId,
  )
  markVaultItemDirty(stream, rowId)
  optimisticUpsertVaultItem(queryClient, stream, userId, optimistic)
  try {
    await createCreditCard(userId, {
      id: rowId,
      displayName: item.displayName ?? '',
      ciphertext,
      iv,
    })
    clearVaultItemDirty(stream, rowId)
  } catch (err) {
    revertVaultItemCaches(queryClient, snapshot)
    clearVaultItemDirty(stream, rowId)
    throw err
  }
}
