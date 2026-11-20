import {
  ActionIcon,
  Group,
  Kbd,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import { IconStar, IconStarFilled } from '@tabler/icons-react'
import { ICONS } from '../lib/aem/icons.js'

function TooltipContent({ title, detail, href, shortcut }) {
  return (
    <Stack gap={2}>
      <Group gap={6} wrap="nowrap" justify="space-between">
        <Text size="xs" fw={600}>
          {title}
        </Text>
        {shortcut ? <Kbd size="xs">{shortcut.toUpperCase()}</Kbd> : null}
      </Group>
      {detail ? (
        <Text size="xs" opacity={0.75}>
          {detail}
        </Text>
      ) : null}
      {href ? (
        <Text
          size="xs"
          opacity={0.6}
          ff="monospace"
          style={{ wordBreak: 'break-all' }}
        >
          {href}
        </Text>
      ) : null}
    </Stack>
  )
}

export function LinkRow({ link, favorite, onOpen, onToggleFavorite }) {
  const disabled = !link.href
  const Icon = ICONS[link.icon] ?? ICONS.link
  const tooltip = (
    <TooltipContent
      title={link.label}
      shortcut={link.shortcut}
      detail={
        disabled
          ? (link.disabledReason ?? 'Not available for this URL')
          : link.description
      }
      href={disabled ? null : link.href}
    />
  )

  return (
    <div className="link-cell">
      <Tooltip label={tooltip} multiline maw={360}>
        <span className="link-tip-anchor">
          <UnstyledButton
            data-link-row=""
            className="link-button"
            disabled={disabled}
            aria-label={link.label}
            aria-keyshortcuts={link.shortcut ?? undefined}
            onClick={() => !disabled && onOpen(link.href)}
            onKeyDown={(event) => {
              if (disabled) return
              if (event.key === 'f') {
                event.preventDefault()
                onToggleFavorite(link.id)
              }
            }}
          >
            <Icon size={17} stroke={1.6} />
          </UnstyledButton>
        </span>
      </Tooltip>

      <ActionIcon
        className="link-star"
        data-active={favorite || undefined}
        color={favorite ? 'orange' : 'gray'}
        size={14}
        aria-label={favorite ? `Unpin ${link.label}` : `Pin ${link.label}`}
        onClick={() => onToggleFavorite(link.id)}
      >
        {favorite ? <IconStarFilled size={8} /> : <IconStar size={8} />}
      </ActionIcon>
    </div>
  )
}
