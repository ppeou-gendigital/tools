import { useCallback, useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import styles from './PatientSwitcher.module.scss'

const ROLE_LABEL = {
  owner: 'Owner',
  helper: 'Can help',
  viewer: 'Can view',
}

export function PatientSwitcher() {
  const vault = usePatientVault()
  const [shared, setShared] = useState([])
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    if (!vault.isUnlocked) {
      setShared([])
      return
    }
    const rows = await vault.listShared()
    setShared(rows.filter((m) => m.role !== 'owner'))
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload, vault.patientId])

  if (!vault.isUnlocked) return null
  if (shared.length === 0 && vault.isOwner) return null

  return (
    <div className={styles.wrap}>
      <label className={styles.label} htmlFor="docto-patient-switcher">
        <Users size={14} aria-hidden="true" />
        Viewing
      </label>
      <select
        id="docto-patient-switcher"
        className={styles.select}
        disabled={busy}
        value={vault.patientId || ''}
        onChange={async (e) => {
          const id = e.target.value
          setBusy(true)
          setError(null)
          try {
            if (id === vault.ownedPatientId || (!vault.ownedPatientId && id === vault.patientId && vault.isOwner)) {
              await vault.switchToOwned()
            } else {
              const membership = shared.find((m) => m.patient_id === id)
              if (!membership) return
              await vault.openSharedPatient(membership)
            }
          } catch (err) {
            setError(err?.message ?? 'Could not switch patient')
          } finally {
            setBusy(false)
          }
        }}
      >
        {vault.ownedPatientId && (
          <option value={vault.ownedPatientId}>
            My record
            {vault.patientId === vault.ownedPatientId ? ' (current)' : ''}
          </option>
        )}
        {shared.map((m) => {
          const ready = m.wrapped_dek && m.wrapped_dek_iv === 'ecdh'
          return (
            <option key={m.id} value={m.patient_id} disabled={!ready}>
              Shared · {ROLE_LABEL[m.role] || m.role}
              {ready ? '' : ' · awaiting key'}
            </option>
          )
        })}
      </select>
      {vault.role && vault.role !== 'owner' && (
        <span className={styles.badge}>{ROLE_LABEL[vault.role]}</span>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
