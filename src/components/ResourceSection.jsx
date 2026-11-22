import { Stack } from '@mantine/core'
import { idsOf } from '../lib/jira/filters.js'
import { normalizeResources } from '../lib/jira/profiles.js'
import { MESSAGE } from '../runtime/protocol.js'
import { OrderedItems } from './OrderedItems.jsx'
import { RemoteSelect } from './RemoteSelect.jsx'

export function ResourceSection({ call, resources, onChange }) {
  return (
    <Stack gap="xs">
      <RemoteSelect
        label="People"
        description="Subtask remaining estimates roll up under these people."
        placeholder="Search people"
        type={MESSAGE.PICKER_USER}
        call={call}
        excludeIds={idsOf(resources)}
        mapResults={(items) =>
          items.map(({ id, name }) => ({ id: `resource:${id}`, name }))
        }
        onPick={(person) =>
          onChange(normalizeResources([...resources, person]))
        }
      />

      <OrderedItems
        items={resources}
        onChange={(items) => onChange(normalizeResources(items))}
        emptyLabel="No resources yet — search above to add one."
        removeLabel="Remove resource"
      />
    </Stack>
  )
}
