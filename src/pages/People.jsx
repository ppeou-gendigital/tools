import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { PageHeader } from '@/patterns/PageHeader'
import {
  deletePerson,
  listMyPeople,
  upsertPerson,
} from '@/lib/viaggioApi'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function People() {
  const { goBack, previousRouteLabel } = useNavigation()
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data: people = [], isLoading } = useQuery({
    queryKey: ['viaggio', 'my-people'],
    queryFn: listMyPeople,
  })

  const saveMut = useMutation({
    mutationFn: () =>
      upsertPerson({
        id: editId,
        displayName: name,
        email: email || null,
        phoneE164: phone || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'my-people'] })
      setName('')
      setEmail('')
      setPhone('')
      setEditId(null)
      setError('')
    },
    onError: (err) => setError(err.message || 'Save failed'),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => deletePerson(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'my-people'] })
    },
    onError: (err) => setError(err.message || 'Delete failed'),
  })

  function startEdit(p) {
    setEditId(p.id)
    setName(p.displayName || '')
    setEmail(p.email || '')
    setPhone(p.phoneE164 || '')
    setError('')
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="People"
        subtitle="Reusable travelers for your journeys"
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={cx(styles.form, styles.formNarrow)}>
          <p className={styles.sectionTitle}>
            {editId ? 'Edit person' : 'Add person'}
          </p>
          <div className={styles.formGrid}>
            <div className={cx(styles.field, styles.formSpan2)}>
              <Label htmlFor="person-name">Name</Label>
              <Input
                id="person-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display name"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="person-email">Email (optional)</Label>
              <Input
                id="person-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="person-phone">Phone (optional)</Label>
              <Input
                id="person-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 555 5555"
              />
            </div>
          </div>
          <div className={styles.actions}>
            <Button
              onClick={() => saveMut.mutate()}
              disabled={!name.trim() || saveMut.isPending}
            >
              {saveMut.isPending ? 'Saving…' : editId ? 'Update' : 'Add'}
            </Button>
            {editId && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditId(null)
                  setName('')
                  setEmail('')
                  setPhone('')
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        <p className={styles.sectionTitle}>Your library</p>
        {isLoading && <LoadingState>Loading people…</LoadingState>}
        {!isLoading && people.length === 0 && (
          <div className={styles.empty}>
            <p>No people yet. Add someone above to reuse them on trips.</p>
          </div>
        )}
        <ul className={styles.list}>
          {people.map((p) => (
            <li key={p.id} className={styles.block}>
              <div className={styles.rowBody}>
                <span className={styles.rowTitle}>{p.displayName}</span>
                <span className={styles.rowMeta}>
                  {[p.email, p.phoneE164, p.linkedUserId ? 'Has account' : null]
                    .filter(Boolean)
                    .join(' · ') || 'Guest contact'}
                </span>
              </div>
              <div className={styles.actions}>
                <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                  Edit
                </Button>
                {(!p.linkedUserId || p.linkedUserId !== p.ownerId) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDelete(p)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        onDismiss={() => setConfirmDelete(null)}
        title="Remove from library?"
        message={
          confirmDelete
            ? `Remove ${confirmDelete.displayName}? They stay on journeys where already added.`
            : undefined
        }
        confirmLabel="Remove"
        confirming={deleteMut.isPending}
        onConfirm={() => {
          if (!confirmDelete) return
          deleteMut.mutate(confirmDelete.id, {
            onSettled: () => setConfirmDelete(null),
          })
        }}
      />
    </div>
  )
}
