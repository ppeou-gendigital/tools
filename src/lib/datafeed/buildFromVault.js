import {
  listAppointments,
  listDoctors,
  listDoses,
  listFiles,
  listMedications,
  listReadings,
  listVisits,
} from '@/lib/doctoApi'
import { buildPatientFeed, buildTypedFeed } from '@/lib/datafeed/serialize'
import { DATAFEED_TYPES } from '@/lib/datafeed/schema'

/**
 * Load decrypted patient domain rows and build a portable datafeed.
 */
export async function loadPatientFeedBundle({ patientId, key, patient }) {
  const [doctors, appointments, visits, medications, doses, readings, files] =
    await Promise.all([
      listDoctors(patientId, key),
      listAppointments(patientId, key),
      listVisits(patientId, key),
      listMedications(patientId, key),
      listDoses(patientId, key),
      listReadings(patientId, key),
      listFiles(patientId, key),
    ])
  return {
    patient,
    doctors,
    appointments,
    visits,
    medications,
    doses,
    readings,
    files,
  }
}

export async function exportPatientDatafeed({ patientId, key, patient }) {
  const bundle = await loadPatientFeedBundle({ patientId, key, patient })
  return buildPatientFeed(bundle)
}

export async function exportTypedDatafeed({ patientId, key, type }) {
  const bundle = await loadPatientFeedBundle({ patientId, key, patient: null })
  const map = {
    [DATAFEED_TYPES.DOCTORS]: bundle.doctors,
    [DATAFEED_TYPES.APPOINTMENTS]: bundle.appointments,
    [DATAFEED_TYPES.VISITS]: bundle.visits,
    [DATAFEED_TYPES.MEDICATIONS]: bundle.medications,
    [DATAFEED_TYPES.READINGS]: bundle.readings,
    [DATAFEED_TYPES.FILES]: bundle.files,
  }
  const items = map[type]
  if (!items) throw new Error(`Unsupported export type: ${type}`)
  return buildTypedFeed(type, items)
}
