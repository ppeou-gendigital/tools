import { supabase } from '@/lib/supabase'
import { createId } from '@/lib/id'
import { encryptJson, decryptJson } from '@/lib/vaultCrypto'
import {
  generateDekRaw,
  generateIdentityKeyPair,
  exportPrivateKeyJwk,
  exportPublicKeyJwk,
  importDek,
  importPrivateKeyJwk,
  sha256Hex,
  unwrapDekWithAesKey,
  unwrapDekWithPrivateKey,
  wrapDekForPublicKey,
  wrapDekWithAesKey,
} from '@/lib/shareCrypto'
import { listActiveRows } from '@/lib/encryptedTable'

const DOMAIN_TABLES = [
  'docto_doctors',
  'docto_appointments',
  'docto_visits',
  'docto_medications',
  'docto_doses',
  'docto_readings',
  'docto_files',
]

export async function listFamilyMembers(patientId) {
  const { data, error } = await supabase
    .from('docto_family_members')
    .select('*')
    .eq('patient_id', patientId)
    .eq('status', 'active')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function listPendingInvites(patientId) {
  const { data, error } = await supabase
    .from('docto_family_invites')
    .select('*')
    .eq('patient_id', patientId)
    .is('accepted_at', null)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function listMyPendingInvites() {
  const { data, error } = await supabase
    .from('docto_family_invites')
    .select('*')
    .is('accepted_at', null)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function listMyMemberships(userId) {
  const { data, error } = await supabase
    .from('docto_family_members')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
  if (error) throw error
  const rows = data ?? []
  const out = []
  for (const m of rows) {
    const { data: patient } = await supabase
      .from('docto_patients')
      .select('id, owner_user_id, ciphertext, iv')
      .eq('id', m.patient_id)
      .maybeSingle()
    out.push({ ...m, docto_patients: patient })
  }
  return out
}

export async function createInvite({ patientId, invitedBy, email, role }) {
  const token = createId() + createId()
  const tokenHash = await sha256Hex(token)
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('docto_family_invites')
    .insert({
      id: createId(),
      patient_id: patientId,
      invited_email: email.trim().toLowerCase(),
      role: role === 'helper' ? 'helper' : 'viewer',
      token_hash: tokenHash,
      expires_at: expires,
      invited_by: invitedBy,
    })
    .select('*')
    .maybeSingle()
  if (error) throw error
  return { invite: data, token }
}

export async function revokeInvite(inviteId) {
  const { error } = await supabase
    .from('docto_family_invites')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', inviteId)
  if (error) throw error
}

export async function revokeMember(memberId) {
  const { error } = await supabase
    .from('docto_family_members')
    .update({
      status: 'revoked',
      wrapped_dek: null,
      wrapped_dek_iv: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', memberId)
  if (error) throw error
}

/**
 * Accept invite: create membership with pubkey; owner must wrap DEK later.
 */
export async function acceptInvite({ invite, userId, publicKeyJwk }) {
  const now = new Date().toISOString()
  const { error: upErr } = await supabase
    .from('docto_family_invites')
    .update({ accepted_at: now })
    .eq('id', invite.id)
  if (upErr) throw upErr

  const { data: existing } = await supabase
    .from('docto_family_members')
    .select('*')
    .eq('patient_id', invite.patient_id)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    const { data, error } = await supabase
      .from('docto_family_members')
      .update({
        role: invite.role,
        status: 'active',
        pubkey: JSON.stringify(publicKeyJwk),
        wrapped_dek: null,
        wrapped_dek_iv: null,
        updated_at: now,
      })
      .eq('id', existing.id)
      .select('*')
      .maybeSingle()
    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('docto_family_members')
    .insert({
      id: createId(),
      patient_id: invite.patient_id,
      user_id: userId,
      role: invite.role,
      status: 'active',
      pubkey: JSON.stringify(publicKeyJwk),
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .maybeSingle()
  if (error) throw error
  return data
}

/** Resolve a pending invite from a cleartext invite token (hash compared server-side). */
export async function findInviteByToken(token) {
  if (!token) return null
  const tokenHash = await sha256Hex(token)
  const { data, error } = await supabase
    .from('docto_family_invites')
    .select('*')
    .eq('token_hash', tokenHash)
    .is('accepted_at', null)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  if (error) throw error
  return data
}

export async function acceptInviteByToken({ token, userId, publicKeyJwk }) {
  const invite = await findInviteByToken(token)
  if (!invite) throw new Error('Invite not found or already used')
  return acceptInvite({ invite, userId, publicKeyJwk })
}

export async function ensureOwnerMembership({ patientId, userId }) {
  const { data: existing } = await supabase
    .from('docto_family_members')
    .select('*')
    .eq('patient_id', patientId)
    .eq('user_id', userId)
    .maybeSingle()
  if (existing) return existing
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('docto_family_members')
    .insert({
      id: createId(),
      patient_id: patientId,
      user_id: userId,
      role: 'owner',
      status: 'active',
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .maybeSingle()
  if (error) throw error
  return data
}

export async function saveOwnerDekWrap({ memberId, kek, dekRaw }) {
  const wrap = await wrapDekWithAesKey(kek, dekRaw)
  const { data, error } = await supabase
    .from('docto_family_members')
    .update({
      wrapped_dek: wrap.wrapped_dek,
      wrapped_dek_iv: wrap.wrapped_dek_iv,
      updated_at: new Date().toISOString(),
    })
    .eq('id', memberId)
    .select('*')
    .maybeSingle()
  if (error) throw error
  return data
}

export async function saveMemberDekWrap({ memberId, wrappedJson }) {
  const { data, error } = await supabase
    .from('docto_family_members')
    .update({
      wrapped_dek: wrappedJson,
      wrapped_dek_iv: 'ecdh',
      updated_at: new Date().toISOString(),
    })
    .eq('id', memberId)
    .select('*')
    .maybeSingle()
  if (error) throw error
  return data
}

export async function loadOwnerDek(kek, ownerMember) {
  if (!ownerMember?.wrapped_dek || !ownerMember?.wrapped_dek_iv) return null
  if (ownerMember.wrapped_dek_iv === 'ecdh') return null
  const raw = await unwrapDekWithAesKey(
    kek,
    ownerMember.wrapped_dek,
    ownerMember.wrapped_dek_iv,
  )
  return { dekRaw: raw, dek: await importDek(raw) }
}

export async function loadMemberDek(identityPrivateKey, memberRow) {
  if (!memberRow?.wrapped_dek || memberRow.wrapped_dek_iv !== 'ecdh') return null
  const raw = await unwrapDekWithPrivateKey(
    memberRow.wrapped_dek,
    identityPrivateKey,
  )
  return { dekRaw: raw, dek: await importDek(raw) }
}

/**
 * One-time: create DEK, re-encrypt domain rows from kek → dek, wrap for owner.
 */
export async function bootstrapDek({
  patientId,
  userId,
  kek,
  ownerMember,
}) {
  const dekRaw = await generateDekRaw()
  const dek = await importDek(dekRaw)

  for (const table of DOMAIN_TABLES) {
    const rows = await listActiveRows(table, patientId, 'updated_at')
    for (const row of rows) {
      if (!row.ciphertext || !row.iv) continue
      try {
        const payload = await decryptJson(kek, row.ciphertext, row.iv)
        const enc = await encryptJson(dek, payload)
        const { error } = await supabase
          .from(table)
          .update({
            ciphertext: enc.ciphertext,
            iv: enc.iv,
            updated_at: new Date().toISOString(),
            updated_by: userId,
          })
          .eq('id', row.id)
        if (error) throw error
      } catch {
        // Skip undecryptable rows (already on DEK or corrupt)
      }
    }
  }

  // Patient profile row
  const { data: patient } = await supabase
    .from('docto_patients')
    .select('*')
    .eq('id', patientId)
    .maybeSingle()
  if (patient?.ciphertext && patient?.iv) {
    try {
      const profile = await decryptJson(kek, patient.ciphertext, patient.iv)
      const enc = await encryptJson(dek, profile)
      await supabase
        .from('docto_patients')
        .update({
          ciphertext: enc.ciphertext,
          iv: enc.iv,
          updated_at: new Date().toISOString(),
        })
        .eq('id', patientId)
    } catch {
      // ignore
    }
  }

  await saveOwnerDekWrap({ memberId: ownerMember.id, kek, dekRaw })
  return { dekRaw, dek }
}

export async function wrapPendingMembers({ patientId, dekRaw }) {
  const members = await listFamilyMembers(patientId)
  const pending = members.filter(
    (m) =>
      m.role !== 'owner' &&
      m.pubkey &&
      (!m.wrapped_dek || m.wrapped_dek_iv !== 'ecdh'),
  )
  for (const m of pending) {
    const wrapped = await wrapDekForPublicKey(dekRaw, m.pubkey)
    await saveMemberDekWrap({ memberId: m.id, wrappedJson: wrapped })
  }
  return pending.length
}

/** Re-wrap DEK for every active non-owner member that published a pubkey. */
export async function rewrapAllMembers({ patientId, dekRaw }) {
  const members = await listFamilyMembers(patientId)
  const targets = members.filter((m) => m.role !== 'owner' && m.pubkey)
  for (const m of targets) {
    const wrapped = await wrapDekForPublicKey(dekRaw, m.pubkey)
    await saveMemberDekWrap({ memberId: m.id, wrappedJson: wrapped })
  }
  return targets.length
}

/**
 * After revoking a helper: mint a new DEK, re-encrypt domain rows, re-wrap for remaining family.
 */
export async function rotatePatientDek({
  patientId,
  userId,
  kek,
  ownerMember,
  oldDek,
}) {
  const newDekRaw = await generateDekRaw()
  const newDek = await importDek(newDekRaw)

  for (const table of DOMAIN_TABLES) {
    const rows = await listActiveRows(table, patientId, 'updated_at')
    for (const row of rows) {
      if (!row.ciphertext || !row.iv) continue
      try {
        const payload = await decryptJson(oldDek, row.ciphertext, row.iv)
        const enc = await encryptJson(newDek, payload)
        const { error } = await supabase
          .from(table)
          .update({
            ciphertext: enc.ciphertext,
            iv: enc.iv,
            updated_at: new Date().toISOString(),
            updated_by: userId,
          })
          .eq('id', row.id)
        if (error) throw error
      } catch {
        // skip
      }
    }
  }

  const { data: patient } = await supabase
    .from('docto_patients')
    .select('*')
    .eq('id', patientId)
    .maybeSingle()
  if (patient?.ciphertext && patient?.iv) {
    try {
      const profile = await decryptJson(oldDek, patient.ciphertext, patient.iv)
      const enc = await encryptJson(newDek, profile)
      await supabase
        .from('docto_patients')
        .update({
          ciphertext: enc.ciphertext,
          iv: enc.iv,
          updated_at: new Date().toISOString(),
        })
        .eq('id', patientId)
    } catch {
      // ignore
    }
  }

  await saveOwnerDekWrap({ memberId: ownerMember.id, kek, dekRaw: newDekRaw })
  await rewrapAllMembers({ patientId, dekRaw: newDekRaw })
  return { dekRaw: newDekRaw, dek: newDek }
}

export async function createIdentityKeys() {
  const pair = await generateIdentityKeyPair()
  const publicJwk = await exportPublicKeyJwk(pair.publicKey)
  const privateJwk = await exportPrivateKeyJwk(pair.privateKey)
  return { pair, publicJwk, privateJwk }
}

export async function restoreIdentityPrivateKey(privateJwk) {
  return importPrivateKeyJwk(privateJwk)
}

export { generateDekRaw, importDek }
