/**
 * Compact JSON shapes embedded in care-chat prompts
 * (avoid Firebase responseSchema which can emit Scope.* mashups).
 */

export const CARE_CHAT_TURN_PROMPT_SCHEMA = `
Return JSON only:
{
  "assistant_message": string,
  "actions": [{
    "type": "add_doctor" | "update_doctor" | "remove_doctor"
      | "add_appointment" | "update_appointment" | "remove_appointment"
      | "add_visit" | "update_visit" | "remove_visit"
      | "add_medication" | "update_medication" | "remove_medication"
      | "log_dose" | "remove_dose"
      | "add_reading" | "update_reading" | "remove_reading"
      | "update_patient",
    "label": string,
    "ids": [existing ids from context…],  // for remove_* actions
    "doctor": {
      "id"?: existing id for update_doctor,
      "name": string,
      "specialty"?, "email"?, "website"?, "notes"?,
      "offices"?: [{
        "id"?, "label"?, "phone"?,
        "addressLine1"?, "city"?, "region"?, "postalCode"?, "country"?,
        "googlePlaceId"?, "lat"?, "lng"?
      }]
    },
    "appointment": {
      "id"?: existing id for update_appointment,
      "title"?, "kind": "checkup"|"follow_up"|"blood_draw"|"xray"|"mri"|"ultrasound"|"lab"|"procedure"|"other",
      "status"?: "scheduled"|"done"|"cancelled",
      "startsAt": ISO-8601 datetime,
      "doctorId"?, "officeId"?, "instructions"?, "notes"?
    },
    "visit": {
      "id"?: existing id for update_visit,
      "title"?, "kind": "doctor_visit"|"procedure",
      "visitDate": "YYYY-MM-DD",
      "doctorId"?, "officeId"?, "appointmentId"?, "summary"?, "notes"?
    },
    "medication": {
      "id"?: existing id for update_medication,
      "name": string,
      "strength"?,
      "status"?: "active"|"suspended"|"stopped",
      "isActive"?: boolean,
      "refillDate"?: "YYYY-MM-DD"|null,
      "doctorId"?,
      "schedule"?: { "frequency": "daily"|"weekly"|"monthly"|"as_needed", "timesPerPeriod"?, "times"?: string[], "instructions"? },
      "refill"?: { "quantity"?, "pillsLeft"?, "rxNumber"? },
      "suspension"?: { "note"?, "suspendedAt"? }
    },
    "dose": {
      "id"?: existing id for remove_dose (prefer ids[]),
      "medicationId": existing medication id,
      "takenAt"?: ISO-8601,
      "note"?
    },
    "reading": {
      "id"?: existing id for update_reading,
      "measuredAt": ISO-8601,
      "bloodPressure"?: { "systolic": number, "diastolic": number },
      "pulse"?: number,
      "weightKg"?: number,
      "heightCm"?: number,
      "notes"?
    },
    "patient": {
      "preferredName"?, "birthday"?, "sex"?, "notes"?
    }
  }]
}

Rules:
- Never concatenate schema paths into values (no "Scope.field:…").
- Concrete record edits ALWAYS go in "actions". Nothing is saved until the user Accepts.
- Prefer update_* / remove_* with existing ids from current_patient_context; use add_* / log_dose for new items.
- Never delete the patient, family members, or encryption keys. Never invent diagnoses or prescriptions.
- For medications and doses: only record what the user stated; ask clarifying questions if strength/schedule is unclear.
- notes may be plain text (the app converts to TipTap) or TipTap JSON.
- Plain YYYY-MM-DD dates and ISO-8601 datetimes only.
`.trim()
