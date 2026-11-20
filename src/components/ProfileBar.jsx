import { useRef, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Loader,
  Menu,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import {
  IconDots,
  IconDownload,
  IconFileImport,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react'
import { toExport } from '../lib/jira/profiles.js'
import { downloadText } from '../runtime/download.js'

function safeName(value) {
  return String(value ?? '')
    .replace(/[^\w.-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'profile'
}

export function ProfileBar({
  items,
  activeId,
  activeProfile,
  onSelect,
  onImport,
  onRemove,
  onRefreshFields,
  refreshingFields,
}) {
  const fileRef = useRef(null)
  const [error, setError] = useState('')

  async function handleFile(event) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    setError('')
    try {
      const raw = JSON.parse(await file.text())
      onImport(raw, file.name)
    } catch (readError) {
      setError(readError.message || 'Could not read that profile.')
    }
  }

  function exportProfile() {
    if (!activeProfile) return
    downloadText(
      `${safeName(activeProfile.name)}.json`,
      JSON.stringify(toExport(activeProfile), null, 2),
    )
  }

  function removeProfile() {
    if (!activeProfile) return
    if (!window.confirm(`Delete the profile "${activeProfile.name}"?`)) return
    onRemove(activeId)
  }

  return (
    <Stack gap={4}>
      <Group gap={4} align="flex-end" wrap="nowrap">
        <Select
          style={{ flex: 1 }}
          label="Profile"
          placeholder={
            items.length === 0 ? 'No profiles yet' : 'Select a profile'
          }
          data={items.map((item) => ({ value: item.id, label: item.name }))}
          value={activeId || null}
          onChange={(value) => value && onSelect(value)}
          allowDeselect={false}
          disabled={items.length === 0}
          nothingFoundMessage="No profiles yet"
        />

        <Menu position="bottom-end" withinPortal shadow="md">
          <Menu.Target>
            <Tooltip label="Profile actions">
              <ActionIcon
                variant="light"
                size="md"
                aria-label="Profile actions"
              >
                <IconDots size={14} />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconFileImport size={14} />}
              onClick={() => fileRef.current?.click()}
            >
              Import profile…
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDownload size={14} />}
              onClick={exportProfile}
              disabled={!activeProfile}
            >
              Export profile
            </Menu.Item>
            <Menu.Item
              leftSection={<IconRefresh size={14} />}
              onClick={onRefreshFields}
              disabled={!activeProfile}
              rightSection={
                refreshingFields ? <Loader size={12} /> : null
              }
            >
              Reload field list from Jira
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={removeProfile}
              disabled={!activeProfile}
            >
              Delete profile
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {items.length === 0 ? (
          <Button
            variant="light"
            leftSection={<IconFileImport size={14} />}
            onClick={() => fileRef.current?.click()}
          >
            Import
          </Button>
        ) : null}
      </Group>

      {error ? (
        <Alert color="red" variant="light" py={4}>
          <Text size="xs">{error}</Text>
        </Alert>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={handleFile}
      />
    </Stack>
  )
}
