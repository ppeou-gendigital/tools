import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { IconCloudUpload } from '@tabler/icons-react'
import {
  REMOTE_STATE,
  buildSnapshot,
  remoteState,
  uploadFileName,
} from '../lib/jira/remote.js'
import { MESSAGE } from '../runtime/protocol.js'

const STATUS_TEXT = {
  [REMOTE_STATE.checking]: {
    color: 'gray',
    text: 'Checking the ticket…',
  },
  [REMOTE_STATE.current]: {
    color: 'green',
    text: 'The attachment on Jira matches this profile.',
  },
  [REMOTE_STATE.changed]: {
    color: 'yellow',
    text: 'The attachment on Jira changed since this profile was imported.',
  },
  [REMOTE_STATE.missing]: {
    color: 'yellow',
    text: 'The original attachment is no longer on the ticket.',
  },
  [REMOTE_STATE.error]: {
    color: 'red',
    text: 'Could not check the ticket. You can still upload.',
  },
}

// Uploads the current working profile to Jira. This is the only place that
// writes to a ticket, and it only runs after the user presses the button.
export function SyncToJiraModal({
  opened,
  onClose,
  entry,
  selection,
  call,
  onSynced,
}) {
  const [checking, setChecking] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [checkError, setCheckError] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const source = entry?.source ?? null
  const issueKey = source?.issueKey ?? ''
  const attachmentId = source?.attachmentId ?? ''

  useEffect(() => {
    if (!opened || !issueKey) return undefined

    let alive = true
    setChecking(true)
    setAttachments([])
    setCheckError('')
    setError('')

    call(MESSAGE.ATTACHMENT_LIST, { keys: [issueKey] }, { timeout: 15_000 })
      .then((list) => {
        if (!alive) return
        const ticket = Array.isArray(list) ? list[0] : null
        if (!ticket) throw new Error('Jira returned no ticket.')
        if (ticket.error) throw new Error(ticket.error)
        setAttachments(Array.isArray(ticket.attachments) ? ticket.attachments : [])
      })
      .catch((checkFailure) => {
        if (!alive) return
        setCheckError(checkFailure?.message ?? 'Could not check the ticket.')
      })
      .finally(() => {
        if (alive) setChecking(false)
      })

    return () => {
      alive = false
    }
  }, [opened, issueKey, attachmentId, call])

  const status = checking
    ? REMOTE_STATE.checking
    : checkError
      ? REMOTE_STATE.error
      : remoteState(source, attachments)

  // Replace the linked attachment, plus any duplicate with the same file name
  // that an earlier failed check may have left behind. Other profile files on
  // the ticket have different names and are never touched.
  const replaceTargets = attachments.filter(
    (attachment) =>
      String(attachment.id) === String(source?.attachmentId) ||
      attachment.filename === source?.filename,
  )
  const filename = uploadFileName(entry)
  const statusText = STATUS_TEXT[status]

  async function sync() {
    if (!source || !entry?.profile) return

    setBusy(true)
    setError('')

    // Stamp the document at upload time; the filename stays stable.
    let user = null
    try {
      user = await call(MESSAGE.USER_SELF, {}, { timeout: 15_000 })
    } catch {
      user = null
    }
    const meta = {
      updatedAt: new Date().toISOString(),
      updatedBy: user?.displayName || entry.profile.updatedBy || '',
    }
    const snapshot = buildSnapshot(entry, selection, meta)

    let uploaded
    try {
      uploaded = await call(MESSAGE.ATTACHMENT_UPLOAD, {
        issueKey: source.issueKey,
        filename,
        text: JSON.stringify(snapshot, null, 2),
      })
    } catch (uploadFailure) {
      setError(uploadFailure?.message ?? 'Could not upload the profile.')
      setBusy(false)
      return
    }

    const problems = []
    for (const target of replaceTargets) {
      if (String(target.id) === String(uploaded.id)) continue
      try {
        await call(MESSAGE.ATTACHMENT_DELETE, { id: target.id })
      } catch (deleteFailure) {
        problems.push(
          `could not delete ${target.filename}: ${
            deleteFailure?.message ?? 'unknown error'
          }`,
        )
      }
    }

    if (checkError && source.attachmentId) {
      problems.push(
        'the previous attachment was not removed because the ticket could not be checked',
      )
    }

    const warning = problems.length > 0
      ? `Uploaded, but ${problems.join('; ')}.`
      : ''

    onSynced(
      {
        ...source,
        attachmentId: String(uploaded.id),
        filename: uploaded.filename || filename,
        remoteCreatedAt: uploaded.created || '',
        syncedAt: new Date().toISOString(),
      },
      warning,
      meta,
    )

    setBusy(false)
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Sync to Jira"
      size="md"
      centered
    >
      <Stack gap="sm">
        <Text size="sm">
          Upload the current selections to{' '}
          <Text span fw={600}>
            {source ? `${source.issueKey} / ${source.filename}` : 'the ticket'}
          </Text>
          . Only this attachment is replaced; other files on the ticket are left
          alone.
        </Text>

        {checking ? (
          <Group gap="xs">
            <Loader size="xs" />
            <Text size="xs" c="dimmed">
              Checking the ticket…
            </Text>
          </Group>
        ) : statusText ? (
          <Alert color={statusText.color} variant="light" py={6}>
            <Text size="xs">
              {statusText.text}
              {checkError ? ` ${checkError}` : ''}
            </Text>
          </Alert>
        ) : null}

        {error ? (
          <Alert color="red" variant="light" py={6}>
            <Text size="xs">{error}</Text>
          </Alert>
        ) : null}

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            leftSection={<IconCloudUpload size={14} />}
            onClick={sync}
            loading={busy}
            disabled={!entry?.profile || checking}
          >
            {replaceTargets.length > 0 ? 'Upload and replace' : 'Upload to ticket'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
