import { useEffect, useRef, useState } from 'react'
import { ActionIcon, Box, Group, Stack, Text, Tooltip } from '@mantine/core'
import {
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconX,
} from '@tabler/icons-react'
import { dropIndex, moveItem, removeItem } from '../lib/jira/order.js'

const SCROLL_EDGE = 48
const SCROLL_STEP = 12
const SCROLL_INTERVAL = 40

export function OrderedItems({
  items,
  onChange,
  emptyLabel,
  removeLabel,
  hiddenIds = [],
  onToggleHidden,
}) {
  const [draggingId, setDraggingId] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const dragId = useRef(null)
  const scrollTimer = useRef(null)

  useEffect(() => () => clearInterval(scrollTimer.current), [])

  function stopAutoScroll() {
    clearInterval(scrollTimer.current)
    scrollTimer.current = null
  }

  function finishDrag() {
    dragId.current = null
    setDraggingId(null)
    setDropTarget(null)
    stopAutoScroll()
  }

  // Native drag does not scroll the page, so holding a row near the popup edge
  // keeps scrolling until the pointer leaves the zone.
  function autoScroll(event) {
    const direction =
      event.clientY < SCROLL_EDGE
        ? -1
        : event.clientY > window.innerHeight - SCROLL_EDGE
          ? 1
          : 0

    if (direction === 0) {
      stopAutoScroll()
      return
    }
    if (scrollTimer.current) return

    scrollTimer.current = setInterval(() => {
      window.scrollBy(0, direction * SCROLL_STEP)
    }, SCROLL_INTERVAL)
  }

  function startDrag(event, item) {
    dragId.current = item.id
    setDraggingId(item.id)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', item.id)

    const row = event.currentTarget.closest('.ordered-row')
    if (row) {
      const rect = row.getBoundingClientRect()
      try {
        event.dataTransfer.setDragImage(
          row,
          event.clientX - rect.left,
          event.clientY - rect.top,
        )
      } catch {
        // Synthetic drag events have no native drag image to set.
      }
    }
  }

  function overRow(event, item) {
    event.preventDefault()
    autoScroll(event)

    if (!dragId.current || dragId.current === item.id) {
      setDropTarget(null)
      return
    }

    event.dataTransfer.dropEffect = 'move'
    const rect = event.currentTarget.getBoundingClientRect()
    const edge = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
    setDropTarget((current) =>
      current?.id === item.id && current.edge === edge
        ? current
        : { id: item.id, edge },
    )
  }

  function leaveRow(event, item) {
    if (event.currentTarget.contains(event.relatedTarget)) return
    setDropTarget((current) => (current?.id === item.id ? null : current))
  }

  function dropOn(event, item) {
    event.preventDefault()

    const from = items.findIndex((entry) => entry.id === dragId.current)
    const target = items.findIndex((entry) => entry.id === item.id)
    const rect = event.currentTarget.getBoundingClientRect()
    const edge = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'

    finishDrag()
    if (from < 0 || target < 0) return

    const to = dropIndex(from, target, edge, items.length)
    if (to !== from) onChange(moveItem(items, from, to))
  }

  // The arrows are gone, so the grip also reorders with the keyboard.
  function handleKeyDown(event, index) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return

    event.preventDefault()
    const to = event.key === 'ArrowUp' ? index - 1 : index + 1
    if (to < 0 || to >= items.length) return
    onChange(moveItem(items, index, to))
  }

  if (items.length === 0) {
    return (
      <Text size="xs" c="dimmed">
        {emptyLabel}
      </Text>
    )
  }

  const hidden = new Set(hiddenIds)

  return (
    <Stack gap={2}>
      {items.map((item, index) => {
        const isHidden = hidden.has(item.id)
        const isDragging = draggingId === item.id
        const dropEdge = dropTarget?.id === item.id ? dropTarget.edge : null

        return (
          <Group
            key={item.id}
            gap={2}
            wrap="nowrap"
            className={[
              'ordered-row',
              isDragging ? 'is-dragging' : '',
              dropEdge ? `drop-${dropEdge}` : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onDragOver={(event) => overRow(event, item)}
            onDragLeave={(event) => leaveRow(event, item)}
            onDrop={(event) => dropOn(event, item)}
          >
            <Box
              component="span"
              className="drag-handle"
              role="button"
              tabIndex={0}
              draggable
              title="Drag to reorder, or use the arrow keys"
              aria-label={`Reorder ${item.name}`}
              aria-keyshortcuts="ArrowUp ArrowDown"
              onDragStart={(event) => startDrag(event, item)}
              onDragEnd={finishDrag}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <IconGripVertical size={12} />
            </Box>

            <Text
              size="xs"
              c={isHidden ? 'dimmed' : undefined}
              style={{ flex: 1 }}
              truncate
            >
              {item.name}
            </Text>

            {onToggleHidden ? (
              <Tooltip label={isHidden ? 'Show in report' : 'Hide from report'}>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  aria-pressed={!isHidden}
                  aria-label={
                    isHidden
                      ? `Show ${item.name} in report`
                      : `Hide ${item.name} from report`
                  }
                  onClick={() => onToggleHidden(item)}
                >
                  {isHidden ? <IconEyeOff size={12} /> : <IconEye size={12} />}
                </ActionIcon>
              </Tooltip>
            ) : null}

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
        )
      })}
    </Stack>
  )
}
