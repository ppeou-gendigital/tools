const APPOINTMENT_KINDS = new Set([
  'checkup',
  'follow_up',
  'blood_draw',
  'xray',
  'mri',
  'ultrasound',
  'lab',
  'procedure',
  'other',
])
const APPOINTMENT_STATUSES = new Set(['scheduled', 'done', 'cancelled'])
const VISIT_KINDS = new Set(['doctor_visit', 'procedure'])
const MED_FREQUENCIES = new Set(['daily', 'weekly', 'monthly', 'as_needed'])
const MED_STATUSES = new Set(['active', 'suspended', 'stopped'])

const CHAT_ACTION_TYPES = new Set([
  'add_doctor',
  'update_doctor',
  'remove_doctor',
  'add_appointment',
  'update_appointment',
  'remove_appointment',
  'add_visit',
  'update_visit',
  'remove_visit',
  'add_medication',
  'update_medication',
  'remove_medication',
  'log_dose',
  'remove_dose',
  'add_reading',
  'update_reading',
  'remove_reading',
  'update_patient',
])

function asString(v) {
  if (v == null) return ''
  return String(v)
}

function asNullableString(v) {
  const s = asString(v).trim()
  return s || null
}

function asNum(v) {
  if (v == null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function collectActionIds(a) {
  const fromIds = Array.isArray(a?.ids) ? a.ids : []
  const single = a?.id != null ? [a.id] : []
  const nested = [
    a?.doctor?.id,
    a?.appointment?.id,
    a?.visit?.id,
    a?.medication?.id,
    a?.dose?.id,
    a?.reading?.id,
  ].filter(Boolean)
  return [...new Set([...fromIds, ...single, ...nested].map((id) => asString(id).trim()).filter(Boolean))]
}

function normalizeOffice(raw) {
  if (!raw || typeof raw !== 'object') return null
  const addressLine1 = asString(raw.addressLine1).trim()
  const phone = asString(raw.phone).trim()
  const googlePlaceId = asNullableString(raw.googlePlaceId)
  const lat = asNum(raw.lat)
  const lng = asNum(raw.lng)
  if (!addressLine1 && !phone && !googlePlaceId && !(lat != null && lng != null)) {
    // allow label-only offices
    if (!asString(raw.label).trim()) return null
  }
  return {
    id: asNullableString(raw.id) || undefined,
    label: asNullableString(raw.label) || undefined,
    phone: phone || undefined,
    addressLine1: addressLine1 || '',
    addressLine2: asNullableString(raw.addressLine2) || undefined,
    city: asString(raw.city).trim() || '',
    region: asNullableString(raw.region) || undefined,
    postalCode: asNullableString(raw.postalCode) || undefined,
    country: asNullableString(raw.country) || 'US',
    googlePlaceId: googlePlaceId || undefined,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
  }
}

function normalizeDoctor(raw, { requireId = false } = {}) {
  const src = raw?.doctor && typeof raw.doctor === 'object' ? raw.doctor : raw
  if (!src || typeof src !== 'object') return null
  const id = asString(src.id).trim()
  if (requireId && !id) return null
  const name = asString(src.name).trim()
  if (!name && !requireId) return null
  const offices = Array.isArray(src.offices)
    ? src.offices.map(normalizeOffice).filter(Boolean)
    : undefined
  return {
    id: id || undefined,
    name: name || undefined,
    specialty: asNullableString(src.specialty) || undefined,
    email: asNullableString(src.email) || undefined,
    website: asNullableString(src.website) || undefined,
    notes: src.notes ?? undefined,
    offices,
  }
}

function normalizeAppointment(raw, { requireId = false } = {}) {
  const src =
    raw?.appointment && typeof raw.appointment === 'object'
      ? raw.appointment
      : raw
  if (!src || typeof src !== 'object') return null
  const id = asString(src.id).trim()
  if (requireId && !id) return null
  const startsAt = asString(src.startsAt || src.starts_at).trim()
  if (!requireId && !startsAt) return null
  let kind = asString(src.kind).trim() || 'other'
  if (!APPOINTMENT_KINDS.has(kind)) kind = 'other'
  let status = asString(src.status).trim() || 'scheduled'
  if (!APPOINTMENT_STATUSES.has(status)) status = 'scheduled'
  return {
    id: id || undefined,
    title: asNullableString(src.title) || undefined,
    kind,
    status,
    startsAt: startsAt || undefined,
    doctorId: asNullableString(src.doctorId || src.doctor_id) || undefined,
    officeId: asNullableString(src.officeId || src.office_id) || undefined,
    instructions: asNullableString(src.instructions) || undefined,
    notes: src.notes ?? undefined,
  }
}

function normalizeVisit(raw, { requireId = false } = {}) {
  const src = raw?.visit && typeof raw.visit === 'object' ? raw.visit : raw
  if (!src || typeof src !== 'object') return null
  const id = asString(src.id).trim()
  if (requireId && !id) return null
  const visitDate = asString(src.visitDate || src.visit_date).trim()
  if (!requireId && !visitDate) return null
  let kind = asString(src.kind).trim() || 'doctor_visit'
  if (!VISIT_KINDS.has(kind)) kind = 'doctor_visit'
  return {
    id: id || undefined,
    title: asNullableString(src.title) || undefined,
    kind,
    visitDate: visitDate || undefined,
    doctorId: asNullableString(src.doctorId || src.doctor_id) || undefined,
    officeId: asNullableString(src.officeId || src.office_id) || undefined,
    appointmentId:
      asNullableString(src.appointmentId || src.appointment_id) || undefined,
    summary: asNullableString(src.summary) || undefined,
    notes: src.notes ?? undefined,
  }
}

function normalizeMedication(raw, { requireId = false } = {}) {
  const src =
    raw?.medication && typeof raw.medication === 'object'
      ? raw.medication
      : raw
  if (!src || typeof src !== 'object') return null
  const id = asString(src.id).trim()
  if (requireId && !id) return null
  const name = asString(src.name).trim()
  if (!requireId && !name) return null
  let status = asString(src.status).trim().toLowerCase()
  if (!MED_STATUSES.has(status)) {
    status = src.isActive === false ? 'stopped' : 'active'
  }
  let schedule
  if (src.schedule && typeof src.schedule === 'object') {
    let frequency = asString(src.schedule.frequency).trim().toLowerCase()
    if (!MED_FREQUENCIES.has(frequency)) frequency = 'daily'
    const times = Array.isArray(src.schedule.times)
      ? src.schedule.times.map((t) => asString(t).trim()).filter(Boolean)
      : []
    let timesPerPeriod =
      asNum(src.schedule.timesPerPeriod) ??
      asNum(src.schedule.timesPerDay) ??
      (times.length > 0 ? times.length : 1)
    if (frequency === 'as_needed') timesPerPeriod = 0
    schedule = {
      frequency,
      timesPerPeriod,
      times,
      instructions: asNullableString(src.schedule.instructions) || undefined,
    }
  }
  return {
    id: id || undefined,
    name: name || undefined,
    strength: asNullableString(src.strength) || undefined,
    status,
    isActive: status === 'active',
    refillDate: asNullableString(src.refillDate) ?? null,
    doctorId: asNullableString(src.doctorId || src.doctor_id) || undefined,
    schedule,
    refill:
      src.refill && typeof src.refill === 'object'
        ? {
            quantity: asNum(src.refill.quantity) ?? undefined,
            pillsLeft: asNum(src.refill.pillsLeft) ?? undefined,
            rxNumber: asNullableString(src.refill.rxNumber) || undefined,
          }
        : undefined,
    suspension:
      src.suspension && typeof src.suspension === 'object'
        ? {
            note: asNullableString(src.suspension.note) || undefined,
            suspendedAt: asNullableString(src.suspension.suspendedAt) || undefined,
          }
        : undefined,
  }
}

function normalizeDose(raw, { requireMedId = true } = {}) {
  const src = raw?.dose && typeof raw.dose === 'object' ? raw.dose : raw
  if (!src || typeof src !== 'object') return null
  const medicationId = asString(src.medicationId || src.medication_id).trim()
  if (requireMedId && !medicationId) return null
  return {
    id: asNullableString(src.id) || undefined,
    medicationId: medicationId || undefined,
    takenAt: asNullableString(src.takenAt || src.taken_at) || undefined,
    note: asNullableString(src.note) || undefined,
  }
}

function normalizeReading(raw, { requireId = false } = {}) {
  const src = raw?.reading && typeof raw.reading === 'object' ? raw.reading : raw
  if (!src || typeof src !== 'object') return null
  const id = asString(src.id).trim()
  if (requireId && !id) return null
  const measuredAt = asString(src.measuredAt || src.measured_at).trim()
  if (!requireId && !measuredAt) return null
  let bloodPressure
  if (src.bloodPressure && typeof src.bloodPressure === 'object') {
    const systolic = asNum(src.bloodPressure.systolic)
    const diastolic = asNum(src.bloodPressure.diastolic)
    if (systolic != null && diastolic != null) {
      bloodPressure = { systolic, diastolic }
    }
  }
  return {
    id: id || undefined,
    measuredAt: measuredAt || undefined,
    bloodPressure,
    pulse: asNum(src.pulse) ?? undefined,
    weightKg: asNum(src.weightKg ?? src.weight_kg) ?? undefined,
    heightCm: asNum(src.heightCm ?? src.height_cm) ?? undefined,
    notes: src.notes ?? undefined,
  }
}

function normalizePatient(raw) {
  const src = raw?.patient && typeof raw.patient === 'object' ? raw.patient : raw
  if (!src || typeof src !== 'object') return null
  const preferredName = asNullableString(src.preferredName)
  const birthday = asNullableString(src.birthday)
  const sex = asNullableString(src.sex)
  const notes = src.notes
  if (!preferredName && !birthday && !sex && notes == null) return null
  return {
    preferredName: preferredName || undefined,
    birthday: birthday || undefined,
    sex: sex || undefined,
    notes: notes ?? undefined,
  }
}

function emptyActionFields() {
  return {
    ids: [],
    doctor: null,
    appointment: null,
    visit: null,
    medication: null,
    dose: null,
    reading: null,
    patient: null,
  }
}

export function normalizeChatTurn(raw) {
  const actionsIn = Array.isArray(raw?.actions) ? raw.actions : []
  const warnings = []
  let dropped = 0

  const actions = actionsIn
    .map((a, i) => {
      const type = asString(a?.type).trim()
      if (!CHAT_ACTION_TYPES.has(type)) {
        dropped += 1
        return null
      }
      const label = asString(a?.label).trim() || type.replace(/_/g, ' ')
      const base = {
        id: `action-${i + 1}`,
        type,
        label,
        ...emptyActionFields(),
        risky: false,
        risk_notes: [],
      }

      if (type.startsWith('remove_')) {
        const ids = collectActionIds(a)
        if (!ids.length) {
          dropped += 1
          return null
        }
        return { ...base, ids }
      }

      if (type === 'add_doctor' || type === 'update_doctor') {
        const doctor = normalizeDoctor(a, { requireId: type === 'update_doctor' })
        if (!doctor) {
          dropped += 1
          return null
        }
        return {
          ...base,
          label: label || `${type === 'update_doctor' ? 'Update' : 'Add'} doctor: ${doctor.name || doctor.id}`,
          doctor,
        }
      }

      if (type === 'add_appointment' || type === 'update_appointment') {
        const appointment = normalizeAppointment(a, {
          requireId: type === 'update_appointment',
        })
        if (!appointment) {
          dropped += 1
          return null
        }
        return {
          ...base,
          label:
            label ||
            `${type === 'update_appointment' ? 'Update' : 'Add'} appointment: ${appointment.title || appointment.kind}`,
          appointment,
        }
      }

      if (type === 'add_visit' || type === 'update_visit') {
        const visit = normalizeVisit(a, { requireId: type === 'update_visit' })
        if (!visit) {
          dropped += 1
          return null
        }
        return {
          ...base,
          label:
            label ||
            `${type === 'update_visit' ? 'Update' : 'Add'} visit: ${visit.title || visit.visitDate}`,
          visit,
        }
      }

      if (type === 'add_medication' || type === 'update_medication') {
        const medication = normalizeMedication(a, {
          requireId: type === 'update_medication',
        })
        if (!medication) {
          dropped += 1
          return null
        }
        return {
          ...base,
          label:
            label ||
            `${type === 'update_medication' ? 'Update' : 'Add'} medication: ${medication.name || medication.id}`,
          medication,
        }
      }

      if (type === 'log_dose') {
        const dose = normalizeDose(a, { requireMedId: true })
        if (!dose) {
          dropped += 1
          return null
        }
        return {
          ...base,
          label: label || 'Log dose',
          dose,
        }
      }

      if (type === 'add_reading' || type === 'update_reading') {
        const reading = normalizeReading(a, {
          requireId: type === 'update_reading',
        })
        if (!reading) {
          dropped += 1
          return null
        }
        return {
          ...base,
          label:
            label ||
            `${type === 'update_reading' ? 'Update' : 'Add'} reading`,
          reading,
        }
      }

      if (type === 'update_patient') {
        const patient = normalizePatient(a)
        if (!patient) {
          dropped += 1
          return null
        }
        return {
          ...base,
          label: label || 'Update patient profile',
          patient,
        }
      }

      dropped += 1
      return null
    })
    .filter(Boolean)

  if (dropped) {
    warnings.push(`Dropped ${dropped} invalid action(s).`)
  }

  return {
    assistant_message: asString(raw?.assistant_message || raw?.message).trim(),
    actions,
    warnings,
  }
}
