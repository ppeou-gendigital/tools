import { supabase } from '@/lib/supabase'
import { createId } from '@/lib/id'
import {
  decryptRows,
  insertEncrypted,
  listActiveRows,
  softDeleteRow,
  updateEncrypted,
} from '@/lib/encryptedTable'
import { decryptJson, encryptJson, bytesToBase64, base64ToBytes } from '@/lib/vaultCrypto'

const UPLOADS_BUCKET = 'docto-uploads'
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024

// —— Doctors ——
export async function listDoctors(patientId, key) {
  const rows = await listActiveRows('docto_doctors', patientId)
  return decryptRows(key, rows, (r) => ({
    id: r.id,
    patientId: r.patient_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function saveDoctor({ userId, patientId, key, id, payload }) {
  if (id) {
    return updateEncrypted({
      table: 'docto_doctors',
      userId,
      id,
      payload,
      key,
    })
  }
  return insertEncrypted({
    table: 'docto_doctors',
    userId,
    patientId,
    payload,
    key,
  })
}

export async function deleteDoctor(userId, id) {
  return softDeleteRow('docto_doctors', userId, id)
}

// —— Appointments ——
export async function listAppointments(patientId, key) {
  const rows = await listActiveRows('docto_appointments', patientId, 'starts_at')
  return decryptRows(key, rows, (r) => ({
    id: r.id,
    patientId: r.patient_id,
    doctorId: r.doctor_id,
    visitId: r.visit_id,
    startsAt: r.starts_at,
    status: r.status,
    kind: r.kind,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function saveAppointment({
  userId,
  patientId,
  key,
  id,
  startsAt,
  status = 'scheduled',
  kind = 'other',
  doctorId = null,
  visitId = null,
  payload,
}) {
  const clearFields = {
    starts_at: startsAt,
    status,
    kind,
    doctor_id: doctorId,
    visit_id: visitId,
  }
  if (id) {
    return updateEncrypted({
      table: 'docto_appointments',
      userId,
      id,
      clearFields,
      payload,
      key,
    })
  }
  return insertEncrypted({
    table: 'docto_appointments',
    userId,
    patientId,
    clearFields,
    payload,
    key,
  })
}

export async function deleteAppointment(userId, id) {
  return softDeleteRow('docto_appointments', userId, id)
}

// —— Visits ——
export async function listVisits(patientId, key) {
  const rows = await listActiveRows('docto_visits', patientId, 'visit_date')
  return decryptRows(key, rows, (r) => ({
    id: r.id,
    patientId: r.patient_id,
    doctorId: r.doctor_id,
    kind: r.kind,
    visitDate: r.visit_date,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function saveVisit({
  userId,
  patientId,
  key,
  id,
  visitDate,
  kind = 'doctor_visit',
  doctorId = null,
  payload,
}) {
  const clearFields = {
    visit_date: visitDate,
    kind,
    doctor_id: doctorId,
  }
  if (id) {
    return updateEncrypted({
      table: 'docto_visits',
      userId,
      id,
      clearFields,
      payload,
      key,
    })
  }
  return insertEncrypted({
    table: 'docto_visits',
    userId,
    patientId,
    clearFields,
    payload,
    key,
  })
}

export async function deleteVisit(userId, id) {
  return softDeleteRow('docto_visits', userId, id)
}

// —— Medications ——
export async function listMedications(patientId, key) {
  const rows = await listActiveRows('docto_medications', patientId)
  return decryptRows(key, rows, (r) => ({
    id: r.id,
    patientId: r.patient_id,
    isActive: r.is_active,
    refillDate: r.refill_date,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function saveMedication({
  userId,
  patientId,
  key,
  id,
  isActive = true,
  refillDate = null,
  payload,
}) {
  const clearFields = { is_active: isActive, refill_date: refillDate }
  if (id) {
    return updateEncrypted({
      table: 'docto_medications',
      userId,
      id,
      clearFields,
      payload,
      key,
    })
  }
  return insertEncrypted({
    table: 'docto_medications',
    userId,
    patientId,
    clearFields,
    payload,
    key,
  })
}

export async function deleteMedication(userId, id) {
  return softDeleteRow('docto_medications', userId, id)
}

export async function listDoses(patientId, key) {
  const rows = await listActiveRows('docto_doses', patientId, 'taken_at')
  return decryptRows(key, rows, (r) => ({
    id: r.id,
    patientId: r.patient_id,
    medicationId: r.medication_id,
    takenAt: r.taken_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function saveDose({
  userId,
  patientId,
  medicationId,
  key,
  takenAt,
  note,
}) {
  if (!userId || !patientId || !medicationId) {
    throw new Error('saveDose: missing required args')
  }
  const now = new Date().toISOString()
  let ciphertext = null
  let iv = null
  if (note && key) {
    const enc = await encryptJson(key, { note })
    ciphertext = enc.ciphertext
    iv = enc.iv
  }
  const { data, error } = await supabase
    .from('docto_doses')
    .insert({
      id: createId(),
      patient_id: patientId,
      medication_id: medicationId,
      taken_at: takenAt || now,
      created_by: userId,
      updated_by: userId,
      ciphertext,
      iv,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .maybeSingle()
  if (error) throw error
  return data
}

export async function logDose({ userId, patientId, medicationId, key, note }) {
  return saveDose({
    userId,
    patientId,
    medicationId,
    key,
    note,
    takenAt: new Date().toISOString(),
  })
}

export async function deleteDose(userId, id) {
  return softDeleteRow('docto_doses', userId, id)
}

// —— Readings ——
export async function listReadings(patientId, key) {
  const rows = await listActiveRows('docto_readings', patientId, 'measured_at')
  return decryptRows(key, rows, (r) => ({
    id: r.id,
    patientId: r.patient_id,
    measuredAt: r.measured_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function saveReading({
  userId,
  patientId,
  key,
  id,
  measuredAt,
  payload,
}) {
  const clearFields = { measured_at: measuredAt }
  if (id) {
    return updateEncrypted({
      table: 'docto_readings',
      userId,
      id,
      clearFields,
      payload,
      key,
    })
  }
  return insertEncrypted({
    table: 'docto_readings',
    userId,
    patientId,
    clearFields,
    payload,
    key,
  })
}

export async function deleteReading(userId, id) {
  return softDeleteRow('docto_readings', userId, id)
}

// —— Files ——
export async function listFiles(patientId, key) {
  const rows = await listActiveRows('docto_files', patientId)
  return decryptRows(key, rows, (r) => ({
    id: r.id,
    patientId: r.patient_id,
    category: r.category,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function saveFile({
  userId,
  patientId,
  key,
  id,
  category = 'other',
  payload,
}) {
  const clearFields = { category }
  if (id) {
    return updateEncrypted({
      table: 'docto_files',
      userId,
      id,
      clearFields,
      payload,
      key,
    })
  }
  return insertEncrypted({
    table: 'docto_files',
    userId,
    patientId,
    clearFields,
    payload,
    key,
  })
}

export async function deleteFile(userId, id) {
  return softDeleteRow('docto_files', userId, id)
}

// —— Uploads ——
export async function listUploads(patientId, parentType, parentId) {
  if (!patientId || !parentId) return []
  const { data, error } = await supabase
    .from('docto_uploads')
    .select('*')
    .eq('patient_id', patientId)
    .eq('parent_type', parentType)
    .eq('parent_id', parentId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function uploadMedia({
  userId,
  patientId,
  parentType,
  parentId,
  file,
  kind = 'photo_or_pdf',
  key,
  source = 'file',
}) {
  if (!userId || !patientId || !parentId || !file || !key) {
    throw new Error('uploadMedia: missing required args')
  }
  const raw = new Uint8Array(await file.arrayBuffer())
  if (raw.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error('File is too large (max 25 MB)')
  }
  const id = createId()
  const ivBytes = globalThis.crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    raw,
  )
  const storagePath = `${patientId}/${parentId}/${id}`
  const { error: upErr } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .upload(storagePath, new Blob([ciphertext]), {
      contentType: 'application/octet-stream',
      upsert: false,
    })
  if (upErr) throw upErr

  const meta = await encryptJson(key, {
    fileName:
      (typeof file.name === 'string' && file.name) ||
      (kind === 'voice' ? 'voice-memo.webm' : 'photo.jpg'),
    source,
  })
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('docto_uploads')
    .insert({
      id,
      patient_id: patientId,
      parent_type: parentType,
      parent_id: parentId,
      kind,
      mime_type: file.type || 'application/octet-stream',
      byte_size: raw.byteLength,
      storage_path: storagePath,
      iv: bytesToBase64(ivBytes),
      ciphertext_meta: meta.ciphertext,
      iv_meta: meta.iv,
      uploaded_by: userId,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .maybeSingle()
  if (error) throw error
  return data
}

export async function downloadUploadBytes(key, row) {
  const { data, error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .download(row.storage_path)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())
  const plain = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(row.iv) },
    key,
    buf,
  )
  let meta = {}
  if (row.ciphertext_meta && row.iv_meta) {
    try {
      meta = await decryptJson(key, row.ciphertext_meta, row.iv_meta)
    } catch {
      meta = {}
    }
  }
  return { bytes: new Uint8Array(plain), meta, mimeType: row.mime_type }
}
