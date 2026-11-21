import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import {
  IconCloudDownload,
  IconCloudUpload,
  IconDots,
  IconDownload,
  IconTrash,
} from '@tabler/icons-react'
import { sourceLabel } from '../lib/jira/remote.js'

const BADGES = {
  checking: {
    color: 'gray',
    label: 'Checking…',
    tip: 'Checking the attached file on Jira.',
  },
  current: {
    color: 'green',
    label: 'Up to date',
    tip: 'The attachment on Jira matches this profile.',
  },
  changed: {
    color: 'yellow',
    label: 'Jira changed',
    tip: 'The attachment on Jira changed since this profile was imported.',
  },
  missing: {
    color: 'red',
    label: 'Removed',
    tip: 'The attachment is no longer on the ticket.',
  },
  error: {
    color: 'gray',
    label: "Can't check",
    tip: 'The Jira attachment could not be checked.',
  },
}

export function ProfileBar({
  items,
  activeId,
  activeProfile,
  activeEntry,
  remoteStatus,
  onSelect,
  onImport,
  onExport,
  onRemove,
  onSync,
  onRefreshStatus,
  canImport,
}) {
  const source = activeEntry?.source
  const badge = BADGES[remoteStatus?.status]

  function removeProfile() {
    if (!activeProfile) return
    if (!window.confirm(`Delete the profile "${activeProfile.name}"?`)) return
    onRemove(activeId)
  }

  const badgeTip = badge
    ? [
        sourceLabel(source),
        badge.tip,
        remoteStatus?.message,
        onRefreshStatus ? 'Click to check again.' : '',
      ]
        .filter(Boolean)
        .join('\n')
    : ''

  return (
    <Stack gap={4}>
      <Group gap={4} align="flex-end" wrap="nowrap">
        <Select
          style={{ flex: 1 }}
          label={
            <Group gap={6} justify="space-between" wrap="nowrap" w="100%">
              <Text size="sm" fw={500}>
                Profile
              </Text>
              {badge ? (
                <Tooltip
                  label={badgeTip}
                  multiline
                  w={260}
                  withArrow
                  position="bottom-end"
                >
                  <Badge
                    color={badge.color}
                    variant="light"
                    size="sm"
                    style={onRefreshStatus ? { cursor: 'pointer' } : undefined}
                    onClick={onRefreshStatus}
                  >
                    {badge.label}
                  </Badge>
                </Tooltip>
              ) : null}
            </Group>
          }
          description={
            source
              ? sourceLabel(source)
              : 'Profiles are imported from a Jira ticket attachment.'
          }
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
              leftSection={<IconCloudDownload size={14} />}
              onClick={onImport}
              disabled={!canImport}
            >
              Import from Jira…
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCloudUpload size={14} />}
              onClick={onSync}
              disabled={!source || !canImport}
            >
              Sync to Jira…
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDownload size={14} />}
              onClick={onExport}
              disabled={!activeProfile}
            >
              Export profile
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
            leftSection={<IconCloudDownload size={14} />}
            onClick={onImport}
            disabled={!canImport}
            title={!canImport ? 'Open the extension on a Jira tab' : undefined}
          >
            Import from Jira
          </Button>
        ) : null}
      </Group>
    </Stack>
  )
}
