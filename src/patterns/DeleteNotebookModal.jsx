import { useMemo, useState } from 'react'
import { Modal } from '@/patterns/Modal'
import { Button } from '@/molecules/Button'
import { Label } from '@/molecules/Label'
import { classifyNotebookNotes } from '@/lib/workspaceModel'
import styles from './DeleteNotebookModal.module.scss'

export function DeleteNotebookModal({
  open,
  notebook,
  workspace,
  notebooks,
  onDismiss,
  onConfirm,
}) {
  const classification = useMemo(() => {
    if (!open || !notebook || !workspace) {
      return {
        exclusiveCount: 0,
        sharedCount: 0,
        totalCount: 0,
      }
    }
    return classifyNotebookNotes(workspace, notebook.id)
  }, [open, notebook, workspace])

  const targets = useMemo(
    () => (notebooks ?? []).filter((nb) => nb.id !== notebook?.id),
    [notebooks, notebook],
  )

  const needsDisposition = classification.exclusiveCount > 0

  if (!notebook) return null

  return (
    <Modal
      open={open}
      onDismiss={onDismiss}
      title={`Delete “${notebook.name}”`}
    >
      <DeleteNotebookForm
        key={notebook.id}
        classification={classification}
        needsDisposition={needsDisposition}
        targets={targets}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
      />
    </Modal>
  )
}

function DeleteNotebookForm({
  classification,
  needsDisposition,
  targets,
  onDismiss,
  onConfirm,
}) {
  const [disposition, setDisposition] = useState('delete')
  const [transferToId, setTransferToId] = useState(targets[0]?.id ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  async function handleConfirm() {
    if (pending) return
    setPending(true)
    setError(null)
    try {
      if (!needsDisposition) {
        await onConfirm({ disposition: 'delete' })
      } else if (disposition === 'transfer') {
        await onConfirm({ disposition: 'transfer', transferToId })
      } else {
        await onConfirm({ disposition: 'delete' })
      }
    } catch (err) {
      setError(err?.message ?? String(err))
      setPending(false)
    }
  }

  const canSubmit =
    !needsDisposition ||
    disposition === 'delete' ||
    (disposition === 'transfer' && Boolean(transferToId))

  return (
    <div className={styles.body}>
      <p className={styles.summary}>
        {classification.totalCount === 0
          ? 'This notebook has no notes.'
          : [
              classification.exclusiveCount > 0
                ? `${classification.exclusiveCount} note${
                    classification.exclusiveCount === 1 ? '' : 's'
                  } only in this notebook`
                : null,
              classification.sharedCount > 0
                ? `${classification.sharedCount} note${
                    classification.sharedCount === 1 ? '' : 's'
                  } also in other notebooks (kept)`
                : null,
            ]
              .filter(Boolean)
              .join('. ') + '.'}
      </p>

      {needsDisposition ? (
        <fieldset className={styles.options} disabled={pending}>
          <legend className={styles.legend}>
            What should happen to notes only in this notebook?
          </legend>
          <label className={styles.option}>
            <input
              type="radio"
              name="notebook-delete-disposition"
              value="delete"
              checked={disposition === 'delete'}
              onChange={() => setDisposition('delete')}
            />
            <span>Delete those notes</span>
          </label>
          <label className={styles.option}>
            <input
              type="radio"
              name="notebook-delete-disposition"
              value="transfer"
              checked={disposition === 'transfer'}
              onChange={() => setDisposition('transfer')}
              disabled={targets.length === 0}
            />
            <span>Transfer those notes to another notebook</span>
          </label>
          {disposition === 'transfer' && (
            <div className={styles.transferField}>
              <Label htmlFor="transfer-notebook">Target notebook</Label>
              <select
                id="transfer-notebook"
                className={styles.select}
                value={transferToId}
                onChange={(e) => setTransferToId(e.target.value)}
                disabled={pending || targets.length === 0}
              >
                {targets.map((nb) => (
                  <option key={nb.id} value={nb.id}>
                    {nb.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </fieldset>
      ) : classification.sharedCount > 0 ? (
        <p className={styles.hint}>
          Notes that also belong to other notebooks will stay; only this
          notebook membership is removed.
        </p>
      ) : null}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onDismiss} disabled={pending}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={pending || !canSubmit}
        >
          {pending ? 'Deleting…' : 'Delete notebook'}
        </Button>
      </div>
    </div>
  )
}
