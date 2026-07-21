import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { fetchUserData, saveVaultMeta } from '@/lib/userDataApi'
import { listCredentials, updateCredential } from '@/lib/credentialsApi'
import { listCreditCards, updateCreditCard } from '@/lib/creditCardsApi'
import { extractVaultMeta, normalizePassphraseHint } from '@/lib/prefs'
import { sessionAsyncStorage } from '@/lib/sessionStorage'
import {
  KDF_ITERATIONS,
  checkVerifier,
  decryptJson,
  deriveKey,
  encryptJson,
  generateSalt,
  makeVerifier,
} from '@/lib/vaultCrypto'
import {
  VAULT_IDLE_DEFAULT_MS,
  normalizeIdleTimeoutMs,
} from '@/lib/vaultIdleOptions'

const MIN_PASSPHRASE_LENGTH = 8

// applySyncOp attaches CAS bookkeeping (`attempts`, `noop`) — keep only
// the vault-item columns before stuffing rows into React Query caches.
function stripSyncMeta(row) {
  if (!row || typeof row !== 'object') return row
  return {
    id: row.id,
    user_id: row.user_id,
    display_name: row.display_name ?? '',
    ciphertext: row.ciphertext ?? '',
    iv: row.iv ?? '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

const VaultContext = createContext(null)

// Status transitions:
//   loading      -> needs-setup | locked | unlocked | error
//     (loading -> unlocked happens when the session cache is fresh
//      and its verifier decrypts on this device)
//   needs-setup  -> unlocked  (setup())
//   locked       -> unlocked  (unlock())
//   unlocked     -> locked    (lock(), sign-out, idle timeout)
//   error        -> loading   (retryLoad())
const STATUS = {
  LOADING: 'loading',
  NEEDS_SETUP: 'needs-setup',
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  ERROR: 'error',
}

// Belt-and-braces backoff so an attacker with a stolen session can't
// hammer PBKDF2 verifications. The KDF cost is the actual security
// barrier; this just prevents CPU-melting spam.
const FAILED_UNLOCK_DELAYS_MS = [0, 250, 500, 1000, 2000, 4000]

// Session-cache key. Namespaced to avoid colliding with anything the
// tool might add later. Payload shape:
//   { userId, passphrase, expiresAt }
// We cache the passphrase (not the derived key bytes) so the CryptoKey
// stays non-extractable everywhere. The ~200ms PBKDF2 cost on resume
// is imperceptible and only paid on popup/tab wake.
const VAULT_SESSION_KEY = 'accesso.vault.session'

// Coalesce activity refreshes: even if the user is jiggling the mouse
// non-stop we only re-arm the timer / rewrite the cache once every 30s.
const ACTIVITY_THROTTLE_MS = 30_000

async function readCache() {
  try {
    const raw = await sessionAsyncStorage.getItem(VAULT_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.passphrase !== 'string' || parsed.passphrase.length === 0) return null
    if (typeof parsed.userId !== 'string' || parsed.userId.length === 0) return null
    if (typeof parsed.expiresAt !== 'number') return null
    if (parsed.expiresAt <= Date.now()) return null
    return parsed
  } catch {
    return null
  }
}

async function writeCache(userId, passphrase, idleTimeoutMs) {
  const payload = {
    userId,
    passphrase,
    expiresAt: Date.now() + idleTimeoutMs,
  }
  try {
    await sessionAsyncStorage.setItem(VAULT_SESSION_KEY, JSON.stringify(payload))
  } catch {
    // best-effort: cache is a UX optimization, not a correctness gate
  }
}

async function clearCache() {
  try {
    await sessionAsyncStorage.removeItem(VAULT_SESSION_KEY)
  } catch {
    // ignore
  }
}

export function VaultProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  const [status, setStatus] = useState(STATUS.LOADING)
  const [error, setError] = useState(null)
  const [reloadCounter, setReloadCounter] = useState(0)
  const [idleTimeoutMs, setIdleTimeoutMsState] = useState(VAULT_IDLE_DEFAULT_MS)
  const [unlockPrompt, setUnlockPrompt] = useState(null)
  // Plaintext memory jog from vault meta. Mirrored in state (not read
  // from metaRef during render) so the unlock UI can subscribe to it.
  const [passphraseHint, setPassphraseHintState] = useState(null)
  // True while changePassphrase is re-encrypting rows / flipping meta.
  // Gates encrypt/decrypt so nothing else writes under the old key.
  const [isRekeying, setIsRekeying] = useState(false)

  const keyRef = useRef(null)
  const metaRef = useRef(null)
  const failedAttemptsRef = useRef(0)
  const idleTimeoutMsRef = useRef(VAULT_IDLE_DEFAULT_MS)
  const rekeyingRef = useRef(false)

  const userId = user?.id ?? null

  useEffect(() => {
    idleTimeoutMsRef.current = idleTimeoutMs
  }, [idleTimeoutMs])

  // Single sync-and-load effect. All state mutations happen inside
  // an async body — the first `await Promise.resolve()` yields to a
  // microtask so setState calls happen off the synchronous render
  // path (which keeps the react-hooks lint rule happy). The
  // `cancelled` flag guards against races when the user id changes
  // mid-fetch.
  useEffect(() => {
    if (authLoading) return
    let cancelled = false

    ;(async () => {
      await Promise.resolve()
      if (cancelled) return

      keyRef.current = null
      metaRef.current = null
      failedAttemptsRef.current = 0

      if (!userId) {
        setStatus(STATUS.LOADING)
        setError(null)
        setUnlockPrompt(null)
        setPassphraseHintState(null)
        setIdleTimeoutMsState(VAULT_IDLE_DEFAULT_MS)
        await clearCache()
        return
      }

      setStatus(STATUS.LOADING)
      setError(null)
      setPassphraseHintState(null)

      try {
        const row = await queryClient.fetchQuery({
          queryKey: ['user_data', userId],
          queryFn: () => fetchUserData(userId),
        })
        if (cancelled) return
        const meta = extractVaultMeta(row?.data)
        const nextIdleMs = normalizeIdleTimeoutMs(row?.data?.vault?.idleTimeoutMs)
        setIdleTimeoutMsState(nextIdleMs)
        idleTimeoutMsRef.current = nextIdleMs

        if (!meta) {
          metaRef.current = null
          setPassphraseHintState(null)
          await clearCache()
          setStatus(STATUS.NEEDS_SETUP)
          return
        }
        metaRef.current = meta
        setPassphraseHintState(meta.hint ?? null)

        // Try to hydrate from the session cache before falling back
        // to the locked screen. If the cache is fresh and matches
        // this user, we derive silently and land straight on
        // UNLOCKED — no visible unlock flash.
        const cached = await readCache()
        if (cached && cached.userId === userId) {
          try {
            const key = await deriveKey(cached.passphrase, meta.salt, meta.iterations)
            const ok = await checkVerifier(key, meta.verifier)
            if (cancelled) return
            if (ok) {
              keyRef.current = key
              // Refresh the expiry so a hydrate counts as activity.
              await writeCache(userId, cached.passphrase, idleTimeoutMsRef.current)
              setStatus(STATUS.UNLOCKED)
              return
            }
            // Verifier mismatch — likely a passphrase change on
            // another device. Drop the stale entry silently and
            // fall through to the locked screen.
            await clearCache()
          } catch {
            await clearCache()
          }
        }

        if (cancelled) return
        setStatus(STATUS.LOCKED)
      } catch (err) {
        if (cancelled) return
        setError(err)
        setPassphraseHintState(null)
        setStatus(STATUS.ERROR)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [userId, authLoading, queryClient, reloadCounter])

  const retryLoad = useCallback(() => {
    setReloadCounter((n) => n + 1)
  }, [])

  // First-time vault setup: pick salt + iterations, derive key,
  // encrypt the verifier, persist meta. On success the vault is
  // already unlocked in memory — no second passphrase prompt.
  // Optional `options.hint` is stored in plaintext on vault meta and
  // shown on later unlock screens as a memory jog — never used in KDF.
  const setup = useCallback(
    async (passphrase, options = {}) => {
      if (!userId) throw new Error('setup: not signed in')
      if (
        typeof passphrase !== 'string' ||
        passphrase.length < MIN_PASSPHRASE_LENGTH
      ) {
        throw new Error(
          `Passphrase must be at least ${MIN_PASSPHRASE_LENGTH} characters.`,
        )
      }
      const salt = generateSalt()
      const iterations = KDF_ITERATIONS
      const key = await deriveKey(passphrase, salt, iterations)
      const verifier = await makeVerifier(key)
      const hint = normalizePassphraseHint(options?.hint)
      const meta = hint
        ? { salt, iterations, verifier, hint }
        : { salt, iterations, verifier }
      const row = await saveVaultMeta(userId, meta)
      queryClient.setQueryData(['user_data', userId], row)
      keyRef.current = key
      metaRef.current = meta
      failedAttemptsRef.current = 0
      await writeCache(userId, passphrase, idleTimeoutMsRef.current)
      setPassphraseHintState(hint)
      setStatus(STATUS.UNLOCKED)
      setError(null)
      setUnlockPrompt(null)
    },
    [queryClient, userId],
  )

  const unlock = useCallback(
    async (passphrase) => {
      if (!userId) throw new Error('unlock: not signed in')
      const meta = metaRef.current
      if (!meta) throw new Error('unlock: no vault meta loaded')

      const delayIdx = Math.min(
        failedAttemptsRef.current,
        FAILED_UNLOCK_DELAYS_MS.length - 1,
      )
      const wait = FAILED_UNLOCK_DELAYS_MS[delayIdx]
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait))
      }

      const key = await deriveKey(passphrase, meta.salt, meta.iterations)
      const ok = await checkVerifier(key, meta.verifier)
      if (!ok) {
        failedAttemptsRef.current += 1
        throw new Error('Wrong passphrase. Try again.')
      }
      keyRef.current = key
      failedAttemptsRef.current = 0
      await writeCache(userId, passphrase, idleTimeoutMsRef.current)
      setStatus(STATUS.UNLOCKED)
      setError(null)
      setUnlockPrompt(null)
    },
    [userId],
  )

  const lock = useCallback(() => {
    keyRef.current = null
    failedAttemptsRef.current = 0
    queryClient.removeQueries({ queryKey: ['credentials', userId] })
    queryClient.removeQueries({ queryKey: ['credit_cards', userId] })
    setStatus(metaRef.current ? STATUS.LOCKED : STATUS.NEEDS_SETUP)
    setError(null)
    // Fire-and-forget; the storage write is not on the render path.
    clearCache()
  }, [queryClient, userId])

  // Persist a new idle-timeout preference. Updates local state
  // immediately (so the timer effect re-registers), then upserts the
  // Supabase row via saveVaultMeta's shallow-merge. If the vault is
  // currently unlocked we also refresh the cache expiry with the new
  // window so the change takes effect on the very next activity tick.
  const setIdleTimeoutMs = useCallback(
    async (ms) => {
      const normalized = normalizeIdleTimeoutMs(ms)
      if (normalized === idleTimeoutMsRef.current) return
      idleTimeoutMsRef.current = normalized
      setIdleTimeoutMsState(normalized)
      if (userId) {
        const row = await saveVaultMeta(userId, { idleTimeoutMs: normalized })
        queryClient.setQueryData(['user_data', userId], row)
        if (keyRef.current) {
          const cached = await readCache()
          if (cached?.userId === userId) {
            await writeCache(userId, cached.passphrase, normalized)
          }
        }
      }
    },
    [queryClient, userId],
  )

  // Update / clear the optional plaintext passphrase hint. Does not
  // touch salt/verifier/ciphertext — hint is not part of the KDF.
  const setPassphraseHint = useCallback(
    async (nextHint) => {
      if (!userId) throw new Error('setPassphraseHint: not signed in')
      if (!metaRef.current) {
        throw new Error('setPassphraseHint: vault has not been set up')
      }
      if (rekeyingRef.current) {
        throw new Error('setPassphraseHint: passphrase change in progress')
      }
      const hint = normalizePassphraseHint(nextHint)
      const current = metaRef.current.hint ?? null
      if (hint === current) return
      const row = await saveVaultMeta(userId, { hint })
      queryClient.setQueryData(['user_data', userId], row)
      if (hint) {
        metaRef.current = { ...metaRef.current, hint }
      } else {
        const nextMeta = { ...metaRef.current }
        delete nextMeta.hint
        metaRef.current = nextMeta
      }
      setPassphraseHintState(hint)
    },
    [queryClient, userId],
  )

  // Rotate the master passphrase: verify current → decrypt every vault
  // item under the old key → re-encrypt under a fresh salt/key → write
  // rows → only then patch vault meta. Hint + idleTimeoutMs are kept
  // via shallow merge (we don't include them in the meta patch).
  // If anything fails before the meta write, the old passphrase still
  // unlocks and the user can retry.
  const changePassphrase = useCallback(
    async (currentPassphrase, nextPassphrase) => {
      if (!userId) throw new Error('changePassphrase: not signed in')
      const meta = metaRef.current
      if (!meta) throw new Error('changePassphrase: vault has not been set up')
      if (!keyRef.current) {
        throw new Error('Unlock the vault before changing the passphrase.')
      }
      if (rekeyingRef.current) {
        throw new Error('A passphrase change is already in progress.')
      }
      if (typeof currentPassphrase !== 'string' || currentPassphrase.length === 0) {
        throw new Error('Current passphrase is required.')
      }
      if (
        typeof nextPassphrase !== 'string' ||
        nextPassphrase.length < MIN_PASSPHRASE_LENGTH
      ) {
        throw new Error(
          `New passphrase must be at least ${MIN_PASSPHRASE_LENGTH} characters.`,
        )
      }
      if (currentPassphrase === nextPassphrase) {
        throw new Error('New passphrase must be different from the current one.')
      }

      const oldKey = await deriveKey(
        currentPassphrase,
        meta.salt,
        meta.iterations,
      )
      const ok = await checkVerifier(oldKey, meta.verifier)
      if (!ok) {
        throw new Error('Wrong current passphrase. Try again.')
      }

      rekeyingRef.current = true
      setIsRekeying(true)
      try {
        const newSalt = generateSalt()
        const iterations = KDF_ITERATIONS
        const newKey = await deriveKey(nextPassphrase, newSalt, iterations)
        const newVerifier = await makeVerifier(newKey)

        const [credRows, cardRows] = await Promise.all([
          listCredentials(userId),
          listCreditCards(userId),
        ])

        // Decrypt everything first so a bad row aborts with zero writes.
        const credPlain = []
        for (const row of credRows) {
          try {
            const plain = await decryptJson(oldKey, row.ciphertext, row.iv)
            credPlain.push({ row, plain })
          } catch {
            throw new Error(
              `Could not decrypt credential "${row.display_name || row.id}". Nothing was changed.`,
            )
          }
        }
        const cardPlain = []
        for (const row of cardRows) {
          try {
            const plain = await decryptJson(oldKey, row.ciphertext, row.iv)
            cardPlain.push({ row, plain })
          } catch {
            throw new Error(
              `Could not decrypt card "${row.display_name || row.id}". Nothing was changed.`,
            )
          }
        }

        const nextCredRows = []
        for (const { row, plain } of credPlain) {
          const enc = await encryptJson(newKey, plain)
          const updated = await updateCredential(userId, row.id, {
            displayName: row.display_name,
            ciphertext: enc.ciphertext,
            iv: enc.iv,
          })
          nextCredRows.push(stripSyncMeta(updated))
        }

        const nextCardRows = []
        for (const { row, plain } of cardPlain) {
          const enc = await encryptJson(newKey, plain)
          const updated = await updateCreditCard(userId, row.id, {
            displayName: row.display_name ?? '',
            ciphertext: enc.ciphertext,
            iv: enc.iv,
          })
          nextCardRows.push(stripSyncMeta(updated))
        }

        // Flip the unlock key only after every row is under the new key.
        const prefsRow = await saveVaultMeta(userId, {
          salt: newSalt,
          iterations,
          verifier: newVerifier,
        })
        queryClient.setQueryData(['user_data', userId], prefsRow)

        metaRef.current = {
          ...meta,
          salt: newSalt,
          iterations,
          verifier: newVerifier,
        }
        keyRef.current = newKey
        failedAttemptsRef.current = 0
        await writeCache(userId, nextPassphrase, idleTimeoutMsRef.current)

        queryClient.setQueryData(['credentials', userId], nextCredRows)
        queryClient.setQueryData(['credit_cards', userId], nextCardRows)
        queryClient.removeQueries({
          predicate: (q) => {
            const key = q.queryKey
            return (
              Array.isArray(key) &&
              (key[0] === 'credential' || key[0] === 'credit_card') &&
              key[1] === userId
            )
          },
        })
      } finally {
        rekeyingRef.current = false
        setIsRekeying(false)
      }
    },
    [queryClient, userId],
  )

  // Overlay prompt. No-op when unlocking wouldn't make sense (already
  // unlocked, or first-time setup — that flow uses the full page).
  const requestUnlock = useCallback(
    ({ dismissible = true } = {}) => {
      if (status === STATUS.UNLOCKED) return
      if (status === STATUS.NEEDS_SETUP) return
      setUnlockPrompt((prev) => {
        if (prev && prev.dismissible === dismissible) return prev
        return { dismissible }
      })
    },
    [status],
  )

  const dismissUnlock = useCallback(() => {
    setUnlockPrompt((p) => (p?.dismissible ? null : p))
  }, [])

  // Idle-lock effect. Only active while unlocked. Activity signals
  // reset both the rolling setTimeout and the cache expiry. When the
  // effect re-registers on `idleTimeoutMs` change, the new value
  // takes effect immediately for both the timer and the next cache
  // refresh.
  useEffect(() => {
    if (status !== STATUS.UNLOCKED) return
    if (typeof window === 'undefined') return

    let timerId = null
    let lastActivityAt = 0

    const arm = () => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        lock()
      }, idleTimeoutMs)
    }

    const onActivity = () => {
      const now = Date.now()
      if (now - lastActivityAt < ACTIVITY_THROTTLE_MS) return
      lastActivityAt = now
      arm()
      // Refresh cache expiry too, so a wake in another tab / popup
      // sees the freshest deadline.
      if (userId) {
        readCache().then((cached) => {
          if (cached?.userId === userId) {
            writeCache(userId, cached.passphrase, idleTimeoutMsRef.current)
          }
        })
      }
    }

    arm()
    // pointerdown / keydown bubble on window everywhere;
    // visibilitychange only fires on document.
    window.addEventListener('pointerdown', onActivity, { passive: true })
    window.addEventListener('keydown', onActivity, { passive: true })
    document.addEventListener('visibilitychange', onActivity)

    return () => {
      if (timerId) clearTimeout(timerId)
      window.removeEventListener('pointerdown', onActivity)
      window.removeEventListener('keydown', onActivity)
      document.removeEventListener('visibilitychange', onActivity)
    }
  }, [status, idleTimeoutMs, lock, userId])

  const encryptRecord = useCallback(async (value) => {
    if (!keyRef.current) throw new Error('encryptRecord: vault is locked')
    if (rekeyingRef.current) {
      throw new Error('encryptRecord: passphrase change in progress')
    }
    return encryptJson(keyRef.current, value)
  }, [])

  const decryptRecord = useCallback(async ({ ciphertext, iv }) => {
    if (!keyRef.current) throw new Error('decryptRecord: vault is locked')
    if (rekeyingRef.current) {
      throw new Error('decryptRecord: passphrase change in progress')
    }
    return decryptJson(keyRef.current, ciphertext, iv)
  }, [])

  const value = useMemo(
    () => ({
      status,
      error,
      isLoading: status === STATUS.LOADING,
      isUnlocked: status === STATUS.UNLOCKED,
      needsSetup: status === STATUS.NEEDS_SETUP,
      isLocked: status === STATUS.LOCKED,
      isRekeying,
      passphraseHint,
      setPassphraseHint,
      idleTimeoutMs,
      setIdleTimeoutMs,
      unlockPrompt,
      requestUnlock,
      dismissUnlock,
      setup,
      unlock,
      changePassphrase,
      lock,
      retryLoad,
      encryptRecord,
      decryptRecord,
    }),
    [
      status,
      error,
      isRekeying,
      passphraseHint,
      setPassphraseHint,
      idleTimeoutMs,
      setIdleTimeoutMs,
      unlockPrompt,
      requestUnlock,
      dismissUnlock,
      setup,
      unlock,
      changePassphrase,
      lock,
      retryLoad,
      encryptRecord,
      decryptRecord,
    ],
  )

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}

export function useVault() {
  const ctx = useContext(VaultContext)
  if (!ctx) {
    throw new Error('useVault must be used inside <VaultProvider>')
  }
  return ctx
}

export { STATUS as VAULT_STATUS }
