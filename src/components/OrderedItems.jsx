import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconX } from '@tabler/icons-react'
import { moveItem, removeItem } from '../lib/jira/order.js'

export function OrderedItems({ items, onChange, emptyLabel, removeLabel }) {
  if (items.length === 0) {
    return (
      <Text size="xs" c="dimmed">
        {emptyLabel}
      </Text>
    )
  }

  return (
    <Stack gap={2}>
      {items.map((item, index) => (
        <Group key={item.id} gap={2} wrap="nowrap" className="ordered-row">
          <Text size="xs" style={{ flex: 1 }} truncate>
            {item.name}
          </Text>
          <Tooltip label="Move up">
            <ActionIcon
              size="xs"
              disabled={index === 0}
              aria-label={`Move ${item.name} up`}
              onClick={() => onChange(moveItem(items, index, index - 1))}
            >
              <IconArrowUp size={12} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Move down">
            <ActionIcon
              size="xs"
              disabled={index === items.length - 1}
              aria-label={`Move ${item.name} down`}
              onClick={() => onChange(moveItem(items, index, index + 1))}
            >
              <IconArrowDown size={12} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={removeLabel ?? 'Remove'}>
            <ActionIcon
              size="xs"
              color="red"
              aria-label={`Remove ${item.name}`}
              onClick={() => onChange(removeItem(items, item.id))}
            >
              <IconX size={12} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ))}
    </Stack>
  )
}
