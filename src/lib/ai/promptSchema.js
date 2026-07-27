/**
 * Care-chat JSON shapes (prompt contract).
 * Avoid Firebase responseSchema which can emit Scope.* mashups — describe
 * shapes in the system prompt instead.
 */

export const CARE_TURN_TYPES = Object.freeze([
  'chat',
  'ask_user',
  'propose_actions',
  'need_tool',
])

export const CARE_TOOL_NAMES = Object.freeze(['search_doctors'])

/**
 * Compact JSON shapes embedded in care-chat prompts.
 */
export const CARE_CHAT_TURN_PROMPT_SCHEMA = `
Return JSON only — one CareTurn object:

{
  "type": "chat" | "ask_user" | "propose_actions" | "need_tool",
  "assistant_message": string,
  "expecting"?: ["location" | "doctor_name" | "medication_strength" | "other"],
  "tool"?: {
    "name": "search_doctors",
    "args": { "textQuery": string, "maxResults"?: number }
  },
  "actions"?: [{
    "type": "add_doctor" | "update_doctor" | "remove_doctor"
      | "add_appointment" | "update_appointment" | "remove_appointment"
      | "add_visit" | "update_visit" | "remove_visit"
      | "add_medication" | "update_medication" | "remove_medication"
      | "log_dose" | "remove_dose"
      | "add_reading" | "update_reading" | "remove_reading"
      | "update_patient",
    "label": string,
    "ids": [existing ids from context…],
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

When to use each type:
- "chat": answer or explain; no vault change.
- "ask_user": need a clarifying answer (ZIP, doctor name, med strength, …). Set expecting[].
- "propose_actions": ready for Accept/Reject; put concrete edits in actions (non-empty).
- "need_tool": must look up live clinics via Google Places. Set tool.name="search_doctors" and tool.args.textQuery (include name and/or city/ZIP). Do NOT invent clinic phone/address.

Rules:
- Never concatenate schema paths into values (no "Scope.field:…").
- Concrete record edits ALWAYS go in "actions" with type "propose_actions". Nothing is saved until the user Accepts.
- Prefer update_* / remove_* with existing ids from current_patient_context; use add_* / log_dose for new items.
- Never delete the patient, family members, or encryption keys. Never invent diagnoses or prescriptions.
- For medications and doses: only record what the user stated; ask_user when strength/schedule is unclear.
- To find doctors/clinics, use need_tool → search_doctors (never invent Places data).
- After a tool_result is provided, return propose_actions with add_doctor from those results (or ask_user / chat if empty).
- notes may be plain text (the app converts to TipTap) or TipTap JSON.
- Plain YYYY-MM-DD dates and ISO-8601 datetimes only.
`.trim()
