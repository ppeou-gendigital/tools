import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { listCredentials } from '@/lib/credentialsApi'
import {
  decryptVaultRows,
  isVaultIntegrityFailed,
} from '@/lib/decryptVaultRows'

// Fetches the credentials list from Supabase (React Query cached
// under `['credentials', userId]`, so it dedupes with the Credentials
// list page) and returns them decrypted through the vault key.
//
// Kept separate from the Credentials page so any consumer — the
// autofill toolbar button today, future ambient badges tomorrow — can
// read the decrypted set without re-implementing the decrypt loop.
//
// Rows that fail to decrypt stay in the returned array marked
// `error: true`, matching the Credentials page's contract, so
// downstream code can uniformly ignore or surface them.
export function useDecryptedCredentials() {
  const { user } = useAuth()
  const vault = useVault()
  const userId = user?.id ?? null
  const { isUnlocked, isRekeying, decryptRecord, keyEpoch } = vault

  const listQuery = useQuery({
    queryKey: ['credentials', userId],
    queryFn: () => listCredentials(userId),
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

      if (!isCurrent() || results == null) return
      setDecrypted(results)
      setDecrypting(false)
    }

    run()
    return () => {
      // Invalidate this pass so a late Promise.all cannot publish.
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
