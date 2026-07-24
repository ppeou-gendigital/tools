import { useEffect, useRef, useState } from 'react'
import { useOffline } from '@/providers/OfflineProvider'
import { useVault } from '@/providers/VaultProvider'
import {
  decryptVaultRows,
  isVaultIntegrityFailed,
} from '@/lib/decryptVaultRows'

/**
 * Decrypt credential/card rows from the offline pack (not Supabase).
 * @param {'credentials' | 'creditCards'} kind
 */
export function useOfflineVaultDecrypt(kind) {
  const { primaryPack, getPack } = useOffline()
  const vault = useVault()
  const { isUnlocked, isRekeying, decryptRecord, keyEpoch } = vault
  const scopeId = primaryPack?.scopeId

  const [rows, setRows] = useState([])
  const [decrypted, setDecrypted] = useState([])
  const [loading, setLoading] = useState(true)
  const [decrypting, setDecrypting] = useState(false)
  const [syncedAt, setSyncedAt] = useState(null)
  const generationRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const pack = scopeId ? await getPack(scopeId) : primaryPack
      if (cancelled) return
      const list =
        kind === 'creditCards'
          ? pack?.creditCards ?? []
          : pack?.credentials ?? []
      setRows(list)
      setSyncedAt(pack?.syncedAt ?? null)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [scopeId, getPack, primaryPack, kind])

  useEffect(() => {
    const generation = ++generationRef.current
    const isCurrent = () => generationRef.current === generation

    async function run() {
      if (!isUnlocked || isRekeying || !rows) {
        if (isCurrent()) {
          setDecrypted([])
          setDecrypting(false)
        }
        return
      }
      setDecrypting(true)

      if (kind === 'creditCards') {
        const { results } = await decryptVaultRows({
          rows,
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
        if (isCurrent() && results) {
          setDecrypted(results)
          setDecrypting(false)
        }
        return
      }

      const { results } = await decryptVaultRows({
        rows,
        label: 'credential',
        isCurrent,
        decryptOne: async (row) => {
          const plain = await decryptRecord({
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
        },
        mapError: (row) => ({
          id: row.id,
          displayName: row.display_name,
          urlOrApp: '',
          accounts: [],
          notes: '',
          updatedAt: row.updated_at,
          createdAt: row.created_at,
          error: true,
        }),
      })
      if (isCurrent() && results) {
        setDecrypted(results)
        setDecrypting(false)
      }
    }

    void run()
  }, [isUnlocked, isRekeying, decryptRecord, keyEpoch, rows, kind])

  return {
    decrypted,
    loading,
    decrypting,
    syncedAt,
    integrityFailed: isVaultIntegrityFailed(decrypted),
  }
}
