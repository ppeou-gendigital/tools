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
import { idsOf, mergeItems } from './lib/jira/filters.js'
import { buildJql, hasFilters } from './lib/jira/jql.js'
import { parseIssues } from './lib/jira/export/parse-issues.js'
import { parseIssueView } from './lib/jira/export/parse-issueview.js'
import { applyResourceHours, countRows } from './lib/jira/export/rows.js'
import { buildTableHtml } from './lib/jira/export/table.js'
import { buildSnapshot, uploadFileName } from './lib/jira/remote.js'
import { callRunner } from './runtime/chrome/messaging.js'
import { pingRunner, resolveJiraTab } from './runtime/chrome/tab.js'
import { copyHtml } from './runtime/clipboard.js'
import { downloadText } from './runtime/download.js'
import { MESSAGE } from './runtime/protocol.js'
import { useConfig } from './state/useConfig.js'
import { useProfiles } from './state/useProfiles.js'
import { useRemoteStatus } from './state/useRemoteStatus.js'
import { ExportBar } from './components/ExportBar.jsx'
import { FieldSection } from './components/FieldSection.jsx'
import { FilterSection } from './components/FilterSection.jsx'
import { Panels } from './components/Panels.jsx'
import { ProfileBar } from './components/ProfileBar.jsx'
import { RemoteImportModal } from './components/RemoteImportModal.jsx'
import { ResourceSection } from './components/ResourceSection.jsx'
import { SyncToJiraModal } from './components/SyncToJiraModal.jsx'
import { TabGate } from './components/TabGate.jsx'

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
  const [importOpen, setImportOpen] = useState(false)
  const [syncOpen, setSyncOpen] = useState(false)

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
        // Wake the content script while the user types the first ticket key,
        // so the first real request does not pay for injection.
        pingRunner(result.tab.id).catch(() => {})
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
    (type, payload = {}, options) => {
      const tabId = tabState?.tab?.id
      if (tabId == null) {
        return Promise.reject(
          new Error('Open the extension on a Jira tab first.'),
        )
      }
      return callRunner(tabId, type, payload, options)
    },
    [tabState],
  )

  const origin = tabState?.origin ?? ''
  const activeEntry = profiles.activeEntry
  const activeProfile = profiles.activeProfile
  const remote = useRemoteStatus({
    entry: activeEntry,
    call,
    enabled: Boolean(tabState?.tab),
  })

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
    if (config.fetchFields.length === 0 && config.reportFields.length === 0) {
      throw new Error('Pick at least one fetch field before exporting.')
    }
  }

  function generateReport() {
    return runExport('report', async () => {
      requireFilters()
      requireFetchFields()

      const { html } = await call(MESSAGE.REPORT_ISSUE_VIEW, {
        jql: buildJql(config),
        columns: idsOf(mergeItems(config.fetchFields, config.reportFields))
          .filter((id) => id !== 'subtask'),
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

  function importProfiles(files) {
    const imported = profiles.importProfiles(files)
    if (imported.length === 0) return
    setNotice({
      color: 'green',
      text:
        imported.length === 1
          ? `Imported "${imported[0].name}".`
          : `Imported ${imported.length} profiles.`,
    })
  }

  function createProfileOnTicket({ name, profile, source }) {
    profiles.addProfile({ name, profile, source })
    setNotice({
      color: 'green',
      text: `Created "${name}" on ${source.issueKey}.`,
    })
  }

  function exportProfile() {
    if (!activeEntry) return
    const snapshot = buildSnapshot(activeEntry, config)
    if (!snapshot) return
    downloadText(uploadFileName(activeEntry), JSON.stringify(snapshot, null, 2))
  }

  function handleSynced(source, warning, meta) {
    profiles.updateProfileSync(profiles.activeId, { source, meta })
    setNotice({
      color: warning ? 'yellow' : 'green',
      text:
        warning ??
        `Synced ${source.issueKey} / ${source.filename}.`,
    })
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
              activeEntry={activeEntry}
              remoteStatus={remote}
              onSelect={profiles.selectProfile}
              onImport={() => setImportOpen(true)}
              onExport={exportProfile}
              onRemove={profiles.removeProfile}
              onSync={() => setSyncOpen(true)}
              onRefreshStatus={remote.refresh}
              canImport={Boolean(tabState?.tab)}
            />
          ) : null}

          {!profiles.ready || checking ? (
            <Center py="md">
              <Loader size="sm" />
            </Center>
          ) : !activeProfile ? (
            <Alert color="blue" variant="light" title="Start from a Jira ticket">
              <Text size="xs">
                A profile carries the filter lists, fetch fields, report
                columns, and resources. Open it from a JSON file attached to a
                Jira ticket — or create a starter profile on a ticket with{' '}
                <strong>Open from Jira</strong> above.
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

      <RemoteImportModal
        opened={importOpen}
        onClose={() => setImportOpen(false)}
        call={call}
        onImport={importProfiles}
        onCreate={createProfileOnTicket}
      />

      <SyncToJiraModal
        opened={syncOpen}
        onClose={() => setSyncOpen(false)}
        entry={activeEntry}
        selection={config}
        call={call}
        onSynced={handleSynced}
      />
    </Box>
  )
}
