import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { listCredentials } from '@/lib/credentialsApi'

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

  const listQuery = useQuery({
    queryKey: ['credentials', userId],
    queryFn: () => listCredentials(userId),
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
              urlOrApp: plain?.urlOrApp ?? '',
              accounts: Array.isArray(plain?.accounts) ? plain.accounts : [],
              notes: plain?.notes ?? '',
              updatedAt: row.updated_at,
              createdAt: row.created_at,
              error: false,
            }
          } catch (err) {
            console.warn('[accesso] credential decrypt failed', err)
            return {
              id: row.id,
              displayName: row.display_name,
              urlOrApp: '',
              accounts: [],
              notes: '',
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
