import { useCallback, useEffect, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Box,
  Center,
  Divider,
  Group,
  Loader,
  Menu,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import {
  IconCheck,
  IconDeviceDesktop,
  IconLinkCode,
  IconMoon,
  IconSun,
  IconSunrise,
} from '@tabler/icons-react'
import {
  COMMENT_EXPORT_FIELDS,
  COMMENT_EXPORT_FIELD_IDS,
} from './lib/jira/fields.js'
import { idsOf } from './lib/jira/filters.js'
import { buildJql, hasFilters } from './lib/jira/jql.js'
import { parseIssues } from './lib/jira/export/parse-issues.js'
import { parseIssueView } from './lib/jira/export/parse-issueview.js'
import { applyResourceHours, countRows } from './lib/jira/export/rows.js'
import { buildTableHtml } from './lib/jira/export/table.js'
import { callRunner } from './runtime/chrome/messaging.js'
import { resolveJiraTab } from './runtime/chrome/tab.js'
import { copyHtml } from './runtime/clipboard.js'
import { MESSAGE } from './runtime/protocol.js'
import { useConfig } from './state/useConfig.js'
import { useProfiles } from './state/useProfiles.js'
import { ExportBar } from './components/ExportBar.jsx'
import { FieldSection } from './components/FieldSection.jsx'
import { FilterSection } from './components/FilterSection.jsx'
import { Panels } from './components/Panels.jsx'
import { ProfileBar } from './components/ProfileBar.jsx'
import { ResourceSection } from './components/ResourceSection.jsx'
import { TabGate } from './components/TabGate.jsx'

function profileLabel(raw, fileName) {
  const name = typeof raw?.name === 'string' ? raw.name.trim() : ''
  return name || fileName
}

const THEMES = [
  { value: 'light', label: 'Light', Icon: IconSun },
  { value: 'dark', label: 'Dark', Icon: IconMoon },
  { value: 'sunrise', label: 'Sunrise/sunset', Icon: IconSunrise },
  { value: 'system', label: 'System', Icon: IconDeviceDesktop },
]

export default function App({
  colorScheme = 'system',
  onColorSchemeChange = () => {},
}) {
  const profiles = useProfiles()
  const { config, update, ready: configReady } = useConfig(profiles.activeEntry)

  const [tabState, setTabState] = useState(null)
  const [gate, setGate] = useState(null)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState(null)

  const checkTab = useCallback(async () => {
    setChecking(true)
    try {
      const result = await resolveJiraTab()
      if (result.error) {
        setTabState(null)
        setGate(result)
      } else {
        setTabState(result)
        setGate(null)
      }
    } catch (error) {
      setTabState(null)
      setGate({
        error: 'unavailable',
        message: error?.message ?? 'Could not inspect the active tab.',
      })
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    checkTab()
  }, [checkTab])

  const call = useCallback(
    (type, payload = {}) => {
      const tabId = tabState?.tab?.id
      if (tabId == null) {
        return Promise.reject(
          new Error('Open the extension on a Jira tab first.'),
        )
      }
      return callRunner(tabId, type, payload)
    },
    [tabState],
  )

  const origin = tabState?.origin ?? ''
  const activeProfile = profiles.activeProfile
  const available = activeProfile?.available

  async function runExport(kind, task) {
    setBusy(kind)
    setNotice(null)
    try {
      const text = await task()
      setNotice({ color: 'green', text })
    } catch (error) {
      setNotice({ color: 'red', text: error?.message ?? 'Export failed.' })
    } finally {
      setBusy('')
    }
  }

  function requireFilters() {
    if (!hasFilters(config.filters)) {
      throw new Error('Pick at least one filter before exporting.')
    }
  }

  function requireFetchFields() {
    if (config.fetchFields.length === 0) {
      throw new Error('Pick at least one fetch field before exporting.')
    }
  }

  function generateReport() {
    return runExport('report', async () => {
      requireFilters()
      requireFetchFields()

      const { html } = await call(MESSAGE.REPORT_ISSUE_VIEW, {
        jql: buildJql(config),
        columns: idsOf(config.fetchFields).filter((id) => id !== 'subtask'),
      })

      const doc = new DOMParser().parseFromString(html, 'text/html')
      const { rows } = parseIssueView(doc)
      if (rows.length === 0) {
        throw new Error('No issues matched the current filters.')
      }

      const merged = applyResourceHours(rows, config.resources)
      const table = buildTableHtml({
        columns: [...config.reportFields, ...config.resources],
        rows: merged,
        origin,
      })

      await copyHtml(table)
      return `Copied ${countRows(merged)} rows for ${merged.length} issues.`
    })
  }

  function exportComments() {
    return runExport('comments', async () => {
      requireFilters()

      const { issues } = await call(MESSAGE.ISSUES_WITH_COMMENTS, {
        jql: buildJql(config),
        fields: COMMENT_EXPORT_FIELD_IDS,
      })

      const { rows } = parseIssues({ issues })
      if (rows.length === 0) {
        throw new Error('No issues matched the current filters.')
      }

      const table = buildTableHtml({
        columns: COMMENT_EXPORT_FIELDS,
        rows,
        origin,
      })

      await copyHtml(table)
      return `Copied ${countRows(rows)} rows for ${rows.length} issues.`
    })
  }

  function importProfile(raw, fileName) {
    const entry = profiles.importProfile(raw, {
      name: profileLabel(raw, fileName),
    })
    setNotice({ color: 'green', text: `Imported "${entry.name}".` })
  }

  const activeTheme =
    THEMES.find((item) => item.value === colorScheme) ?? THEMES[3]

  return (
    <Box className="app">
      <Box p="sm" py={8}>
        <Stack gap="xs">
          {profiles.ready ? (
            <ProfileBar
              items={profiles.items}
              activeId={profiles.activeId}
              activeProfile={activeProfile}
              onSelect={profiles.selectProfile}
              onImport={importProfile}
              onRemove={profiles.removeProfile}
            />
          ) : null}

          {!profiles.ready || checking ? (
            <Center py="md">
              <Loader size="sm" />
            </Center>
          ) : !activeProfile ? (
            <Alert color="blue" variant="light" title="Import a profile">
              <Text size="xs">
                A profile carries the filter lists, fetch fields, report
                columns, and resources. Import the JSON exported by an earlier
                version and it is migrated automatically.
              </Text>
            </Alert>
          ) : gate ? (
            <TabGate gate={gate} onRetry={checkTab} />
          ) : (
            <>
              <Panels>
                <Stack gap="xs">
                  <Divider label="Filters" labelPosition="left" />
                  <FilterSection
                    call={call}
                    available={available}
                    filters={config.filters}
                    onChange={(filters) => update({ filters })}
                  />
                  <ExportBar
                    onReport={generateReport}
                    onComments={exportComments}
                    busy={busy}
                    disabled={Boolean(busy) || !configReady}
                    notice={notice}
                  />
                </Stack>

                <Stack gap="xs">
                  <Divider label="Fields" labelPosition="left" />
                  <FieldSection
                    call={call}
                    config={config}
                    onChange={update}
                  />
                </Stack>

                <Stack gap="xs">
                  <Divider label="Resources" labelPosition="left" />
                  <ResourceSection
                    call={call}
                    resources={config.resources}
                    onChange={(resources) => update({ resources })}
                  />
                </Stack>
              </Panels>
            </>
          )}
        </Stack>
      </Box>

      {/* Brand and theme live at the bottom so the top starts with the profile
          picker. The footer is sticky but last in flow: it never permanently
          covers the panels or their horizontal scrollbar. */}
      <Group className="app-footer" justify="space-between" wrap="nowrap">
        <Group gap={5} wrap="nowrap" title="Jira Capacity">
          <ThemeIcon
            variant="filled"
            size={18}
            radius="xl"
            style={{ backgroundColor: '#5F3DC4', color: '#ffffff' }}
          >
            <IconLinkCode size={11} stroke={2.2} />
          </ThemeIcon>
          <Text size="xs" fw={600} lh={1}>
            Jira Capacity
          </Text>
        </Group>

        <Menu position="top-end" width={180} withinPortal shadow="md">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              aria-label={`Theme: ${activeTheme.label}`}
            >
              <activeTheme.Icon size={16} stroke={1.8} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Theme</Menu.Label>
            {THEMES.map(({ value, label, Icon }) => (
              <Menu.Item
                key={value}
                leftSection={<Icon size={14} stroke={1.8} />}
                rightSection={
                  colorScheme === value ? <IconCheck size={14} /> : null
                }
                onClick={() => onColorSchemeChange(value)}
              >
                {label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  )
}
