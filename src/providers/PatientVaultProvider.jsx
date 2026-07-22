import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAuth } from '@/providers/AuthProvider'
import {
  KDF_ITERATIONS,
  checkVerifier,
  decryptJson,
  deriveKey,
  encryptJson,
  generateSalt,
  makeVerifier,
} from '@/lib/vaultCrypto'
import { fetchVaultMeta, saveVaultMeta, VAULT_APP_ID } from '@/lib/vaultMetaApi'
import { sessionAsyncStorage } from '@/lib/sessionStorage'
import { asyncStorage } from '@/lib/storage'
import { normalizePassphraseHint } from '@/lib/prefs'
import {
  clearBiometricEnrollment,
  enrollBiometrics as enrollBiometricsDevice,
  probeBiometricsCapability,
  readBiometricEnrollment,
  unlockWithBiometrics as unlockPassphraseWithBiometrics,
} from '@/lib/biometrics'
import {
  createPatient,
  decryptPatient,
  listOwnedPatients,
} from '@/lib/patientsApi'
import {
  bootstrapDek,
  createIdentityKeys,
  ensureOwnerMembership,
  listMyMemberships,
  loadMemberDek,
  loadOwnerDek,
  restoreIdentityPrivateKey,
  wrapPendingMembers,
  generateDekRaw,
  importDek,
  saveOwnerDekWrap,
  rotatePatientDek,
} from '@/lib/familyApi'

const MIN_PASSPHRASE_LENGTH = 8
const SESSION_KEY = 'docto.vault.session'
const IDENTITY_KEY_PREFIX = 'docto.identity.'
const IDLE_MS = 30 * 60 * 1000

const STATUS = {
  LOADING: 'loading',
  NEEDS_SETUP: 'needs-setup',
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  ERROR: 'error',
}

const VaultContext = createContext(null)

async function readCache() {
  try {
    const raw = await sessionAsyncStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.passphrase || !parsed?.userId) return null
    if (typeof parsed.expiresAt !== 'number' || parsed.expiresAt <= Date.now()) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

async function writeCache(userId, passphrase) {
  try {
    await sessionAsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        userId,
        passphrase,
        expiresAt: Date.now() + IDLE_MS,
      }),
    )
  } catch {
    // ignore
  }
}

async function clearCache() {
  try {
    await sessionAsyncStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

export function PatientVaultProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? null

  const [status, setStatus] = useState(STATUS.LOADING)
  const [error, setError] = useState(null)
  const [patient, setPatient] = useState(null)
  const [ownedPatientId, setOwnedPatientId] = useState(null)
  const [role, setRole] = useState(null)
  const [hint, setHint] = useState(null)
  const [busy, setBusy] = useState(false)
  const [identityPublicJwk, setIdentityPublicJwk] = useState(null)
  const [biometrics, setBiometrics] = useState({
    capability: null,
    enrollment: null,
    loading: true,
  })

  const kekRef = useRef(null)
  const dekRef = useRef(null)
  const dekRawRef = useRef(null)
  const metaRef = useRef(null)
  const passphraseRef = useRef(null)
  const identityPrivRef = useRef(null)
  const ownerMemberRef = useRef(null)

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
    refreshBiometrics()
  }, [refreshBiometrics])

  const lock = useCallback(async () => {
    kekRef.current = null
    dekRef.current = null
    dekRawRef.current = null
    passphraseRef.current = null
    identityPrivRef.current = null
    ownerMemberRef.current = null
    setPatient(null)
    setOwnedPatientId(null)
    setRole(null)
    setIdentityPublicJwk(null)
    await clearCache()
    setStatus((s) => (s === STATUS.NEEDS_SETUP ? s : STATUS.LOCKED))
  }, [])

  const ensureIdentity = useCallback(async (kek) => {
    const storageKey = `${IDENTITY_KEY_PREFIX}${userId}`
    try {
      const raw = await asyncStorage.getItem(storageKey)
      if (raw) {
        const packed = JSON.parse(raw)
        const privateJwk = await decryptJson(kek, packed.ciphertext, packed.iv)
        identityPrivRef.current = await restoreIdentityPrivateKey(privateJwk)
        setIdentityPublicJwk(packed.publicJwk)
        return packed.publicJwk
      }
    } catch {
      // recreate
    }
    const { publicJwk, privateJwk } = await createIdentityKeys()
    const enc = await encryptJson(kek, privateJwk)
    await asyncStorage.setItem(
      storageKey,
      JSON.stringify({ publicJwk, ciphertext: enc.ciphertext, iv: enc.iv }),
    )
    identityPrivRef.current = await restoreIdentityPrivateKey(privateJwk)
    setIdentityPublicJwk(publicJwk)
    return publicJwk
  }, [userId])

  const openOwnedPatient = useCallback(
    async (kek) => {
      const rows = await listOwnedPatients(userId)
      let patientRow = rows[0]
      if (!patientRow) {
        patientRow = await createPatient({
          userId,
          key: kek,
          profile: { preferredName: 'Me' },
        })
      }

      let ownerMember = await ensureOwnerMembership({
        patientId: patientRow.id,
        userId,
      })

      let dekBundle = await loadOwnerDek(kek, ownerMember)
      if (!dekBundle) {
        dekBundle = await bootstrapDek({
          patientId: patientRow.id,
          userId,
          kek,
          ownerMember,
        })
        ownerMember = await ensureOwnerMembership({
          patientId: patientRow.id,
          userId,
        })
        const refreshed = await listOwnedPatients(userId)
        patientRow = refreshed.find((r) => r.id === patientRow.id) || patientRow
      }

      dekRef.current = dekBundle.dek
      dekRawRef.current = dekBundle.dekRaw
      ownerMemberRef.current = ownerMember
      setOwnedPatientId(patientRow.id)

      let profile
      try {
        profile = await decryptPatient(dekBundle.dek, patientRow)
      } catch {
        profile = await decryptPatient(kek, patientRow)
      }

      try {
        await wrapPendingMembers({
          patientId: patientRow.id,
          dekRaw: dekBundle.dekRaw,
        })
      } catch {
        // non-fatal
      }

      setPatient(profile)
      setRole('owner')
      return profile
    },
    [userId],
  )

  const switchToOwned = useCallback(async () => {
    if (!kekRef.current) throw new Error('Vault is locked')
    await openOwnedPatient(kekRef.current)
  }, [openOwnedPatient])

  const finishUnlock = useCallback(
    async (kek, passphrase) => {
      kekRef.current = kek
      passphraseRef.current = passphrase
      await ensureIdentity(kek)
      await openOwnedPatient(kek)
      await writeCache(userId, passphrase)
      setStatus(STATUS.UNLOCKED)
    },
    [ensureIdentity, openOwnedPatient, userId],
  )

  useEffect(() => {
    if (authLoading) return
    let cancelled = false

    ;(async () => {
      await Promise.resolve()
      if (!userId) {
        kekRef.current = null
        dekRef.current = null
        metaRef.current = null
        passphraseRef.current = null
        if (!cancelled) {
          setPatient(null)
          setRole(null)
          setStatus(STATUS.LOADING)
          setError(null)
        }
        return
      }

      try {
        if (!cancelled) {
          setStatus(STATUS.LOADING)
          setError(null)
        }
        const result = await fetchVaultMeta(userId, VAULT_APP_ID)
        if (cancelled) return
        if (!result?.meta) {
          metaRef.current = null
          setStatus(STATUS.NEEDS_SETUP)
          return
        }
        metaRef.current = result.meta
        setHint(result.meta.hint ?? null)

        const cache = await readCache()
        if (cache?.userId === userId) {
          const kek = await deriveKey(
            cache.passphrase,
            result.meta.salt,
            result.meta.iterations,
          )
          const ok = await checkVerifier(kek, result.meta.verifier)
          if (ok && !cancelled) {
            await finishUnlock(kek, cache.passphrase)
            return
          }
        }
        if (!cancelled) setStatus(STATUS.LOCKED)
      } catch (err) {
        if (!cancelled) {
          setError(err?.message ?? 'Could not load vault')
          setStatus(STATUS.ERROR)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, userId, finishUnlock])

  useEffect(() => {
    if (!userId && status !== STATUS.LOADING) {
      clearCache()
    }
  }, [userId, status])

  const setup = useCallback(
    async (passphrase, preferredName = 'Me', passphraseHint = null) => {
      if (!userId) throw new Error('Not signed in')
      if (typeof passphrase !== 'string' || passphrase.length < MIN_PASSPHRASE_LENGTH) {
        throw new Error(`Passphrase must be at least ${MIN_PASSPHRASE_LENGTH} characters`)
      }
      const hintNorm = normalizePassphraseHint(passphraseHint)
      setBusy(true)
      try {
        const salt = generateSalt()
        const kek = await deriveKey(passphrase, salt, KDF_ITERATIONS)
        const verifier = await makeVerifier(kek)
        await saveVaultMeta(
          userId,
          {
            salt,
            iterations: KDF_ITERATIONS,
            verifier,
            hint: hintNorm,
            idleTimeoutMs: IDLE_MS,
          },
          VAULT_APP_ID,
        )
        metaRef.current = {
          salt,
          iterations: KDF_ITERATIONS,
          verifier,
          hint: hintNorm,
          idleTimeoutMs: IDLE_MS,
        }
        setHint(hintNorm)

        await ensureIdentity(kek)
        const dekRaw = await generateDekRaw()
        const dek = await importDek(dekRaw)
        const row = await createPatient({
          userId,
          key: dek,
          profile: { preferredName: preferredName || 'Me' },
        })
        const ownerMember = await ensureOwnerMembership({
          patientId: row.id,
          userId,
        })
        await saveOwnerDekWrap({ memberId: ownerMember.id, kek, dekRaw })
        dekRef.current = dek
        dekRawRef.current = dekRaw
        ownerMemberRef.current = ownerMember
        kekRef.current = kek
        passphraseRef.current = passphrase
        const p = await decryptPatient(dek, row)
        setOwnedPatientId(row.id)
        setPatient(p)
        setRole('owner')
        await writeCache(userId, passphrase)
        setStatus(STATUS.UNLOCKED)
      } finally {
        setBusy(false)
      }
    },
    [userId, ensureIdentity],
  )

  const unlock = useCallback(
    async (passphrase) => {
      if (!userId) throw new Error('Not signed in')
      const meta = metaRef.current
      if (!meta) throw new Error('Vault is not set up')
      setBusy(true)
      try {
        const kek = await deriveKey(passphrase, meta.salt, meta.iterations)
        const ok = await checkVerifier(kek, meta.verifier)
        if (!ok) throw new Error('Wrong passphrase')
        await finishUnlock(kek, passphrase)
      } finally {
        setBusy(false)
      }
    },
    [userId, finishUnlock],
  )

  const unlockWithBiometrics = useCallback(async () => {
    if (!userId) throw new Error('Not signed in')
    const passphrase = await unlockPassphraseWithBiometrics(userId)
    await unlock(passphrase)
    await refreshBiometrics()
  }, [userId, unlock, refreshBiometrics])

  const enrollBiometrics = useCallback(async () => {
    if (!userId) throw new Error('Not signed in')
    if (!passphraseRef.current) {
      throw new Error('Unlock with your passphrase first, then enable biometrics.')
    }
    await enrollBiometricsDevice(userId, passphraseRef.current, {
      userName: user?.email || userId,
      displayName: 'Docto vault',
    })
    await refreshBiometrics()
  }, [userId, user?.email, refreshBiometrics])

  const disableBiometrics = useCallback(async () => {
    if (!userId) return
    await clearBiometricEnrollment(userId)
    await refreshBiometrics()
  }, [userId, refreshBiometrics])

  const updatePassphraseHint = useCallback(
    async (nextHint) => {
      if (!userId) throw new Error('Not signed in')
      if (!kekRef.current) throw new Error('Vault is locked')
      const hintNorm = normalizePassphraseHint(nextHint)
      await saveVaultMeta(userId, { hint: hintNorm }, VAULT_APP_ID)
      if (metaRef.current) metaRef.current = { ...metaRef.current, hint: hintNorm }
      setHint(hintNorm)
    },
    [userId],
  )

  const shareKeysWithFamily = useCallback(async () => {
    if (!ownedPatientId || !dekRawRef.current || role !== 'owner') {
      throw new Error('Vault is not ready to share')
    }
    return wrapPendingMembers({
      patientId: ownedPatientId,
      dekRaw: dekRawRef.current,
    })
  }, [ownedPatientId, role])

  const openSharedPatient = useCallback(
    async (membership) => {
      if (!identityPrivRef.current) throw new Error('Identity keys missing')
      if (!membership?.docto_patients) {
        throw new Error('Shared patient record is unavailable')
      }
      const bundle = await loadMemberDek(identityPrivRef.current, membership)
      if (!bundle) {
        throw new Error(
          'Waiting for the patient owner to share the vault key. Ask them to open Family and tap Share keys.',
        )
      }
      dekRef.current = bundle.dek
      dekRawRef.current = bundle.dekRaw
      const profile = await decryptPatient(bundle.dek, membership.docto_patients)
      setPatient(profile)
      setRole(membership.role)
    },
    [],
  )

  const listShared = useCallback(async () => {
    if (!userId) return []
    return listMyMemberships(userId)
  }, [userId])

  const rotateKeysAfterRevoke = useCallback(async () => {
    if (role !== 'owner' || !ownedPatientId || !kekRef.current || !dekRef.current) {
      throw new Error('Only the owner can rotate keys')
    }
    let ownerMember = ownerMemberRef.current
    if (!ownerMember) {
      ownerMember = await ensureOwnerMembership({
        patientId: ownedPatientId,
        userId,
      })
      ownerMemberRef.current = ownerMember
    }
    const next = await rotatePatientDek({
      patientId: ownedPatientId,
      userId,
      kek: kekRef.current,
      ownerMember,
      oldDek: dekRef.current,
    })
    dekRef.current = next.dek
    dekRawRef.current = next.dekRaw
    return next
  }, [role, ownedPatientId, userId])

  const encrypt = useCallback(async (value) => {
    if (!dekRef.current) throw new Error('Vault is locked')
    return encryptJson(dekRef.current, value)
  }, [])

  const decrypt = useCallback(async (ciphertext, iv) => {
    if (!dekRef.current) throw new Error('Vault is locked')
    return decryptJson(dekRef.current, ciphertext, iv)
  }, [])

  const value = useMemo(
    () => ({
      status,
      error,
      busy,
      hint,
      patient,
      patientId: patient?.id ?? null,
      ownedPatientId,
      role,
      canWrite: role === 'owner' || role === 'helper',
      isOwner: role === 'owner',
      identityPublicJwk,
      biometrics,
      isLoading: status === STATUS.LOADING,
      needsSetup: status === STATUS.NEEDS_SETUP,
      isLocked: status === STATUS.LOCKED,
      isUnlocked: status === STATUS.UNLOCKED,
      minPassphraseLength: MIN_PASSPHRASE_LENGTH,
      setup,
      unlock,
      unlockWithBiometrics,
      enrollBiometrics,
      disableBiometrics,
      updatePassphraseHint,
      shareKeysWithFamily,
      openSharedPatient,
      switchToOwned,
      rotateKeysAfterRevoke,
      listShared,
      lock,
      encrypt,
      decrypt,
      getKey: () => dekRef.current,
      getDekRaw: () => dekRawRef.current,
      refreshBiometrics,
      retryLoad: () => setStatus(STATUS.LOADING),
    }),
    [
      status,
      error,
      busy,
      hint,
      patient,
      ownedPatientId,
      role,
      identityPublicJwk,
      biometrics,
      setup,
      unlock,
      unlockWithBiometrics,
      enrollBiometrics,
      disableBiometrics,
      updatePassphraseHint,
      shareKeysWithFamily,
      openSharedPatient,
      switchToOwned,
      rotateKeysAfterRevoke,
      listShared,
      lock,
      encrypt,
      decrypt,
      refreshBiometrics,
    ],
  )

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}

export function usePatientVault() {
  const ctx = useContext(VaultContext)
  if (!ctx) {
    throw new Error('usePatientVault must be used inside <PatientVaultProvider>')
  }
  return ctx
}
