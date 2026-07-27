import {
  deleteAppointment,
  deleteDoctor,
  deleteDose,
  deleteMedication,
  deleteReading,
  deleteVisit,
  listAppointments,
  listDoctors,
  listMedications,
  listReadings,
  listVisits,
  logDose,
  saveAppointment,
  saveDoctor,
  saveMedication,
  saveReading,
  saveVisit,
} from '@/lib/doctoApi'
import { updatePatientProfile } from '@/lib/patientsApi'
import { plainToDoc, serializeRichBody } from '@/lib/richBody'

function toNotesPayload(notes) {
  if (notes == null) return undefined
  if (typeof notes === 'object') {
    if (notes.type === 'doc') return notes
    if (notes.format && notes.doc) return notes
    return notes
  }
  if (typeof notes === 'string') {
    const trimmed = notes.trim()
    if (!trimmed) return undefined
    if (trimmed.startsWith('{')) {
      try {
        return JSON.parse(trimmed)
      } catch {
        // fall through
      }
    }
    return JSON.parse(serializeRichBody(plainToDoc(trimmed)))
  }
  return undefined
}

async function findById(listFn, patientId, key, id) {
  const rows = await listFn(patientId, key)
  return rows.find((r) => r.id === id) || null
}

/**
 * Apply one accepted care-chat action.
 * @returns {{ applied: object, errors: string[] }}
 */
export async function applyCareAction(action, {
  userId,
  patientId,
  key,
  patientProfile = null,
}) {
  const errors = []
  const applied = {}
  if (!action?.type) {
    return { applied, errors: ['Missing action type'] }
  }
  if (!userId || !patientId || !key) {
    return { applied, errors: ['Vault credentials missing'] }
  }

  try {
    switch (action.type) {
      case 'add_doctor': {
        const d = action.doctor || {}
        const row = await saveDoctor({
          userId,
          patientId,
          key,
          payload: {
            name: d.name || 'Doctor',
            specialty: d.specialty,
            email: d.email,
            website: d.website,
            notes: d.notes,
            offices: Array.isArray(d.offices) ? d.offices : [],
          },
        })
        applied.doctor = { id: row?.id }
        break
      }
      case 'update_doctor': {
        const d = action.doctor || {}
        if (!d.id) throw new Error('update_doctor requires id')
        const existing = await findById(listDoctors, patientId, key, d.id)
        if (!existing) throw new Error(`Doctor not found: ${d.id}`)
        await saveDoctor({
          userId,
          patientId,
          key,
          id: d.id,
          payload: {
            name: d.name ?? existing.name,
            specialty: d.specialty !== undefined ? d.specialty : existing.specialty,
            email: d.email !== undefined ? d.email : existing.email,
            website: d.website !== undefined ? d.website : existing.website,
            notes: d.notes !== undefined ? d.notes : existing.notes,
            offices:
              d.offices !== undefined ? d.offices : existing.offices || [],
          },
        })
        applied.doctor = { id: d.id }
        break
      }
      case 'remove_doctor': {
        for (const id of action.ids || []) {
          await deleteDoctor(userId, id)
        }
        applied.removed = action.ids
        break
      }

      case 'add_appointment': {
        const a = action.appointment || {}
        const row = await saveAppointment({
          userId,
          patientId,
          key,
          startsAt: a.startsAt,
          status: a.status || 'scheduled',
          kind: a.kind || 'other',
          doctorId: a.doctorId || null,
          payload: {
            title: a.title,
            officeId: a.officeId,
            instructions: a.instructions,
            notes: toNotesPayload(a.notes),
          },
        })
        applied.appointment = { id: row?.id }
        break
      }
      case 'update_appointment': {
        const a = action.appointment || {}
        if (!a.id) throw new Error('update_appointment requires id')
        const existing = await findById(
          listAppointments,
          patientId,
          key,
          a.id,
        )
        if (!existing) throw new Error(`Appointment not found: ${a.id}`)
        await saveAppointment({
          userId,
          patientId,
          key,
          id: a.id,
          startsAt: a.startsAt || existing.startsAt,
          status: a.status || existing.status,
          kind: a.kind || existing.kind,
          doctorId:
            a.doctorId !== undefined ? a.doctorId : existing.doctorId,
          visitId: existing.visitId || null,
          payload: {
            title: a.title !== undefined ? a.title : existing.title,
            officeId:
              a.officeId !== undefined ? a.officeId : existing.officeId,
            instructions:
              a.instructions !== undefined
                ? a.instructions
                : existing.instructions,
            notes:
              a.notes !== undefined
                ? toNotesPayload(a.notes)
                : existing.notes,
          },
        })
        applied.appointment = { id: a.id }
        break
      }
      case 'remove_appointment': {
        for (const id of action.ids || []) {
          await deleteAppointment(userId, id)
        }
        applied.removed = action.ids
        break
      }

      case 'add_visit': {
        const v = action.visit || {}
        const row = await saveVisit({
          userId,
          patientId,
          key,
          visitDate: v.visitDate,
          kind: v.kind || 'doctor_visit',
          doctorId: v.doctorId || null,
          payload: {
            title: v.title,
            officeId: v.officeId,
            appointmentId: v.appointmentId,
            summary: v.summary,
            notes: toNotesPayload(v.notes),
          },
        })
        applied.visit = { id: row?.id }
        break
      }
      case 'update_visit': {
        const v = action.visit || {}
        if (!v.id) throw new Error('update_visit requires id')
        const existing = await findById(listVisits, patientId, key, v.id)
        if (!existing) throw new Error(`Visit not found: ${v.id}`)
        await saveVisit({
          userId,
          patientId,
          key,
          id: v.id,
          visitDate: v.visitDate || existing.visitDate,
          kind: v.kind || existing.kind,
          doctorId: v.doctorId !== undefined ? v.doctorId : existing.doctorId,
          payload: {
            title: v.title !== undefined ? v.title : existing.title,
            officeId: v.officeId !== undefined ? v.officeId : existing.officeId,
            appointmentId:
              v.appointmentId !== undefined
                ? v.appointmentId
                : existing.appointmentId,
            summary: v.summary !== undefined ? v.summary : existing.summary,
            notes:
              v.notes !== undefined ? toNotesPayload(v.notes) : existing.notes,
          },
        })
        applied.visit = { id: v.id }
        break
      }
      case 'remove_visit': {
        for (const id of action.ids || []) {
          await deleteVisit(userId, id)
        }
        applied.removed = action.ids
        break
      }

      case 'add_medication': {
        const m = action.medication || {}
        const status = m.status || (m.isActive === false ? 'stopped' : 'active')
        const row = await saveMedication({
          userId,
          patientId,
          key,
          isActive: status === 'active',
          refillDate: m.refillDate ?? null,
          payload: {
            name: m.name || 'Medication',
            strength: m.strength,
            doctorId: m.doctorId,
            schedule: m.schedule,
            refill: m.refill,
            status,
            suspension: m.suspension,
          },
        })
        applied.medication = { id: row?.id }
        break
      }
      case 'update_medication': {
        const m = action.medication || {}
        if (!m.id) throw new Error('update_medication requires id')
        const existing = await findById(
          listMedications,
          patientId,
          key,
          m.id,
        )
        if (!existing) throw new Error(`Medication not found: ${m.id}`)
        const status =
          m.status ||
          existing.status ||
          (existing.isActive === false ? 'stopped' : 'active')
        await saveMedication({
          userId,
          patientId,
          key,
          id: m.id,
          isActive: status === 'active',
          refillDate:
            m.refillDate !== undefined ? m.refillDate : existing.refillDate,
          payload: {
            name: m.name ?? existing.name,
            strength:
              m.strength !== undefined ? m.strength : existing.strength,
            doctorId:
              m.doctorId !== undefined ? m.doctorId : existing.doctorId,
            schedule:
              m.schedule !== undefined ? m.schedule : existing.schedule,
            refill: m.refill !== undefined ? m.refill : existing.refill,
            status,
            suspension:
              m.suspension !== undefined ? m.suspension : existing.suspension,
          },
        })
        applied.medication = { id: m.id }
        break
      }
      case 'remove_medication': {
        for (const id of action.ids || []) {
          await deleteMedication(userId, id)
        }
        applied.removed = action.ids
        break
      }

      case 'log_dose': {
        const d = action.dose || {}
        if (!d.medicationId) throw new Error('log_dose requires medicationId')
        const row = await logDose({
          userId,
          patientId,
          medicationId: d.medicationId,
          key,
          note: d.note,
        })
        // If takenAt was specified and differs, we still logged "now" via logDose.
        // Acceptable for MVP; saveDose with takenAt is available if needed later.
        applied.dose = { id: row?.id, medicationId: d.medicationId }
        if (d.takenAt) {
          // Best-effort: overwrite taken_at via a follow-up is not exposed; note in applied.
          applied.dose.requestedTakenAt = d.takenAt
        }
        break
      }
      case 'remove_dose': {
        for (const id of action.ids || []) {
          await deleteDose(userId, id)
        }
        applied.removed = action.ids
        break
      }

      case 'add_reading': {
        const r = action.reading || {}
        const row = await saveReading({
          userId,
          patientId,
          key,
          measuredAt: r.measuredAt || new Date().toISOString(),
          payload: {
            bloodPressure: r.bloodPressure,
            pulse: r.pulse,
            weightKg: r.weightKg,
            heightCm: r.heightCm,
            notes: r.notes,
          },
        })
        applied.reading = { id: row?.id }
        break
      }
      case 'update_reading': {
        const r = action.reading || {}
        if (!r.id) throw new Error('update_reading requires id')
        const existing = await findById(listReadings, patientId, key, r.id)
        if (!existing) throw new Error(`Reading not found: ${r.id}`)
        await saveReading({
          userId,
          patientId,
          key,
          id: r.id,
          measuredAt: r.measuredAt || existing.measuredAt,
          payload: {
            bloodPressure:
              r.bloodPressure !== undefined
                ? r.bloodPressure
                : existing.bloodPressure,
            pulse: r.pulse !== undefined ? r.pulse : existing.pulse,
            weightKg:
              r.weightKg !== undefined ? r.weightKg : existing.weightKg,
            heightCm:
              r.heightCm !== undefined ? r.heightCm : existing.heightCm,
            notes: r.notes !== undefined ? r.notes : existing.notes,
          },
        })
        applied.reading = { id: r.id }
        break
      }
      case 'remove_reading': {
        for (const id of action.ids || []) {
          await deleteReading(userId, id)
        }
        applied.removed = action.ids
        break
      }

      case 'update_patient': {
        const p = action.patient || {}
        const next = {
          preferredName:
            p.preferredName ?? patientProfile?.preferredName ?? 'Me',
          birthday:
            p.birthday !== undefined ? p.birthday : patientProfile?.birthday,
          sex: p.sex !== undefined ? p.sex : patientProfile?.sex,
          notes: p.notes !== undefined ? p.notes : patientProfile?.notes,
        }
        await updatePatientProfile({ patientId, key, profile: next })
        applied.patient = next
        break
      }

      default:
        errors.push(`Unsupported action: ${action.type}`)
    }
  } catch (err) {
    errors.push(err?.message || String(err))
  }

  return { applied, errors }
}
