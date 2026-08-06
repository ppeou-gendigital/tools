import { useCallback, useMemo } from 'react'
import { TransferList } from '@/patterns/TransferList'
import { valueToLookupList } from '@/lib/jira/initialState'
import { useJiraConfig } from '@/providers/JiraConfigProvider'
import styles from './Page.module.scss'

function LookupFilterPage({
  title,
  hint,
  lookupKey,
  selectedKey,
  size = 6,
}) {
  const { jira, setJira, selectedId } = useJiraConfig()
  const available = useMemo(
    () => valueToLookupList(jira.lookupList[lookupKey]),
    [jira.lookupList, lookupKey],
  )
  const selected = jira[selectedKey] || []

  const onChange = useCallback(
    (values) => setJira({ [selectedKey]: values }),
    [selectedKey, setJira],
  )

  return (
    <div className={styles.page}>
      <h2 className={styles.slideTitle}>{title}</h2>
      <p className={styles.slideMeta}>{hint}</p>
      <div className={styles.body}>
        {available.length === 0 && (
          <p className={styles.hint}>
            No lookup values in this profile. Import a config that includes{' '}
            <code>lookupList.{lookupKey}</code>.
          </p>
        )}
        <TransferList
          key={`${selectedKey}-${selectedId}`}
          itemKey="id"
          available={available}
          selected={selected}
          onChange={onChange}
          size={size}
        />
      </div>
    </div>
  )
}

export function Projects() {
  return (
    <LookupFilterPage
      title="Projects"
      hint="Pick projects included in the JQL filter."
      lookupKey="projects"
      selectedKey="projects"
      size={4}
    />
  )
}

export function IssueType() {
  return (
    <LookupFilterPage
      title="Issue type"
      hint="Pick issue types included in the JQL filter."
      lookupKey="issueType"
      selectedKey="types"
    />
  )
}

export function IssueStatus() {
  return (
    <LookupFilterPage
      title="Status"
      hint="Pick statuses included in the JQL filter."
      lookupKey="issueStatus"
      selectedKey="status"
    />
  )
}

export function Resolutions() {
  return (
    <LookupFilterPage
      title="Resolutions"
      hint="Pick resolutions included in the JQL filter."
      lookupKey="resolutions"
      selectedKey="resolutions"
    />
  )
}
