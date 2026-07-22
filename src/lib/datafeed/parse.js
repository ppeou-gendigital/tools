import {
  DATAFEED_TYPES,
  DATAFEED_VERSION,
  isDatafeedType,
  normalizeAppointment,
  normalizeDoctor,
  normalizeDose,
  normalizeFile,
  normalizeMedication,
  normalizePatientProfile,
  normalizeReading,
  normalizeVisit,
  validateAppointment,
  validateDoctor,
  validateDose,
  validateFile,
  validateMedication,
  validateReading,
  validateVisit,
} from '@/lib/datafeed/schema'

/**
 * Parse a JSON string (or object) into a normalized patient datafeed.
 * Envelope errors throw. Per-item problems go into `errors`.
 */
export function parseDatafeed(input) {
  let doc = input
  if (typeof input === 'string') {
    try {
      doc = JSON.parse(input)
    } catch {
      throw new Error('Datafeed is not valid JSON')
    }
  }
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    throw new Error('Datafeed must be a JSON object')
  }
  if (doc.version !== DATAFEED_VERSION) {
    throw new Error(
      `Unsupported datafeed version (expected ${DATAFEED_VERSION}, got ${JSON.stringify(doc.version)})`,
    )
  }
  if (!isDatafeedType(doc.type)) {
    throw new Error(
      `Unsupported datafeed type (got ${JSON.stringify(doc.type)})`,
    )
  }

  const errors = []
  const type =
    doc.type === DATAFEED_TYPES.LEGACY_BACKUP
      ? DATAFEED_TYPES.PATIENT
      : doc.type

  let patient = null
  let doctors = []
  let appointments = []
  let visits = []
  let medications = []
  let doses = []
  let readings = []
  let files = []

  if (type === DATAFEED_TYPES.PATIENT) {
    if (doc.patient && typeof doc.patient === 'object') {
      patient = normalizePatientProfile(doc.patient)
    }
    doctors = normalizeList(doc.doctors, 'doctors', normalizeDoctor, validateDoctor, errors)
    appointments = normalizeList(
      doc.appointments,
      'appointments',
      normalizeAppointment,
      validateAppointment,
      errors,
    )
    visits = normalizeList(doc.visits, 'visits', normalizeVisit, validateVisit, errors)
    medications = normalizeList(
      doc.medications,
      'medications',
      normalizeMedication,
      validateMedication,
      errors,
    )
    doses = normalizeList(doc.doses, 'doses', normalizeDose, validateDose, errors)
    readings = normalizeList(
      doc.readings,
      'readings',
      normalizeReading,
      validateReading,
      errors,
    )
    files = normalizeList(doc.files, 'files', normalizeFile, validateFile, errors)
  } else if (type === DATAFEED_TYPES.DOCTORS) {
    doctors = normalizeList(doc.items, 'items', normalizeDoctor, validateDoctor, errors)
  } else if (type === DATAFEED_TYPES.APPOINTMENTS) {
    appointments = normalizeList(
      doc.items,
      'items',
      normalizeAppointment,
      validateAppointment,
      errors,
    )
  } else if (type === DATAFEED_TYPES.VISITS) {
    visits = normalizeList(doc.items, 'items', normalizeVisit, validateVisit, errors)
  } else if (type === DATAFEED_TYPES.MEDICATIONS) {
    medications = normalizeList(
      doc.items,
      'items',
      normalizeMedication,
      validateMedication,
      errors,
    )
  } else if (type === DATAFEED_TYPES.READINGS) {
    readings = normalizeList(doc.items, 'items', normalizeReading, validateReading, errors)
  } else if (type === DATAFEED_TYPES.FILES) {
    files = normalizeList(doc.items, 'items', normalizeFile, validateFile, errors)
  }

  return {
    type,
    version: DATAFEED_VERSION,
    exportedAt:
      typeof doc.exportedAt === 'string' && doc.exportedAt
        ? doc.exportedAt
        : null,
    patient,
    doctors,
    appointments,
    visits,
    medications,
    doses,
    readings,
    files,
    errors,
  }
}

function normalizeList(raw, label, normalize, validate, errors) {
  if (raw == null) return []
  if (!Array.isArray(raw)) {
    errors.push(`${label} must be an array`)
    return []
  }
  const out = []
  raw.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(`${label}[${index}]: expected an object`)
      return
    }
    const item = normalize(entry)
    const err = validate(item, index)
    if (err) {
      errors.push(err)
      return
    }
    out.push(item)
  })
  return out
}
