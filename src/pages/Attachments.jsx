import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus } from 'lucide-react'
import { AiPlannerButton } from '@/molecules/AiPlannerButton'
import { AttachmentCard } from '@/molecules/AttachmentCard'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { journeyAllShortcuts } from '@/lib/journeyNav'
import {
  formatByteSize,
  listAttachmentsForJourney,
} from '@/lib/attachmentsApi'
import { isAiPlanningEnabled } from '@/lib/ai/enabled'
import { getJourney, myMembership } from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

function attachmentMeta(att) {
  const linkBits = []
  if (att.entryIds?.length) {
    linkBits.push(
      `${att.entryIds.length} activit${att.entryIds.length === 1 ? 'y' : 'ies'}`,
    )
  }
  if (att.expenseIds?.length) {
    linkBits.push(
      `${att.expenseIds.length} expense${att.expenseIds.length === 1 ? '' : 's'}`,
    )
  }
  return linkBits.length > 0 ? linkBits.join(' · ') : 'Journey'
}

export function Attachments() {
  const nav = useNavigation()
  const {
    params,
    goBack,
    previousRouteLabel,
    goAttachmentEdit,
  } = nav
  const journeyId = params.journeyId
  const { user } = useAuth()
  const aiEnabled = isAiPlanningEnabled()

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

  const {
    data: attachments = [],
    isLoading: attachmentsLoading,
    error,
  } = useQuery({
    queryKey: ['viaggio', 'attachments', journeyId],
    queryFn: () => listAttachmentsForJourney(journeyId),
    enabled: !!journeyId,
  })

  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'
  const isLoading = journeyLoading || attachmentsLoading

  if (!journeyId) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing journey.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Attachments"
        subtitle={journey?.title}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          canEdit ? (
            <div className={styles.toolbar}>
              {aiEnabled && (
                <AiPlannerButton
                  journeyId={journeyId}
                  className={styles.iconBtn}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={() => goAttachmentEdit({ journeyId })}
                aria-label="Add attachment"
                title="Add attachment"
              >
                <Plus size={14} aria-hidden="true" />
              </Button>
            </div>
          ) : null
        }
        shortcuts={
          <PageShortcuts
            current="attachments"
            className={styles.iconBtn}
            shortcuts={journeyAllShortcuts(journeyId, nav)}
          />
        }
      />

      <div className={cx('is-fluid-width', styles.body)}>
        {!canEdit && membership && (
          <p className={styles.readOnlyBanner}>
            You can view these files. Only editors can add or change them.
          </p>
        )}

        {isLoading && <LoadingState>Loading attachments…</LoadingState>}

        {!isLoading && error && (
          <p className={styles.error} role="alert">
            {error.message || 'Could not load attachments.'}
          </p>
        )}

        {!isLoading && !error && attachments.length === 0 && (
          <div className={styles.empty}>
            <p>
              {canEdit
                ? 'No files yet. Add photos, PDFs, or tickets for this journey.'
                : 'No files on this journey.'}
            </p>
            {canEdit && (
              <Button onClick={() => goAttachmentEdit({ journeyId })}>
                <Plus size={14} aria-hidden="true" />
                Add attachment
              </Button>
            )}
          </div>
        )}

        {!isLoading && !error && attachments.length > 0 && (
          <ul className={styles.list}>
            {attachments.map((att) => (
              <li key={att.id}>
                <AttachmentCard
                  attachment={att}
                  meta={`${formatByteSize(att.byteSize)} · ${attachmentMeta(att)}`}
                  onOpen={() =>
                    goAttachmentEdit({
                      journeyId,
                      attachmentId: att.id,
                    })
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
