import { DATAFEED_TYPES, DATAFEED_VERSION } from '@/lib/datafeed/schema'

function stripUndef(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue
    out[k] = v
  }
  return out
}

function serializeOffice(o) {
  return stripUndef({
    id: o.id,
    label: o.label,
    phone: o.phone,
    phoneExt: o.phoneExt,
    email: o.email,
    website: o.website,
    addressLine1: o.addressLine1 || undefined,
    addressLine2: o.addressLine2,
    city: o.city || undefined,
    region: o.region,
    postalCode: o.postalCode,
    country: o.country,
  })
}

function serializeDoctor(d) {
  return stripUndef({
    id: d.id,
    name: d.name ?? '',
    specialty: d.specialty,
    email: d.email,
    website: d.website,
    notes: d.notes,
    offices: Array.isArray(d.offices) ? d.offices.map(serializeOffice) : [],
  })
}

function serializeAppointment(a) {
  return stripUndef({
    id: a.id,
    title: a.title,
    kind: a.kind,
    status: a.status,
    startsAt: a.startsAt,
    doctorId: a.doctorId,
    officeId: a.officeId,
    instructions: a.instructions,
    notes: a.notes,
  })
}

function serializeVisit(v) {
  return stripUndef({
    id: v.id,
    title: v.title,
    kind: v.kind,
    visitDate: v.visitDate,
    doctorId: v.doctorId,
    officeId: v.officeId,
    appointmentId: v.appointmentId,
    summary: v.summary,
    notes: v.notes,
  })
}

function serializeMedication(m) {
  return stripUndef({
    id: m.id,
    name: m.name ?? '',
    strength: m.strength,
    isActive: m.isActive !== false,
    refillDate: m.refillDate || undefined,
    doctorId: m.doctorId,
    schedule: m.schedule,
    refill: m.refill,
  })
}

function serializeDose(d) {
  return stripUndef({
    medicationId: d.medicationId,
    takenAt: d.takenAt,
    note: d.note,
  })
}

function serializeReading(r) {
  return stripUndef({
    measuredAt: r.measuredAt,
    bloodPressure: r.bloodPressure,
    pulse: r.pulse,
    weightKg: r.weightKg,
    heightCm: r.heightCm,
    notes: r.notes,
  })
}

function serializeFile(f) {
  return stripUndef({
    title: f.title ?? '',
    category: f.category,
    insuranceCompany: f.insuranceCompany,
    memberId: f.memberId,
    notes: f.notes,
  })
}

function ok(row) {
  return row && !row._decryptError
}

/**
 * Build a portable patient datafeed from decrypted domain rows.
 */
export function buildPatientFeed(
  {
    patient,
    doctors = [],
    appointments = [],
    visits = [],
    medications = [],
    doses = [],
    readings = [],
    files = [],
  },
  { exportedAt } = {},
) {
  return {
    version: DATAFEED_VERSION,
    type: DATAFEED_TYPES.PATIENT,
    exportedAt: exportedAt ?? new Date().toISOString(),
    patient: stripUndef({
      preferredName: patient?.preferredName || 'Me',
      birthday: patient?.birthday,
      sex: patient?.sex,
      notes: patient?.notes,
    }),
    doctors: doctors.filter(ok).map(serializeDoctor),
    appointments: appointments.filter(ok).map(serializeAppointment),
    visits: visits.filter(ok).map(serializeVisit),
    medications: medications.filter(ok).map(serializeMedication),
    doses: doses.filter(ok).map(serializeDose),
    readings: readings.filter(ok).map(serializeReading),
    files: files.filter(ok).map(serializeFile),
  }
}

export function buildTypedFeed(type, items, { exportedAt } = {}) {
  const serializers = {
    [DATAFEED_TYPES.DOCTORS]: serializeDoctor,
    [DATAFEED_TYPES.APPOINTMENTS]: serializeAppointment,
    [DATAFEED_TYPES.VISITS]: serializeVisit,
    [DATAFEED_TYPES.MEDICATIONS]: serializeMedication,
    [DATAFEED_TYPES.READINGS]: serializeReading,
    [DATAFEED_TYPES.FILES]: serializeFile,
  }
  const serialize = serializers[type]
  if (!serialize) throw new Error(`Cannot build typed feed for ${type}`)
  return {
    version: DATAFEED_VERSION,
    type,
    exportedAt: exportedAt ?? new Date().toISOString(),
    items: (items ?? []).filter(ok).map(serialize),
  }
}

export function stringifyDatafeed(doc) {
  return `${JSON.stringify(doc, null, 2)}\n`
}
