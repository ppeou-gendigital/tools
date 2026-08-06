import { useCallback, useState } from 'react'
import { TransferList } from '@/patterns/TransferList'
import { jiraApi } from '@/lib/jira/api'
import { useJiraConfig } from '@/providers/JiraConfigProvider'
import styles from './Page.module.scss'

export function Sprints() {
  const { jira, setJira, selectedId } = useJiraConfig()
  const [available, setAvailable] = useState([])
  const [error, setError] = useState(null)

  const onChange = useCallback(
    (values) => setJira({ sprints: values }),
    [setJira],
  )

  const onSearch = useCallback(async (query) => {
    setError(null)
    const { data, error: err } = await jiraApi.sprint.search(query)
    if (err) setError(String(err?.message || err))
    setAvailable(data || [])
  }, [])

  return (
    <div className={styles.page}>
      <h2 className={styles.slideTitle}>Sprints</h2>
      <p className={styles.slideMeta}>
        Search Jira sprints and pick the ones for the report.
      </p>
      <div className={styles.body}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <TransferList
          key={`sprints-${selectedId}`}
          itemKey="id"
          available={available}
          selected={jira.sprints}
          onChange={onChange}
          searchable
          onSearch={onSearch}
          searchPlaceholder="Search sprints…"
        />
      </div>
    </div>
  )
}
