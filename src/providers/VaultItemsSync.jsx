import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { useVault } from '@/providers/VaultProvider'
import { getVaultItemStreamConfig, pullSync } from '@/lib/supabaseSync'
import {
  clearAllVaultItemDirty,
  getDirtyVaultItemIds,
} from '@/lib/vaultItemDirty'
import { reconcileVaultItemList } from '@/lib/vaultItemsCache'

const VAULT_STREAMS = ['credentials', 'credit_cards']

// VaultItemsSync is pull-only for vault-backed tables. Mutations go
// through supabaseSync from the credential/card APIs. On unlock we
// force-pull both lists and reconcile around dirty (in-flight) rows.
export function VaultItemsSync() {
  const { user, loading: authLoading } = useAuth()
  const vault = useVault()
  const queryClient = useQueryClient()
  const pulledForUnlockRef = useRef(null)

  const userId = user?.id ?? null
  const unlocked = vault.isUnlocked

  useEffect(() => {
    if (!userId || !unlocked) {
      pulledForUnlockRef.current = null
      if (!unlocked) clearAllVaultItemDirty()
    }
  }, [userId, unlocked])

  useEffect(() => {
    if (authLoading || !userId || !unlocked) return
    const sessionKey = `${userId}:unlocked`
    if (pulledForUnlockRef.current === sessionKey) return
    pulledForUnlockRef.current = sessionKey

    let cancelled = false
    ;(async () => {
      try {
        await Promise.all(
          VAULT_STREAMS.map(async (stream) => {
            const cfg = getVaultItemStreamConfig(stream)
            const localList = cfg
              ? queryClient.getQueryData(cfg.queryKey(userId))
              : undefined
            const remote = await pullSync({ stream, userId })
            if (cancelled) return
            reconcileVaultItemList(
              queryClient,
              stream,
              userId,
              remote ?? [],
              getDirtyVaultItemIds(stream),
              localList,
            )
          }),
        )
      } catch (err) {
        if (cancelled) return
        pulledForUnlockRef.current = null
        console.warn(
          '[accesso] vault items auto-pull failed:',
          err?.message ?? err,
        )
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, userId, unlocked, queryClient])

  return null
}
