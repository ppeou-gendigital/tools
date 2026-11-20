import {
  ActionIcon,
  Divider,
  Group,
  MultiSelect,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'
import { ISSUE_FIELDS } from '../lib/jira/fields.js'
import { idsOf, itemsForIds, mergeItems } from '../lib/jira/filters.js'
import { normalizeResources } from '../lib/jira/profiles.js'
import { MESSAGE } from '../runtime/protocol.js'
import { OrderedItems } from './OrderedItems.jsx'
import { RemoteMultiSelect } from './RemoteMultiSelect.jsx'

// `subtask` is a synthetic column that only exists in the REST export, so it
// must never be sent to Jira as a column id.
const FETCHABLE_FIELDS = ISSUE_FIELDS.filter((field) => field.id !== 'subtask')

const toOption = ({ id, name }) => ({ value: id, label: name })

export function FieldSection({
  call,
  available,
  config,
  onChange,
  onRefreshFields,
  refreshingFields,
}) {
  const fetchCatalog = mergeItems(
    FETCHABLE_FIELDS,
    available.fields,
    config.fetchFields,
  )
  const reportSelected = new Set(idsOf(config.reportFields))
  const addable = mergeItems(config.fetchFields)
    .filter((field) => !reportSelected.has(field.id))
    .map(toOption)

  function addReportFields(values) {
    if (values.length === 0) return
    const picked = itemsForIds(values, config.fetchFields, config.reportFields)
    onChange({ reportFields: [...config.reportFields, ...picked] })
  }

  function changeResources(values, pool) {
    const labels = new Map(pool.map(({ value, label }) => [value, label]))
    onChange({
      resources: normalizeResources(
        values.map((value) => ({ id: value, name: labels.get(value) ?? value })),
      ),
    })
  }

  return (
    <Stack gap="sm">
      <Group gap={4} align="flex-end" wrap="nowrap">
        <MultiSelect
          style={{ flex: 1 }}
          label="Fetch fields"
          description="Columns Jira returns for the capacity report."
          placeholder="Pick the columns to fetch"
          data={fetchCatalog.map(toOption)}
          value={idsOf(config.fetchFields)}
          onChange={(values) =>
            onChange({
              fetchFields: itemsForIds(
                values,
                fetchCatalog,
                config.fetchFields,
              ),
            })
          }
          searchable
          clearable
          hidePickedOptions
          nothingFoundMessage="Nothing matches"
        />
        <Tooltip label="Reload the field list from Jira">
          <ActionIcon
            variant="light"
            size="md"
            aria-label="Reload field list from Jira"
            loading={refreshingFields}
            onClick={onRefreshFields}
          >
            <IconRefresh size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Divider label="Report columns" labelPosition="left" />

      <OrderedItems
        items={config.reportFields}
        onChange={(items) => onChange({ reportFields: items })}
        emptyLabel="No columns yet — add one below."
        removeLabel="Remove column"
      />

      {addable.length > 0 ? (
        <MultiSelect
          placeholder="Add a report column"
          data={addable}
          value={[]}
          onChange={addReportFields}
          searchable
          hidePickedOptions
          nothingFoundMessage="Every fetched field is already a column"
        />
      ) : (
        <Text size="xs" c="dimmed">
          Every fetched field is already a column.
        </Text>
      )}

      <Divider label="Resources" labelPosition="left" />

      <RemoteMultiSelect
        label="People"
        description="Subtask remaining estimates roll up under these people."
        placeholder="Search people"
        type={MESSAGE.PICKER_USER}
        call={call}
        value={idsOf(config.resources)}
        selectedOptions={config.resources.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        mapResults={(items) =>
          items.map(({ id, name }) => ({ id: `resource:${id}`, name }))
        }
        onChange={changeResources}
      />

      <OrderedItems
        items={config.resources}
        onChange={(items) =>
          onChange({ resources: normalizeResources(items) })
        }
        emptyLabel="No resources yet."
        removeLabel="Remove resource"
      />
    </Stack>
  )
}
