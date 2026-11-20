import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Center,
  Group,
  Loader,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconLinkCode } from '@tabler/icons-react'
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
import { ProfileBar } from './components/ProfileBar.jsx'
import { TabGate } from './components/TabGate.jsx'

function profileLabel(raw, fileName) {
  const name = typeof raw?.name === 'string' ? raw.name.trim() : ''
  return name || fileName
}

export default function App() {
  const profiles = useProfiles()
  const { config, update, ready: configReady } = useConfig(profiles.activeEntry)

  const [tabState, setTabState] = useState(null)
  const [gate, setGate] = useState(null)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState(null)
  const [refreshingFields, setRefreshingFields] = useState(false)

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

  async function refreshFields() {
    if (!profiles.activeEntry) return

    setRefreshingFields(true)
    setNotice(null)
    try {
      const fields = await call(MESSAGE.PICKER_FIELDS, { query: '' })
      profiles.updateProfile(profiles.activeEntry.id, {
        available: { ...activeProfile.available, fields },
      })
      setNotice({
        color: 'green',
        text: `Loaded ${fields.length} fields from Jira.`,
      })
    } catch (error) {
      setNotice({ color: 'red', text: error?.message ?? 'Could not load fields.' })
    } finally {
      setRefreshingFields(false)
    }
  }

  function importProfile(raw, fileName) {
    const entry = profiles.importProfile(raw, {
      name: profileLabel(raw, fileName),
    })
    setNotice({ color: 'green', text: `Imported "${entry.name}".` })
  }

  return (
    <Box className="app" p="sm">
      <Stack gap="sm">
        <Group gap={6} wrap="nowrap">
          <ThemeIcon size={22} radius="md" variant="light">
            <IconLinkCode size={14} />
          </ThemeIcon>
          <Title order={5}>Jira Capacity</Title>
        </Group>

        {profiles.ready ? (
          <ProfileBar
            items={profiles.items}
            activeId={profiles.activeId}
            activeProfile={activeProfile}
            onSelect={profiles.selectProfile}
            onImport={importProfile}
            onRemove={profiles.removeProfile}
            onRefreshFields={refreshFields}
            refreshingFields={refreshingFields}
          />
        ) : null}

        {!profiles.ready || checking ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : !activeProfile ? (
          <Alert color="blue" variant="light" title="Import a profile">
            <Text size="xs">
              A profile carries the filter lists, fetch fields, report columns,
              and resources. Import the JSON exported by an earlier version and
              it is migrated automatically.
            </Text>
          </Alert>
        ) : gate ? (
          <TabGate gate={gate} onRetry={checkTab} />
        ) : (
          <>
            <Tabs defaultValue="filters" keepMounted={false}>
              <Tabs.List grow>
                <Tabs.Tab value="filters">Filters</Tabs.Tab>
                <Tabs.Tab value="fields">Fields &amp; resources</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="filters" pt="sm">
                <FilterSection
                  call={call}
                  available={available}
                  filters={config.filters}
                  onChange={(filters) => update({ filters })}
                />
              </Tabs.Panel>

              <Tabs.Panel value="fields" pt="sm">
                <FieldSection
                  call={call}
                  available={available}
                  config={config}
                  onChange={update}
                  onRefreshFields={refreshFields}
                  refreshingFields={refreshingFields}
                />
              </Tabs.Panel>
            </Tabs>

            <ExportBar
              onReport={generateReport}
              onComments={exportComments}
              busy={busy}
              disabled={Boolean(busy) || !configReady}
              notice={notice}
            />
          </>
        )}
      </Stack>
    </Box>
  )
}
