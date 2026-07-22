/**
 * Build reminder chips for Home (refills + upcoming appointments).
 */

export function buildReminders({ appointments = [], medications = [], now = Date.now() }) {
  const items = []

  for (const a of appointments) {
    if (a.status !== 'scheduled' || !a.startsAt) continue
    const t = new Date(a.startsAt).getTime()
    const days = (t - now) / (24 * 60 * 60 * 1000)
    if (days < -0.5 || days > 14) continue
    items.push({
      id: `appt-${a.id}`,
      kind: 'appointment',
      urgency: days <= 1 ? 'soon' : 'upcoming',
      title: a.title || a.kind || 'Appointment',
      detail: new Date(a.startsAt).toLocaleString(),
      go: 'goAppointments',
      sort: t,
    })
  }

  for (const m of medications) {
    if (!m.isActive || !m.refillDate) continue
    const t = new Date(`${m.refillDate}T12:00:00`).getTime()
    const days = (t - now) / (24 * 60 * 60 * 1000)
    if (days < -3 || days > 21) continue
    items.push({
      id: `refill-${m.id}`,
      kind: 'refill',
      urgency: days <= 3 ? 'soon' : 'upcoming',
      title: `Refill ${m.name || 'medication'}`,
      detail: `Due ${m.refillDate}`,
      go: 'goMedications',
      sort: t,
    })
  }

  return items.sort((a, b) => a.sort - b.sort).slice(0, 8)
}
