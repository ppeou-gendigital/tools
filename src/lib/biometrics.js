// Per-device biometric convenience unlock via WebAuthn + PRF.
//
// After a successful passphrase unlock, the user can enroll: we create
// a platform authenticator credential and encrypt the passphrase with
// a key derived from the authenticator's PRF output. Later unlocks
// call WebAuthn get() (Face ID / Touch ID / Windows Hello), re-derive
// the PRF key, and decrypt the passphrase for VaultProvider.unlock().
//
// Without PRF support we report biometrics unavailable — gating a
// plaintext local passphrase behind WebAuthn alone would not bind the
// secret to the authenticator.

import { asyncStorage } from '@/lib/storage'
import { bytesToBase64, base64ToBytes } from '@/lib/vaultCrypto'

const STORAGE_PREFIX = 'docto.vault.biometrics.'
const RP_NAME = 'Docto'
const PRF_SALT = new TextEncoder().encode('docto-vault-bio-prf-v1')

export const BIO_REAUTH_OPTIONS = [
  { value: 0, label: 'Every unlock' },
  { value: 24 * 60 * 60 * 1000, label: 'Every 24 hours' },
  { value: 7 * 24 * 60 * 60 * 1000, label: 'Every 7 days' },
]

export const BIO_REAUTH_DEFAULT_MS = 24 * 60 * 60 * 1000

function storageKey(userId) {
  return `${STORAGE_PREFIX}${userId}`
}

function randomIdBytes(length = 32) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

function getRpId() {
  if (typeof location === 'undefined') return 'localhost'
  // Chrome extension pages use chrome-extension://<id>
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

  // PRF probe: some browsers expose support via getClientCapabilities.
  let prfSupported = false
  try {
    const caps = await PublicKeyCredential.getClientCapabilities?.()
    if (caps && typeof caps === 'object' && 'extension:prf' in caps) {
      prfSupported = Boolean(caps['extension:prf'])
    }
  } catch {
    // fall through — try a soft assume for Chromium
  }
  if (!prfSupported) {
    // Chromium has supported PRF for platform authenticators; we still
    // enroll and fail clearly if the extension result is missing.
    prfSupported = true
  }

  return {
    available: prfSupported,
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

export async function readBiometricEnrollment(userId) {
  if (!userId) return null
  try {
    const raw = await asyncStorage.getItem(storageKey(userId))
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

async function writeEnrollment(userId, record) {
  await asyncStorage.setItem(storageKey(userId), JSON.stringify(record))
}

export async function clearBiometricEnrollment(userId) {
  if (!userId) return
  await asyncStorage.removeItem(storageKey(userId))
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
  const bytes = first instanceof ArrayBuffer ? new Uint8Array(first) : new Uint8Array(first.buffer)
  if (bytes.byteLength < 32) return null
  return bytes.slice(0, 32)
}

/**
 * Enroll platform biometrics and wrap `passphrase` with the PRF key.
 */
export async function enrollBiometrics(userId, passphrase, options = {}) {
  if (!userId) throw new Error('enrollBiometrics: not signed in')
  if (!passphrase) throw new Error('enrollBiometrics: passphrase required')

  const userIdBytes = new TextEncoder().encode(userId)
  const challenge = randomIdBytes(32)
  const credential = await navigator.credentials.create({
    publicKey: {
      rp: { name: RP_NAME, id: getRpId() },
      user: {
        id: userIdBytes,
        name: options.userName || userId,
        displayName: options.displayName || 'Docto vault',
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
      extensions: {
        prf: {},
      },
    },
  })

  if (!credential) throw new Error('Biometric enrollment was cancelled.')

  // First PRF evaluation often needs a get() after create().
  const assertion = await navigator.credentials.get({
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
        prf: {
          eval: {
            first: PRF_SALT,
          },
        },
      },
    },
  })

  if (!assertion) throw new Error('Biometric enrollment was cancelled.')

  const prfKey = prfResultsFromCredential(assertion)
  if (!prfKey) {
    throw new Error(
      'This browser/device does not expose a PRF key for biometrics. Passphrase unlock still works.',
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
  await writeEnrollment(userId, record)
  return record
}

/**
 * Prompt biometrics and return the decrypted passphrase.
 */
export async function unlockWithBiometrics(userId) {
  const enrollment = await readBiometricEnrollment(userId)
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
        prf: {
          eval: {
            first: PRF_SALT,
          },
        },
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
    await writeEnrollment(userId, {
      ...enrollment,
      lastStrongUnlockAt: Date.now(),
    })
    return passphrase
  } catch {
    throw new Error(
      'Biometric unlock failed. Use your passphrase, then re-enable biometrics in Vault settings.',
    )
  }
}

export async function setBiometricReauthInterval(userId, reauthIntervalMs) {
  const enrollment = await readBiometricEnrollment(userId)
  if (!enrollment) return null
  const next = {
    ...enrollment,
    reauthIntervalMs: normalizeReauthIntervalMs(reauthIntervalMs),
  }
  await writeEnrollment(userId, next)
  return next
}

export async function touchBiometricStrongUnlock(userId) {
  const enrollment = await readBiometricEnrollment(userId)
  if (!enrollment) return null
  const next = { ...enrollment, lastStrongUnlockAt: Date.now() }
  await writeEnrollment(userId, next)
  return next
}
