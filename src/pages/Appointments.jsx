import { useCallback, useEffect, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAuth } from '@/providers/AuthProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import {
  deleteAppointment,
  listAppointments,
  listDoctors,
  saveAppointment,
  saveVisit,
} from '@/lib/doctoApi'
import styles from './SectionPage.module.scss'

const KINDS = [
  { value: 'checkup', label: 'Checkup' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'blood_draw', label: 'Blood draw' },
  { value: 'xray', label: 'X-ray' },
  { value: 'mri', label: 'MRI' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'lab', label: 'Lab' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'other', label: 'Other' },
]

export function Appointments() {
  const { user } = useAuth()
  const vault = usePatientVault()
  const [items, setItems] = useState([])
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    const key = vault.getKey()
    if (!vault.patientId || !key) return
    const [appts, docs] = await Promise.all([
      listAppointments(vault.patientId, key),
      listDoctors(vault.patientId, key),
    ])
    setItems(appts)
    setDoctors(docs)
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  async function markDone(appt) {
    if (!vault.canWrite) return
    const key = vault.getKey()
    const visitDate = (appt.startsAt || '').slice(0, 10) || new Date().toISOString().slice(0, 10)
    const visit = await saveVisit({
      userId: user.id,
      patientId: vault.patientId,
      key,
      visitDate,
      kind: appt.kind === 'checkup' || appt.kind === 'follow_up' ? 'doctor_visit' : 'procedure',
      doctorId: appt.doctorId,
      payload: {
        title: appt.title || KINDS.find((k) => k.value === appt.kind)?.label || 'Visit',
        officeId: appt.officeId,
        appointmentId: appt.id,
        notes: appt.notes || { type: 'doc', content: [] },
        instructions: appt.instructions,
      },
    })
    await saveAppointment({
      userId: user.id,
      patientId: vault.patientId,
      key,
      id: appt.id,
      startsAt: appt.startsAt,
      status: 'done',
      kind: appt.kind,
      doctorId: appt.doctorId,
      visitId: visit.id,
      payload: {
        title: appt.title,
        officeId: appt.officeId,
        instructions: appt.instructions,
        notes: appt.notes,
      },
    })
    await reload()
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Appointments"
        subtitle="Upcoming checkups, blood draws, imaging, and more."
        actions={
          vault.canWrite ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
              className={styles.iconBtn}
              aria-label="Add appointment"
              title="Add appointment"
            >
              <Plus size={16} aria-hidden="true" />
            </Button>
          ) : null
        }
        shortcuts={
          <PageShortcuts current="appointments" className={styles.iconBtn} />
        }
      />
      <div className={styles.body}>
        {error && <p className={styles.empty}>{error}</p>}
        {showForm && vault.canWrite && (
          <AppointmentForm
            userId={user.id}
            patientId={vault.patientId}
            getKey={vault.getKey}
            doctors={doctors}
            onSaved={async () => {
              setShowForm(false)
              await reload()
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
        {items.length === 0 && !showForm ? (
          <p className={styles.empty}>No appointments scheduled.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((a) => {
              const doctor = doctors.find((d) => d.id === a.doctorId)
              return (
                <li key={a.id} className={styles.card}>
                  <div className={styles.row}>
                    <span className={styles.cardTitle}>
                      {a.title || KINDS.find((k) => k.value === a.kind)?.label}
                    </span>
                    <span className={styles.cardMeta}>{a.status}</span>
                  </div>
                  <span className={styles.cardMeta}>
                    {a.startsAt ? new Date(a.startsAt).toLocaleString() : '—'}
                    {doctor ? ` · ${doctor.name}` : ''}
                  </span>
                  {vault.canWrite && (
                    <div className={styles.row}>
                      {a.status === 'scheduled' && (
                        <Button size="sm" variant="outline" onClick={() => markDone(a)}>
                          <Check size={14} />
                          Mark done
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Delete"
                        onClick={async () => {
                          await deleteAppointment(user.id, a.id)
                          await reload()
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function AppointmentForm({ userId, patientId, getKey, doctors, onSaved, onCancel }) {
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState('blood_draw')
  const [startsAt, setStartsAt] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [officeId, setOfficeId] = useState('')
  const [instructions, setInstructions] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const selected = doctors.find((d) => d.id === doctorId)
  const offices = selected?.offices || []

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const iso = startsAt ? new Date(startsAt).toISOString() : new Date().toISOString()
      await saveAppointment({
        userId,
        patientId,
        key: getKey(),
        startsAt: iso,
        status: 'scheduled',
        kind,
        doctorId: doctorId || null,
        payload: {
          title: title.trim() || KINDS.find((k) => k.value === kind)?.label,
          officeId: officeId || undefined,
          instructions: instructions.trim() || undefined,
        },
      })
      onSaved?.()
    } catch (err) {
      setError(err?.message ?? 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <Label>Type</Label>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 6 }}
        >
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Fasting blood draw" />
      </div>
      <div className={styles.field}>
        <Label>When</Label>
        <Input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <Label>Doctor</Label>
        <select
          value={doctorId}
          onChange={(e) => {
            setDoctorId(e.target.value)
            setOfficeId('')
          }}
          style={{ padding: '0.5rem', borderRadius: 6 }}
        >
          <option value="">—</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      {offices.length > 0 && (
        <div className={styles.field}>
          <Label>Office</Label>
          <select
            value={officeId}
            onChange={(e) => setOfficeId(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 6 }}
          >
            <option value="">—</option>
            {offices.map((o) => (
              <option key={o.id} value={o.id}>{o.label || 'Office'}</option>
            ))}
          </select>
        </div>
      )}
      <div className={styles.field}>
        <Label>Instructions</Label>
        <Input value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </div>
      {error && <p className={styles.empty}>{error}</p>}
      <div className={styles.row}>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
