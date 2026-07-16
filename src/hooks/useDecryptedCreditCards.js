import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { listCreditCards } from '@/lib/creditCardsApi'

// Fetches + decrypts the credit-cards list. React Query key
// `['credit_cards', userId]` dedupes with the CreditCards list page.
// Shared so FillCardButton (and future ambient consumers) can read
// decrypted cards without re-implementing the decrypt loop.
export function useDecryptedCreditCards() {
  const { user } = useAuth()
  const vault = useVault()
  const userId = user?.id ?? null

  const listQuery = useQuery({
    queryKey: ['credit_cards', userId],
    queryFn: () => listCreditCards(userId),
    enabled: !!userId && vault.isUnlocked,
  })

  const [decrypted, setDecrypted] = useState([])
  const [decrypting, setDecrypting] = useState(false)

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
              isFavorite: Boolean(plain?.isFavorite),
              updatedAt: row.updated_at,
              createdAt: row.created_at,
              error: false,
            }
          } catch (err) {
            console.warn('[accesso] credit card decrypt failed', err)
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
              isFavorite: false,
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

  return {
    decrypted,
    isLoading: listQuery.isLoading,
    isDecrypting: decrypting,
    error: listQuery.error ?? null,
    listQuery,
  }
}

// Find a saved card whose digits match the captured number. Used by
// capture-from-page to route into update vs create.
export function findMatchingCreditCard(cards, cardNumber) {
  const digits = String(cardNumber || '').replace(/\D+/g, '')
  if (!digits || digits.length < 4) return null
  return (
    cards.find(
      (c) =>
        !c.error &&
        String(c.cardNumber || '').replace(/\D+/g, '') === digits,
    ) ?? null
  )
}
