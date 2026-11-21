import { Stack } from '@mantine/core'
import { idsOf } from '../lib/jira/filters.js'
import { normalizeResources } from '../lib/jira/profiles.js'
import { MESSAGE } from '../runtime/protocol.js'
import { OrderedItems } from './OrderedItems.jsx'
import { RemoteMultiSelect } from './RemoteMultiSelect.jsx'

export function ResourceSection({ call, resources, onChange }) {
  function changeResources(values, pool) {
    const labels = new Map(pool.map(({ value, label }) => [value, label]))
    onChange(
      normalizeResources(
        values.map((value) => ({
          id: value,
          name: labels.get(value) ?? value,
        })),
      ),
    )
  }

  return (
    <Stack gap="xs">
      <RemoteMultiSelect
        label="People"
        description="Subtask remaining estimates roll up under these people."
        placeholder="Search people"
        type={MESSAGE.PICKER_USER}
        call={call}
        value={idsOf(resources)}
        selectedOptions={resources.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        mapResults={(items) =>
          items.map(({ id, name }) => ({ id: `resource:${id}`, name }))
        }
        onChange={changeResources}
      />

      <OrderedItems
        items={resources}
        onChange={(items) => onChange(normalizeResources(items))}
        emptyLabel="No resources yet."
        removeLabel="Remove resource"
      />
    </Stack>
  )
}
