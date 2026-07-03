import styles from './AboutRow.module.scss'

export function AboutRow({ version }) {
  return (
    <div className={styles.aboutRow}>
      <span>Loopy</span>
      <span>v{version}</span>
    </div>
  )
}
