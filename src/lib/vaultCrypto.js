// Web Crypto primitives for the app-wide E2EE vault.
//
// One passphrase per user protects every vault-backed feature
// (credentials today; secure notes / files / etc. tomorrow). Uses only
// the browser-native `crypto.subtle` API — no npm deps. The derived
// AES-GCM key is 256-bit, non-extractable (raw bytes never leave the
// SubtleCrypto boundary once imported) and never persisted; callers
// keep it in memory via VaultProvider.
//
// Encryption format per record: AES-GCM with a 12-byte random IV, both
// stored as base64 alongside the row. Every record gets its own fresh
// IV so we're safe against IV reuse across the vault, regardless of
// which feature-table the ciphertext ends up in.

// OWASP 2024 guidance for PBKDF2-SHA-256 in browser contexts. High
// enough to slow a targeted brute-force yet fast enough to stay under
// ~200ms on a mid-tier laptop; users only pay this cost once per
// unlock.
export const KDF_ITERATIONS = 310_000
export const KDF_HASH = 'SHA-256'
export const KDF_KEY_LENGTH_BITS = 256
export const SALT_BYTES = 16
export const IV_BYTES = 12

// Sentinel encrypted at setup and re-decrypted at unlock to detect a
// wrong passphrase before we touch any real credential row. Must stay
// stable across releases — changing it invalidates every existing
// vault.
export const VERIFIER_PLAINTEXT = 'acceso-vault-v1'

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

// URL-safe base64 would be nicer, but we're going through JSONB
// storage so plain base64 keeps things simple and copy-pasteable.
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

// Derive a non-extractable AES-GCM key from the user's passphrase and
// their per-user salt. Both must survive across devices, so we return
// the same key given the same inputs — that's what makes the vault
// portable between the extension popup and the web build.
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

// Encrypt an arbitrary JSON-serializable value. Returns base64 iv +
// ciphertext so callers can persist them verbatim.
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

// Inverse of encryptJson. Throws OperationError if the key is wrong or
// the ciphertext is tampered with (AES-GCM authenticates).
export async function decryptJson(key, ciphertextB64, ivB64) {
  const plaintext = await subtle().decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(ivB64) },
    key,
    base64ToBytes(ciphertextB64),
  )
  return JSON.parse(textDecoder.decode(plaintext))
}

// Verifier is a known-plaintext canary. Encrypt it once at setup so
// the server holds { ciphertext, iv } for the constant sentinel; on
// unlock we attempt to decrypt it and compare against the constant. A
// mismatch (or a decrypt throw) means the passphrase is wrong.
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
