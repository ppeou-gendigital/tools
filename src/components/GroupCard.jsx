import {
  ActionIcon,
  Badge,
  Box,
  Collapse,
  Paper,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { IconChevronDown, IconGripVertical } from '@tabler/icons-react'
import { LinkRow } from './LinkRow.jsx'

export function GroupCard({
  group,
  collapsed,
  onToggle,
  favorites,
  onOpen,
  onToggleFavorite,
  dragHandleProps,
}) {
  const available = group.links.filter((link) => link.href).length
  const total = group.links.length

  return (
    <Paper withBorder radius="md" className="group-card" p={0}>
      <div className="group-head">
        {dragHandleProps ? (
          <ActionIcon
            {...dragHandleProps}
            variant="subtle"
            color="gray"
            size={18}
            className="group-handle"
            aria-label={`Reorder ${group.label}`}
          >
            <IconGripVertical size={12} stroke={2} />
          </ActionIcon>
        ) : (
          <span className="group-handle group-handle-empty" aria-hidden="true" />
        )}

        <UnstyledButton
          className="group-toggle"
          onClick={onToggle}
          aria-expanded={!collapsed}
        >
          <Text
            className="group-title"
            size="10px"
            fw={700}
            tt="uppercase"
            c="dimmed"
          >
            {group.label}
          </Text>
          <Badge
            ml="auto"
            variant="light"
            color={available > 0 ? 'orange' : 'gray'}
          >
            {available}/{total}
          </Badge>
          <IconChevronDown
            size={13}
            className={`group-chevron${collapsed ? ' is-collapsed' : ''}`}
          />
        </UnstyledButton>
      </div>

      <Collapse expanded={!collapsed} transitionDuration={120}>
        <Box p={4} className="links">
          {group.links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              favorite={favorites.includes(link.id)}
              onOpen={onOpen}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </Box>
      </Collapse>
    </Paper>
  )
}
