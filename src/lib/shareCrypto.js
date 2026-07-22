import {
  base64ToBytes,
  bytesToBase64,
  IV_BYTES,
} from '@/lib/vaultCrypto'

const textEncoder = new TextEncoder()

function randomBytes(length) {
  const bytes = new Uint8Array(length)
  globalThis.crypto.getRandomValues(bytes)
  return bytes
}

export async function generateDekRaw() {
  return randomBytes(32)
}

export async function importDek(rawBytes, extractable = false) {
  return globalThis.crypto.subtle.importKey(
    'raw',
    rawBytes,
    { name: 'AES-GCM', length: 256 },
    extractable,
    ['encrypt', 'decrypt'],
  )
}

export async function generateIdentityKeyPair() {
  return globalThis.crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits'],
  )
}

export async function exportPublicKeyJwk(publicKey) {
  return globalThis.crypto.subtle.exportKey('jwk', publicKey)
}

export async function exportPrivateKeyJwk(privateKey) {
  return globalThis.crypto.subtle.exportKey('jwk', privateKey)
}

export async function importPublicKeyJwk(jwk) {
  return globalThis.crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    [],
  )
}

export async function importPrivateKeyJwk(jwk) {
  return globalThis.crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits'],
  )
}

async function deriveWrapKey(privateKey, publicKey) {
  const bits = await globalThis.crypto.subtle.deriveBits(
    { name: 'ECDH', public: publicKey },
    privateKey,
    256,
  )
  return globalThis.crypto.subtle.importKey(
    'raw',
    bits,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/**
 * Wrap DEK bytes for a member's ECDH public key.
 * Returns JSON string stored in family_members.wrapped_dek.
 */
export async function wrapDekForPublicKey(dekRaw, memberPublicKeyJwk) {
  const memberPub = await importPublicKeyJwk(
    typeof memberPublicKeyJwk === 'string'
      ? JSON.parse(memberPublicKeyJwk)
      : memberPublicKeyJwk,
  )
  const eph = await generateIdentityKeyPair()
  const wrapKey = await deriveWrapKey(eph.privateKey, memberPub)
  const iv = randomBytes(IV_BYTES)
  const ct = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    wrapKey,
    dekRaw,
  )
  const ephPub = await exportPublicKeyJwk(eph.publicKey)
  return JSON.stringify({
    v: 1,
    ephPub,
    iv: bytesToBase64(iv),
    ct: bytesToBase64(new Uint8Array(ct)),
  })
}

export async function unwrapDekWithPrivateKey(wrappedJson, memberPrivateKey) {
  const packed = typeof wrappedJson === 'string' ? JSON.parse(wrappedJson) : wrappedJson
  const ephPub = await importPublicKeyJwk(packed.ephPub)
  const wrapKey = await deriveWrapKey(memberPrivateKey, ephPub)
  const plain = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(packed.iv) },
    wrapKey,
    base64ToBytes(packed.ct),
  )
  return new Uint8Array(plain)
}

/** Wrap DEK with owner's passphrase-derived AES key (encryptJson-compatible). */
export async function wrapDekWithAesKey(aesKey, dekRaw) {
  const iv = randomBytes(IV_BYTES)
  const ct = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    textEncoder.encode(JSON.stringify({ dek: bytesToBase64(dekRaw) })),
  )
  return {
    wrapped_dek: bytesToBase64(new Uint8Array(ct)),
    wrapped_dek_iv: bytesToBase64(iv),
  }
}

export async function unwrapDekWithAesKey(aesKey, wrappedDek, wrappedDekIv) {
  const plain = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(wrappedDekIv) },
    aesKey,
    base64ToBytes(wrappedDek),
  )
  const parsed = JSON.parse(new TextDecoder().decode(plain))
  if (typeof parsed?.dek !== 'string') throw new Error('Invalid wrapped DEK')
  return base64ToBytes(parsed.dek)
}

export async function sha256Hex(text) {
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    textEncoder.encode(text),
  )
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
