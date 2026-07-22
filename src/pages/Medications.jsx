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
  deleteMedication,
  listMedications,
  logDose,
  saveMedication,
} from '@/lib/doctoApi'
import styles from './SectionPage.module.scss'

export function Medications() {
  const { user } = useAuth()
  const vault = usePatientVault()
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    const key = vault.getKey()
    if (!vault.patientId || !key) return
    setItems(await listMedications(vault.patientId, key))
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  return (
    <div className={styles.page}>
      <PageHeader
        title="Medications"
        subtitle="Current meds, refill dates, and dose log."
        actions={
          vault.canWrite ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
              className={styles.iconBtn}
              aria-label="Add medication"
              title="Add medication"
            >
              <Plus size={16} aria-hidden="true" />
            </Button>
          ) : null
        }
        shortcuts={
          <PageShortcuts current="medications" className={styles.iconBtn} />
        }
      />
      <div className={styles.body}>
        {error && <p className={styles.empty}>{error}</p>}
        {showForm && vault.canWrite && (
          <MedForm
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
          <p className={styles.empty}>No medications yet.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((m) => (
              <li key={m.id} className={styles.card}>
                <div className={styles.row}>
                  <span className={styles.cardTitle}>
                    {m.name || 'Medication'}
                    {m.strength ? ` · ${m.strength}` : ''}
                  </span>
                  {vault.canWrite && (
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={async () => {
                        await deleteMedication(user.id, m.id)
                        await reload()
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <span className={styles.cardMeta}>
                  {m.isActive ? 'Active' : 'Inactive'}
                  {m.refillDate ? ` · Refill ${m.refillDate}` : ''}
                </span>
                {vault.canWrite && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await logDose({
                        userId: user.id,
                        patientId: vault.patientId,
                        medicationId: m.id,
                        key: vault.getKey(),
                      })
                      setError('Dose logged')
                    }}
                  >
                    <Check size={14} />
                    I took this
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function MedForm({ userId, patientId, getKey, onSaved, onCancel }) {
  const [name, setName] = useState('')
  const [strength, setStrength] = useState('')
  const [refillDate, setRefillDate] = useState('')
  const [instructions, setInstructions] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await saveMedication({
        userId,
        patientId,
        key: getKey(),
        isActive: true,
        refillDate: refillDate || null,
        payload: {
          name: name.trim(),
          strength: strength.trim() || undefined,
          schedule: {
            timesPerDay: 1,
            times: ['08:00'],
            instructions: instructions.trim() || undefined,
          },
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
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className={styles.field}>
        <Label>Strength</Label>
        <Input value={strength} onChange={(e) => setStrength(e.target.value)} placeholder="10 mg" />
      </div>
      <div className={styles.field}>
        <Label>Refill date</Label>
        <Input type="date" value={refillDate} onChange={(e) => setRefillDate(e.target.value)} />
      </div>
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
