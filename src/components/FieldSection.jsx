import { Divider, MultiSelect, Stack, Text } from '@mantine/core'
import { ISSUE_FIELDS } from '../lib/jira/fields.js'
import { idsOf, itemsForIds, mergeItems } from '../lib/jira/filters.js'
import { MESSAGE } from '../runtime/protocol.js'
import { OrderedItems } from './OrderedItems.jsx'
import { RemoteMultiSelect } from './RemoteMultiSelect.jsx'

// `subtask` is a synthetic column that only exists in the REST export, so it
// must never be sent to Jira as a column id.
const FETCHABLE_FIELDS = ISSUE_FIELDS.filter((field) => field.id !== 'subtask')

const toOption = ({ id, name }) => ({ value: id, label: name })

export function FieldSection({ call, config, onChange }) {
  const reportSelected = new Set(idsOf(config.reportFields))
  const addable = mergeItems(config.fetchFields)
    .filter((field) => !reportSelected.has(field.id))
    .map(toOption)

  function addReportFields(values) {
    if (values.length === 0) return
    const picked = itemsForIds(values, config.fetchFields, config.reportFields)
    onChange({ reportFields: [...config.reportFields, ...picked] })
  }

  return (
    <Stack gap="xs">
      <RemoteMultiSelect
        label="Fetch fields"
        description="Columns Jira returns for the capacity report. Type to search the full Jira field list."
        placeholder="Search fields"
        type={MESSAGE.PICKER_FIELDS}
        call={call}
        value={idsOf(config.fetchFields)}
        options={FETCHABLE_FIELDS.map(toOption)}
        selectedOptions={config.fetchFields.map(toOption)}
        onChange={(values, pool) =>
          onChange({ fetchFields: itemsForIds(values, pool, config.fetchFields) })
        }
      />

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
    </Stack>
  )
}
