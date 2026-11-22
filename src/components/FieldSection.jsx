import { Stack, Text } from '@mantine/core'
import {
  applyFieldRows,
  toggleReportVisibility,
} from '../lib/jira/fieldSelection.js'
import { ISSUE_FIELDS } from '../lib/jira/fields.js'
import { idsOf } from '../lib/jira/filters.js'
import { MESSAGE } from '../runtime/protocol.js'
import { OrderedItems } from './OrderedItems.jsx'
import { RemoteSelect } from './RemoteSelect.jsx'

// `subtask` is a synthetic column that only exists in the REST export, so it
// must never be sent to Jira as a column id.
const FETCHABLE_FIELDS = ISSUE_FIELDS.filter((field) => field.id !== 'subtask')

const toOption = ({ id, name }) => ({ value: id, label: name })

export function FieldSection({ call, config, onChange }) {
  // One ordered list: everything is fetched, the eye marks report columns.
  // `normalizeSelection` keeps the fetch order aligned with the report order.
  const rows = config.fetchFields
  const reportIds = idsOf(config.reportFields)
  const visible = new Set(reportIds)
  const hiddenIds = rows
    .filter((row) => !visible.has(row.id))
    .map((row) => row.id)

  function commit(nextRows, nextVisible = visible) {
    onChange(applyFieldRows(nextRows, nextVisible))
  }

  function addField(field) {
    commit([...rows, field], new Set([...reportIds, field.id]))
  }

  return (
    <Stack gap="xs">
      <RemoteSelect
        label="Fetch fields"
        description="Columns Jira returns for the capacity report. The eye chooses which appear in the export."
        placeholder="Search fields"
        type={MESSAGE.PICKER_FIELDS}
        call={call}
        options={FETCHABLE_FIELDS.map(toOption)}
        excludeIds={rows.map((row) => row.id)}
        onPick={addField}
      />

      {rows.length > 0 ? (
        <Text size="xs" c="dimmed">
          {rows.length - hiddenIds.length} of {rows.length} fields in the report
        </Text>
      ) : null}

      <OrderedItems
        items={rows}
        onChange={(nextRows) => commit(nextRows)}
        emptyLabel="No fields yet — search above to add one."
        removeLabel="Remove field"
        hiddenIds={hiddenIds}
        onToggleHidden={(item) =>
          commit(rows, toggleReportVisibility(reportIds, item.id))
        }
      />
    </Stack>
  )
}
