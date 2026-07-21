import { CircleUserRound, Clock, Mail } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Home.module.scss'

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function Home() {
  const { user } = useAuth()
  const { goProfile } = useNavigation()

  return (
    <div className={styles.page}>
      <PageHeader
        title="Welcome back"
        subtitle="You're signed in."
        shortcuts={
          <PageShortcuts current="home" className={styles.iconBtn} />
        }
      />

      <div className={styles.body}>
        <div className={styles.grid}>
          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <Mail size={16} aria-hidden="true" />
            </div>
            <div className={styles.statBody}>
              <span className={styles.statLabel}>Email</span>
              <span className={styles.statValue} title={user?.email}>
                {user?.email ?? '—'}
              </span>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <Clock size={16} aria-hidden="true" />
            </div>
            <div className={styles.statBody}>
              <span className={styles.statLabel}>Signed in at</span>
              <span className={styles.statValue}>
                {formatDate(user?.last_sign_in_at)}
              </span>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={goProfile} fullWidth>
          <CircleUserRound size={14} aria-hidden="true" />
          Edit profile
        </Button>
      </div>
    </div>
  )
}
