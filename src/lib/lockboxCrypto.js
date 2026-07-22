// Web Crypto primitives for notas lockboxes (multi-vault E2EE).
// Adapted from Accesso's vaultCrypto — one passphrase per lockbox.

export const KDF_ITERATIONS = 310_000
export const KDF_HASH = 'SHA-256'
export const KDF_KEY_LENGTH_BITS = 256
export const SALT_BYTES = 16
export const IV_BYTES = 12

export const VERIFIER_PLAINTEXT = 'notas-lockbox-v1'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function subtle() {
  const s = globalThis.crypto?.subtle
  if (!s) {
    throw new Error('Web Crypto SubtleCrypto is unavailable in this environment')
  }
  return s
}

function randomBytes(length) {
  const bytes = new Uint8Array(length)
  globalThis.crypto.getRandomValues(bytes)
  return bytes
}

export function bytesToBase64(bytes) {
  let binary = ''
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  for (let i = 0; i < view.byteLength; i++) {
    binary += String.fromCharCode(view[i])
  }
  return globalThis.btoa(binary)
}

export function base64ToBytes(b64) {
  if (typeof b64 !== 'string') throw new Error('base64ToBytes: expected string')
  const binary = globalThis.atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function generateSalt() {
  return bytesToBase64(randomBytes(SALT_BYTES))
}

export async function deriveKey(passphrase, saltB64, iterations = KDF_ITERATIONS) {
  if (typeof passphrase !== 'string' || passphrase.length === 0) {
    throw new Error('deriveKey: passphrase must be a non-empty string')
  }
  const s = subtle()
  const baseKey = await s.importKey(
    'raw',
    textEncoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return s.deriveKey(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(saltB64),
      iterations,
      hash: KDF_HASH,
    },
    baseKey,
    { name: 'AES-GCM', length: KDF_KEY_LENGTH_BITS },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptJson(key, value) {
  const iv = randomBytes(IV_BYTES)
  const plaintext = textEncoder.encode(JSON.stringify(value))
  const ciphertext = await subtle().encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext,
  )
  return {
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    iv: bytesToBase64(iv),
  }
}

export async function decryptJson(key, ciphertextB64, ivB64) {
  const plaintext = await subtle().decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(ivB64) },
    key,
    base64ToBytes(ciphertextB64),
  )
  return JSON.parse(textDecoder.decode(plaintext))
}

/** Encrypt raw bytes (attachments). Returns base64 ciphertext + iv. */
export async function encryptBytes(key, bytes) {
  const iv = randomBytes(IV_BYTES)
  const view =
    bytes instanceof Uint8Array
      ? bytes
      : new Uint8Array(bytes)
  const ciphertext = await subtle().encrypt(
    { name: 'AES-GCM', iv },
    key,
    view,
  )
  return {
    ciphertext: new Uint8Array(ciphertext),
    iv: bytesToBase64(iv),
  }
}

/** Decrypt raw attachment bytes. */
export async function decryptBytes(key, ciphertextBytes, ivB64) {
  const plain = await subtle().decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(ivB64) },
    key,
    ciphertextBytes instanceof Uint8Array
      ? ciphertextBytes
      : new Uint8Array(ciphertextBytes),
  )
  return new Uint8Array(plain)
}

export async function makeVerifier(key) {
  return encryptJson(key, VERIFIER_PLAINTEXT)
}

export async function checkVerifier(key, verifier) {
  if (!verifier?.ciphertext || !verifier?.iv) return false
  try {
    const value = await decryptJson(key, verifier.ciphertext, verifier.iv)
    return value === VERIFIER_PLAINTEXT
  } catch {
    return false
  }
}
