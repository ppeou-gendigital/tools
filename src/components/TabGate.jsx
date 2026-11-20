import { Alert, Button, Group, Text } from '@mantine/core'
import { IconExternalLink, IconRefresh } from '@tabler/icons-react'
import { JIRA_ORIGIN } from '../lib/jira/config.js'

// Hard stop when the popup is not opened on a Jira tab. There is no manual or
// cross-origin fallback: the Jira tab is the only network executor.
export function TabGate({ gate, onRetry }) {
  const canOpenJira = gate.error !== 'unavailable'

  return (
    <Alert
      color="yellow"
      variant="light"
      title="Open the extension on a Jira tab"
    >
      <Text size="xs">{gate.message}</Text>
      <Group gap="xs" mt="sm">
        <Button
          size="xs"
          variant="light"
          leftSection={<IconRefresh size={14} />}
          onClick={onRetry}
        >
          Check again
        </Button>
        {canOpenJira ? (
          <Button
            size="xs"
            leftSection={<IconExternalLink size={14} />}
            onClick={() =>
              chrome.tabs.create({ url: `${JIRA_ORIGIN}/secure/Dashboard.jspa` })
            }
          >
            Open Jira
          </Button>
        ) : null}
      </Group>
    </Alert>
  )
}
