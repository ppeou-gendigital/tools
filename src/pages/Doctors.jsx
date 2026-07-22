import { useCallback, useEffect, useId, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAuth } from '@/providers/AuthProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { createId } from '@/lib/id'
import {
  deleteDoctor,
  listDoctors,
  saveDoctor,
} from '@/lib/doctoApi'
import {
  formatAddress,
  mapsHref,
  mailtoHref,
  telHref,
  websiteHref,
} from '@/lib/contactLinks'
import styles from './SectionPage.module.scss'

export function Doctors() {
  const { user } = useAuth()
  const vault = usePatientVault()
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    const key = vault.getKey()
    if (!vault.patientId || !key) return
    const rows = await listDoctors(vault.patientId, key)
    setItems(rows)
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  return (
    <div className={styles.page}>
      <PageHeader
        title="Doctors"
        subtitle="Profiles, offices, and tap-to-call / maps links."
        actions={
          vault.canWrite ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
              className={styles.iconBtn}
              aria-label="Add doctor"
              title="Add doctor"
            >
              <Plus size={16} aria-hidden="true" />
            </Button>
          ) : null
        }
        shortcuts={
          <PageShortcuts current="doctors" className={styles.iconBtn} />
        }
      />
      <div className={styles.body}>
        {error && <p className={styles.empty}>{error}</p>}
        {showForm && vault.canWrite && (
          <DoctorForm
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
          <p className={styles.empty}>
            {vault.canWrite
              ? 'No doctors yet. Add your care team.'
              : 'No doctors yet.'}
          </p>
        ) : (
          <ul className={styles.list}>
            {items.map((d) => (
              <li key={d.id} className={styles.card}>
                <div className={styles.row}>
                  <span className={styles.cardTitle}>{d.name || 'Doctor'}</span>
                  {vault.canWrite && (
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete doctor"
                      onClick={async () => {
                        await deleteDoctor(user.id, d.id)
                        await reload()
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                {d.specialty && (
                  <span className={styles.cardMeta}>{d.specialty}</span>
                )}
                <div className={styles.links}>
                  {mailtoHref(d.email) && (
                    <a className={styles.link} href={mailtoHref(d.email)}>
                      {d.email}
                    </a>
                  )}
                  {websiteHref(d.website) && (
                    <a
                      className={styles.link}
                      href={websiteHref(d.website)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Website
                    </a>
                  )}
                </div>
                {(d.offices || []).map((o) => (
                  <div key={o.id} className={styles.office}>
                    <strong className={styles.cardMeta}>{o.label || 'Office'}</strong>
                    <div className={styles.links}>
                      {telHref(o.phone, o.phoneExt) && (
                        <a className={styles.link} href={telHref(o.phone, o.phoneExt)}>
                          {o.phone}
                          {o.phoneExt ? ` x${o.phoneExt}` : ''}
                        </a>
                      )}
                      {mapsHref(o) && (
                        <a
                          className={styles.link}
                          href={mapsHref(o)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {formatAddress(o) || 'Open in Maps'}
                        </a>
                      )}
                      {mailtoHref(o.email) && (
                        <a className={styles.link} href={mailtoHref(o.email)}>
                          {o.email}
                        </a>
                      )}
                      {websiteHref(o.website) && (
                        <a
                          className={styles.link}
                          href={websiteHref(o.website)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Office site
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function DoctorForm({ userId, patientId, getKey, onSaved, onCancel }) {
  const nameId = useId()
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [officeLabel, setOfficeLabel] = useState('Main office')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const offices = []
      if (addressLine1 || phone) {
        offices.push({
          id: createId(),
          label: officeLabel || 'Office',
          phone: phone || undefined,
          addressLine1: addressLine1 || '',
          city: city || '',
          region: region || undefined,
          postalCode: postalCode || undefined,
          country: 'US',
        })
      }
      await saveDoctor({
        userId,
        patientId,
        key: getKey(),
        payload: {
          name: name.trim(),
          specialty: specialty.trim() || undefined,
          email: email.trim() || undefined,
          website: website.trim() || undefined,
          offices,
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
        <Label htmlFor={nameId}>Doctor name</Label>
        <Input id={nameId} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className={styles.field}>
        <Label>Specialty</Label>
        <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
      </div>
      <div className={styles.field}>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className={styles.field}>
        <Label>Website</Label>
        <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="clinic.example" />
      </div>
      <p className={styles.muted}>Office (optional — add more later from edit)</p>
      <div className={styles.field}>
        <Label>Office label</Label>
        <Input value={officeLabel} onChange={(e) => setOfficeLabel(e.target.value)} />
      </div>
      <div className={styles.field}>
        <Label>Phone</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className={styles.field}>
        <Label>Street</Label>
        <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
      </div>
      <div className={styles.row}>
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input placeholder="State" value={region} onChange={(e) => setRegion(e.target.value)} />
        <Input placeholder="ZIP" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
      </div>
      {error && <p className={styles.empty}>{error}</p>}
      <div className={styles.row}>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save doctor'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
