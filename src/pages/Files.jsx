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
  deleteFile,
  listFiles,
  listUploads,
  saveFile,
  uploadMedia,
} from '@/lib/doctoApi'
import styles from './SectionPage.module.scss'

const CATEGORIES = [
  { value: 'insurance', label: 'Insurance' },
  { value: 'lab', label: 'Lab' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'other', label: 'Other' },
]

export function Files() {
  const { user } = useAuth()
  const vault = usePatientVault()
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [uploadFor, setUploadFor] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    const key = vault.getKey()
    if (!vault.patientId || !key) return
    setItems(await listFiles(vault.patientId, key))
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  return (
    <div className={styles.page}>
      <PageHeader
        title="Files"
        subtitle="Insurance cards and other paperwork. Use the camera for card photos."
        actions={
          vault.canWrite ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
              className={styles.iconBtn}
              aria-label="Add file"
              title="Add file"
            >
              <Plus size={16} aria-hidden="true" />
            </Button>
          ) : null
        }
        shortcuts={
          <PageShortcuts current="files" className={styles.iconBtn} />
        }
      />
      <div className={styles.body}>
        {(error || message) && (
          <p className={styles.empty}>{error || message}</p>
        )}
        {showForm && vault.canWrite && (
          <FileForm
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
          <p className={styles.empty}>No files yet.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((f) => (
              <li key={f.id} className={styles.card}>
                <div className={styles.row}>
                  <span className={styles.cardTitle}>{f.title || 'File'}</span>
                  {vault.canWrite && (
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={async () => {
                        await deleteFile(user.id, f.id)
                        await reload()
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <span className={styles.cardMeta}>
                  {CATEGORIES.find((c) => c.value === f.category)?.label || f.category}
                  {f.insuranceCompany ? ` · ${f.insuranceCompany}` : ''}
                </span>
                {vault.canWrite && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setUploadFor(uploadFor === f.id ? null : f.id)}
                    >
                      Add photo / PDF
                    </Button>
                    {uploadFor === f.id && (
                      <UploadPicker
                        onPick={async (file, source) => {
                          await uploadMedia({
                            userId: user.id,
                            patientId: vault.patientId,
                            parentType: 'file',
                            parentId: f.id,
                            file,
                            key: vault.getKey(),
                            source,
                          })
                          const ups = await listUploads(vault.patientId, 'file', f.id)
                          setMessage(`${ups.length} upload(s) on this file`)
                          setError(null)
                        }}
                      />
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function FileForm({ userId, patientId, getKey, onSaved, onCancel }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('insurance')
  const [insuranceCompany, setInsuranceCompany] = useState('')
  const [memberId, setMemberId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await saveFile({
        userId,
        patientId,
        key: getKey(),
        category,
        payload: {
          title: title.trim() || (category === 'insurance' ? 'Insurance card' : 'File'),
          insuranceCompany: insuranceCompany.trim() || undefined,
          memberId: memberId.trim() || undefined,
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
        <Label>Category</Label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.5rem', borderRadius: 6 }}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      {category === 'insurance' && (
        <>
          <div className={styles.field}>
            <Label>Insurance company</Label>
            <Input value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} />
          </div>
          <div className={styles.field}>
            <Label>Member ID</Label>
            <Input value={memberId} onChange={(e) => setMemberId(e.target.value)} />
          </div>
        </>
      )}
      {error && <p className={styles.empty}>{error}</p>}
      <div className={styles.row}>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
