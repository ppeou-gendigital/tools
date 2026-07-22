import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { listCreditCards } from '@/lib/creditCardsApi'
import {
  decryptVaultRows,
  isVaultIntegrityFailed,
} from '@/lib/decryptVaultRows'

// Fetches + decrypts the credit-cards list. React Query key
// `['credit_cards', userId]` dedupes with the CreditCards list page.
// Shared so FillCardButton (and future ambient consumers) can read
// decrypted cards without re-implementing the decrypt loop.
export function useDecryptedCreditCards() {
  const { user } = useAuth()
  const vault = useVault()
  const userId = user?.id ?? null
  const { isUnlocked, isRekeying, decryptRecord, keyEpoch } = vault

  const listQuery = useQuery({
    queryKey: ['credit_cards', userId],
    queryFn: () => listCreditCards(userId),
    enabled: !!userId && isUnlocked,
  })

  const [decrypted, setDecrypted] = useState([])
  const [decrypting, setDecrypting] = useState(false)
  const generationRef = useRef(0)

  useEffect(() => {
    const generation = ++generationRef.current
    const isCurrent = () => generationRef.current === generation

    async function run() {
      if (!isUnlocked || isRekeying || !listQuery.data) {
        if (isCurrent()) {
          setDecrypted([])
          setDecrypting(false)
        }
        return
      }

      setDecrypting(true)
      const { results } = await decryptVaultRows({
        rows: listQuery.data,
        label: 'credit card',
        isCurrent,
        decryptOne: async (row) => {
          const plain = await decryptRecord({
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
        },
        mapError: (row) => ({
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
        }),
      })

      if (!isCurrent() || results == null) return
      setDecrypted(results)
      setDecrypting(false)
    }

    run()
    return () => {
      if (generationRef.current === generation) {
        generationRef.current += 1
      }
    }
  }, [
    listQuery.data,
    isUnlocked,
    isRekeying,
    decryptRecord,
    keyEpoch,
  ])

  return {
    decrypted,
    isLoading: listQuery.isLoading,
    isDecrypting: decrypting,
    integrityFailed: isVaultIntegrityFailed(decrypted),
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
