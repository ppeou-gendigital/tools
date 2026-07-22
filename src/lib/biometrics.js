// Per-device biometric convenience unlock via WebAuthn + PRF.
// One enrollment record per (userId, lockboxId).

import { asyncStorage } from '@/lib/storage'
import { bytesToBase64, base64ToBytes } from '@/lib/lockboxCrypto'

const STORAGE_PREFIX = 'notas.lockbox.biometrics.'
const RP_NAME = 'Notas'
const PRF_SALT = new TextEncoder().encode('notas-lockbox-bio-prf-v1')

export const BIO_REAUTH_OPTIONS = [
  { value: 0, label: 'Every unlock' },
  { value: 24 * 60 * 60 * 1000, label: 'Every 24 hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Every 7 days' },
]

export const BIO_REAUTH_DEFAULT_MS = 24 * 60 * 60 * 1000

function storageKey(userId, lockboxId) {
  return `${STORAGE_PREFIX}${userId}.${lockboxId}`
}

function randomIdBytes(length = 32) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

function getRpId() {
  if (typeof location === 'undefined') return 'localhost'
  if (location.protocol === 'chrome-extension:') {
    return location.hostname
  }
  return location.hostname
}

export async function probeBiometricsCapability() {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return {
      available: false,
      reason: 'WebAuthn is not available in this browser.',
    }
  }
  try {
    const uvpaa =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.()
    if (!uvpaa) {
      return {
        available: false,
        reason: 'No platform authenticator (Face ID / fingerprint / Windows Hello).',
      }
    }
  } catch {
    return {
      available: false,
      reason: 'Could not detect a platform authenticator.',
    }
  }
  return {
    available: true,
    reason: null,
    label: platformBiometricLabel(),
  }
}

export function platformBiometricLabel() {
  if (typeof navigator === 'undefined') return 'biometrics'
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad|Macintosh/.test(ua) && 'ontouchend' in document) {
    return 'Face ID / Touch ID'
  }
  if (/Mac/.test(ua)) return 'Touch ID'
  if (/Windows/.test(ua)) return 'Windows Hello'
  if (/Android/.test(ua)) return 'fingerprint'
  return 'biometrics'
}

export async function readBiometricEnrollment(userId, lockboxId) {
  if (!userId || !lockboxId) return null
  try {
    const raw = await asyncStorage.getItem(storageKey(userId, lockboxId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.credentialId || !parsed?.ciphertext || !parsed?.iv) return null
    return {
      credentialId: parsed.credentialId,
      ciphertext: parsed.ciphertext,
      iv: parsed.iv,
      reauthIntervalMs: normalizeReauthIntervalMs(parsed.reauthIntervalMs),
      lastStrongUnlockAt:
        typeof parsed.lastStrongUnlockAt === 'number'
          ? parsed.lastStrongUnlockAt
          : 0,
      enrolledAt:
        typeof parsed.enrolledAt === 'number' ? parsed.enrolledAt : 0,
    }
  } catch {
    return null
  }
}

export function normalizeReauthIntervalMs(v) {
  const n = typeof v === 'number' ? v : Number(v)
  if (BIO_REAUTH_OPTIONS.some((o) => o.value === n)) return n
  return BIO_REAUTH_DEFAULT_MS
}

export function needsBiometricPrompt(enrollment, now = Date.now()) {
  if (!enrollment) return false
  const interval = normalizeReauthIntervalMs(enrollment.reauthIntervalMs)
  if (interval === 0) return true
  if (!enrollment.lastStrongUnlockAt) return true
  return now - enrollment.lastStrongUnlockAt >= interval
}

async function writeEnrollment(userId, lockboxId, record) {
  await asyncStorage.setItem(
    storageKey(userId, lockboxId),
    JSON.stringify(record),
  )
}

export async function clearBiometricEnrollment(userId, lockboxId) {
  if (!userId || !lockboxId) return
  await asyncStorage.removeItem(storageKey(userId, lockboxId))
}

async function importAesKey(rawKeyBytes) {
  return crypto.subtle.importKey(
    'raw',
    rawKeyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  )
}

async function encryptPassphrase(aesKey, passphrase) {
  const iv = randomIdBytes(12)
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    new TextEncoder().encode(passphrase),
  )
  return {
    ciphertext: bytesToBase64(new Uint8Array(ct)),
    iv: bytesToBase64(iv),
  }
}

async function decryptPassphrase(aesKey, ciphertext, iv) {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(iv) },
    aesKey,
    base64ToBytes(ciphertext),
  )
  return new TextDecoder().decode(plain)
}

function prfResultsFromCredential(credential) {
  const ext = credential?.getClientExtensionResults?.()
  const first = ext?.prf?.results?.first
  if (!(first instanceof ArrayBuffer) && !ArrayBuffer.isView(first)) {
    return null
  }
  const bytes =
    first instanceof ArrayBuffer
      ? new Uint8Array(first)
      : new Uint8Array(first.buffer)
  if (bytes.byteLength < 32) return null
  return bytes.slice(0, 32)
}

export function formatBiometricError(err) {
  const name = err?.name || ''
  const message = err?.message || String(err || 'Biometric request failed.')
  if (name === 'NotAllowedError') {
    return 'Touch ID / Face ID was cancelled or blocked. Keep this tab focused and try again (avoid --disable-web-security).'
  }
  if (name === 'InvalidStateError') {
    return 'A biometric credential already exists for this lockbox. Disable biometrics first, then enable again.'
  }
  if (name === 'NotSupportedError' || name === 'SecurityError') {
    return 'This browser cannot complete biometric enrollment here. Use HTTPS or localhost in a normal browser window.'
  }
  return message
}

/**
 * WebAuthn user.id must be ≤ 64 bytes. Hash user+lockbox so two UUIDs
 * (73+ chars as UTF-8) stay unique without exceeding the limit.
 */
async function webAuthnUserHandle(userId, lockboxId) {
  const raw = new TextEncoder().encode(`${userId}:${lockboxId}`)
  const digest = await crypto.subtle.digest('SHA-256', raw)
  return new Uint8Array(digest) // 32 bytes
}

export async function enrollBiometrics(
  userId,
  lockboxId,
  passphrase,
  options = {},
) {
  if (!userId) throw new Error('enrollBiometrics: not signed in')
  if (!lockboxId) throw new Error('enrollBiometrics: lockboxId required')
  if (!passphrase) throw new Error('enrollBiometrics: passphrase required')

  const userHandle = await webAuthnUserHandle(userId, lockboxId)
  const challenge = randomIdBytes(32)
  let credential
  try {
    credential = await navigator.credentials.create({
      publicKey: {
        rp: { name: RP_NAME, id: getRpId() },
        user: {
          id: userHandle,
          name: `${options.userName || userId}`.slice(0, 64),
          displayName: (options.displayName || 'Notas lockbox').slice(0, 64),
        },
        challenge,
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
          requireResidentKey: false,
        },
        timeout: 60_000,
        attestation: 'none',
        extensions: { prf: {} },
      },
    })
  } catch (err) {
    throw new Error(formatBiometricError(err))
  }

  if (!credential) throw new Error('Biometric enrollment was cancelled.')

  let assertion
  try {
    assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomIdBytes(32),
        rpId: getRpId(),
        allowCredentials: [
          {
            type: 'public-key',
            id: credential.rawId,
            transports: ['internal'],
          },
        ],
        userVerification: 'required',
        timeout: 60_000,
        extensions: {
          prf: { eval: { first: PRF_SALT } },
        },
      },
    })
  } catch (err) {
    throw new Error(formatBiometricError(err))
  }

  if (!assertion) throw new Error('Biometric enrollment was cancelled.')

  const prfKey = prfResultsFromCredential(assertion)
  if (!prfKey) {
    throw new Error(
      'This browser/device does not expose a PRF key for biometrics (needed to store your passphrase). Passphrase unlock still works. Try Chrome/Safari on a recent macOS, or a phone browser.',
    )
  }

  const aesKey = await importAesKey(prfKey)
  const { ciphertext, iv } = await encryptPassphrase(aesKey, passphrase)
  const now = Date.now()
  const record = {
    credentialId: bytesToBase64(new Uint8Array(credential.rawId)),
    ciphertext,
    iv,
    reauthIntervalMs: normalizeReauthIntervalMs(
      options.reauthIntervalMs ?? BIO_REAUTH_DEFAULT_MS,
    ),
    lastStrongUnlockAt: now,
    enrolledAt: now,
  }
  await writeEnrollment(userId, lockboxId, record)
  return record
}

export async function unlockWithBiometrics(userId, lockboxId) {
  const enrollment = await readBiometricEnrollment(userId, lockboxId)
  if (!enrollment) {
    throw new Error('Biometric unlock is not enabled on this device.')
  }

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: randomIdBytes(32),
      rpId: getRpId(),
      allowCredentials: [
        {
          type: 'public-key',
          id: base64ToBytes(enrollment.credentialId),
          transports: ['internal'],
        },
      ],
      userVerification: 'required',
      timeout: 60_000,
      extensions: {
        prf: { eval: { first: PRF_SALT } },
      },
    },
  })

  if (!assertion) throw new Error('Biometric unlock was cancelled.')

  const prfKey = prfResultsFromCredential(assertion)
  if (!prfKey) {
    throw new Error('Biometric unlock failed (missing PRF). Try your passphrase.')
  }

  const aesKey = await importAesKey(prfKey)
  try {
    const passphrase = await decryptPassphrase(
      aesKey,
      enrollment.ciphertext,
      enrollment.iv,
    )
    await writeEnrollment(userId, lockboxId, {
      ...enrollment,
      lastStrongUnlockAt: Date.now(),
    })
    return passphrase
  } catch {
    throw new Error(
      'Biometric unlock failed. Use your passphrase, then re-enable biometrics in Lockbox settings.',
    )
  }
}

export async function setBiometricReauthInterval(
  userId,
  lockboxId,
  reauthIntervalMs,
) {
  const enrollment = await readBiometricEnrollment(userId, lockboxId)
  if (!enrollment) return null
  const next = {
    ...enrollment,
    reauthIntervalMs: normalizeReauthIntervalMs(reauthIntervalMs),
  }
  await writeEnrollment(userId, lockboxId, next)
  return next
}

export async function touchBiometricStrongUnlock(userId, lockboxId) {
  const enrollment = await readBiometricEnrollment(userId, lockboxId)
  if (!enrollment) return null
  const next = { ...enrollment, lastStrongUnlockAt: Date.now() }
  await writeEnrollment(userId, lockboxId, next)
  return next
}
