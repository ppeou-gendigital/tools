import { CalendarRange, Plane } from 'lucide-react'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import { OfflineBanner } from './OfflineBanner'
import styles from '../Page.module.scss'
import homeStyles from '../Home.module.scss'

function formatRange(startsOn, endsOn) {
  if (!startsOn && !endsOn) return null
  try {
    const fmt = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    if (startsOn && endsOn) {
      return `${fmt.format(new Date(`${startsOn}T12:00:00`))} – ${fmt.format(new Date(`${endsOn}T12:00:00`))}`
    }
    const d = startsOn || endsOn
    return fmt.format(new Date(`${d}T12:00:00`))
  } catch {
    return [startsOn, endsOn].filter(Boolean).join(' – ')
  }
}

export function OfflineHome() {
  const { packs } = useOffline()
  const nav = useNavigation()

  return (
    <div className={styles.page}>
      <PageHeader title="Offline journeys" />
      <div className={cx('is-fluid-width', styles.body)}>
        <OfflineBanner />
        <ul className={cx(styles.list, homeStyles.listGrid)}>
          {packs.map((pack) => {
            const j = pack.journey
            const range = formatRange(j?.startsOn, j?.endsOn)
            return (
              <li key={pack.scopeId}>
                <div className={homeStyles.card}>
                  <button
                    type="button"
                    className={homeStyles.cardMain}
                    onClick={() =>
                      nav.navigate('journey', { journeyId: pack.scopeId })
                    }
                  >
                    <span className={homeStyles.cardIcon} aria-hidden="true">
                      {j?.type === 'journal' ? (
                        <CalendarRange size={18} />
                      ) : (
                        <Plane size={18} />
                      )}
                    </span>
                    <span className={homeStyles.cardBody}>
                      <span className={homeStyles.cardTitle}>
                        {pack.title || 'Journey'}
                      </span>
                      {range && (
                        <span className={homeStyles.cardMeta}>{range}</span>
                      )}
                      <span className={homeStyles.cardMeta}>
                        Synced{' '}
                        {new Date(pack.syncedAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </span>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
