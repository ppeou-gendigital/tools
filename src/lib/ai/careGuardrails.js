/**
 * Pre-accept care-chat guardrails.
 * Soften clinical-sounding labels; require med/dose essentials.
 */

const CLINICAL_CLAIM =
  /\b(diagnos(e|is|ed)|prescribe|prescription|treat(ment|ing)?|cure|should take|you have|you need to take)\b/i

function softenLabel(label) {
  const s = String(label || '').trim()
  if (!s) return s
  if (!CLINICAL_CLAIM.test(s)) return s
  return s
    .replace(/\bdiagnos(e|is|ed)\b/gi, 'note')
    .replace(/\bprescribe|prescription\b/gi, 'record')
    .replace(/\btreat(ment|ing)?\b/gi, 'log')
    .replace(/\bcure\b/gi, 'track')
}

/**
 * @param {{ assistant_message: string, actions: object[], warnings?: string[] }} turn
 * @param {{ medicationIds?: Set<string> }} [opts]
 */
export function applyCareActionGuardrails(turn, opts = {}) {
  const medIds = opts.medicationIds || new Set()
  const warnings = [...(turn.warnings || [])]
  const actions = []

  for (const action of turn.actions || []) {
    if (!action || typeof action !== 'object') continue
    let next = {
      ...action,
      label: softenLabel(action.label),
      risk_notes: [...(action.risk_notes || [])],
      risky: Boolean(action.risky),
    }

    if (next.type === 'log_dose') {
      const medId = next.dose?.medicationId
      if (!medId || (medIds.size && !medIds.has(medId))) {
        warnings.push('Skipped log_dose: medicationId missing or unknown.')
        continue
      }
    }

    if (next.type === 'add_medication') {
      if (!next.medication?.name) {
        warnings.push('Skipped add_medication: name required.')
        continue
      }
      if (!next.medication.schedule && !next.medication.strength) {
        next.risky = true
        next.risk_notes.push(
          'Medication has no strength/schedule — confirm with the patient before accepting.',
        )
      }
    }

    if (
      next.type === 'add_appointment' &&
      next.appointment &&
      !next.appointment.startsAt
    ) {
      warnings.push('Skipped add_appointment: startsAt required.')
      continue
    }

    if (next.type === 'add_visit' && next.visit && !next.visit.visitDate) {
      warnings.push('Skipped add_visit: visitDate required.')
      continue
    }

    actions.push(next)
  }

  let assistant_message = String(turn.assistant_message || '')
  if (CLINICAL_CLAIM.test(assistant_message)) {
    warnings.push(
      'Reminder: Docto AI organizes records only — it does not diagnose or prescribe.',
    )
  }

  return { ...turn, assistant_message, actions, warnings }
}
