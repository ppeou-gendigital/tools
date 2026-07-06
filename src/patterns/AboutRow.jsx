import styles from './AboutRow.module.scss'

export function AboutRow({ name = 'TOOLNAME', version }) {
  return (
    <div className={styles.aboutRow}>
      <span>{name}</span>
      <span>v{version}</span>
    </div>
  )
}
