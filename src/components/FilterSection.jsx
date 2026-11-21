import { Stack } from '@mantine/core'
import { idsOf, mergeItems, setFilterValues } from '../lib/jira/filters.js'
import { toProjectOption } from '../lib/jira/projects.js'
import { MESSAGE } from '../runtime/protocol.js'
import { RemoteMultiSelect } from './RemoteMultiSelect.jsx'

const LIVE_FILTERS = [
  {
    key: 'types',
    label: 'Issue types',
    catalog: 'types',
    type: MESSAGE.PICKER_TYPES,
    description: 'Searched live across every issue type on this Jira instance.',
  },
  {
    key: 'statuses',
    label: 'Statuses',
    catalog: 'statuses',
    type: MESSAGE.PICKER_STATUSES,
    description: 'Searched live across every status on this Jira instance.',
  },
  {
    key: 'resolutions',
    label: 'Resolutions',
    catalog: 'resolutions',
    type: MESSAGE.PICKER_RESOLUTIONS,
    description: 'Searched live across every resolution on this Jira instance.',
  },
]

function toOption({ id, name }) {
  return { value: id, label: name }
}

export function FilterSection({ call, available, filters, onChange }) {
  return (
    <Stack gap="xs">
      <RemoteMultiSelect
        label="Projects"
        placeholder="Search projects"
        description="Searched live across every project this Jira account can see."
        type={MESSAGE.PICKER_PROJECT}
        call={call}
        mapResults={(items) => items.map(toProjectOption)}
        value={idsOf(filters.projects)}
        options={mergeItems(available?.projects).map(toProjectOption)}
        selectedOptions={mergeItems(filters.projects).map(toProjectOption)}
        onChange={(values, pool) =>
          onChange(
            setFilterValues(
              filters,
              'projects',
              values,
              pool.map(({ value, label }) => ({ id: value, name: label })),
            ),
          )
        }
      />

      {LIVE_FILTERS.map(({ key, label, catalog, type, description }) => (
        <RemoteMultiSelect
          key={key}
          label={label}
          placeholder={`Search ${label.toLowerCase()}`}
          description={description}
          type={type}
          call={call}
          value={idsOf(filters[key])}
          options={mergeItems(available?.[catalog]).map(toOption)}
          selectedOptions={mergeItems(filters[key]).map(toOption)}
          onChange={(values, pool) =>
            onChange(
              setFilterValues(
                filters,
                key,
                values,
                pool.map(({ value, label: text }) => ({ id: value, name: text })),
              ),
            )
          }
        />
      ))}

      <RemoteMultiSelect
        label="Sprints"
        type={MESSAGE.PICKER_SPRINT}
        call={call}
        placeholder="Search sprints"
        description="Results come from the Jira sprint picker."
        value={idsOf(filters.sprints)}
        selectedOptions={(filters.sprints ?? []).map(toOption)}
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
