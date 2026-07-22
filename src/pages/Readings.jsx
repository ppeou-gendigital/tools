import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAuth } from '@/providers/AuthProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { deleteReading, listReadings, saveReading } from '@/lib/doctoApi'
import styles from './SectionPage.module.scss'

export function Readings() {
  const { user } = useAuth()
  const vault = usePatientVault()
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    const key = vault.getKey()
    if (!vault.patientId || !key) return
    setItems(await listReadings(vault.patientId, key))
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  return (
    <div className={styles.page}>
      <PageHeader
        title="Readings"
        subtitle="Blood pressure, weight, height, and pulse."
        actions={
          vault.canWrite ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
              className={styles.iconBtn}
              aria-label="Add reading"
              title="Add reading"
            >
              <Plus size={16} aria-hidden="true" />
            </Button>
          ) : null
        }
        shortcuts={
          <PageShortcuts current="readings" className={styles.iconBtn} />
        }
      />
      <div className={styles.body}>
        {error && <p className={styles.empty}>{error}</p>}
        {showForm && vault.canWrite && (
          <ReadingForm
            userId={user.id}
            patientId={vault.patientId}
            getKey={vault.getKey}
            onSaved={async () => {
              setShowForm(false)
              await reload()
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
        {items.length === 0 && !showForm ? (
          <p className={styles.empty}>No readings yet.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((r) => (
              <li key={r.id} className={styles.card}>
                <div className={styles.row}>
                  <span className={styles.cardTitle}>
                    {r.measuredAt ? new Date(r.measuredAt).toLocaleString() : 'Reading'}
                  </span>
                  {vault.canWrite && (
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={async () => {
                        await deleteReading(user.id, r.id)
                        await reload()
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <span className={styles.cardMeta}>
                  {[
                    r.bloodPressure
                      ? `BP ${r.bloodPressure.systolic}/${r.bloodPressure.diastolic}`
                      : null,
                    r.pulse != null ? `Pulse ${r.pulse}` : null,
                    r.weightKg != null ? `Weight ${r.weightKg} kg` : null,
                    r.heightCm != null ? `Height ${r.heightCm} cm` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ReadingForm({ userId, patientId, getKey, onSaved, onCancel }) {
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [pulse, setPulse] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {}
      if (systolic && diastolic) {
        payload.bloodPressure = {
          systolic: Number(systolic),
          diastolic: Number(diastolic),
        }
      }
      if (pulse) payload.pulse = Number(pulse)
      if (weightKg) payload.weightKg = Number(weightKg)
      if (heightCm) payload.heightCm = Number(heightCm)
      await saveReading({
        userId,
        patientId,
        key: getKey(),
        measuredAt: new Date().toISOString(),
        payload,
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
      <div className={styles.row}>
        <div className={styles.field}>
          <Label>Systolic</Label>
          <Input inputMode="numeric" value={systolic} onChange={(e) => setSystolic(e.target.value)} />
        </div>
        <div className={styles.field}>
          <Label>Diastolic</Label>
          <Input inputMode="numeric" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} />
        </div>
      </div>
      <div className={styles.field}>
        <Label>Pulse</Label>
        <Input inputMode="numeric" value={pulse} onChange={(e) => setPulse(e.target.value)} />
      </div>
      <div className={styles.field}>
        <Label>Weight (kg)</Label>
        <Input inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
      </div>
      <div className={styles.field}>
        <Label>Height (cm)</Label>
        <Input inputMode="decimal" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
      </div>
      {error && <p className={styles.empty}>{error}</p>}
      <div className={styles.row}>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save reading'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
