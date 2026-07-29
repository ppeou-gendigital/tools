import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Download,
  Loader2,
  Save,
  Trash2,
} from 'lucide-react'
import { ActivityLinkChips } from '@/molecules/ActivityLinkChips'
import { Button } from '@/molecules/Button'
import { ExpenseLinkChips } from '@/molecules/ExpenseLinkChips'
import { LoadingState } from '@/molecules/LoadingState'
import { ReceiptField } from '@/molecules/ReceiptField'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { PageHeader } from '@/patterns/PageHeader'
import {
  deleteAttachment,
  downloadAttachment,
  getAttachment,
  MAX_ATTACHMENT_BYTES,
  setAttachmentLinks,
  uploadAttachment,
} from '@/lib/attachmentsApi'
import {
  getJourney,
  listEntries,
  listExpensesForJourney,
  myMembership,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function AttachmentEdit() {
  const { params, goBack, previousRouteLabel, goHome } = useNavigation()
  const { journeyId, attachmentId, entryId, expenseId } = params
  const { user } = useAuth()
  const { displayLocale } = useDisplayPrefs()

  const { data: journey, isLoading: journeyLoading } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: membership } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const { data: existing, isLoading: attachmentLoading } = useQuery({
    queryKey: ['viaggio', 'attachment', attachmentId],
    queryFn: () => getAttachment(attachmentId),
    enabled: !!attachmentId,
  })

  const stillLoading =
    journeyLoading || (!!attachmentId && attachmentLoading)
  const missing =
    !stillLoading &&
    (!journey || !user || (attachmentId && !existing))
  const ready =
    !!journeyId &&
    !!journey &&
    !!user &&
    !journeyLoading &&
    (!attachmentId || (!attachmentLoading && existing))

  if (!journeyId) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing attachment context.</p>
        </div>
      </div>
    )
  }

  if (stillLoading || (!ready && !missing)) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Attachment"
          leading={
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft size={14} />
              {previousRouteLabel ?? 'Back'}
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading attachment…</LoadingState>
        </div>
      </div>
    )
  }

  if (missing || !ready) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Attachment"
          leading={
            <Button variant="ghost" size="sm" onClick={goHome}>
              <ArrowLeft size={14} />
              Home
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>
            {!journey || (attachmentId && !existing)
              ? 'This attachment was not found, or you no longer have access.'
              : 'Could not load attachment details.'}
          </p>
          <Button onClick={goHome} fullWidth>
            Back to journeys
          </Button>
        </div>
      </div>
    )
  }

  return (
    <AttachmentEditForm
      key={attachmentId || `new-${entryId || 'x'}-${expenseId || 'x'}`}
      journey={journey}
      existing={existing || null}
      attachmentId={attachmentId || null}
      entryId={entryId || null}
      expenseId={expenseId || null}
      membership={membership}
      user={user}
      displayLocale={displayLocale}
      goBack={goBack}
      previousRouteLabel={previousRouteLabel}
    />
  )
}

function initialEntryIds(existing, routeEntryId) {
  if (existing?.entryIds?.length) return existing.entryIds
  if (existing?.entryId) return [existing.entryId]
  return routeEntryId ? [routeEntryId] : []
}

function initialExpenseIds(existing, routeExpenseId) {
  if (existing?.expenseIds?.length) return existing.expenseIds
  if (existing?.expenseId) return [existing.expenseId]
  return routeExpenseId ? [routeExpenseId] : []
}

function AttachmentEditForm({
  journey,
  existing,
  attachmentId,
  entryId,
  expenseId,
  membership,
  user,
  displayLocale,
  goBack,
  previousRouteLabel,
}) {
  const qc = useQueryClient()
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [pendingFiles, setPendingFiles] = useState([])
  const [downloadBusy, setDownloadBusy] = useState(false)
  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'

  const [linkedEntryIds, setLinkedEntryIds] = useState(
    () => new Set(initialEntryIds(existing, entryId)),
  )
  const [linkedExpenseIds, setLinkedExpenseIds] = useState(
    () => new Set(initialExpenseIds(existing, expenseId)),
  )

  const { data: journeyEntries = [] } = useQuery({
    queryKey: ['viaggio', 'entries', journey.id],
    queryFn: () => listEntries(journey.id),
    enabled: !!journey.id,
  })

  const { data: journeyExpenses = [] } = useQuery({
    queryKey: ['viaggio', 'expenses', journey.id],
    queryFn: () => listExpensesForJourney(journey.id),
    enabled: !!journey.id,
  })

  function invalidateAttachmentQueries() {
    qc.invalidateQueries({ queryKey: ['viaggio', 'attachment'] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'attachments', journey.id] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'entry-attachments'] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'expense-receipts'] })
  }

  function toggleEntryLink(id) {
    setLinkedEntryIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleExpenseLink(id) {
    setLinkedExpenseIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const canSave = attachmentId
    ? true
    : pendingFiles.length > 0

  const saveMut = useMutation({
    mutationFn: async () => {
      const entryIds = [...linkedEntryIds]
      const expenseIds = [...linkedExpenseIds]
      if (attachmentId) {
        await setAttachmentLinks(attachmentId, { entryIds, expenseIds })
        return { ids: [attachmentId] }
      }
      if (!pendingFiles.length) {
        throw new Error('Add a file to upload.')
      }
      const ids = []
      for (const file of pendingFiles) {
        if ((file.size ?? 0) > MAX_ATTACHMENT_BYTES) {
          throw new Error(
            `“${file.name || 'File'}” is too large (max ${Math.round(MAX_ATTACHMENT_BYTES / (1024 * 1024))} MB).`,
          )
        }
        const saved = await uploadAttachment({
          journeyId: journey.id,
          userId: user.id,
          file,
          entryIds,
          expenseIds,
        })
        ids.push(saved.id)
      }
      return { ids }
    },
    onSuccess: () => {
      invalidateAttachmentQueries()
      goBack()
    },
    onError: (err) => setError(err.message || 'Save failed'),
  })

  const deleteMut = useMutation({
    mutationFn: () => deleteAttachment(existing),
    onSuccess: () => {
      invalidateAttachmentQueries()
      goBack()
    },
    onError: (err) => setError(err.message || 'Delete failed'),
  })

  async function handleDownload() {
    if (!existing) return
    setError('')
    setDownloadBusy(true)
    try {
      const blob = await downloadAttachment(existing)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = existing.fileName || 'attachment'
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message || 'Could not download file.')
    } finally {
      setDownloadBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={attachmentId ? 'Edit attachment' : 'Add attachment'}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          canEdit ? (
            <div className={styles.toolbar}>
              {attachmentId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.iconBtn}
                  disabled={downloadBusy}
                  onClick={handleDownload}
                  aria-label="Download"
                  title="Download"
                >
                  {downloadBusy ? (
                    <Loader2 size={14} className={styles.spin} />
                  ) : (
                    <Download size={14} aria-hidden="true" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                disabled={!canSave || saveMut.isPending}
                onClick={() => {
                  setError('')
                  saveMut.mutate()
                }}
                aria-label={saveMut.isPending ? 'Saving…' : 'Save attachment'}
                title={saveMut.isPending ? 'Saving…' : 'Save attachment'}
              >
                {saveMut.isPending ? (
                  <Loader2 size={14} className={styles.spin} />
                ) : (
                  <Save size={14} aria-hidden="true" />
                )}
              </Button>
              {attachmentId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.iconBtn}
                  disabled={deleteMut.isPending}
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Delete attachment"
                  title="Delete"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </Button>
              )}
            </div>
          ) : attachmentId ? (
            <Button
              variant="ghost"
              size="sm"
              className={styles.iconBtn}
              disabled={downloadBusy}
              onClick={handleDownload}
              aria-label="Download"
              title="Download"
            >
              {downloadBusy ? (
                <Loader2 size={14} className={styles.spin} />
              ) : (
                <Download size={14} aria-hidden="true" />
              )}
            </Button>
          ) : null
        }
      />

      <div className={cx('is-fluid-width', styles.body)}>
        {!canEdit && (
          <p className={styles.readOnlyBanner}>
            You can view this attachment. Only editors can change it.
          </p>
        )}
        <div className={cx(styles.form, styles.formNarrow, styles.formGrid)}>
          <div className={cx(styles.field, styles.formSpan2)}>
            {attachmentId && existing ? (
              <ReceiptField
                label="File"
                attachments={[existing]}
                readOnly
                emptyReadOnlyHint="No file."
                onOpenAttachment={() => handleDownload()}
              />
            ) : (
              <ReceiptField
                label="File"
                pendingFiles={pendingFiles}
                attachments={[]}
                readOnly={!canEdit}
                busy={saveMut.isPending}
                emptyHint="Add a photo or PDF."
                emptyReadOnlyHint="No file."
                onAddFiles={(files) =>
                  setPendingFiles((prev) => [...prev, ...files])
                }
                onRemovePending={(idx) =>
                  setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            )}
          </div>

          <div className={cx(styles.field, styles.formSpan2)}>
            <p className={styles.sectionTitle}>Activities</p>
            <p className={styles.hint}>
              Optional. Link to one or more activities. None + no expenses →
              journey attachment.
            </p>
            <ActivityLinkChips
              entries={journeyEntries}
              selected={linkedEntryIds}
              onToggle={toggleEntryLink}
              showPrimary={false}
              emptySelectedHint="No activities linked."
              readOnly={!canEdit}
              displayLocale={displayLocale}
            />
          </div>

          <div className={cx(styles.field, styles.formSpan2)}>
            <p className={styles.sectionTitle}>Expenses</p>
            <p className={styles.hint}>
              Optional. Link to one or more expenses.
            </p>
            <ExpenseLinkChips
              expenses={journeyExpenses}
              selected={linkedExpenseIds}
              onToggle={toggleExpenseLink}
              readOnly={!canEdit}
              displayLocale={displayLocale}
            />
          </div>

          {!linkedEntryIds.size && !linkedExpenseIds.size && (
            <p className={cx(styles.hint, styles.formSpan2)}>
              No activities or expenses linked — this file belongs to the
              journey.
            </p>
          )}

          {error && (
            <p className={cx(styles.error, styles.formSpan2)} role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onDismiss={() => setConfirmDelete(false)}
        title="Delete attachment?"
        message="This permanently removes the file from the journey."
        confirmLabel="Delete"
        confirming={deleteMut.isPending}
        onConfirm={() => deleteMut.mutate()}
      />
    </div>
  )
}
