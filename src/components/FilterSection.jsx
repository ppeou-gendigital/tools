import { MultiSelect, Stack } from '@mantine/core'
import { idsOf, mergeItems, setFilterValues } from '../lib/jira/filters.js'
import { MESSAGE } from '../runtime/protocol.js'
import { RemoteMultiSelect } from './RemoteMultiSelect.jsx'

const LOCAL_FILTERS = [
  { key: 'projects', label: 'Projects', catalog: 'projects' },
  { key: 'types', label: 'Issue types', catalog: 'types' },
  { key: 'statuses', label: 'Statuses', catalog: 'statuses' },
  { key: 'resolutions', label: 'Resolutions', catalog: 'resolutions' },
]

function toOption({ id, name }) {
  return { value: id, label: name }
}

export function FilterSection({ call, available, filters, onChange }) {
  return (
    <Stack gap="xs">
      {LOCAL_FILTERS.map(({ key, label, catalog }) => {
        const options = mergeItems(available[catalog], filters[key])
        return (
          <MultiSelect
            key={key}
            label={label}
            placeholder={options.length ? 'Any' : 'Not in this profile'}
            data={options.map(toOption)}
            value={idsOf(filters[key])}
            onChange={(values) =>
              onChange(setFilterValues(filters, key, values, available[catalog]))
            }
            searchable
            clearable
            hidePickedOptions
            nothingFoundMessage="Nothing matches"
          />
        )
      })}

      <RemoteMultiSelect
        label="Sprints"
        type={MESSAGE.PICKER_SPRINT}
        call={call}
        placeholder="Search sprints"
        description="Results come from the Jira sprint picker."
        value={idsOf(filters.sprints)}
        selectedOptions={filters.sprints.map(toOption)}
        onChange={(values, pool) =>
          onChange(
            setFilterValues(
              filters,
              'sprints',
              values,
              pool.map(({ value, label }) => ({ id: value, name: label })),
            ),
          )
        }
      />
    </Stack>
  )
}
