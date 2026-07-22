import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { UploadPicker } from '@/molecules/UploadPicker'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAuth } from '@/providers/AuthProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import {
  deleteVisit,
  listDoctors,
  listUploads,
  listVisits,
  saveVisit,
  uploadMedia,
} from '@/lib/doctoApi'
import styles from './SectionPage.module.scss'

export function Visits() {
  const { user } = useAuth()
  const vault = usePatientVault()
  const [items, setItems] = useState([])
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [uploadFor, setUploadFor] = useState(null)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    const key = vault.getKey()
    if (!vault.patientId || !key) return
    const [visits, docs] = await Promise.all([
      listVisits(vault.patientId, key),
      listDoctors(vault.patientId, key),
    ])
    setItems(visits)
    setDoctors(docs)
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  return (
    <div className={styles.page}>
      <PageHeader
        title="Visits"
        subtitle="Past doctor visits and procedures — notes, photos, voice later."
        actions={
          vault.canWrite ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
              className={styles.iconBtn}
              aria-label="Add visit"
              title="Add visit"
            >
              <Plus size={16} aria-hidden="true" />
            </Button>
          ) : null
        }
        shortcuts={
          <PageShortcuts current="visits" className={styles.iconBtn} />
        }
      />
      <div className={styles.body}>
        {error && <p className={styles.empty}>{error}</p>}
        {showForm && vault.canWrite && (
          <VisitForm
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
          <p className={styles.empty}>No visits logged yet.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((v) => {
              const doctor = doctors.find((d) => d.id === v.doctorId)
              return (
                <li key={v.id} className={styles.card}>
                  <div className={styles.row}>
                    <span className={styles.cardTitle}>{v.title || 'Visit'}</span>
                    {vault.canWrite && (
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Delete"
                        onClick={async () => {
                          await deleteVisit(user.id, v.id)
                          await reload()
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                  <span className={styles.cardMeta}>
                    {v.visitDate}
                    {doctor ? ` · ${doctor.name}` : ''}
                    {v.kind === 'procedure' ? ' · Procedure' : ''}
                  </span>
                  {v.summary && <p className={styles.muted}>{v.summary}</p>}
                  {vault.canWrite && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUploadFor(uploadFor === v.id ? null : v.id)}
                      >
                        Add photo / file
                      </Button>
                      {uploadFor === v.id && (
                        <UploadPicker
                          onPick={async (file, source) => {
                            await uploadMedia({
                              userId: user.id,
                              patientId: vault.patientId,
                              parentType: 'visit',
                              parentId: v.id,
                              file,
                              key: vault.getKey(),
                              source,
                            })
                            const ups = await listUploads(vault.patientId, 'visit', v.id)
                            setError(`Uploaded (${ups.length} file${ups.length === 1 ? '' : 's'} on this visit)`)
                          }}
                        />
                      )}
                    </>
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

function VisitForm({ userId, patientId, getKey, doctors, onSaved, onCancel }) {
  const [title, setTitle] = useState('')
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10))
  const [kind, setKind] = useState('doctor_visit')
  const [doctorId, setDoctorId] = useState('')
  const [summary, setSummary] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await saveVisit({
        userId,
        patientId,
        key: getKey(),
        visitDate,
        kind,
        doctorId: doctorId || null,
        payload: {
          title: title.trim() || 'Visit',
          summary: summary.trim() || undefined,
          notes: { type: 'doc', content: [] },
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
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className={styles.field}>
        <Label>Date</Label>
        <Input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required />
      </div>
      <div className={styles.field}>
        <Label>Type</Label>
        <select value={kind} onChange={(e) => setKind(e.target.value)} style={{ padding: '0.5rem', borderRadius: 6 }}>
          <option value="doctor_visit">Doctor visit</option>
          <option value="procedure">Procedure</option>
        </select>
      </div>
      <div className={styles.field}>
        <Label>Doctor</Label>
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} style={{ padding: '0.5rem', borderRadius: 6 }}>
          <option value="">—</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <Label>Summary</Label>
        <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      {error && <p className={styles.empty}>{error}</p>}
      <div className={styles.row}>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save visit'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
