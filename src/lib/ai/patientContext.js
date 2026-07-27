import { loadPatientFeedBundle } from '@/lib/datafeed/buildFromVault'
import { buildReminders } from '@/lib/reminders'
import { planningClockContext } from '@/lib/ai/planningClock'
import { bodyToPreviewText } from '@/lib/richBody'

const MAX_LIST = 40
const MAX_DOSES = 30
const MAX_NOTE = 400

function truncateNote(notes) {
  if (notes == null) return undefined
  if (typeof notes === 'string') {
    const t = notes.trim()
    if (!t) return undefined
    return t.length > MAX_NOTE ? `${t.slice(0, MAX_NOTE)}…` : t
  }
  const preview = bodyToPreviewText(notes, MAX_NOTE)
  return preview || undefined
}

function compactDoctor(d) {
  return {
    id: d.id,
    name: d.name || '',
    specialty: d.specialty || undefined,
    email: d.email || undefined,
    website: d.website || undefined,
    notes: truncateNote(d.notes),
    offices: Array.isArray(d.offices)
      ? d.offices.map((o) => ({
          id: o.id,
          label: o.label || undefined,
          phone: o.phone || undefined,
          addressLine1: o.addressLine1 || undefined,
          city: o.city || undefined,
          region: o.region || undefined,
          postalCode: o.postalCode || undefined,
          country: o.country || undefined,
          googlePlaceId: o.googlePlaceId || undefined,
          lat: Number.isFinite(o.lat) ? o.lat : undefined,
          lng: Number.isFinite(o.lng) ? o.lng : undefined,
        }))
      : [],
  }
}

function compactAppointment(a) {
  return {
    id: a.id,
    title: a.title || undefined,
    kind: a.kind,
    status: a.status,
    startsAt: a.startsAt,
    doctorId: a.doctorId || undefined,
    officeId: a.officeId || undefined,
    instructions: a.instructions || undefined,
    notes: truncateNote(a.notes),
  }
}

function compactVisit(v) {
  return {
    id: v.id,
    title: v.title || undefined,
    kind: v.kind,
    visitDate: v.visitDate,
    doctorId: v.doctorId || undefined,
    officeId: v.officeId || undefined,
    appointmentId: v.appointmentId || undefined,
    summary: v.summary || undefined,
    notes: truncateNote(v.notes),
  }
}

function compactMedication(m) {
  return {
    id: m.id,
    name: m.name || '',
    strength: m.strength || undefined,
    status: m.status || (m.isActive === false ? 'stopped' : 'active'),
    isActive: m.isActive !== false,
    refillDate: m.refillDate || null,
    doctorId: m.doctorId || undefined,
    schedule: m.schedule || undefined,
    refill: m.refill || undefined,
    suspension: m.suspension || undefined,
  }
}

function compactDose(d) {
  return {
    id: d.id,
    medicationId: d.medicationId,
    takenAt: d.takenAt,
    note: truncateNote(d.note),
  }
}

function compactReading(r) {
  return {
    id: r.id,
    measuredAt: r.measuredAt,
    bloodPressure: r.bloodPressure || undefined,
    pulse: r.pulse ?? undefined,
    weightKg: r.weightKg ?? undefined,
    heightCm: r.heightCm ?? undefined,
    notes: truncateNote(r.notes),
  }
}

/**
 * Build compact patient context for each care-chat turn.
 * @param {{ patientId: string, key: CryptoKey|ArrayBuffer, patient?: object, displayLocale?: string }} opts
 */
export async function buildPatientAiContext({
  patientId,
  key,
  patient = null,
  displayLocale = null,
}) {
  if (!patientId || !key) {
    throw new Error('buildPatientAiContext: patientId and key required')
  }
  const bundle = await loadPatientFeedBundle({ patientId, key, patient })
  const clock = planningClockContext(displayLocale)
  const reminders = buildReminders({
    appointments: bundle.appointments || [],
    medications: bundle.medications || [],
  }).map((r) => ({
    kind: r.kind,
    urgency: r.urgency,
    title: r.title,
    detail: r.detail,
  }))

  const profile = bundle.patient
    ? {
        preferredName: bundle.patient.preferredName || undefined,
        birthday: bundle.patient.birthday || undefined,
        sex: bundle.patient.sex || undefined,
        notes: truncateNote(bundle.patient.notes),
      }
    : null

  return {
    clock,
    patient: profile,
    reminders,
    doctors: (bundle.doctors || []).slice(0, MAX_LIST).map(compactDoctor),
    appointments: (bundle.appointments || [])
      .slice(0, MAX_LIST)
      .map(compactAppointment),
    visits: (bundle.visits || []).slice(0, MAX_LIST).map(compactVisit),
    medications: (bundle.medications || [])
      .slice(0, MAX_LIST)
      .map(compactMedication),
    doses: (bundle.doses || [])
      .slice(-MAX_DOSES)
      .map(compactDose),
    readings: (bundle.readings || [])
      .slice(-MAX_LIST)
      .map(compactReading),
    counts: {
      doctors: (bundle.doctors || []).length,
      appointments: (bundle.appointments || []).length,
      visits: (bundle.visits || []).length,
      medications: (bundle.medications || []).length,
      doses: (bundle.doses || []).length,
      readings: (bundle.readings || []).length,
    },
  }
}

export function patientSystemRulesPromptBlock(ctx) {
  const name = ctx?.patient?.preferredName || 'the patient'
  const today = ctx?.clock?.today || 'unknown'
  const weekday = ctx?.clock?.weekday || ''
  const zone = ctx?.clock?.timeZone || 'UTC'
  return [
    `Active patient: ${name}.`,
    `Today is ${weekday} ${today} (${zone}). Resolve relative dates from this clock.`,
    'Use ids from current_patient_context only. Do not invent uuid-looking ids for updates/removes.',
  ].join(' ')
}
