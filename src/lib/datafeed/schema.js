// Docto patient datafeed v1 — constants + normalizers.
// Spec + samples live in /datafeed at the repo root.

export const DATAFEED_VERSION = 1

export const DATAFEED_TYPES = Object.freeze({
  PATIENT: 'patient',
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  VISITS: 'visits',
  MEDICATIONS: 'medications',
  READINGS: 'readings',
  FILES: 'files',
  /** @deprecated legacy export alias — accepted on import */
  LEGACY_BACKUP: 'docto-backup',
})

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
const FILE_CATEGORIES = new Set(['insurance', 'lab', 'imaging', 'other'])

export function isDatafeedType(value) {
  return Object.values(DATAFEED_TYPES).includes(value)
}

function str(value) {
  return value == null ? '' : String(value).trim()
}

function optStr(value) {
  const s = str(value)
  return s || undefined
}

function optId(value) {
  const s = str(value)
  return s || undefined
}

function numOrUndef(value) {
  if (value == null || value === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

export function normalizePatientProfile(raw) {
  return {
    preferredName: str(raw?.preferredName) || 'Me',
    birthday: optStr(raw?.birthday),
    sex: optStr(raw?.sex),
    notes: optStr(raw?.notes),
  }
}

function optNum(v) {
  if (v == null || v === '') return undefined
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : undefined
}

export function normalizeOffice(raw) {
  return {
    id: optId(raw?.id),
    label: optStr(raw?.label),
    phone: optStr(raw?.phone),
    phoneExt: optStr(raw?.phoneExt),
    email: optStr(raw?.email),
    website: optStr(raw?.website),
    addressLine1: optStr(raw?.addressLine1) ?? '',
    addressLine2: optStr(raw?.addressLine2),
    city: optStr(raw?.city) ?? '',
    region: optStr(raw?.region),
    postalCode: optStr(raw?.postalCode),
    country: optStr(raw?.country),
    googlePlaceId: optStr(raw?.googlePlaceId),
    lat: optNum(raw?.lat),
    lng: optNum(raw?.lng),
  }
}

export function normalizeDoctor(raw) {
  const offices = Array.isArray(raw?.offices)
    ? raw.offices
        .filter((o) => o && typeof o === 'object')
        .map(normalizeOffice)
    : []
  return {
    id: optId(raw?.id),
    name: str(raw?.name),
    specialty: optStr(raw?.specialty),
    email: optStr(raw?.email),
    website: optStr(raw?.website),
    notes: optStr(raw?.notes),
    offices,
  }
}

export function normalizeAppointment(raw) {
  const kind = str(raw?.kind) || 'other'
  const status = str(raw?.status) || 'scheduled'
  return {
    id: optId(raw?.id),
    title: optStr(raw?.title),
    kind: APPOINTMENT_KINDS.has(kind) ? kind : 'other',
    status: APPOINTMENT_STATUSES.has(status) ? status : 'scheduled',
    startsAt: str(raw?.startsAt),
    doctorId: optId(raw?.doctorId),
    officeId: optId(raw?.officeId),
    instructions: optStr(raw?.instructions),
    notes: raw?.notes,
  }
}

export function normalizeVisit(raw) {
  const kind = str(raw?.kind) || 'doctor_visit'
  return {
    id: optId(raw?.id),
    title: optStr(raw?.title),
    kind: VISIT_KINDS.has(kind) ? kind : 'doctor_visit',
    visitDate: str(raw?.visitDate),
    doctorId: optId(raw?.doctorId),
    officeId: optId(raw?.officeId),
    appointmentId: optId(raw?.appointmentId),
    summary: optStr(raw?.summary),
    notes: raw?.notes,
  }
}

const MED_FREQUENCIES = new Set(['daily', 'weekly', 'monthly', 'as_needed'])
const MED_STATUSES = new Set(['active', 'suspended', 'stopped'])

export function normalizeMedication(raw) {
  let schedule
  if (raw?.schedule && typeof raw.schedule === 'object') {
    let frequency = str(raw.schedule.frequency).toLowerCase()
    if (!MED_FREQUENCIES.has(frequency)) frequency = 'daily'
    const times = Array.isArray(raw.schedule.times)
      ? raw.schedule.times.map((t) => str(t)).filter(Boolean)
      : []
    let timesPerPeriod =
      numOrUndef(raw.schedule.timesPerPeriod) ??
      numOrUndef(raw.schedule.timesPerDay) ??
      (times.length > 0 ? times.length : 1)
    if (frequency === 'as_needed') timesPerPeriod = 0
    schedule = {
      frequency,
      timesPerPeriod,
      // Keep legacy field so older readers still see a count for daily meds
      timesPerDay:
        frequency === 'daily' ? timesPerPeriod || 1 : undefined,
      times,
      instructions: optStr(raw.schedule.instructions),
    }
  }

  const refill =
    raw?.refill && typeof raw.refill === 'object'
      ? {
          quantity: numOrUndef(raw.refill.quantity),
          pillsLeft: numOrUndef(raw.refill.pillsLeft),
          rxNumber: optStr(raw.refill.rxNumber),
        }
      : undefined

  let status = str(raw?.status).toLowerCase()
  if (!MED_STATUSES.has(status)) {
    status = raw?.isActive === false ? 'stopped' : 'active'
  }

  const suspension =
    raw?.suspension && typeof raw.suspension === 'object'
      ? {
          note: optStr(raw.suspension.note),
          suspendedAt: optStr(raw.suspension.suspendedAt),
        }
      : undefined

  return {
    id: optId(raw?.id),
    name: str(raw?.name),
    strength: optStr(raw?.strength),
    isActive: status === 'active',
    status,
    suspension: status === 'suspended' ? suspension : undefined,
    refillDate: optStr(raw?.refillDate) ?? null,
    doctorId: optId(raw?.doctorId),
    schedule,
    refill,
  }
}

export function normalizeDose(raw) {
  return {
    medicationId: optId(raw?.medicationId),
    takenAt: str(raw?.takenAt),
    note: optStr(raw?.note),
  }
}

export function normalizeReading(raw) {
  const bp = raw?.bloodPressure
  return {
    measuredAt: str(raw?.measuredAt),
    bloodPressure:
      bp && typeof bp === 'object'
        ? {
            systolic: numOrUndef(bp.systolic),
            diastolic: numOrUndef(bp.diastolic),
          }
        : undefined,
    pulse: numOrUndef(raw?.pulse),
    weightKg: numOrUndef(raw?.weightKg),
    heightCm: numOrUndef(raw?.heightCm),
    notes: optStr(raw?.notes),
  }
}

export function normalizeFile(raw) {
  const category = str(raw?.category) || 'other'
  return {
    title: str(raw?.title),
    category: FILE_CATEGORIES.has(category) ? category : 'other',
    insuranceCompany: optStr(raw?.insuranceCompany),
    memberId: optStr(raw?.memberId),
    notes: optStr(raw?.notes),
  }
}

export function validateDoctor(item, index) {
  if (!item.name) return `doctors[${index}]: name is required`
  return null
}

export function validateAppointment(item, index) {
  if (!item.startsAt) return `appointments[${index}]: startsAt is required`
  return null
}

export function validateVisit(item, index) {
  if (!item.visitDate) return `visits[${index}]: visitDate is required`
  return null
}

export function validateMedication(item, index) {
  if (!item.name) return `medications[${index}]: name is required`
  return null
}

export function validateDose(item, index) {
  if (!item.medicationId) return `doses[${index}]: medicationId is required`
  if (!item.takenAt) return `doses[${index}]: takenAt is required`
  return null
}

export function validateReading(item, index) {
  if (!item.measuredAt) return `readings[${index}]: measuredAt is required`
  return null
}

export function validateFile(item, index) {
  if (!item.title) return `files[${index}]: title is required`
  return null
}
