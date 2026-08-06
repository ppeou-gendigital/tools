import { useCallback, useEffect, useState } from 'react'
import { FileBarChart2, FileDown } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { SortableList } from '@/patterns/SortableList'
import { useJiraBridge } from '@/providers/JiraBridgeProvider'
import { useJiraConfig } from '@/providers/JiraConfigProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { convertCapacityReport } from '@/lib/jira/transformCapacity'
import { convertCommentReport } from '@/lib/jira/transformComments'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

const FILTER_ROWS = [
  { id: 'projects', label: 'Projects', key: 'projects' },
  { id: 'resolutions', label: 'Resolution', key: 'resolutions' },
  { id: 'sprints', label: 'Sprints', key: 'sprints' },
  { id: 'issue-status', label: 'Status', key: 'status' },
  { id: 'issue-type', label: 'Types', key: 'types' },
]

function bridgePillClass(status) {
  if (status === 'ready') return styles.statusPillReady
  if (status === 'web' || status === 'connecting') return styles.statusPill
  return styles.statusPillWarn
}

function bridgePillLabel(status) {
  if (status === 'ready') return 'Bridge ready'
  if (status === 'web') return 'Web preview'
  if (status === 'connecting') return 'Connecting…'
  if (status === 'no-tab') return 'Open a Jira tab'
  return `Bridge: ${status}`
}

export function Report() {
  const { jira, setJira, selectedId } = useJiraConfig()
  const { broadcast, on, status: bridgeStatus } = useJiraBridge()
  const { replace } = useNavigation()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const asError = (err) => {
      if (!err) return null
      if (typeof err === 'string') return new Error(err)
      if (err instanceof Error) return err
      return new Error(err.message || String(err))
    }

    const offReport = on('channel::report::result', async (e) => {
      try {
        if (e.detail?.error) throw asError(e.detail.error)
        await convertCapacityReport(e.detail.data, jira)
        setMessage('Capacity report copied to clipboard (paste into Excel).')
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Failed to build capacity report')
      } finally {
        setBusy(false)
      }
    })
    const offComment = on('channel::report-comment::result', async (e) => {
      try {
        if (e.detail?.error) throw asError(e.detail.error)
        await convertCommentReport(e.detail.data, jira)
        setMessage('Tickets and comments copied to clipboard.')
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Failed to export tickets and comments')
      } finally {
        setBusy(false)
      }
    })
    return () => {
      offReport()
      offComment()
    }
  }, [jira, on])

  const generateReport = () => {
    setError(null)
    setMessage(null)
    setBusy(true)
    const ok = broadcast('channel::report::get', jira)
    if (!ok) {
      setBusy(false)
      setError(
        'Jira bridge not ready. Open a jira.corp.nortonlifelock.com tab and reopen the extension.',
      )
    }
  }

  const exportComments = () => {
    setError(null)
    setMessage(null)
    setBusy(true)
    const ok = broadcast('channel::report-comment::get', jira)
    if (!ok) {
      setBusy(false)
      setError(
        'Jira bridge not ready. Open a jira.corp.nortonlifelock.com tab and reopen the extension.',
      )
    }
  }

  const onColumnsOrderChange = useCallback(
    (arr) => setJira({ columns: arr }),
    [setJira],
  )
  const onResourcesOrderChange = useCallback(
    (arr) => setJira({ users: arr }),
    [setJira],
  )

  return (
    <div className={styles.page}>
      <h2 className={styles.slideTitle}>Report</h2>
      <p className={styles.slideMeta}>
        Generate capacity HTML for Excel, or export ticket comments.
      </p>
      <div className={styles.body}>
        <p
          className={cx(styles.statusPill, bridgePillClass(bridgeStatus))}
          role="status"
        >
          {bridgePillLabel(bridgeStatus)}
        </p>

        <div className={styles.actions}>
          <Button fullWidth onClick={generateReport} disabled={busy}>
            <FileBarChart2 size={14} />
            Generate Capacity Report
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={exportComments}
            disabled={busy}
          >
            <FileDown size={14} />
            Export Tickets and Comments
          </Button>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {message && <p className={styles.success}>{message}</p>}

        <section className={styles.filters} aria-label="Filters">
          <h3 className={styles.rowTitle}>Filters</h3>
          {FILTER_ROWS.map(({ id, label, key }) => {
            const items = jira[key] || []
            return (
              <div key={id} className={styles.filterRow}>
                <p className={styles.filterLabel}>{label}</p>
                <div className={styles.chipRow}>
                  {items.length === 0 ? (
                    <button
                      type="button"
                      className={cx(styles.chip, styles.chipEmpty)}
                      onClick={() => replace(id)}
                    >
                      None — edit
                    </button>
                  ) : (
                    items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={styles.chip}
                        onClick={() => replace(id)}
                        title={`Edit ${label}`}
                      >
                        {item.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </section>

        <section className={styles.block}>
          <SortableList
            key={`report-cols-${selectedId}`}
            label="Columns"
            items={jira.columns}
            onChange={onColumnsOrderChange}
          />
        </section>
        <section className={styles.block}>
          <SortableList
            key={`report-users-${selectedId}`}
            label="Resources"
            items={jira.users}
            size={8}
            onChange={onResourcesOrderChange}
            getLabel={(item) => item.displayName || item.name}
          />
        </section>
      </div>
      {busy && <div className={styles.overlay}>Working…</div>}
    </div>
  )
}
