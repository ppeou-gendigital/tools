import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Pause, Play, Plus, Square, Trash2 } from 'lucide-react'
import { AiCareButton } from '@/molecules/AiCareButton'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAuth } from '@/providers/AuthProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import {
  deleteDose,
  deleteMedication,
  listDoctors,
  listDoses,
  listMedications,
  logDose,
  saveMedication,
} from '@/lib/doctoApi'
import {
  buildDoseSlots,
  dosesInPeriod,
  formatDoseDateTime,
  formatDoseTime,
  normalizeSchedule,
  periodBounds,
  resolveMedicationStatus,
  scheduleLabel,
} from '@/lib/medicationSchedule'
import styles from './SectionPage.module.scss'

export function Medications() {
  const { user } = useAuth()
  const vault = usePatientVault()
  const [items, setItems] = useState([])
  const [doses, setDoses] = useState([])
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    const key = vault.getKey()
    if (!vault.patientId || !key) return
    const [meds, doseRows, docs] = await Promise.all([
      listMedications(vault.patientId, key),
      listDoses(vault.patientId, key),
      listDoctors(vault.patientId, key),
    ])
    setItems(meds)
    setDoses(doseRows)
    setDoctors(docs)
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  const dosesByMed = useMemo(() => {
    const map = new Map()
    for (const d of doses) {
      const list = map.get(d.medicationId) || []
      list.push(d)
      map.set(d.medicationId, list)
    }
    return map
  }, [doses])

  const doctorName = useCallback(
    (id) => {
      if (!id) return 'OTC'
      return doctors.find((d) => d.id === id)?.name || 'Doctor'
    },
    [doctors],
  )

  return (
    <div className={styles.page}>
      <PageHeader
        title="Medications"
        subtitle="Dose slots by schedule, as-needed logs, and suspend/resume."
        actions={
          <>
            <AiCareButton className={styles.iconBtn} />
            {vault.canWrite ? (
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
            ) : null}
          </>
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
            doctors={doctors}
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
              <MedCard
                key={m.id}
                med={m}
                doses={dosesByMed.get(m.id) || []}
                doctorLabel={doctorName(m.doctorId)}
                canWrite={vault.canWrite}
                userId={user.id}
                patientId={vault.patientId}
                getKey={vault.getKey}
                onChanged={reload}
                onError={setError}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function MedCard({
  med,
  doses,
  doctorLabel,
  canWrite,
  userId,
  patientId,
  getKey,
  onChanged,
  onError,
}) {
  const status = resolveMedicationStatus(med)
  const schedule = normalizeSchedule(med.schedule)
  const [busy, setBusy] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [suspendNote, setSuspendNote] = useState('')

  const slots = useMemo(
    () => buildDoseSlots(schedule, doses),
    [schedule, doses],
  )

  const recentPrn = useMemo(() => {
    if (schedule.frequency !== 'as_needed') return []
    return [...doses]
      .sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))
      .slice(0, 5)
  }, [schedule.frequency, doses])

  async function toggleSlot(slot) {
    if (!canWrite || busy || status !== 'active') return
    setBusy(true)
    onError?.(null)
    try {
      if (slot.dose) {
        await deleteDose(userId, slot.dose.id)
      } else {
        await logDose({
          userId,
          patientId,
          medicationId: med.id,
          key: getKey(),
        })
      }
      await onChanged()
    } catch (e) {
      onError?.(e?.message ?? 'Could not update dose')
    } finally {
      setBusy(false)
    }
  }

  async function logPrn() {
    if (!canWrite || busy || status !== 'active') return
    setBusy(true)
    onError?.(null)
    try {
      await logDose({
        userId,
        patientId,
        medicationId: med.id,
        key: getKey(),
      })
      await onChanged()
    } catch (e) {
      onError?.(e?.message ?? 'Could not log dose')
    } finally {
      setBusy(false)
    }
  }

  async function undoDose(doseId) {
    if (!canWrite || busy) return
    setBusy(true)
    onError?.(null)
    try {
      await deleteDose(userId, doseId)
      await onChanged()
    } catch (e) {
      onError?.(e?.message ?? 'Could not remove dose')
    } finally {
      setBusy(false)
    }
  }

  async function persistStatus(nextStatus, note) {
    if (!canWrite || busy) return
    setBusy(true)
    onError?.(null)
    try {
      const key = getKey()
      await saveMedication({
        userId,
        patientId,
        key,
        id: med.id,
        isActive: nextStatus === 'active',
        refillDate: med.refillDate || null,
        payload: {
          name: med.name,
          strength: med.strength,
          doctorId: med.doctorId || undefined,
          schedule: med.schedule,
          refill: med.refill,
          status: nextStatus,
          suspension:
            nextStatus === 'suspended'
              ? {
                  note: note?.trim() || 'Suspended',
                  suspendedAt: new Date().toISOString(),
                }
              : null,
        },
      })
      setSuspendOpen(false)
      setSuspendNote('')
      await onChanged()
    } catch (e) {
      onError?.(e?.message ?? 'Could not update medication')
    } finally {
      setBusy(false)
    }
  }

  const period = periodBounds(schedule.frequency === 'as_needed' ? 'daily' : schedule.frequency)
  const takenCount =
    schedule.frequency === 'as_needed'
      ? dosesInPeriod(doses, period).length
      : slots.filter((s) => s.dose).length

  return (
    <li className={styles.card}>
      <div className={styles.row}>
        <span className={styles.cardTitle}>
          {med.name || 'Medication'}
          {med.strength ? ` · ${med.strength}` : ''}
        </span>
        {canWrite && (
          <Button
            size="sm"
            variant="ghost"
            aria-label="Delete"
            disabled={busy}
            onClick={async () => {
              await deleteMedication(userId, med.id)
              await onChanged()
            }}
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>

      <span className={styles.cardMeta}>
        {status === 'active' && 'Active'}
        {status === 'suspended' && 'Suspended'}
        {status === 'stopped' && 'Stopped'}
        {` · ${scheduleLabel(schedule)}`}
        {` · ${doctorLabel}`}
        {med.refillDate ? ` · Refill ${med.refillDate}` : ''}
        {status === 'active' && schedule.frequency !== 'as_needed'
          ? ` · ${takenCount}/${slots.length} ${period.label}`
          : null}
      </span>

      {status === 'suspended' && med.suspension?.note && (
        <p className={styles.suspendNote}>{med.suspension.note}</p>
      )}

      {schedule.instructions && (
        <span className={styles.muted}>{schedule.instructions}</span>
      )}

      {status === 'active' && schedule.frequency !== 'as_needed' && (
        <div className={styles.doseSlots} role="group" aria-label="Dose slots">
          {slots.map((slot) => {
            const filled = Boolean(slot.dose)
            const label = filled
              ? formatDoseTime(slot.dose.takenAt)
              : slot.label || `Dose ${slot.index + 1}`
            return (
              <button
                key={slot.index}
                type="button"
                className={filled ? styles.doseSlotFilled : styles.doseSlot}
                disabled={!canWrite || busy}
                aria-pressed={filled}
                aria-label={
                  filled
                    ? `Taken at ${label}. Tap to undo.`
                    : `Mark dose ${slot.index + 1} taken${slot.label ? ` (${slot.label})` : ''}`
                }
                title={filled ? 'Tap to undo' : 'Tap when taken'}
                onClick={() => toggleSlot(slot)}
              >
                {filled ? <Check size={14} aria-hidden="true" /> : null}
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      )}

      {status === 'active' && schedule.frequency === 'as_needed' && (
        <div className={styles.prnBlock}>
          {canWrite && (
            <Button size="sm" variant="outline" disabled={busy} onClick={logPrn}>
              <Check size={14} />
              Log dose
            </Button>
          )}
          {recentPrn.length > 0 && (
            <ul className={styles.prnList}>
              {recentPrn.map((d) => (
                <li key={d.id} className={styles.prnItem}>
                  <span>{formatDoseDateTime(d.takenAt)}</span>
                  {canWrite && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      aria-label="Undo dose"
                      onClick={() => undoDose(d.id)}
                    >
                      Undo
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {canWrite && status === 'active' && !suspendOpen && (
        <div className={styles.row}>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => setSuspendOpen(true)}
          >
            <Pause size={14} />
            Suspend
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => persistStatus('stopped')}
          >
            <Square size={14} />
            Stop
          </Button>
        </div>
      )}

      {canWrite && suspendOpen && (
        <div className={styles.suspendForm}>
          <Label>Why suspend?</Label>
          <Input
            value={suspendNote}
            onChange={(e) => setSuspendNote(e.target.value)}
            placeholder="Side effect, drug conflict, doctor advice…"
            required
          />
          <div className={styles.row}>
            <Button
              size="sm"
              disabled={busy || !suspendNote.trim()}
              onClick={() => persistStatus('suspended', suspendNote)}
            >
              Confirm suspend
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setSuspendOpen(false)
                setSuspendNote('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {canWrite && status === 'suspended' && (
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => persistStatus('active')}
        >
          <Play size={14} />
          Resume
        </Button>
      )}

      {canWrite && status === 'stopped' && (
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => persistStatus('active')}
        >
          <Play size={14} />
          Restart
        </Button>
      )}
    </li>
  )
}

function MedForm({ userId, patientId, getKey, doctors, onSaved, onCancel }) {
  const [name, setName] = useState('')
  const [strength, setStrength] = useState('')
  const [refillDate, setRefillDate] = useState('')
  const [instructions, setInstructions] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [timesPerPeriod, setTimesPerPeriod] = useState(1)
  const [doctorId, setDoctorId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const schedule = normalizeSchedule({
        frequency,
        timesPerPeriod: frequency === 'as_needed' ? 0 : timesPerPeriod,
        instructions: instructions.trim() || undefined,
      })
      await saveMedication({
        userId,
        patientId,
        key: getKey(),
        isActive: true,
        refillDate: refillDate || null,
        payload: {
          name: name.trim(),
          strength: strength.trim() || undefined,
          doctorId: doctorId || undefined,
          status: 'active',
          suspension: null,
          schedule,
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
        <Input
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
          placeholder="10 mg"
        />
      </div>
      <div className={styles.field}>
        <Label>Prescribed by</Label>
        <select
          className={styles.select}
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        >
          <option value="">Over the counter / none</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name || 'Doctor'}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <Label>Frequency</Label>
        <select
          className={styles.select}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="as_needed">As needed</option>
        </select>
      </div>
      {frequency !== 'as_needed' && (
        <div className={styles.field}>
          <Label>
            Times per{' '}
            {frequency === 'daily' ? 'day' : frequency === 'weekly' ? 'week' : 'month'}
          </Label>
          <Input
            type="number"
            min={1}
            max={12}
            value={timesPerPeriod}
            onChange={(e) => setTimesPerPeriod(Number(e.target.value) || 1)}
          />
        </div>
      )}
      <div className={styles.field}>
        <Label>Refill date</Label>
        <Input
          type="date"
          value={refillDate}
          onChange={(e) => setRefillDate(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <Label>Instructions</Label>
        <Input
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      {error && <p className={styles.empty}>{error}</p>}
      <div className={styles.row}>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
