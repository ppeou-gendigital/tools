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
import { useOfflineOptional } from '@/providers/OfflineProvider'
import { getVaultOfflinePack } from '@/lib/offline/vaultPack'
import { listCredentials, updateCredential } from '@/lib/credentialsApi'
import { listCreditCards, updateCreditCard } from '@/lib/creditCardsApi'
import { normalizePassphraseHint } from '@/lib/prefs'
import {
  VAULT_APP_ACCESSO,
  fetchVaultMeta,
  saveVaultMeta,
  vaultMetaQueryKey,
  wipeAccessoVaultData,
} from '@/lib/vaultMetaApi'
import {
  exportAccessoVaultMetaBackup,
  restoreAccessoVaultMetaBackup,
} from '@/lib/vaultMetaBackup'
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
import {
  clearBiometricEnrollment,
  BIO_PRF_UNAVAILABLE_MESSAGE,
  enrollBiometrics as enrollBiometricsDevice,
  probeBiometricsCapability,
  readBiometricEnrollment,
  setBiometricReauthInterval,
  touchBiometricStrongUnlock,
  unlockWithBiometrics as unlockPassphraseWithBiometrics,
} from '@/lib/biometrics'

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
  const offline = useOfflineOptional()
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
  // Bumped whenever keyRef is (re)derived successfully so decrypt
  // hooks re-run after unlock-time meta refresh without depending on
  // the whole vault context object.
  const [keyEpoch, setKeyEpoch] = useState(0)
  const [biometrics, setBiometrics] = useState({
    capability: null,
    enrollment: null,
    loading: true,
  })

  const keyRef = useRef(null)
  const metaRef = useRef(null)
  const failedAttemptsRef = useRef(0)
  const idleTimeoutMsRef = useRef(VAULT_IDLE_DEFAULT_MS)
  const rekeyingRef = useRef(false)
  // Kept only while unlocked so Vault settings can enroll biometrics
  // without re-typing the passphrase. Cleared on lock.
  const passphraseRef = useRef(null)
  // Dedupes the post-unlock prefs pull (same pattern as VaultItemsSync).
  const metaSyncedForUnlockRef = useRef(null)

  const authUserId = user?.id ?? null
  // Offline packs are keyed by userId; allow unlock without a live OTP session.
  const userId =
    authUserId ??
    (offline?.isOfflineMode ? offline.primaryPack?.scopeId ?? null : null)
  const isOfflineVault = Boolean(offline?.isOfflineMode)

  useEffect(() => {
    idleTimeoutMsRef.current = idleTimeoutMs
  }, [idleTimeoutMs])

  const refreshBiometrics = useCallback(async () => {
    if (!userId) {
      setBiometrics({ capability: null, enrollment: null, loading: false })
      return
    }
    try {
      const [capability, enrollment] = await Promise.all([
        probeBiometricsCapability(),
        readBiometricEnrollment(userId),
      ])
      setBiometrics({ capability, enrollment, loading: false })
    } catch {
      setBiometrics({
        capability: {
          available: false,
          reason: 'Could not check biometric support.',
        },
        enrollment: null,
        loading: false,
      })
    }
  }, [userId])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!userId) {
        if (!cancelled) {
          setBiometrics({ capability: null, enrollment: null, loading: false })
        }
        return
      }
      try {
        const [capability, enrollment] = await Promise.all([
          probeBiometricsCapability(),
          readBiometricEnrollment(userId),
        ])
        if (!cancelled) {
          setBiometrics({ capability, enrollment, loading: false })
        }
      } catch {
        if (!cancelled) {
          setBiometrics({
            capability: {
              available: false,
              reason: 'Could not check biometric support.',
            },
            enrollment: null,
            loading: false,
          })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId])

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
      metaSyncedForUnlockRef.current = null

      try {
        let meta = null

        if (isOfflineVault) {
          const pack =
            (await getVaultOfflinePack(userId)) ?? offline?.primaryPack ?? null
          meta = pack?.vaultMeta ?? null
          if (cancelled) return
        } else {
          // Vault crypto lives in public.vault_meta (per app_id), not in
          // the shared user_data prefs blob — sibling tools must not be
          // able to wipe salt/verifier via prefs CAS.
          await queryClient.invalidateQueries({
            queryKey: vaultMetaQueryKey(userId),
          })
          const fetched = await fetchVaultMeta(userId, VAULT_APP_ACCESSO)
          if (cancelled) return
          queryClient.setQueryData(vaultMetaQueryKey(userId), fetched)
          meta = fetched?.meta ?? null
        }

        const nextIdleMs = normalizeIdleTimeoutMs(meta?.idleTimeoutMs)
        setIdleTimeoutMsState(nextIdleMs)
        idleTimeoutMsRef.current = nextIdleMs

        if (!meta) {
          metaRef.current = null
          setPassphraseHintState(null)
          await clearCache()
          if (isOfflineVault) {
            setError(
              new Error(
                'Offline vault pack is missing unlock metadata. Connect and refresh Available offline.',
              ),
            )
            setStatus(STATUS.ERROR)
          } else {
            setStatus(STATUS.NEEDS_SETUP)
          }
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
              passphraseRef.current = cached.passphrase
              // Refresh the expiry so a hydrate counts as activity.
              await writeCache(userId, cached.passphrase, idleTimeoutMsRef.current)
              setKeyEpoch((n) => n + 1)
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
        if (!isOfflineVault) {
          try {
            const pack = await getVaultOfflinePack(userId)
            if (pack?.vaultMeta && !cancelled) {
              const meta = pack.vaultMeta
              metaRef.current = meta
              setPassphraseHintState(meta.hint ?? null)
              const nextIdleMs = normalizeIdleTimeoutMs(meta.idleTimeoutMs)
              setIdleTimeoutMsState(nextIdleMs)
              idleTimeoutMsRef.current = nextIdleMs
              setStatus(STATUS.LOCKED)
              return
            }
          } catch {
            // ignore pack fallback errors
          }
        }
        setError(err)
        setPassphraseHintState(null)
        setStatus(STATUS.ERROR)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [
    userId,
    authLoading,
    queryClient,
    reloadCounter,
    isOfflineVault,
    offline?.primaryPack,
  ])

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
      // Refuse to mint a new salt/verifier when encrypted rows already
      // exist — that orphans every credential/card under the old key.
      const [existingCreds, existingCards] = await Promise.all([
        listCredentials(userId),
        listCreditCards(userId),
      ])
      if (existingCreds.length > 0 || existingCards.length > 0) {
        throw new Error(
          'Vault items already exist for this account. Unlock with your existing passphrase. If vault metadata was lost, restore it or wipe items before creating a new vault.',
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
      const saved = await saveVaultMeta(userId, meta, VAULT_APP_ACCESSO)
      queryClient.setQueryData(vaultMetaQueryKey(userId), saved)
      const nextMeta = saved?.meta ?? meta
      keyRef.current = key
      metaRef.current = nextMeta
      failedAttemptsRef.current = 0
      await writeCache(userId, passphrase, idleTimeoutMsRef.current)
      passphraseRef.current = passphrase
      setPassphraseHintState(hint)
      setIdleTimeoutMsState(
        normalizeIdleTimeoutMs(nextMeta.idleTimeoutMs),
      )
      setKeyEpoch((n) => n + 1)
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
      passphraseRef.current = passphrase
      await writeCache(userId, passphrase, idleTimeoutMsRef.current)
      touchBiometricStrongUnlock(userId).then((enrollment) => {
        if (enrollment) {
          setBiometrics((prev) => ({ ...prev, enrollment }))
        }
      })
      setKeyEpoch((n) => n + 1)
      setStatus(STATUS.UNLOCKED)
      setError(null)
      setUnlockPrompt(null)
    },
    [userId],
  )

  const unlockWithBiometrics = useCallback(async () => {
    if (!userId) throw new Error('unlockWithBiometrics: not signed in')
    const passphrase = await unlockPassphraseWithBiometrics(userId)
    await unlock(passphrase)
    await refreshBiometrics()
  }, [refreshBiometrics, unlock, userId])

  const enrollDeviceBiometrics = useCallback(
    async (options = {}) => {
      if (!userId) throw new Error('enrollBiometrics: not signed in')
      if (!keyRef.current) {
        throw new Error('Unlock the vault before enabling biometrics.')
      }
      const passphrase = passphraseRef.current
      if (!passphrase) {
        throw new Error(
          'Re-unlock with your passphrase, then enable biometrics.',
        )
      }
      try {
        const enrollment = await enrollBiometricsDevice(
          userId,
          passphrase,
          options,
        )
        setBiometrics((prev) => ({ ...prev, enrollment }))
        return enrollment
      } catch (err) {
        const msg = err?.message ?? String(err)
        if (msg === BIO_PRF_UNAVAILABLE_MESSAGE || /PRF key/i.test(msg)) {
          setBiometrics((prev) => ({
            ...prev,
            enrollment: null,
            capability: {
              available: false,
              reason: BIO_PRF_UNAVAILABLE_MESSAGE,
              label: prev.capability?.label,
            },
          }))
        }
        throw err
      }
    },
    [userId],
  )

  const disableBiometrics = useCallback(async () => {
    if (!userId) return
    await clearBiometricEnrollment(userId)
    setBiometrics((prev) => ({ ...prev, enrollment: null }))
  }, [userId])

  const setBiometricsReauthInterval = useCallback(
    async (ms) => {
      if (!userId) return
      const enrollment = await setBiometricReauthInterval(userId, ms)
      if (enrollment) {
        setBiometrics((prev) => ({ ...prev, enrollment }))
      }
    },
    [userId],
  )

  const lock = useCallback(() => {
    keyRef.current = null
    passphraseRef.current = null
    failedAttemptsRef.current = 0
    metaSyncedForUnlockRef.current = null
    queryClient.removeQueries({ queryKey: ['credentials', userId] })
    queryClient.removeQueries({ queryKey: ['credit_cards', userId] })
    setStatus(metaRef.current ? STATUS.LOCKED : STATUS.NEEDS_SETUP)
    setError(null)
    // Fire-and-forget; the storage write is not on the render path.
    clearCache()
  }, [queryClient, userId])

  // After unlock (including session hydrate), force-pull vault_meta and
  // re-verify the in-memory passphrase against fresh salt/verifier.
  useEffect(() => {
    if (status !== STATUS.UNLOCKED || !userId || isOfflineVault) {
      if (status !== STATUS.UNLOCKED) {
        metaSyncedForUnlockRef.current = null
      }
      // Offline: trust pack meta; mark session so we do not retry network.
      if (status === STATUS.UNLOCKED && isOfflineVault && userId) {
        metaSyncedForUnlockRef.current = `${userId}:unlocked:offline`
      }
      return
    }
    const sessionKey = `${userId}:unlocked`
    if (metaSyncedForUnlockRef.current === sessionKey) return

    let cancelled = false
    ;(async () => {
      try {
        const fetched = await fetchVaultMeta(userId, VAULT_APP_ACCESSO)
        if (cancelled) return
        queryClient.setQueryData(vaultMetaQueryKey(userId), fetched)

        const meta = fetched?.meta ?? null
        const nextIdleMs = normalizeIdleTimeoutMs(meta?.idleTimeoutMs)
        setIdleTimeoutMsState(nextIdleMs)
        idleTimeoutMsRef.current = nextIdleMs

        if (!meta) {
          keyRef.current = null
          passphraseRef.current = null
          metaRef.current = null
          setPassphraseHintState(null)
          await clearCache()
          setStatus(STATUS.NEEDS_SETUP)
          return
        }

        metaRef.current = meta
        setPassphraseHintState(meta.hint ?? null)

        const passphrase = passphraseRef.current
        if (!passphrase) {
          keyRef.current = null
          await clearCache()
          setStatus(STATUS.LOCKED)
          return
        }

        const key = await deriveKey(passphrase, meta.salt, meta.iterations)
        const ok = await checkVerifier(key, meta.verifier)
        if (cancelled) return
        if (!ok) {
          keyRef.current = null
          passphraseRef.current = null
          await clearCache()
          setStatus(STATUS.LOCKED)
          return
        }

        keyRef.current = key
        await writeCache(userId, passphrase, idleTimeoutMsRef.current)
        // Mark this unlock session only after a successful re-verify so
        // Strict Mode remounts / cancelled pulls can retry.
        metaSyncedForUnlockRef.current = sessionKey
        setKeyEpoch((n) => n + 1)
      } catch (err) {
        if (cancelled) return
        console.warn(
          '[accesso] vault meta refresh failed:',
          err?.message ?? err,
        )
      }
    })()

    return () => {
      cancelled = true
    }
  }, [status, userId, queryClient, isOfflineVault])

  // Persist a new idle-timeout preference. Updates local state
  // immediately (so the timer effect re-registers), then upserts the
  // vault_meta row. If the vault is currently unlocked we also refresh
  // the cache expiry with the new window so the change takes effect on
  // the very next activity tick.
  const setIdleTimeoutMs = useCallback(
    async (ms) => {
      const normalized = normalizeIdleTimeoutMs(ms)
      if (normalized === idleTimeoutMsRef.current) return
      idleTimeoutMsRef.current = normalized
      setIdleTimeoutMsState(normalized)
      if (userId) {
        const saved = await saveVaultMeta(
          userId,
          { idleTimeoutMs: normalized },
          VAULT_APP_ACCESSO,
        )
        queryClient.setQueryData(vaultMetaQueryKey(userId), saved)
        if (saved?.meta) metaRef.current = saved.meta
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
      const saved = await saveVaultMeta(
        userId,
        { hint },
        VAULT_APP_ACCESSO,
      )
      queryClient.setQueryData(vaultMetaQueryKey(userId), saved)
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
        const saved = await saveVaultMeta(
          userId,
          {
            salt: newSalt,
            iterations,
            verifier: newVerifier,
          },
          VAULT_APP_ACCESSO,
        )
        queryClient.setQueryData(vaultMetaQueryKey(userId), saved)

        metaRef.current = {
          ...meta,
          salt: newSalt,
          iterations,
          verifier: newVerifier,
        }
        keyRef.current = newKey
        passphraseRef.current = nextPassphrase
        failedAttemptsRef.current = 0
        await writeCache(userId, nextPassphrase, idleTimeoutMsRef.current)
        // Old biometric wrap was under the previous passphrase.
        await clearBiometricEnrollment(userId)
        setBiometrics((prev) => ({ ...prev, enrollment: null }))
        setKeyEpoch((n) => n + 1)

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

  // Download salt/verifier backup (no passphrase, no plaintext secrets).
  const exportVaultMetaBackup = useCallback(async () => {
    if (!userId) throw new Error('exportVaultMetaBackup: not signed in')
    return exportAccessoVaultMetaBackup(userId)
  }, [userId])

  // Restore salt/verifier from a backup file, then force re-unlock.
  const restoreVaultMetaBackup = useCallback(
    async (raw) => {
      if (!userId) throw new Error('restoreVaultMetaBackup: not signed in')
      if (rekeyingRef.current) {
        throw new Error('restoreVaultMetaBackup: passphrase change in progress')
      }
      const { saved } = await restoreAccessoVaultMetaBackup(userId, raw)
      queryClient.setQueryData(vaultMetaQueryKey(userId), saved)
      keyRef.current = null
      passphraseRef.current = null
      failedAttemptsRef.current = 0
      metaSyncedForUnlockRef.current = null
      await clearCache()
      try {
        await clearBiometricEnrollment(userId)
      } catch {
        // best-effort — bio wrap was under previous meta generation
      }
      setBiometrics((prev) => ({ ...prev, enrollment: null }))
      setUnlockPrompt(null)
      setError(null)
      setKeyEpoch((n) => n + 1)
      // Reload meta from network and land on locked (or needs-setup).
      setReloadCounter((n) => n + 1)
      return saved
    },
    [queryClient, userId],
  )

  // Destructive reset: delete credentials/cards + Accesso vault_meta,
  // strip legacy user_data.vault, clear local session, land on setup.
  const wipeVaultData = useCallback(async () => {
    if (!userId) throw new Error('wipeVaultData: not signed in')
    if (rekeyingRef.current) {
      throw new Error('wipeVaultData: passphrase change in progress')
    }
    await wipeAccessoVaultData(userId)
    try {
      await clearBiometricEnrollment(userId)
    } catch {
      // best-effort
    }
    keyRef.current = null
    passphraseRef.current = null
    metaRef.current = null
    failedAttemptsRef.current = 0
    metaSyncedForUnlockRef.current = null
    await clearCache()
    queryClient.removeQueries({ queryKey: ['credentials', userId] })
    queryClient.removeQueries({ queryKey: ['credit_cards', userId] })
    queryClient.removeQueries({ queryKey: vaultMetaQueryKey(userId) })
    queryClient.removeQueries({ queryKey: ['user_data', userId] })
    setBiometrics((prev) => ({ ...prev, enrollment: null }))
    setPassphraseHintState(null)
    setIdleTimeoutMsState(VAULT_IDLE_DEFAULT_MS)
    idleTimeoutMsRef.current = VAULT_IDLE_DEFAULT_MS
    setUnlockPrompt(null)
    setError(null)
    setKeyEpoch((n) => n + 1)
    setStatus(STATUS.NEEDS_SETUP)
  }, [queryClient, userId])

  const value = useMemo(
    () => ({
      status,
      error,
      isLoading: status === STATUS.LOADING,
      isUnlocked: status === STATUS.UNLOCKED,
      needsSetup: status === STATUS.NEEDS_SETUP,
      isLocked: status === STATUS.LOCKED,
      isRekeying,
      keyEpoch,
      passphraseHint,
      setPassphraseHint,
      idleTimeoutMs,
      setIdleTimeoutMs,
      unlockPrompt,
      requestUnlock,
      dismissUnlock,
      setup,
      unlock,
      unlockWithBiometrics,
      enrollBiometrics: enrollDeviceBiometrics,
      disableBiometrics,
      setBiometricsReauthInterval,
      refreshBiometrics,
      biometrics,
      changePassphrase,
      lock,
      exportVaultMetaBackup,
      restoreVaultMetaBackup,
      wipeVaultData,
      retryLoad,
      encryptRecord,
      decryptRecord,
    }),
    [
      status,
      error,
      isRekeying,
      keyEpoch,
      passphraseHint,
      setPassphraseHint,
      idleTimeoutMs,
      setIdleTimeoutMs,
      unlockPrompt,
      requestUnlock,
      dismissUnlock,
      setup,
      unlock,
      unlockWithBiometrics,
      enrollDeviceBiometrics,
      disableBiometrics,
      setBiometricsReauthInterval,
      refreshBiometrics,
      biometrics,
      changePassphrase,
      lock,
      exportVaultMetaBackup,
      restoreVaultMetaBackup,
      wipeVaultData,
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
