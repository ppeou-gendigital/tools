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
import { useNotes } from '@/providers/NotesProvider'
import { sessionAsyncStorage } from '@/lib/sessionStorage'
import {
  KDF_ITERATIONS,
  checkVerifier,
  decryptBytes as decryptBytesCrypto,
  decryptJson,
  deriveKey,
  encryptBytes as encryptBytesCrypto,
  encryptJson,
  generateSalt,
  makeVerifier,
} from '@/lib/lockboxCrypto'
import {
  LOCKBOX_IDLE_DEFAULT_MS,
  normalizeIdleTimeoutMs,
} from '@/lib/lockboxIdleOptions'
import {
  clearBiometricEnrollment,
  enrollBiometrics as enrollBiometricsDevice,
  formatBiometricError,
  probeBiometricsCapability,
  readBiometricEnrollment,
  setBiometricReauthInterval,
  touchBiometricStrongUnlock,
  unlockWithBiometrics as unlockPassphraseWithBiometrics,
} from '@/lib/biometrics'
import {
  createId,
  effectiveLockboxId,
  notebookIdsForNote,
  notesInNotebook,
} from '@/lib/workspaceModel'

const MIN_PASSPHRASE_LENGTH = 8
const SESSION_KEY = 'notas.lockboxes.session'
const FAILED_UNLOCK_DELAYS_MS = [0, 250, 500, 1000, 2000, 4000]
const ACTIVITY_THROTTLE_MS = 30_000

const LockboxContext = createContext(null)

async function readSessionCache() {
  try {
    const raw = await sessionAsyncStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.userId !== 'string') return null
    if (typeof parsed.expiresAt !== 'number' || parsed.expiresAt <= Date.now()) {
      return null
    }
    if (!parsed.lockboxes || typeof parsed.lockboxes !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

async function writeSessionCache(userId, passphrases, idleTimeoutMs) {
  const payload = {
    userId,
    lockboxes: passphrases,
    expiresAt: Date.now() + idleTimeoutMs,
  }
  try {
    await sessionAsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload))
  } catch {
    // best-effort
  }
}

async function clearSessionCache() {
  try {
    await sessionAsyncStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

export function LockboxProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const {
    ready: notesReady,
    workspace,
    lockboxes,
    getNote,
    createNote,
    updateNote,
    upsertLockboxMeta,
    removeLockboxMeta,
    updateNotebook,
    setNoteNotebooks,
    setLockboxIdleTimeoutMs,
  } = useNotes()

  const userId = user?.id ?? null

  // lockboxId -> CryptoKey
  const keysRef = useRef(new Map())
  // lockboxId -> passphrase (for bio enroll / session cache)
  const passphrasesRef = useRef(new Map())
  const failedAttemptsRef = useRef(new Map())
  const idleTimeoutMsRef = useRef(LOCKBOX_IDLE_DEFAULT_MS)

  const [unlockedIds, setUnlockedIds] = useState(() => new Set())
  const [idleTimeoutMs, setIdleTimeoutMsState] = useState(
    LOCKBOX_IDLE_DEFAULT_MS,
  )
  const [unlockPrompt, setUnlockPrompt] = useState(null)
  const [capability, setCapability] = useState(null)
  // lockboxId -> enrollment | null
  const [enrollments, setEnrollments] = useState({})
  const [bioLoading, setBioLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      const ms = normalizeIdleTimeoutMs(
        workspace.lockboxIdleTimeoutMs ?? LOCKBOX_IDLE_DEFAULT_MS,
      )
      idleTimeoutMsRef.current = ms
      setIdleTimeoutMsState(ms)
    })()
    return () => {
      cancelled = true
    }
  }, [workspace.lockboxIdleTimeoutMs])

  const refreshBiometrics = useCallback(async () => {
    if (!userId) {
      setCapability(null)
      setEnrollments({})
      setBioLoading(false)
      return
    }
    setBioLoading(true)
    try {
      const cap = await probeBiometricsCapability()
      setCapability(cap)
      const next = {}
      await Promise.all(
        lockboxes.map(async (lb) => {
          next[lb.id] = await readBiometricEnrollment(userId, lb.id)
        }),
      )
      setEnrollments(next)
    } catch {
      setCapability({
        available: false,
        reason: 'Could not check biometric support.',
      })
    } finally {
      setBioLoading(false)
    }
  }, [userId, lockboxes])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      await refreshBiometrics()
    })()
    return () => {
      cancelled = true
    }
  }, [refreshBiometrics])

  // Hydrate unlocked keys from session cache when workspace is ready.
  useEffect(() => {
    if (authLoading || !notesReady || !userId) return
    let cancelled = false
    ;(async () => {
      const cached = await readSessionCache()
      if (cancelled || !cached || cached.userId !== userId) return
      const nextUnlocked = new Set()
      for (const meta of lockboxes) {
        const passphrase = cached.lockboxes?.[meta.id]
        if (typeof passphrase !== 'string' || !passphrase) continue
        try {
          const key = await deriveKey(
            passphrase,
            meta.salt,
            meta.iterations,
          )
          const ok = await checkVerifier(key, meta.verifier)
          if (!ok) continue
          keysRef.current.set(meta.id, key)
          passphrasesRef.current.set(meta.id, passphrase)
          nextUnlocked.add(meta.id)
        } catch {
          // skip
        }
      }
      if (!cancelled && nextUnlocked.size > 0) {
        setUnlockedIds(nextUnlocked)
        await writeSessionCache(
          userId,
          Object.fromEntries(passphrasesRef.current),
          idleTimeoutMsRef.current,
        )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, notesReady, userId, lockboxes])

  // Clear only after auth has resolved with no user — never during the
  // brief userId=null window on page refresh (that was wiping the session).
  useEffect(() => {
    if (authLoading || userId) return
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      keysRef.current = new Map()
      passphrasesRef.current = new Map()
      setUnlockedIds(new Set())
      setUnlockPrompt(null)
      await clearSessionCache()
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, userId])

  const bumpUnlocked = useCallback(() => {
    setUnlockedIds(new Set(keysRef.current.keys()))
    setTick((t) => t + 1)
  }, [])

  const persistSession = useCallback(async () => {
    if (!userId) return
    await writeSessionCache(
      userId,
      Object.fromEntries(passphrasesRef.current),
      idleTimeoutMsRef.current,
    )
  }, [userId])

  const isUnlocked = useCallback(
    (lockboxId) => (lockboxId ? keysRef.current.has(lockboxId) : true),
    // tick forces re-subscribe when set changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick, unlockedIds],
  )

  const createLockbox = useCallback(
    async (name, passphrase, options = {}) => {
      if (!userId) throw new Error('createLockbox: not signed in')
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
      const now = new Date().toISOString()
      const meta = {
        id: createId(),
        name: String(name ?? '').trim() || 'Lockbox',
        salt,
        iterations,
        verifier,
        hint:
          typeof options.hint === 'string' && options.hint.trim()
            ? options.hint.trim().slice(0, 120)
            : null,
        createdAt: now,
        updatedAt: now,
      }
      await upsertLockboxMeta(meta)
      keysRef.current.set(meta.id, key)
      passphrasesRef.current.set(meta.id, passphrase)
      bumpUnlocked()
      await persistSession()
      return meta
    },
    [bumpUnlocked, persistSession, upsertLockboxMeta, userId],
  )

  const unlock = useCallback(
    async (lockboxId, passphrase) => {
      if (!userId) throw new Error('unlock: not signed in')
      const meta = lockboxes.find((l) => l.id === lockboxId)
      if (!meta) throw new Error('unlock: unknown lockbox')

      const attempts = failedAttemptsRef.current.get(lockboxId) ?? 0
      const delayIdx = Math.min(attempts, FAILED_UNLOCK_DELAYS_MS.length - 1)
      const wait = FAILED_UNLOCK_DELAYS_MS[delayIdx]
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait))
      }

      const key = await deriveKey(passphrase, meta.salt, meta.iterations)
      const ok = await checkVerifier(key, meta.verifier)
      if (!ok) {
        failedAttemptsRef.current.set(lockboxId, attempts + 1)
        throw new Error('Wrong passphrase. Try again.')
      }
      failedAttemptsRef.current.set(lockboxId, 0)
      keysRef.current.set(lockboxId, key)
      passphrasesRef.current.set(lockboxId, passphrase)
      bumpUnlocked()
      await persistSession()
      touchBiometricStrongUnlock(userId, lockboxId).then((enrollment) => {
        if (enrollment) {
          setEnrollments((prev) => ({ ...prev, [lockboxId]: enrollment }))
        }
      })
      setUnlockPrompt((p) => (p?.lockboxId === lockboxId ? null : p))
    },
    [bumpUnlocked, lockboxes, persistSession, userId],
  )

  const unlockWithBiometrics = useCallback(
    async (lockboxId) => {
      if (!userId) throw new Error('unlockWithBiometrics: not signed in')
      const passphrase = await unlockPassphraseWithBiometrics(
        userId,
        lockboxId,
      )
      await unlock(lockboxId, passphrase)
      await refreshBiometrics()
    },
    [refreshBiometrics, unlock, userId],
  )

  const lockOne = useCallback(
    async (lockboxId) => {
      keysRef.current.delete(lockboxId)
      passphrasesRef.current.delete(lockboxId)
      bumpUnlocked()
      await persistSession()
    },
    [bumpUnlocked, persistSession],
  )

  const lockAll = useCallback(async () => {
    keysRef.current = new Map()
    passphrasesRef.current = new Map()
    bumpUnlocked()
    await clearSessionCache()
  }, [bumpUnlocked])

  const requestUnlock = useCallback((lockboxId, options = {}) => {
    if (!lockboxId) return Promise.resolve()
    if (keysRef.current.has(lockboxId)) return Promise.resolve()
    return new Promise((resolve, reject) => {
      setUnlockPrompt({
        lockboxId,
        dismissible: options.dismissible !== false,
        resolve,
        reject,
      })
    })
  }, [])

  const dismissUnlock = useCallback(() => {
    setUnlockPrompt((p) => {
      if (p?.reject) p.reject(new Error('Unlock dismissed'))
      return null
    })
  }, [])

  // Resolve unlock prompt when that lockbox becomes unlocked
  useEffect(() => {
    if (!unlockPrompt?.lockboxId) return
    if (!keysRef.current.has(unlockPrompt.lockboxId)) return
    unlockPrompt.resolve?.()
    setUnlockPrompt(null)
  }, [unlockPrompt, unlockedIds])

  const enrollDeviceBiometrics = useCallback(
    async (lockboxId, options = {}) => {
      if (!userId) throw new Error('enrollBiometrics: not signed in')
      if (!keysRef.current.has(lockboxId)) {
        throw new Error('Unlock the lockbox before enabling biometrics.')
      }
      const passphrase =
        options.passphrase || passphrasesRef.current.get(lockboxId)
      if (!passphrase) {
        throw new Error(
          'Re-unlock with your passphrase, then enable biometrics.',
        )
      }
      // Keep passphrase for this enroll attempt even if session was restored
      // without it (e.g. key present but passphrase map empty).
      passphrasesRef.current.set(lockboxId, passphrase)
      const meta = lockboxes.find((l) => l.id === lockboxId)
      try {
        const enrollment = await enrollBiometricsDevice(
          userId,
          lockboxId,
          passphrase,
          {
            ...options,
            displayName: meta?.name || 'Notas lockbox',
          },
        )
        setEnrollments((prev) => ({ ...prev, [lockboxId]: enrollment }))
        return enrollment
      } catch (err) {
        throw new Error(formatBiometricError(err))
      }
    },
    [lockboxes, userId],
  )

  const disableBiometrics = useCallback(
    async (lockboxId) => {
      if (!userId || !lockboxId) return
      await clearBiometricEnrollment(userId, lockboxId)
      setEnrollments((prev) => ({ ...prev, [lockboxId]: null }))
    },
    [userId],
  )

  const setBiometricsReauthInterval = useCallback(
    async (lockboxId, ms) => {
      if (!userId) return
      const enrollment = await setBiometricReauthInterval(
        userId,
        lockboxId,
        ms,
      )
      if (enrollment) {
        setEnrollments((prev) => ({ ...prev, [lockboxId]: enrollment }))
      }
    },
    [userId],
  )

  const setIdleTimeout = useCallback(
    async (ms) => {
      const normalized = normalizeIdleTimeoutMs(ms)
      idleTimeoutMsRef.current = normalized
      setIdleTimeoutMsState(normalized)
      await setLockboxIdleTimeoutMs(normalized)
      if (passphrasesRef.current.size > 0 && userId) {
        await writeSessionCache(
          userId,
          Object.fromEntries(passphrasesRef.current),
          normalized,
        )
      }
    },
    [setLockboxIdleTimeoutMs, userId],
  )

  // Idle lock: clear all unlocked keys after inactivity
  useEffect(() => {
    if (unlockedIds.size === 0) return undefined
    let timer = null
    let lastActivityWrite = 0

    const arm = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        lockAll()
      }, idleTimeoutMsRef.current)
    }

    const onActivity = () => {
      arm()
      const now = Date.now()
      if (now - lastActivityWrite < ACTIVITY_THROTTLE_MS) return
      lastActivityWrite = now
      if (userId && passphrasesRef.current.size > 0) {
        writeSessionCache(
          userId,
          Object.fromEntries(passphrasesRef.current),
          idleTimeoutMsRef.current,
        )
      }
    }

    arm()
    const events = ['pointerdown', 'keydown', 'touchstart', 'mousemove']
    for (const ev of events) {
      window.addEventListener(ev, onActivity, { passive: true })
    }
    return () => {
      if (timer) clearTimeout(timer)
      for (const ev of events) {
        window.removeEventListener(ev, onActivity)
      }
    }
  }, [unlockedIds, idleTimeoutMs, lockAll, userId])

  const encryptPayload = useCallback(async (lockboxId, payload) => {
    const key = keysRef.current.get(lockboxId)
    if (!key) throw new Error('Lockbox is locked.')
    return encryptJson(key, payload)
  }, [])

  const decryptPayload = useCallback(async (lockboxId, ciphertext, iv) => {
    const key = keysRef.current.get(lockboxId)
    if (!key) throw new Error('Lockbox is locked.')
    return decryptJson(key, ciphertext, iv)
  }, [])

  const encryptBytes = useCallback(async (lockboxId, bytes) => {
    const key = keysRef.current.get(lockboxId)
    if (!key) throw new Error('Lockbox is locked.')
    return encryptBytesCrypto(key, bytes)
  }, [])

  const decryptBytes = useCallback(async (lockboxId, bytes, iv) => {
    const key = keysRef.current.get(lockboxId)
    if (!key) throw new Error('Lockbox is locked.')
    return decryptBytesCrypto(key, bytes, iv)
  }, [])

  const revealNoteContent = useCallback(
    async (noteId) => {
      const note = getNote(noteId)
      if (!note) return null
      const lbId = effectiveLockboxId(workspace, note)
      if (!lbId || (!note.ciphertext && note.body !== undefined)) {
        return { title: note.title, body: note.body, locked: false }
      }
      if (!note.ciphertext || !note.iv) {
        return { title: note.title, body: note.body, locked: false }
      }
      if (!keysRef.current.has(lbId)) {
        return { title: 'Locked note', body: '', locked: true, lockboxId: lbId }
      }
      const payload = await decryptPayload(lbId, note.ciphertext, note.iv)
      return {
        title: payload?.title ?? '',
        body: payload?.body ?? '',
        locked: false,
        lockboxId: lbId,
      }
    },
    [decryptPayload, getNote, workspace],
  )

  const saveNoteContent = useCallback(
    async (
      noteId,
      { title, body, notebookId, notebookIds, lockboxId: explicitLb } = {},
    ) => {
      const note = noteId ? getNote(noteId) : null
      const requested = Array.isArray(notebookIds)
        ? notebookIds
        : notebookId
          ? [notebookId]
          : noteId
            ? notebookIdsForNote(workspace, noteId)
            : [workspace.activeNotebookId]
      const targetIds = [
        ...new Set(
          requested.filter((id) =>
            workspace.notebooks.some((n) => n.id === id),
          ),
        ),
      ]
      if (targetIds.length === 0 && workspace.activeNotebookId) {
        targetIds.push(workspace.activeNotebookId)
      }
      if (targetIds.length === 0) {
        throw new Error('Select at least one notebook.')
      }

      const memberLockboxes = targetIds
        .map((id) => workspace.notebooks.find((n) => n.id === id)?.lockboxId)
        .filter(Boolean)
      const inheritedLb =
        memberLockboxes.length > 0 && new Set(memberLockboxes).size === 1
          ? memberLockboxes[0]
          : null

      // Note-level lockbox when set; otherwise inherit when memberships agree.
      // Stored note.lockboxId is only the explicit override (null = inherit).
      const storedNoteLb =
        explicitLb !== undefined
          ? explicitLb || null
          : (note?.lockboxId ?? null)
      const encryptWithLb = storedNoteLb || inheritedLb

      if (encryptWithLb && !keysRef.current.has(encryptWithLb)) {
        await requestUnlock(encryptWithLb)
      }

      let saved
      if (encryptWithLb) {
        const { ciphertext, iv } = await encryptPayload(encryptWithLb, {
          title: String(title ?? '').trim() || 'Untitled',
          body: String(body ?? ''),
        })
        if (noteId) {
          saved = await updateNote(noteId, {
            title: 'Locked note',
            body: '',
            lockboxId: storedNoteLb,
            ciphertext,
            iv,
            clearPlaintext: true,
          })
        } else {
          saved = await createNote({
            notebookIds: targetIds,
            lockboxId: storedNoteLb,
            ciphertext,
            iv,
          })
        }
      } else if (noteId) {
        saved = await updateNote(noteId, {
          title,
          body,
          lockboxId: null,
          ciphertext: null,
          iv: null,
          decryptPlaintext: true,
        })
      } else {
        saved = await createNote({
          title,
          body,
          notebookIds: targetIds,
          lockboxId: null,
        })
      }

      const id = saved?.id ?? noteId
      if (id && noteId) {
        await setNoteNotebooks(id, targetIds)
      }
      return saved
    },
    [
      createNote,
      encryptPayload,
      getNote,
      requestUnlock,
      setNoteNotebooks,
      updateNote,
      workspace,
    ],
  )

  const attachLockboxToNotebook = useCallback(
    async (notebookId, lockboxId) => {
      const notebook = workspace.notebooks.find((n) => n.id === notebookId)
      const prevLb = notebook?.lockboxId ?? null
      const nextLb = lockboxId || null
      if (prevLb === nextLb) return

      // Need the current key to decrypt, and the new key to encrypt.
      if (prevLb && !keysRef.current.has(prevLb)) {
        await requestUnlock(prevLb)
      }
      if (nextLb && !keysRef.current.has(nextLb)) {
        await requestUnlock(nextLb)
      }

      const members = notesInNotebook(workspace, notebookId).filter(
        (n) => !n.lockboxId,
      )

      // Removing notebook protection: decrypt notes that would lose inheritance
      if (!nextLb && prevLb) {
        for (const note of members) {
          if (!note.ciphertext || !note.iv) continue
          const otherLbs = notebookIdsForNote(workspace, note.id)
            .filter((id) => id !== notebookId)
            .map((id) => workspace.notebooks.find((n) => n.id === id)?.lockboxId)
            .filter(Boolean)
          const stillInherits =
            otherLbs.length > 0 &&
            new Set(otherLbs).size === 1 &&
            otherLbs[0] === prevLb
          if (stillInherits) continue
          const payload = await decryptPayload(
            prevLb,
            note.ciphertext,
            note.iv,
          )
          await updateNote(note.id, {
            title: payload?.title ?? 'Untitled',
            body: payload?.body ?? '',
            ciphertext: null,
            iv: null,
            decryptPlaintext: true,
          })
        }
        await updateNotebook(notebookId, { lockboxId: null })
        return
      }

      // Attach or switch lockbox: decrypt with previous key (if any), then
      // encrypt with the new key so ciphertext matches notebook inheritance.
      for (const note of members) {
        const otherLbs = notebookIdsForNote(workspace, note.id)
          .filter((id) => id !== notebookId)
          .map((id) => workspace.notebooks.find((n) => n.id === id)?.lockboxId)
          .filter(Boolean)
        const afterLbs = nextLb ? [...otherLbs, nextLb] : otherLbs
        const inheritsNext =
          afterLbs.length > 0 &&
          new Set(afterLbs).size === 1 &&
          afterLbs[0] === nextLb

        let title = note.title
        let body = note.body
        if (note.ciphertext && note.iv) {
          const decryptWith =
            (prevLb && keysRef.current.has(prevLb) && prevLb) ||
            effectiveLockboxId(workspace, note)
          if (!decryptWith || !keysRef.current.has(decryptWith)) {
            throw new Error(
              'Unlock the current lockbox before changing notebook protection.',
            )
          }
          const payload = await decryptPayload(
            decryptWith,
            note.ciphertext,
            note.iv,
          )
          title = payload?.title ?? 'Untitled'
          body = payload?.body ?? ''
        }

        if (inheritsNext && nextLb) {
          const { ciphertext, iv } = await encryptPayload(nextLb, {
            title,
            body,
          })
          await updateNote(note.id, {
            title: 'Locked note',
            body: '',
            ciphertext,
            iv,
            clearPlaintext: true,
          })
        } else if (note.ciphertext && note.iv) {
          await updateNote(note.id, {
            title,
            body,
            ciphertext: null,
            iv: null,
            decryptPlaintext: true,
          })
        }
      }

      await updateNotebook(notebookId, { lockboxId: nextLb })
    },
    [
      decryptPayload,
      encryptPayload,
      requestUnlock,
      updateNote,
      updateNotebook,
      workspace,
    ],
  )

  const attachLockboxToNote = useCallback(
    async (noteId, lockboxId) => {
      const note = getNote(noteId)
      if (!note) return null
      if (lockboxId && !keysRef.current.has(lockboxId)) {
        await requestUnlock(lockboxId)
      }

      let title = note.title
      let body = note.body
      const prevLb = effectiveLockboxId(workspace, note)
      if (note.ciphertext && note.iv) {
        if (!prevLb || !keysRef.current.has(prevLb)) {
          throw new Error('Unlock the current lockbox before changing protection.')
        }
        const payload = await decryptPayload(
          prevLb,
          note.ciphertext,
          note.iv,
        )
        title = payload?.title ?? ''
        body = payload?.body ?? ''
      }

      if (!lockboxId) {
        return updateNote(noteId, {
          title,
          body,
          lockboxId: null,
          ciphertext: null,
          iv: null,
          decryptPlaintext: true,
        })
      }

      const { ciphertext, iv } = await encryptPayload(lockboxId, {
        title: String(title).trim() || 'Untitled',
        body: String(body ?? ''),
      })
      return updateNote(noteId, {
        title: 'Locked note',
        body: '',
        lockboxId,
        ciphertext,
        iv,
        clearPlaintext: true,
      })
    },
    [
      decryptPayload,
      encryptPayload,
      getNote,
      requestUnlock,
      updateNote,
      workspace,
    ],
  )

  const changeLockboxPassphrase = useCallback(
    async (lockboxId, currentPassphrase, nextPassphrase) => {
      if (!userId) throw new Error('changePassphrase: not signed in')
      const meta = lockboxes.find((l) => l.id === lockboxId)
      if (!meta) throw new Error('Unknown lockbox')
      if (
        typeof nextPassphrase !== 'string' ||
        nextPassphrase.length < MIN_PASSPHRASE_LENGTH
      ) {
        throw new Error(
          `New passphrase must be at least ${MIN_PASSPHRASE_LENGTH} characters.`,
        )
      }
      const oldKey = await deriveKey(
        currentPassphrase,
        meta.salt,
        meta.iterations,
      )
      const ok = await checkVerifier(oldKey, meta.verifier)
      if (!ok) throw new Error('Wrong current passphrase.')

      const salt = generateSalt()
      const iterations = KDF_ITERATIONS
      const newKey = await deriveKey(nextPassphrase, salt, iterations)
      const verifier = await makeVerifier(newKey)

      // Re-encrypt every note that uses this lockbox (note-level or notebook)
      for (const note of workspace.notes) {
        const lb = effectiveLockboxId(workspace, note)
        if (lb !== lockboxId) continue
        if (!note.ciphertext || !note.iv) continue
        const payload = await decryptJson(oldKey, note.ciphertext, note.iv)
        const enc = await encryptJson(newKey, payload)
        await updateNote(note.id, {
          title: 'Locked note',
          body: '',
          ciphertext: enc.ciphertext,
          iv: enc.iv,
          clearPlaintext: true,
        })
      }

      const nextMeta = {
        ...meta,
        salt,
        iterations,
        verifier,
        updatedAt: new Date().toISOString(),
      }
      await upsertLockboxMeta(nextMeta)
      keysRef.current.set(lockboxId, newKey)
      passphrasesRef.current.set(lockboxId, nextPassphrase)
      bumpUnlocked()
      await persistSession()
      await clearBiometricEnrollment(userId, lockboxId)
      setEnrollments((prev) => ({ ...prev, [lockboxId]: null }))
    },
    [
      bumpUnlocked,
      lockboxes,
      persistSession,
      updateNote,
      upsertLockboxMeta,
      userId,
      workspace,
    ],
  )

  const deleteLockbox = useCallback(
    async (lockboxId, passphrase) => {
      const meta = lockboxes.find((l) => l.id === lockboxId)
      if (!meta) return
      const key = await deriveKey(passphrase, meta.salt, meta.iterations)
      const ok = await checkVerifier(key, meta.verifier)
      if (!ok) throw new Error('Wrong passphrase.')

      // Decrypt notes to plaintext before removing lockbox
      for (const note of workspace.notes) {
        const noteUses =
          note.lockboxId === lockboxId ||
          (!note.lockboxId &&
            effectiveLockboxId(workspace, note) === lockboxId)
        if (!noteUses) continue
        if (note.ciphertext && note.iv) {
          const payload = await decryptJson(key, note.ciphertext, note.iv)
          await updateNote(note.id, {
            title: payload?.title ?? 'Untitled',
            body: payload?.body ?? '',
            lockboxId: null,
            ciphertext: null,
            iv: null,
            decryptPlaintext: true,
          })
        } else {
          await updateNote(note.id, { lockboxId: null })
        }
      }
      for (const nb of workspace.notebooks) {
        if (nb.lockboxId === lockboxId) {
          await updateNotebook(nb.id, { lockboxId: null })
        }
      }
      await removeLockboxMeta(lockboxId)
      keysRef.current.delete(lockboxId)
      passphrasesRef.current.delete(lockboxId)
      bumpUnlocked()
      await persistSession()
      if (userId) await clearBiometricEnrollment(userId, lockboxId)
    },
    [
      bumpUnlocked,
      lockboxes,
      persistSession,
      removeLockboxMeta,
      updateNote,
      updateNotebook,
      userId,
      workspace,
    ],
  )

  const noteIsLocked = useCallback(
    (note) => {
      if (!note) return false
      const lbId = effectiveLockboxId(workspace, note) || note.lockboxId
      const hasCipher = Boolean(note.ciphertext && note.iv)
      // Ciphertext with no resolvable lockbox cannot be decrypted in-session.
      if (hasCipher && !lbId) return true
      if (!lbId) return false
      if (!keysRef.current.has(lbId)) {
        return hasCipher || Boolean(lbId)
      }
      return false
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace, tick, unlockedIds],
  )

  const value = useMemo(
    () => ({
      lockboxes,
      unlockedIds,
      isUnlocked,
      noteIsLocked,
      unlockPrompt,
      requestUnlock,
      dismissUnlock,
      createLockbox,
      unlock,
      unlockWithBiometrics,
      lockOne,
      lockAll,
      enrollDeviceBiometrics,
      disableBiometrics,
      setBiometricsReauthInterval,
      idleTimeoutMs,
      setIdleTimeout,
      biometrics: {
        capability,
        enrollments,
        loading: bioLoading,
      },
      revealNoteContent,
      saveNoteContent,
      attachLockboxToNotebook,
      attachLockboxToNote,
      changeLockboxPassphrase,
      deleteLockbox,
      encryptPayload,
      decryptPayload,
      encryptBytes,
      decryptBytes,
      minPassphraseLength: MIN_PASSPHRASE_LENGTH,
    }),
    [
      lockboxes,
      unlockedIds,
      isUnlocked,
      noteIsLocked,
      unlockPrompt,
      requestUnlock,
      dismissUnlock,
      createLockbox,
      unlock,
      unlockWithBiometrics,
      lockOne,
      lockAll,
      enrollDeviceBiometrics,
      disableBiometrics,
      setBiometricsReauthInterval,
      idleTimeoutMs,
      setIdleTimeout,
      capability,
      enrollments,
      bioLoading,
      revealNoteContent,
      saveNoteContent,
      attachLockboxToNotebook,
      attachLockboxToNote,
      changeLockboxPassphrase,
      deleteLockbox,
      encryptPayload,
      decryptPayload,
      encryptBytes,
      decryptBytes,
    ],
  )

  return (
    <LockboxContext.Provider value={value}>{children}</LockboxContext.Provider>
  )
}

export function useLockbox() {
  const ctx = useContext(LockboxContext)
  if (!ctx) {
    throw new Error('useLockbox must be used inside <LockboxProvider>')
  }
  return ctx
}
