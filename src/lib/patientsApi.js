import { supabase } from '@/lib/supabase'
import { createId } from '@/lib/id'
import { decryptJson, encryptJson } from '@/lib/vaultCrypto'

export async function listOwnedPatients(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('docto_patients')
    .select('*')
    .eq('owner_user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createPatient({ userId, key, profile }) {
  if (!userId || !key) throw new Error('createPatient: userId and key required')
  const id = createId()
  const { ciphertext, iv } = await encryptJson(key, profile ?? { preferredName: 'Me' })
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('docto_patients')
    .insert({
      id,
      owner_user_id: userId,
      ciphertext,
      iv,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .maybeSingle()
  if (error) throw error

  const { error: memErr } = await supabase.from('docto_family_members').insert({
    id: createId(),
    patient_id: id,
    user_id: userId,
    role: 'owner',
    status: 'active',
    created_at: now,
    updated_at: now,
  })
  if (memErr) throw memErr
  return data
}

export async function decryptPatient(key, row) {
  if (!row) return null
  const profile = await decryptJson(key, row.ciphertext, row.iv)
  return { id: row.id, ownerUserId: row.owner_user_id, ...profile, _row: row }
}

/** Replace encrypted patient profile fields (keeps the same patient id). */
export async function updatePatientProfile({ patientId, key, profile }) {
  if (!patientId || !key) {
    throw new Error('updatePatientProfile: patientId and key required')
  }
  const { ciphertext, iv } = await encryptJson(key, profile ?? {})
  const { data, error } = await supabase
    .from('docto_patients')
    .update({
      ciphertext,
      iv,
      updated_at: new Date().toISOString(),
    })
    .eq('id', patientId)
    .select('*')
    .maybeSingle()
  if (error) throw error
  return decryptPatient(key, data)
}
