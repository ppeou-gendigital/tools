import { useCallback, useState } from 'react'
import { TransferList } from '@/patterns/TransferList'
import { jiraApi } from '@/lib/jira/api'
import { useJiraConfig } from '@/providers/JiraConfigProvider'
import styles from './Page.module.scss'

export function Columns() {
  const { jira, setJira, setLookupList, selectedId } = useJiraConfig()
  const [available, setAvailable] = useState([])
  const [error, setError] = useState(null)

  const onLookupChange = useCallback(
    (values) => setLookupList({ fields: values }),
    [setLookupList],
  )
  const onReportChange = useCallback(
    (values) => setJira({ columns: values }),
    [setJira],
  )

  const onSearch = useCallback(async (query) => {
    setError(null)
    const { data, error: err } = await jiraApi.columns.search(query)
    if (err) setError(String(err?.message || err))
    setAvailable(data || [])
  }, [])

  return (
    <div className={styles.page}>
      <h2 className={styles.slideTitle}>Columns</h2>
      <p className={styles.slideMeta}>
        Fields for Jira data fetch, then columns used in the capacity report.
      </p>
      <div className={styles.body}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <section className={styles.stackSection}>
          <h3 className={styles.rowTitle}>Columns for Jira data fetching</h3>
          <TransferList
            key={`cols-lookup-${selectedId}`}
            itemKey="name"
            available={available}
            selected={jira.lookupList.fields}
            onChange={onLookupChange}
            getLabel={(item) => `${item.name} (${item.id})`}
            searchable
            onSearch={onSearch}
            searchPlaceholder="Search columns…"
          />
        </section>
        <section className={styles.stackSection}>
          <h3 className={styles.rowTitle}>Columns for report</h3>
          <TransferList
            key={`cols-report-${selectedId}`}
            itemKey="id"
            available={jira.lookupList.fields}
            selected={jira.columns}
            onChange={onReportChange}
            getLabel={(item) => `${item.name} (${item.id})`}
          />
        </section>
      </div>
    </div>
  )
}
