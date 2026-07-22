import { createId } from '@/lib/id'
import { updatePatientProfile } from '@/lib/patientsApi'
import {
  saveAppointment,
  saveDoctor,
  saveDose,
  saveFile,
  saveMedication,
  saveReading,
  saveVisit,
} from '@/lib/doctoApi'

/**
 * Import a parsed datafeed into the active patient.
 * Always inserts new domain rows (patient profile is updated in place).
 */
export async function importDatafeedItems({
  userId,
  patientId,
  key,
  feed,
  onProgress,
}) {
  if (!userId) throw new Error('Not signed in')
  if (!patientId || !key) throw new Error('Vault is locked')
  if (!feed) throw new Error('No datafeed')

  const {
    patient,
    doctors = [],
    appointments = [],
    visits = [],
    medications = [],
    doses = [],
    readings = [],
    files = [],
  } = feed

  const total =
    (patient ? 1 : 0) +
    doctors.length +
    appointments.length +
    visits.length +
    medications.length +
    doses.length +
    readings.length +
    files.length

  let done = 0
  const report = () => onProgress?.({ done, total })

  const result = {
    patientUpdated: false,
    doctorsCreated: 0,
    appointmentsCreated: 0,
    visitsCreated: 0,
    medicationsCreated: 0,
    dosesCreated: 0,
    readingsCreated: 0,
    filesCreated: 0,
    failures: [],
  }

  const doctorIdMap = new Map()
  const officeIdMap = new Map()
  const appointmentIdMap = new Map()
  const visitIdMap = new Map()
  const medicationIdMap = new Map()

  if (patient) {
    try {
      await updatePatientProfile({ patientId, key, profile: patient })
      result.patientUpdated = true
    } catch (err) {
      result.failures.push({
        kind: 'patient',
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  for (let i = 0; i < doctors.length; i++) {
    const item = doctors[i]
    try {
      const offices = (item.offices || []).map((o) => {
        const newId = createId()
        if (o.id) officeIdMap.set(o.id, newId)
        return { ...o, id: newId }
      })
      const row = await saveDoctor({
        userId,
        patientId,
        key,
        payload: {
          name: item.name,
          specialty: item.specialty,
          email: item.email,
          website: item.website,
          notes: item.notes,
          offices,
        },
      })
      if (item.id) doctorIdMap.set(item.id, row.id)
      result.doctorsCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'doctor',
        index: i,
        name: item.name,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  for (let i = 0; i < medications.length; i++) {
    const item = medications[i]
    try {
      const row = await saveMedication({
        userId,
        patientId,
        key,
        isActive: item.isActive,
        refillDate: item.refillDate,
        payload: {
          name: item.name,
          strength: item.strength,
          doctorId: mapId(doctorIdMap, item.doctorId),
          schedule: item.schedule,
          refill: item.refill,
        },
      })
      if (item.id) medicationIdMap.set(item.id, row.id)
      result.medicationsCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'medication',
        index: i,
        name: item.name,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  for (let i = 0; i < appointments.length; i++) {
    const item = appointments[i]
    try {
      const row = await saveAppointment({
        userId,
        patientId,
        key,
        startsAt: item.startsAt,
        status: item.status,
        kind: item.kind,
        doctorId: mapId(doctorIdMap, item.doctorId),
        payload: {
          title: item.title,
          officeId: mapId(officeIdMap, item.officeId),
          instructions: item.instructions,
          notes: item.notes,
        },
      })
      if (item.id) appointmentIdMap.set(item.id, row.id)
      result.appointmentsCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'appointment',
        index: i,
        title: item.title,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  for (let i = 0; i < visits.length; i++) {
    const item = visits[i]
    try {
      const row = await saveVisit({
        userId,
        patientId,
        key,
        visitDate: item.visitDate,
        kind: item.kind,
        doctorId: mapId(doctorIdMap, item.doctorId),
        payload: {
          title: item.title,
          officeId: mapId(officeIdMap, item.officeId),
          appointmentId: mapId(appointmentIdMap, item.appointmentId),
          summary: item.summary,
          notes: item.notes,
        },
      })
      if (item.id) visitIdMap.set(item.id, row.id)
      result.visitsCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'visit',
        index: i,
        title: item.title,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  // visitIdMap reserved for future appointment.visitId backfill
  void visitIdMap

  for (let i = 0; i < doses.length; i++) {
    const item = doses[i]
    try {
      const medicationId = mapId(medicationIdMap, item.medicationId)
      if (!medicationId) {
        throw new Error('medicationId could not be resolved')
      }
      await saveDose({
        userId,
        patientId,
        medicationId,
        key,
        takenAt: item.takenAt,
        note: item.note,
      })
      result.dosesCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'dose',
        index: i,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  for (let i = 0; i < readings.length; i++) {
    const item = readings[i]
    try {
      await saveReading({
        userId,
        patientId,
        key,
        measuredAt: item.measuredAt,
        payload: {
          bloodPressure: item.bloodPressure,
          pulse: item.pulse,
          weightKg: item.weightKg,
          heightCm: item.heightCm,
          notes: item.notes,
        },
      })
      result.readingsCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'reading',
        index: i,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  for (let i = 0; i < files.length; i++) {
    const item = files[i]
    try {
      await saveFile({
        userId,
        patientId,
        key,
        category: item.category,
        payload: {
          title: item.title,
          insuranceCompany: item.insuranceCompany,
          memberId: item.memberId,
          notes: item.notes,
        },
      })
      result.filesCreated += 1
    } catch (err) {
      result.failures.push({
        kind: 'file',
        index: i,
        title: item.title,
        message: err?.message ?? String(err),
      })
    }
    done += 1
    report()
  }

  return result
}

function mapId(map, feedId) {
  if (!feedId) return null
  return map.get(feedId) ?? null
}
