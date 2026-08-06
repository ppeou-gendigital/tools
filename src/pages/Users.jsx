import { useCallback, useState } from 'react'
import { TransferList } from '@/patterns/TransferList'
import { jiraApi } from '@/lib/jira/api'
import { useJiraConfig } from '@/providers/JiraConfigProvider'
import styles from './Page.module.scss'

export function Users() {
  const { jira, setJira, selectedId } = useJiraConfig()
  const [available, setAvailable] = useState([])
  const [error, setError] = useState(null)

  const onChange = useCallback(
    (values) => setJira({ users: values }),
    [setJira],
  )

  const onSearch = useCallback(async (query) => {
    setError(null)
    const { data, error: err } = await jiraApi.user.search(query)
    if (err) setError(String(err?.message || err))
    setAvailable(data || [])
  }, [])

  return (
    <div className={styles.page}>
      <h2 className={styles.slideTitle}>Users</h2>
      <p className={styles.slideMeta}>
        Search team members used as resource columns.
      </p>
      <div className={styles.body}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <TransferList
          key={`users-${selectedId}`}
          itemKey="name"
          available={available}
          selected={jira.users}
          onChange={onChange}
          getLabel={(item) => item.displayName || item.name}
          searchable
          onSearch={onSearch}
          searchPlaceholder="Search users…"
        />
      </div>
    </div>
  )
}
