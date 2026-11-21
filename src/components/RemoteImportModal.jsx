import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  TagsInput,
  Text,
} from '@mantine/core'
import { IconCloudDownload, IconRefresh } from '@tabler/icons-react'
import { STORAGE_KEYS } from '../lib/jira/config.js'
import {
  isJsonAttachment,
  mergeRecentTickets,
  parseTicketKeys,
} from '../lib/jira/remote.js'
import { useChromeStorage } from '../hooks/useChromeStorage.js'
import { MESSAGE } from '../runtime/protocol.js'

function attachmentKey(issueKey, attachmentId) {
  return `${issueKey}:${attachmentId}`
}

function formatSize(bytes) {
  const value = Number(bytes ?? 0)
  if (!value) return '0 B'
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString()
}

// Imports one profile per selected JSON attachment. Multiple tickets and
// multiple files are supported; nothing is written back to Jira here.
export function RemoteImportModal({ opened, onClose, call, onImport }) {
  const [tickets, setTickets] = useState([])
  const [recent, setRecent] = useChromeStorage(STORAGE_KEYS.recentTickets, [])
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState({})
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (opened) return
    setResults([])
    setSelected({})
    setLoading(false)
    setImporting(false)
    setError('')
  }, [opened])

  async function loadAttachments() {
    const { keys, invalid } = parseTicketKeys(tickets)
    if (invalid.length > 0) {
      setError(`Not a Jira ticket key: ${invalid.join(', ')}`)
      return
    }
    if (keys.length === 0) {
      setError('Enter at least one Jira ticket key.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const list = await call(MESSAGE.ATTACHMENT_LIST, { keys }, { timeout: 30_000 })
      setResults(Array.isArray(list) ? list : [])
      setSelected({})
      setRecent(mergeRecentTickets(recent, keys))
    } catch (loadError) {
      setError(loadError?.message ?? 'Could not load the ticket attachments.')
    } finally {
      setLoading(false)
    }
  }

  function toggle(key) {
    setSelected((previous) => {
      const next = { ...previous }
      if (next[key]) delete next[key]
      else next[key] = true
      return next
    })
  }

  function toggleTicket(ticket) {
    const jsonAttachments = ticket.attachments.filter(isJsonAttachment)
    const allSelected = jsonAttachments.every(
      (attachment) => selected[attachmentKey(ticket.key, attachment.id)],
    )

    setSelected((previous) => {
      const next = { ...previous }
      for (const attachment of jsonAttachments) {
        const key = attachmentKey(ticket.key, attachment.id)
        if (allSelected) delete next[key]
        else next[key] = true
      }
      return next
    })
  }

  const picked = results.flatMap((ticket) =>
    ticket.attachments
      .filter(
        (attachment) =>
          isJsonAttachment(attachment) &&
          selected[attachmentKey(ticket.key, attachment.id)],
      )
      .map((attachment) => ({ ...attachment, issueKey: ticket.key })),
  )

  async function importSelected() {
    if (picked.length === 0) {
      setError('Select at least one JSON attachment.')
      return
    }

    setImporting(true)
    setError('')
    try {
      const downloads = await call(
        MESSAGE.ATTACHMENT_DOWNLOAD,
        {
          items: picked.map((attachment) => ({
            issueKey: attachment.issueKey,
            attachmentId: attachment.id,
            filename: attachment.filename,
            content: attachment.content,
          })),
        },
        { timeout: 30_000 },
      )

      const createdByKey = new Map(
        picked.map((attachment) => [
          attachmentKey(attachment.issueKey, attachment.id),
          attachment.created,
        ]),
      )

      const files = []
      const failures = []

      for (const download of downloads) {
        if (download?.error) {
          failures.push(`${download.filename}: ${download.error}`)
          continue
        }

        try {
          const raw = JSON.parse(download.text)
          files.push({
            raw,
            name: raw?.name || download.filename,
            source: {
              type: 'jira',
              issueKey: download.issueKey,
              attachmentId: String(download.attachmentId),
              filename: download.filename,
              remoteCreatedAt:
                createdByKey.get(
                  attachmentKey(download.issueKey, download.attachmentId),
                ) ?? '',
            },
          })
        } catch {
          failures.push(`${download.filename}: not a valid JSON profile.`)
        }
      }

      if (failures.length > 0) {
        setError(failures.join(' '))
        return
      }

      onImport(files)
      onClose()
    } catch (importError) {
      setError(importError?.message ?? 'Could not import the attachments.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Import from Jira"
      size="lg"
      centered
    >
      <Stack gap="sm">
        <Group align="flex-end" gap="xs" wrap="nowrap">
          <TagsInput
            style={{ flex: 1 }}
            label="Jira tickets"
            description="Profiles come from JSON files attached to one or more tickets."
            placeholder="e.g. WEBEXP-123"
            data={Array.isArray(recent) ? recent : []}
            value={tickets}
            onChange={setTickets}
            splitChars={[',', ' ', ';']}
            maxTags={20}
            clearable
          />
          <Button
            variant="light"
            leftSection={<IconRefresh size={14} />}
            onClick={loadAttachments}
            loading={loading}
          >
            Load
          </Button>
        </Group>

        {error ? (
          <Alert color="red" variant="light" py={6}>
            <Text size="xs">{error}</Text>
          </Alert>
        ) : null}

        {loading ? (
          <Group justify="center" py="md">
            <Loader size="sm" />
          </Group>
        ) : null}

        {!loading && results.length > 0 ? (
          <ScrollArea.Autosize mah={320} type="auto">
            <Stack gap="md">
              {results.map((ticket) => {
                const jsonAttachments = ticket.attachments.filter(isJsonAttachment)
                const allSelected =
                  jsonAttachments.length > 0 &&
                  jsonAttachments.every(
                    (attachment) =>
                      selected[attachmentKey(ticket.key, attachment.id)],
                  )

                return (
                  <Box key={ticket.key}>
                    <Group justify="space-between" gap="xs" wrap="nowrap">
                      <Text size="sm" fw={600}>
                        {ticket.key}
                        {ticket.summary ? (
                          <Text span size="xs" c="dimmed" fw={400}>
                            {' '}
                            {ticket.summary}
                          </Text>
                        ) : null}
                      </Text>
                      {jsonAttachments.length > 0 ? (
                        <Button
                          size="compact-xs"
                          variant="subtle"
                          onClick={() => toggleTicket(ticket)}
                        >
                          {allSelected ? 'Clear' : 'Select all'}
                        </Button>
                      ) : null}
                    </Group>

                    {ticket.error ? (
                      <Alert color="red" variant="light" py={4} mt={4}>
                        <Text size="xs">{ticket.error}</Text>
                      </Alert>
                    ) : null}

                    {!ticket.error && ticket.attachments.length === 0 ? (
                      <Text size="xs" c="dimmed" mt={4}>
                        This ticket has no attachments.
                      </Text>
                    ) : null}

                    {!ticket.error && ticket.attachments.length > 0 ? (
                      <Stack gap={2} mt={4}>
                        {ticket.attachments.map((attachment) => {
                          const key = attachmentKey(ticket.key, attachment.id)
                          const json = isJsonAttachment(attachment)
                          const description = [
                            attachment.author,
                            formatDate(attachment.created),
                          ]
                            .filter(Boolean)
                            .join(' · ')

                          return (
                            <Checkbox
                              key={attachment.id}
                              checked={Boolean(selected[key])}
                              onChange={() => toggle(key)}
                              disabled={!json}
                              label={
                                <Group gap={6} wrap="nowrap">
                                  <Text size="xs">{attachment.filename}</Text>
                                  <Badge size="xs" variant="light">
                                    {formatSize(attachment.size)}
                                  </Badge>
                                  {!json ? (
                                    <Badge size="xs" color="gray" variant="light">
                                      not JSON
                                    </Badge>
                                  ) : null}
                                </Group>
                              }
                              description={description}
                            />
                          )
                        })}
                      </Stack>
                    ) : null}
                  </Box>
                )
              })}
            </Stack>
          </ScrollArea.Autosize>
        ) : null}

        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {picked.length > 0
              ? `${picked.length} file${picked.length === 1 ? '' : 's'} selected`
              : 'Select the JSON files to import.'}
          </Text>
          <Group gap="xs">
            <Button variant="default" onClick={onClose} disabled={importing}>
              Cancel
            </Button>
            <Button
              leftSection={<IconCloudDownload size={14} />}
              onClick={importSelected}
              loading={importing}
              disabled={picked.length === 0}
            >
              Import
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}
