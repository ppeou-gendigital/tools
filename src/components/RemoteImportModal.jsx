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
  TextInput,
} from '@mantine/core'
import { IconCloudDownload, IconPlus, IconRefresh } from '@tabler/icons-react'
import { STORAGE_KEYS } from '../lib/jira/config.js'
import { createBlankProfile, toExport } from '../lib/jira/profiles.js'
import {
  isJsonAttachment,
  mergeRecentTickets,
  parseTicketKeys,
  profileFileName,
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

// Opens profiles from Jira: existing JSON attachments are imported, and a
// ticket with no profile can get a freshly created one. Nothing is written to
// Jira except the explicit "Create" action.
export function RemoteImportModal({ opened, onClose, call, onImport, onCreate }) {
  const [tickets, setTickets] = useState([])
  const [recent, setRecent] = useChromeStorage(STORAGE_KEYS.recentTickets, [])
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState({})
  const [names, setNames] = useState({})
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [creatingKey, setCreatingKey] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (opened) return
    setResults([])
    setSelected({})
    setNames({})
    setLoading(false)
    setImporting(false)
    setCreatingKey('')
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

      const metaByKey = new Map(
        picked.map((attachment) => [
          attachmentKey(attachment.issueKey, attachment.id),
          { created: attachment.created, author: attachment.author },
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
          // Older files have no metadata; Jira knows when and by whom the
          // attachment was uploaded, so use that instead of "now".
          const meta = metaByKey.get(
            attachmentKey(download.issueKey, download.attachmentId),
          )
          if (meta) {
            if (!raw.createdAt && meta.created) raw.createdAt = meta.created
            if (!raw.createdBy && meta.author) raw.createdBy = meta.author
          }
          files.push({
            raw,
            name: raw?.name || download.filename,
            source: {
              type: 'jira',
              issueKey: download.issueKey,
              attachmentId: String(download.attachmentId),
              filename: download.filename,
              remoteCreatedAt:
                meta?.created ?? '',
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

  // Creates a valid starter profile (defaults, no filters) directly on a ticket
  // and records it as the active profile. This is the only way to get a first
  // profile when the ticket has no JSON attachment.
  async function createOnTicket(ticket) {
    const name = String(names[ticket.key] ?? '').trim()
    if (!name) {
      setError('Enter a profile name first.')
      return
    }

    setCreatingKey(ticket.key)
    setError('')
    try {
      const user = await call(MESSAGE.USER_SELF, {}, { timeout: 15_000 }).catch(
        () => null,
      )
      const profile = createBlankProfile({
        name,
        createdBy: user?.displayName ?? '',
      })
      const filename = profileFileName(profile.name, profile.id)
      const uploaded = await call(
        MESSAGE.ATTACHMENT_UPLOAD,
        {
          issueKey: ticket.key,
          filename,
          text: JSON.stringify(toExport(profile), null, 2),
        },
        { timeout: 30_000 },
      )

      onCreate({
        name,
        profile,
        source: {
          type: 'jira',
          issueKey: ticket.key,
          attachmentId: String(uploaded.id),
          filename: uploaded.filename || filename,
          remoteCreatedAt: uploaded.created || '',
        },
      })
      onClose()
    } catch (createError) {
      setError(
        createError?.message ??
          'Could not create the profile. Check that you can attach files to this ticket.',
      )
    } finally {
      setCreatingKey('')
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Open from Jira"
      size="lg"
      centered
    >
      <Stack gap="sm">
        <Group align="flex-end" gap="xs" wrap="nowrap">
          <TagsInput
            style={{ flex: 1 }}
            label="Jira tickets"
            description="Find an existing profile on a ticket, or create one there."
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

                    {!ticket.error ? (
                      <Group align="flex-end" gap="xs" wrap="nowrap" mt={8}>
                        <TextInput
                          style={{ flex: 1 }}
                          size="xs"
                          label="New profile"
                          description="Creates a starter file on this ticket."
                          placeholder="Team or report name, e.g. WebExp"
                          value={names[ticket.key] ?? ''}
                          onChange={(event) => {
                            const value = event.currentTarget.value
                            setNames((previous) => ({
                              ...previous,
                              [ticket.key]: value,
                            }))
                          }}
                          disabled={Boolean(creatingKey)}
                          maxLength={80}
                        />
                        <Button
                          size="compact-sm"
                          variant="light"
                          leftSection={<IconPlus size={14} />}
                          onClick={() => createOnTicket(ticket)}
                          loading={creatingKey === ticket.key}
                          disabled={
                            Boolean(creatingKey) ||
                            !String(names[ticket.key] ?? '').trim()
                          }
                        >
                          Create
                        </Button>
                      </Group>
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
