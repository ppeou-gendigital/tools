import { Alert, Button, Stack, Text } from '@mantine/core'
import { IconMessages, IconTable } from '@tabler/icons-react'

export function ExportBar({ onReport, onComments, busy, disabled, notice }) {
  return (
    <Stack gap="xs">
      <Button
        leftSection={<IconTable size={16} />}
        onClick={onReport}
        loading={busy === 'report'}
        disabled={disabled}
      >
        Generate Capacity Report
      </Button>

      <Button
        variant="light"
        leftSection={<IconMessages size={16} />}
        onClick={onComments}
        loading={busy === 'comments'}
        disabled={disabled}
      >
        Export Tickets and Comments
      </Button>

      {notice ? (
        <Alert color={notice.color} variant="light" py={6}>
          <Text size="xs">{notice.text}</Text>
        </Alert>
      ) : null}
    </Stack>
  )
}
